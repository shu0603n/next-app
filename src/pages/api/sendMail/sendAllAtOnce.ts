import { NextApiResponse, NextApiRequest } from 'next';
import nodemailer, { TransportOptions } from 'nodemailer';
import { prisma } from '../db/prisma';
import pLimit from 'p-limit';

// 処理全体のタイムアウト時間の設定(ms)
export const maxDuration = 300;

// トークンをキャッシュするためのオブジェクト
const tokenCache = new Map();
// １回の送信処理のタイムアウト(s)
const maxMailTimeOut = maxDuration * 1000;

// 日本時間 (JST) で表示
const formatJST = (date: Date): Date => {
  // UTC時間から日本時間（Asia/Tokyo）への調整
  const jstOffset = 9 * 60; // 日本時間のUTCオフセット（日本はUTC+9）
  // UTC時間のミリ秒を取得し、日本時間に変換
  const jstDate = new Date(date.getTime() + jstOffset * 60 * 1000);
  return jstDate; // 日本時間を反映した Date オブジェクトを返す
};
// 日本時間 (JST) で表示
const formatNowJST = (): Date => {
  const today = new Date();
  // 日本時間 (Asia/Tokyo) に合わせる
  const todayInJST = new Date(today.toLocaleString('ja-JP', { timeZone: 'Asia/Tokyo' }));
  return formatJST(todayInJST); // 日本時間を反映した Date オブジェクトを返す
};

// メール送信用トランスポーターを作成またはキャッシュから取得
const getTransporter = (account: { user: string; pass: string }) => {
  const cachedTransporter = tokenCache.get(account.user);
  if (cachedTransporter) {
    return cachedTransporter;
  }
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: account.user,
      pass: account.pass
    }
  } as TransportOptions);
  tokenCache.set(account.user, transporter);
  return transporter;
};

// メールオプションを生成
const buildMailOptions = (item: any) => {
  return {
    to: item.staff.mail,
    from: `"トライブ株式会社 北海道支店" <saiyo-hokkaido@tribe-group.jp>`,
    subject: item.mail_list.title,
    html: `
      <p>${item.staff.name} 様</p>
      <br />
      <p>${item.mail_list.main_text}</p><br />
      <p>―――――――――――――――――――<br/>
      トライブ株式会社<br/>
      E-mail：saiyo-hokkaido@tribe-group.jp<br/>
      ●北海道支店<br/>
      〒060-0031<br/>
      北海道札幌市中央区北1条東1丁目4番地1 サン経成ビル6F<br/>
      Tel：011-590-4888 Fax：011-590-4887<br/>
      ――――――――――――――――――――<br/>
      【秘密保持のお願い】<br/>
      送信したメールには、個人情報や機密情報が含まれている場合がございます。<br/>
      誠に恐れ入りますが、誤って送信したメールを受信された際には、このメールのコピー・使用・公開等をなさらず、<br/>
      速やかに送信元にご連絡いただくとともに、このメールを削除いただきますようお願い申し上げます。<br/>
      </p>`
  };
};

