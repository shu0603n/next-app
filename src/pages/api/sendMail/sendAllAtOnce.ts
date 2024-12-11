import { NextApiResponse, NextApiRequest } from 'next';
import nodemailer, { TransportOptions } from 'nodemailer';
import { prisma } from '../db/prisma';

// 非同期処理の遅延関数
const sleep = (ms: number): Promise<void> => new Promise((resolve) => setTimeout(resolve, ms));

export default async function handler(request: NextApiRequest, response: NextApiResponse) {
  try {
    const { id } = request.query;

    // mail_list_id に基づいて mail_destination テーブルからデータを取得
    const mailDestinations = await prisma.mail_destination.findMany({
      where: {
        mail_list_id: Number(id), // リクエストの ID を使ってフィルタリング
        complete_flg: false // 未送信データのみ抽出
      },
      select: {
        staff: {
          select: {
            id: true,
            name: true,
            mail: true
          }
        },
        mail_list_id: true // mail_list_id も取得
      }
    });

    // アカウント情報の取得
    const account = await prisma.mail_account.findMany({
      select: {
        id: true,
        user: true,
        pass: true
      }
    });

    try {
      // メール送信の非同期処理を配列に格納
      const emailPromises = mailDestinations.map(async (item: any, index: number) => {
        // アカウント情報を順番に使用するため、インデックスを使ってループ
        const accountIndex = index % account.length; // 最後まで行ったら最初に戻る

        // nodemailer の設定を毎回新しく作成
        const transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
            user: account[accountIndex].user, // 現在使用するアカウントのユーザー
            pass: account[accountIndex].pass // 現在使用するアカウントのパスワード
          }
        } as TransportOptions);

        const mailOptions: nodemailer.SendMailOptions = {
          to: item.staff.mail,
          from: `"トライブ株式会社 北海道支店" <saiyo-hokkaido@tribe-group.jp>`,
          subject: item.staff.title, // メールの件名
          html: `
            <p>${item.staff.name} 様</p>
            <br />
            <p>${item.staff.description}</p><br />
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

        // メール送信の処理
        if (item.staff.mail && item.staff.mail.length !== 0) {
          try {
            // メール送信の際にそのアカウントを使用
            await transporter.sendMail(mailOptions);

            // メール送信成功時に complete_flg を true に更新
            await prisma.mail_destination.updateMany({
              where: {
                mail_list_id: item.mail_list_id,
                staff_id: item.staff.id
              },
              data: {
                complete_flg: true,
                mail_account_id: account[accountIndex].id
              }
            });

            console.log('メール送信完了:', {
              id: item.staff.id,
              name: item.staff.name,
              email: item.staff.mail,
              flag: '送信済み'
            });
          } catch (error) {
            // メール送信エラー時に complete_flg を false に更新
            await prisma.mail_destination.updateMany({
              where: {
                mail_list_id: item.mail_list_id,
                staff_id: item.staff.id
              },
              data: {
                complete_flg: false,
                mail_account_id: account[accountIndex].id
              }
            });

            console.error(
              'メールの送信エラー:',
              {
                id: item.staff.id,
                name: item.staff.name,
                email: item.staff.mail,
                flag: 'エラー'
              },
              error
            );
          }
        }

        // 3秒の遅延
        await sleep(10000);

        return { id: item.staff.id, name: item.staff.name, email: item.staff.mail, flag: '送信済み' };
      });

      // 全ての非同期処理が完了するのを待つ
      await Promise.all(emailPromises);
    } catch (error) {
      console.error('メールの送信処理が失敗しました:', error);
      throw error;
    }

    return response.status(200).json({ message: '正常に処理が完了しました。' });
  } catch (error) {
    console.error('エラーが発生しました:', error);
    return response.status(500).json({ error: 'データを取得できませんでした。' });
  }
}
