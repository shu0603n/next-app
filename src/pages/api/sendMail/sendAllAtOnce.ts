import { NextApiResponse, NextApiRequest } from 'next';
import nodemailer from 'nodemailer';

export default async function handler(request: NextApiRequest, response: NextApiResponse) {
  try {
    const body = request.body;
    const title = request.body.title;
    const description = request.body.description;
    const shomei = `<br/>
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
    速やかに送信元にご連絡いただくとともに、このメールを削除いただきますようお願い申し上げます。<br/>`
    const sendEmailToUser = async (userData: any): Promise<void> => {
      // nodemailerの設定
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: 's.murai@tribe-group.jp', // 送信元のメールアドレス
          pass: 'wqdp ewpg vovh auzu' // 送信元のメールアドレスのパスワード
        }
      });

      // データのプロパティが数値のキーを持つものだけを取り出す
      const items = Object.values(body).filter((item) => typeof item === 'object');

      // map を使用して処理
      const mappedData = items.map((item: any) => {
        // ここで各アイテムに対する処理を行う
        const { id, name, email, age, status } = item;
        return { id, name, email, age, status };
      });

      try {
        // メールを送信
        for (const item of mappedData) {
          // メールのオプション
          const mailOptions: nodemailer.SendMailOptions = {
            // from: 'saiyo-hokkaido@tribe-group.jp', // 送信元のメールアドレス
            to: 'shu0603n@gmail.com',
            // to: item.email,
            subject: title, // メールの件名
            html: `<p>${item.name}様</p><p>${item.email}宛</p><p>${description}</p><p>${shomei}</p>`,
            from: '"トライブ株式会社 北海道支店" <saiyo-hokkaido@tribe-group.jp>'
          };
          if (item.email && item.email.length !== 0) {
            await transporter.sendMail(mailOptions);
          }
        }
        console.log('メールを送信しました');
      } catch (error) {
        console.error('メールの送信エラー:', error);
        throw error;
      }
    };

    await sendEmailToUser(body);
    return response.status(200).json({ message: '正常に処理が完了しました。' });
  } catch (error) {
    console.error('エラーが発生しました:', error);
    return response.status(500).json({ error: 'データを取得できませんでした。' });
  }
}