// メール送信
const sendMailProcess = async (mailOptions: any, account: any, mail_list_id: any, staffId: any) => {
  const today = new Date();

  // 日本時間 (Asia/Tokyo) に合わせる
  const todayInJST = new Date(today.toLocaleString('ja-JP', { timeZone: 'Asia/Tokyo' }));

  // JSTで今日の0時に設定
  const startOfDayJST = new Date(todayInJST);
  startOfDayJST.setHours(0, 0, 0, 0);

  // JSTで今日の23時59分59秒に設定
  const endOfDayJST = new Date(todayInJST);
  endOfDayJST.setHours(23, 59, 59, 999);

  const transporter = getTransporter(account);
  const statusRecord = await prisma.mail_send_logs.create({
    data: {
      mail_list_id: mail_list_id,
      staff_id: staffId,
      mail_account_id: account.id,
      status: 0,
      log: '',
      sent_at: formatNowJST()
    }
  });
  try {
    await transporter.sendMail(mailOptions);
    await prisma.mail_send_logs.update({
      where: { id: statusRecord.id },
      data: {
        mail_list_id: mail_list_id,
        staff_id: staffId,
        mail_account_id: account.id,
        status: 1,
        log: '',
        sent_at: formatNowJST()
      }
    });
    return 'success';
  } catch (error: any) {
    await prisma.mail_send_logs.update({
      where: { id: statusRecord.id },
      data: {
        mail_list_id: mail_list_id,
        staff_id: staffId,
        mail_account_id: account.id,
        status: -1,
        log: JSON.stringify(error),
        sent_at: formatNowJST()
      }
    });
    throw error;
  }
};
const sendEmailsInBackground = async (mailDestinations: any, accounts: any, maxTimeOut: number) => {
  try {
    const limit = pLimit(10); // 並列処理数の制限

    let accountIndex = 0; // アカウントを順番に使うためのインデックス
    let isError = false; // タイムアウトフラグ

    // タイムアウトの設定
    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => {
        isError = true;
        reject(new Error('408')); // 全体のタイムアウト
      }, maxTimeOut)
    );

    const emailPromises = mailDestinations.map((item: any) => {
      return limit(async () => {
        if (isError) {
          return; // タイムアウト後は処理をスキップ
        }

        const mailOptions = buildMailOptions(item);
        let account = null;

        if (item.staff.mail && accounts.length > 0) {
          try {
            account = accounts[accountIndex]; // 使用するアカウントを取得

            // Promise.raceで個別のメール送信にタイムアウトを設定
            await Promise.race([
              sendMailProcess(mailOptions, account, item.mail_list.id, item.staff.id), // メール送信プロセス
              new Promise((_, reject) => setTimeout(() => reject(new Error('408')), maxTimeOut)) // 個別タイムアウト
            ]);

            await prisma.mail_destination.updateMany({
              where: {
                mail_list_id: item.mail_list_id,
                staff_id: item.staff.id
              },
              data: {
                complete_flg: 1,
                mail_account_id: account.id, // 使用したアカウントIDを記録
                log: 'success'
              }
            });

            console.log('メール送信完了:', item.staff.name, ':', item.staff.mail, `(送信アカウント：${account.name})`);

            // 次のアカウントに切り替え
            accountIndex = (accountIndex + 1) % accounts.length;
          } catch (error: any) {
            console.error('メール送信エラー:', item.staff.mail, `(送信アカウント: ${accounts[accountIndex]?.name})`, error);

            if ([454, 535, 543, 550].includes(error?.responseCode)) {
              if (error.responseCode === 550 && account) {
                await prisma.mail_account.update({
                  where: { id: account.id },
                  data: {
                    use: false
                  }
                });
              }
              console.warn(`一時的に無効化されるアカウント: ${account.name}`);
              accounts.splice(accountIndex, 1); // 無効なアカウントを削除
            }
            const log =
              accounts.length > 0 ? JSON.stringify(error) : '全てのアカウントでエラーが起きたため、実行できるアカウントがありません。';

            await prisma.mail_destination.updateMany({
              where: {
                mail_list_id: item.mail_list_id,
                staff_id: item.staff.id
              },
              data: {
                complete_flg: -1,
                mail_account_id: account.id,
                log: log
              }
            });
            if (accounts.length > 0) {
              console.error('全てのアカウントでエラーが起きました。');
              isError = true;
              throw new Error('422');
            }
          }
        } else if (!item.staff.mail && accounts.length > 0) {
          console.warn('メールアドレスが存在しません：', item.staff.name);
          await prisma.mail_destination.updateMany({
            where: {
              mail_list_id: item.mail_list_id,
              staff_id: item.staff.id
            },
            data: {
              complete_flg: 0,
              log: 'メールアドレス未設定'
            }
          });
        } else if (!item.staff.mail && accounts.length > 0) {
          isError = true;
          throw new Error('422'); // エラーメッセージを明示的に指定
        } else {
          isError = true;
          throw new Error('500'); // エラーメッセージを明示的に指定
        }
      });
    });

    // 全体のタイムアウトとメール送信処理を並列で実行
    await Promise.race([
      Promise.all(emailPromises), // 全てのメール送信処理
      timeoutPromise // タイムアウト
    ]);
  } catch (error: any) {
    if (error.message === '408') {
      console.error('全体の処理がタイムアウトしました。');
      throw new Error('408');
    } else if (error.message === '422') {
      console.error('使用可能なアカウントがありません。');
      throw new Error('422');
    } else {
      console.error('メール送信処理中にエラーが発生しました:', error);
      throw error;
    }
  }
};

