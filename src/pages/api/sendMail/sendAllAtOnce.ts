import { NextApiResponse, NextApiRequest } from 'next';
import nodemailer, { TransportOptions } from 'nodemailer';
import { prisma } from '../db/prisma';
import pLimit from 'p-limit';

// タイムアウト時間の設定
export const maxDuration = 300;

// トークンをキャッシュするためのオブジェクト
const tokenCache = new Map();

const sendEmailsInBackground = async (mailDestinations: any, account: any, maxDuration: number) => {
  try {
    const limit = pLimit(10); // 並列処理数の制限

    const timeoutPromise = (ms: number) => new Promise<never>((_, reject) => setTimeout(() => reject(new Error('Timeout')), ms));

    const emailPromises = mailDestinations.map(async (item: any, index: number) => {
      return limit(async () => {
        const accountIndex = index % account.length;
        const cachedToken = tokenCache.get(account[accountIndex].user);

        if (!cachedToken) {
          // トークンがキャッシュされていない場合、新しいトークンを取得してキャッシュ
          const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
              user: account[accountIndex].user,
              pass: account[accountIndex].pass
            }
          } as TransportOptions);

          tokenCache.set(account[accountIndex].user, transporter);
        }

        const transporter = tokenCache.get(account[accountIndex].user);

        const mailOptions: nodemailer.SendMailOptions = {
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

        if (item.staff.mail && item.staff.mail.length !== 0) {
          try {
            await transporter.sendMail(mailOptions);

            await prisma.mail_destination.updateMany({
              where: {
                mail_list_id: item.mail_list_id,
                staff_id: item.staff.id
              },
              data: {
                complete_flg: 1,
                mail_account_id: account[accountIndex].id,
                log: 'success'
              }
            });
            console.log('メール送信完了:', item.staff.mail);
          } catch (error) {
            await prisma.mail_destination.updateMany({
              where: {
                mail_list_id: item.mail_list_id,
                staff_id: item.staff.id
              },
              data: {
                complete_flg: -1,
                mail_account_id: account[accountIndex].id,
                log: JSON.stringify(error)
              }
            });
            console.error('メール送信エラー:', item.staff.mail, error);
          }
        }
      });
    });

    await Promise.race([Promise.all(emailPromises), timeoutPromise(maxDuration * 1000)]);
  } catch (error) {
    console.error('メール送信処理中にエラーが発生しました:', error);
    throw error; // タイムアウトの場合も含む
  }
};

export default async function handler(request: NextApiRequest, response: NextApiResponse) {
  try {
    if (request.method === 'GET') {
      // 現在の処理状態を返す
      const status = await prisma.send_mail_status.findFirst({
        orderBy: { start_at: 'desc' } // start_atでソート
      });
      return response.status(200).json({ status });
    }

    if (request.method === 'POST') {
      const { id } = request.query;

      const mailDestinations = await prisma.mail_destination.findMany({
        where: {
          mail_list_id: Number(id),
          OR: [{ complete_flg: null }, { complete_flg: 0 }, { complete_flg: -1 }]
        },
        select: {
          staff: { select: { id: true, name: true, mail: true } },
          mail_list: { select: { title: true, main_text: true } }
        },
        orderBy: {
          staff_id: 'asc'
        }
      });

      const account = await prisma.mail_account.findMany({
        where: { use: true },
        select: { id: true, user: true, pass: true }
      });

      // メール送信処理を開始し、ステータスを「processing」に設定
      const statusRecord = await prisma.send_mail_status.create({
        data: {
          status: 'processing',
          error_log: '',
          start_at: new Date() // start_atに現在の時間を設定
        }
      });

      try {
        // バックグラウンドでメール送信を実行
        await sendEmailsInBackground(mailDestinations, account, maxDuration);

        // メール送信完了後、ステータスを更新
        await prisma.send_mail_status.update({
          where: { id: statusRecord.id },
          data: {
            status: 'completed',
            error_log: '',
            end_at: new Date() // end_atに現在の時間を設定
          }
        });
      } catch (error: any) {
        // エラー時、ステータスを更新
        await prisma.send_mail_status.update({
          where: { id: statusRecord.id },
          data: {
            status: error.message === 'Timeout' ? 'timeout' : 'error',
            error_log: JSON.stringify(error),
            end_at: new Date() // end_atに現在の時間を設定
          }
        });
      }

      return response.status(200).json({ message: 'メール送信処理がバックグラウンドで開始されました。' });
    }

    return response.status(405).json({ error: 'Method Not Allowed' });
  } catch (error) {
    console.error('エラーが発生しました:', error);
    return response.status(500).json({ error: 'データを取得できませんでした。' });
  }
}
