import { NextApiResponse, NextApiRequest } from 'next';
import nodemailer, { TransportOptions } from 'nodemailer';
import { prisma } from '../db/prisma';

export default async function handler(request: NextApiRequest, response: NextApiResponse) {
  try {
    const title = request.body.title;
    const description = request.body.description;
    const name = request.body.user;
    const account = await prisma.mail_account.findMany({
      where: {
        name
      },
      select: {
        user: true,
        pass: true
      }
    });

    const sleep = (ms: number): Promise<void> => new Promise((resolve) => setTimeout(resolve, ms));

    const sendEmailToUser = async (userData: any): Promise<any> => {
      const newArray = [];

      // データのプロパティが数値のキーを持つものだけを取り出す
      const items = Object.values(userData).filter((item) => typeof item === 'object');

      // map を使用して処理
      const mappedData = items.map((item: any) => {
        // ここで各アイテムに対する処理を行う
        const { id, name, email, age, status } = item;
        return { id, name, email, age, status };
      });

      try {
        // メールを送信
        for (const item of mappedData) {
          // nodemailerの設定
          const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
              user: account[0].user,
              pass: account[0].pass
            }
          } as TransportOptions);
          // メールのオプション
          const mailOptions: nodemailer.SendMailOptions = {
            to: item.email,
            from: '"トライブ株式会社 北海道支店" <saiyo-hokkaido@tribe-group.jp>',
            subject: title, // メールの件名
            html: `
            <p>${item.name} 様</p>
            <br />
            <p>${description}</p><br />
            <p>
            ――――――――――――――――――――<br/>
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

          if (item.email && item.email.length !== 0) {
            try {
              // メール送信処理
              const sendEmailPromise = transporter.sendMail(mailOptions);
              // 最低でも1秒の遅延
              const minimumDelay = sleep(3000);
              // メール送信が完了するのを待機し、最低でも0.2秒の遅延を確保
              await Promise.all([sendEmailPromise, minimumDelay]);

              newArray.push({ ...item, flag: '送信済み' });
              console.log('メール送信完了:', { ...item, flag: '送信済み' });
            } catch (error) {
              newArray.push({ ...item, flag: 'エラー' });
              console.error('メールの送信エラー:', { ...item, flag: 'エラー' }, error);
            }
          }
        }
      } catch (error) {
        console.error('メールの送信処理が失敗しました:', items, error);
        throw error;
      }
      return newArray;
    };

    const data = await sendEmailToUser(request.body);
    return response.status(200).json({ message: '正常に処理が完了しました。', data: data });
  } catch (error) {
    console.error('エラーが発生しました:', error);
    return response.status(500).json({ error: 'データを取得できませんでした。' });
  }
}