const getMailAccountsSentToday = async () => {
  const today = new Date();

  // 日本時間 (Asia/Tokyo) に合わせる
  const todayInJST = new Date(today.toLocaleString('ja-JP', { timeZone: 'Asia/Tokyo' }));

  // JSTで今日の0時に設定
  const startOfDayJST = new Date(todayInJST);
  startOfDayJST.setHours(0, 0, 0, 0);

  // JSTで今日の23時59分59秒に設定
  const endOfDayJST = new Date(todayInJST);
  endOfDayJST.setHours(23, 59, 59, 999);

  // 今日送信されたログを取得（`mail_send_logs`から）
  const result = await prisma.mail_send_logs.groupBy({
    by: ['mail_account_id'], // mail_account_idでグループ化
    where: {
      sent_at: {
        gte: formatJST(startOfDayJST), // 今日の00:00:00以降
        lte: formatJST(endOfDayJST) // 今日の23:59:59まで
      }
    },
    _count: {
      mail_account_id: true // mail_account_idごとにカウント
    }
  });

  // 全てのmail_accountを取得
  const allMailAccounts = await prisma.mail_account.findMany({
    where: { use: true }
  });

  // `result` を `mail_account` にマージする形でデータを作成
  const mailAccounts = await Promise.all(
    allMailAccounts.map(async (mailAccount) => {
      // `result` に該当するデータを取得
      const log = result.find((log) => log.mail_account_id === mailAccount.id);

      // `result` にデータがある場合はカウントをチェック
      if (log && log._count.mail_account_id >= 1500) return null;

      return {
        id: mailAccount.id,
        name: mailAccount.name,
        user: mailAccount.user,
        pass: mailAccount.pass,
        count: log?._count.mail_account_id || 0 // ログがない場合はカウントを0にする
      };
    })
  );

  // null を除外して返す
  return mailAccounts.filter((account) => account !== null);
};

export default async function handler(request: NextApiRequest, response: NextApiResponse) {
  let statusRecord;
  try {
    if (request.method === 'POST') {
      const { id } = request.query;

      const status = await prisma.send_mail_status.findFirst({
        orderBy: { start_at: 'desc' }
      });

      if (status) {
        if (status.end_at) {
          console.log('前回の処理が正常終了しているため、新たに処理を開始します。');
        } else if (status.start_at && formatNowJST().getTime() - status.start_at.getTime() < maxMailTimeOut) {
          throw new Error('429');
        }
      }

      statusRecord = await prisma.send_mail_status.create({
        data: {
          status: 'processing',
          error_log: '',
          start_at: formatNowJST()
        }
      });

      const mailDestinations = await prisma.mail_destination.findMany({
        where: {
          mail_list_id: Number(id),
          OR: [{ complete_flg: null }, { complete_flg: -1 }]
        },
        select: {
          staff: { select: { id: true, name: true, mail: true } },
          mail_list: { select: { id: true, title: true, main_text: true } }
        },
        orderBy: {
          staff_id: 'asc'
        }
      });

      const accounts = await getMailAccountsSentToday();

      const shuffledAccounts = accounts.sort(() => Math.random() - 0.5);

      await sendEmailsInBackground(mailDestinations, shuffledAccounts, maxMailTimeOut);

      await prisma.send_mail_status.update({
        where: { id: statusRecord.id },
        data: {
          status: 'completed',
          error_log: '',
          end_at: formatNowJST()
        }
      });

      return response.status(200).json({ message: 'メール送信処理が完了しました。' });
    }

    return response.status(405).json({ error: 'Method Not Allowed' });
  } catch (error: any) {
    console.error('エラーが発生しました:', error, error.message);

    console.log('message:', error.message);
    if (error.message === '422') {
      if (statusRecord) {
        await prisma.send_mail_status.update({
          where: { id: statusRecord.id },
          data: {
            status: 'failed',
            error_log: '使用可能なアカウントがありません。',
            end_at: formatNowJST()
          }
        });
      }
      return response.status(422).json({ error: '使用可能なアカウントがありません。' });
    } else if (error.message === '408') {
      if (statusRecord) {
        prisma.send_mail_status.update({
          where: { id: statusRecord.id },
          data: {
            status: 'failed',
            error_log: 'タイムアウトが発生しました。',
            end_at: formatNowJST()
          }
        });
      }
      return response.status(408).json({ error: 'タイムアウトが発生しました。処理を終了します。' });
    } else if (error.message === '429') {
      return response.status(429).json({
        error: '前回の処理が開始されてから3分以内です。少し時間をおいて再試行してください。'
      });
    } else {
      if (statusRecord) {
        prisma.send_mail_status.update({
          where: { id: statusRecord.id },
          data: {
            status: 'failed',
            error_log: '不明なエラーが発生しました。',
            end_at: formatNowJST()
          }
        });
      }
      return response.status(500).json({ error: '不明なエラーが発生したため、処理が終了しました。' });
    }
  }
}
