import { NextApiResponse, NextApiRequest } from 'next';
import nodemailer, { TransportOptions } from 'nodemailer';
import { prisma } from '../db/prisma';
import pLimit from 'p-limit';

// 処理全体のタイムアウト時間の設定(ms)
export const maxDuration = 300;

// トークンをキャッシュするためのオブジェクト
const tokenCache = new Map();
// １回の送信処理のタイムアウト(s)
const maxTimeOut = 10000; // 10秒
// １回の送信処理のリトライ回数
const retries = 3;

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
      pass: account.pass,
    },
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

// リトライ付きメール送信
const sendMailWithRetry = async (mailOptions: any, accounts: any) => {
  for (let attempt = 1; attempt <= retries; attempt++) {
    const accountIndex = (attempt - 1) % accounts.length; // リトライ時に異なるアカウントを選択
    const currentAccount = accounts[accountIndex];
    const transporter = getTransporter(currentAccount);

    try {
      await transporter.sendMail(mailOptions);
      return 'success';
    } catch (error: any) {
      console.warn(`メール送信エラー (試行 ${attempt}/${retries}):`, error);
      if (attempt === retries) {
        throw error;
      }
    }
  }
};

const sendEmailsInBackground = async (mailDestinations: any, accounts: any, maxDuration: number) => {
  try {
    const limit = pLimit(10); // 並列処理数の制限

    const timeoutPromise = (ms: any) => new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout')), ms));

    const emailPromises = mailDestinations.map((item: any, index: any) => {
      return limit(async () => {
        const mailOptions = buildMailOptions(item);

        if (item.staff.mail) {
          try {
            await Promise.race([
              sendMailWithRetry(mailOptions, accounts), // 異なるアカウントでリトライ
              timeoutPromise(maxTimeOut), // タイムアウト設定
            ]);

            await prisma.mail_destination.updateMany({
              where: {
                mail_list_id: item.mail_list_id,
                staff_id: item.staff.id,
              },
              data: {
                complete_flg: 1,
                mail_account_id: accounts[0].id, // 最初のアカウントIDを記録
                log: 'success',
              },
            });
            console.log('メール送信完了:', item.staff.mail);
          } catch (error: any) {
            console.error('メール送信エラー:', item.staff.mail, error);

            if ([454, 535, 550].includes(error?.responseCode)) {
              console.warn(`無効化されるアカウント: ${accounts[0].user}`);
              accounts.shift(); // アカウントを削除
            }

            await prisma.mail_destination.updateMany({
              where: {
                mail_list_id: item.mail_list_id,
                staff_id: item.staff.id,
              },
              data: {
                complete_flg: -1,
                mail_account_id: accounts[0]?.id,
                log: JSON.stringify(error),
              },
            });
          }
        }
      });
    });

    await Promise.race([Promise.all(emailPromises), timeoutPromise(maxDuration * 1000)]);
  } catch (error) {
    console.error('メール送信処理中にエラーが発生しました:', error);
    throw error;
  }
};


export default async function handler(request: NextApiRequest, response: NextApiResponse) {
  let statusRecord;
  try {
    if (request.method === 'POST') {
      const { id } = request.query;

      // 現在の処理状態を返す
      const status = await prisma.send_mail_status.findFirst({
        orderBy: { start_at: 'desc' } // start_atでソート
      });

      const currentTime = new Date();
      if (status && status.start_at && currentTime.getTime() - new Date(status.start_at).getTime() < 30000) {
        return response.status(429).json({
          error: '前回の処理が開始されてから30秒以内です。少し時間をおいて再試行してください。'
        });
      }

      // メール送信処理を開始し、ステータスを「processing」に設定
      statusRecord = await prisma.send_mail_status.create({
        data: {
          status: 'processing',
          error_log: '',
          start_at: new Date() // start_atに現在の時間を設定
        }
      });

      const mailDestinations = await prisma.mail_destination.findMany({
        where: {
          mail_list_id: Number(id),
          OR: [{ complete_flg: null }, { complete_flg: 0 }, { complete_flg: -1 }],
        },
        select: {
          staff: { select: { id: true, name: true, mail: true } },
          mail_list: { select: { title: true, main_text: true } },
        },
        orderBy: {
          staff_id: 'asc',
        },
      });

      const accounts = await prisma.mail_account.findMany({
        where: { use: true },
        select: { id: true, user: true, pass: true },
      });

      await sendEmailsInBackground(mailDestinations, accounts, maxDuration);

      // メール送信完了後、ステータスを更新
      await prisma.send_mail_status.update({
        where: { id: statusRecord.id },
        data: {
          status: 'completed',
          error_log: '',
          end_at: new Date() // end_atに現在の時間を設定
        }
      });

      return response.status(200).json({ message: 'メール送信処理が完了しました。' });
    }

    return response.status(405).json({ error: 'Method Not Allowed' });
  } catch (error) {
    console.error('エラーが発生しました:', error);

    // エラー時にステータスを「failed」に更新
    if (statusRecord) {
      await prisma.send_mail_status.update({
        where: { id: statusRecord.id },
        data: {
          status: 'failed',
          error_log: JSON.stringify(error),
          end_at: new Date() // end_atに現在の時間を設定
        }
      });
    }

    return response.status(500).json({ error: 'データを取得できませんでした。' });
  }
}

