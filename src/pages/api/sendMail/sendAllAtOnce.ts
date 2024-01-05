import { NextApiResponse, NextApiRequest } from 'next';
import nodemailer, { TransportOptions } from 'nodemailer';
import { prisma } from '../db/prisma';

// 非同期処理の遅延関数
const sleep = (ms: number): Promise<void> => new Promise((resolve) => setTimeout(resolve, ms));

export default async function handler(request: NextApiRequest, response: NextApiResponse) {
  try {
    const { title, description, user: name } = request.body;
    const account = await prisma.mail_account.findMany({
      where: {
        name
      },
      select: {
        user: true,
        pass: true
      }
    });

    const newArray: any[] = [];

    // データのプロパティが数値のキーを持つものだけを取り出す
    const items = Object.values(request.body).filter((item) => typeof item === 'object');

    // map を使用して処理
    const mappedData = items.map((item: any) => {
      const { id, name, email, age, status } = item;
      return { id, name, email, age, status };
    });

    try {
      // nodemailerの設定
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: account[0].user,
          pass: account[0].pass
        }
      } as TransportOptions);

      // メール送信の非同期処理を配列に格納
      const emailPromises = mappedData.map(async (item: any) => {
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
            await transporter.sendMail(mailOptions);
            newArray.push({ id: item.id, name: item.name, email: item.email, age: item.age, status: item.status, flag: '送信済み' });
            console.log('メール送信完了:', {
              id: item.id,
              name: item.name,
              email: item.email,
              age: item.age,
              status: item.status,
              flag: '送信済み'
            });
          } catch (error) {
            // if(error.responseCode && error.responseCode === 454 ){

            // }
            newArray.push({ id: item.id, name: item.name, email: item.email, age: item.age, status: item.status, flag: 'エラー' });
            console.error(
              'メールの送信エラー:',
              { id: item.id, name: item.name, email: item.email, age: item.age, status: item.status, flag: 'エラー' },
              error
            );
          }
        }

        // 3秒の遅延
        await sleep(10000);

        return { id: item.id, name: item.name, email: item.email, age: item.age, status: item.status, flag: '送信済み' };
      });

      // 全ての非同期処理が完了するのを待つ
      await Promise.all(emailPromises);
    } catch (error) {
      console.error('メールの送信処理が失敗しました:', items, error);
      throw error;
    }

    return response.status(200).json({ message: '正常に処理が完了しました。', data: newArray });
  } catch (error) {
    console.error('エラーが発生しました:', error);
    return response.status(500).json({ error: 'データを取得できませんでした。' });
  }
}
