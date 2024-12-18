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
// １回に同時送信する数
const numberOfParallelProcessing = 5;

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
const getTransporter = () => {
  const cachedTransporter = tokenCache.get('sv14591.xserver.jp');
  if (cachedTransporter) {
    return cachedTransporter;
  }
  const transporter = nodemailer.createTransport({
    host: 'sv14591.xserver.jp',
    port: 465, // または587（587を使う場合はsecureをfalseに設定）
    secure: true, // 465を使う場合はtrue
    auth: {
      user: 'mail@murai-san.com',
      pass: 'Tribegroup'
    },
    // localhostから送る場合のみ（SSL/TLS証明書の検証をスキップ）
    tls: {
      rejectUnauthorized: false
    }
  } as TransportOptions);
  tokenCache.set('sv14591.xserver.jp', transporter);
  return transporter;
};

// メールオプションを生成
const buildMailOptions = (item: any) => {
  return {
    to: item.staff.mail,
    from: `"トライブ株式会社 北海道支店" <mail@murai-san.com>`,
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
const sendMailProcess = async (mailOptions: any, mail_list_id: any, staffId: any) => {
  const transporter = getTransporter();
  try {
    transporter.sendMail(mailOptions);
    return 'success';
  } catch (error: any) {
    throw error;
  }
};
const sendEmailsInBackground = async (mailDestinations: any, maxTimeOut: number) => {
  try {
    const limit = pLimit(numberOfParallelProcessing); // 並列処理数の制限

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

        if (item.staff.mail) {
          try {
            // Promise.raceで個別のメール送信にタイムアウトを設定
            await Promise.race([
              sendMailProcess(mailOptions, item.mail_list.id, item.staff.id), // メール送信プロセス
              new Promise((_, reject) => setTimeout(() => reject(new Error('408')), maxTimeOut)) // 個別タイムアウト
            ]);

            await prisma.mail_destination.updateMany({
              where: {
                mail_list_id: item.mail_list_id,
                staff_id: item.staff.id
              },
              data: {
                complete_flg: 1,
                mail_account_id: 1, // 使用したアカウントIDを記録
                log: 'success'
              }
            });

            console.log('メール送信完了:', item.staff.name, ':', item.staff.mail);
          } catch (error: any) {
            console.error('メール送信エラー:', item.staff.mail, error);

            await prisma.mail_destination.updateMany({
              where: {
                mail_list_id: item.mail_list_id,
                staff_id: item.staff.id
              },
              data: {
                complete_flg: -1,
                mail_account_id: 1,
                log: JSON.stringify(error)
              }
            });
          }
        } else if (!item.staff.mail) {
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
    } else {
      console.error('メール送信処理中にエラーが発生しました:', error);
      throw error;
    }
  }
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

      await sendEmailsInBackground(mailDestinations, maxMailTimeOut)
        .then(() => {
          console.log('sendEmailsInBackgroundが正常終了しました');
        })
        .catch((error: any) => {
          console.log('sendEmailsInBackgroundが異常終了しました', error);
          throw error;
        });

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
    if (error.message === '408') {
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
