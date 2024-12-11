import { NextApiResponse, NextApiRequest } from 'next';
import { prisma } from '../../prisma';

export default async function handler(request: NextApiRequest, response: NextApiResponse) {
  try {
    const id = request.query.id as string;

    // Prismaを使ってmail_listテーブルからidでデータを取得
    const mailList = await prisma.mail_list.findUnique({
      where: { id: Number(id) }, // idはstring型なのでNumberに変換
      select: {
        id: true,
        title: true,
        main_text: true
      }
    });

    if (!mailList) {
      return response.status(404).json({ error: 'データが見つかりません。' });
    }

    const mailDestination = await prisma.mail_destination.findMany({
      where: { mail_list_id: Number(id) }, // mail_list_idが一致するデータを取得
      select: {
        mail_list_id: true,
        staff: {
          select: {
            id: true,
            name: true,
            mail: true
          }
        },
        create_at: true,
        update_at: true
      }
    });

    return response.status(200).json({ mailList, mailDestination });
  } catch (error) {
    console.error('エラーが発生しました:', error);
    return response.status(500).json({ error: 'データを取得できませんでした。' });
  }
}
