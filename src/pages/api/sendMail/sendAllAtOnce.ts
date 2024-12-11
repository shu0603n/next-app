import { NextApiResponse, NextApiRequest } from 'next';
import nodemailer, { TransportOptions } from 'nodemailer';
import { prisma } from '../db/prisma';
import pLimit from 'p-limit';

// 非同期処理の遅延関数
const sleep = (ms: number): Promise<void> => new Promise((resolve) => setTimeout(resolve, ms));

const sendEmailsInBackground = async (mailDestinations: any, account: any) => {
  try {
    // 並列処理の数を制限するための制限値 (例: 5)
    const limit = pLimit(10);

    const emailPromises = mailDestinations.map(async (item: any, index: number) => {
      return limit(async () => {
        const accountIndex = index % account.length;
        const transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
            user: account[accountIndex].user,
            pass: account[accountIndex].pass
          }
        } as TransportOptions);

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
                complete_flg: true,
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
                complete_flg: false,
                mail_account_id: account[accountIndex].id,
                log: JSON.stringify(error)
              }
            });
            console.error('メール送信エラー:', item.staff.mail, error);
          }
        }
        await sleep(10000); // 10秒の遅延
      });
    });

    // 全てのメール送信を並列で処理
    await Promise.all(emailPromises);
  } catch (error) {
    console.error('メール送信処理中にエラーが発生しました:', error);
  }
};

export default async function handler(request: NextApiRequest, response: NextApiResponse) {
  try {
    const { id } = request.query;

    const mailDestinations = await prisma.mail_destination.findMany({
      where: {
        mail_list_id: Number(id),
        complete_flg: false
      },
      select: {
        staff: { select: { id: true, name: true, mail: true } },
        mail_list: { select: { title: true, main_text: true } }
      }
    });

    const account = await prisma.mail_account.findMany({
      select: { id: true, user: true, pass: true }
    });

    // バックグラウンドでメール送信を実行
    sendEmailsInBackground(mailDestinations, account);

    return response.status(200).json({ message: 'メール送信処理がバックグラウンドで開始されました。' });
  } catch (error) {
    console.error('エラーが発生しました:', error);
    return response.status(500).json({ error: 'データを取得できませんでした。' });
  }
}
