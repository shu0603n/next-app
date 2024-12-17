import { NextApiResponse, NextApiRequest } from 'next';
import { prisma } from '../../prisma';

const getMailAccountsSentToday = async (id?: Number) => {
  const today = new Date();

  // 日本時間 (Asia/Tokyo) に合わせる
  const todayInJST = new Date(today.toLocaleString('ja-JP', { timeZone: 'Asia/Tokyo' }));

  // JSTで今日の0時に設定
  const startOfDayJST = new Date(todayInJST);
  startOfDayJST.setHours(0, 0, 0, 0);

  // JSTで今日の23時59分59秒に設定
  const endOfDayJST = new Date(todayInJST);
  endOfDayJST.setHours(23, 59, 59, 999);

  // 日本時間 (JST) で表示
  const formatJST = (date: Date): Date => {
    // UTC時間から日本時間（Asia/Tokyo）への調整
    const jstOffset = 9 * 60; // 日本時間のUTCオフセット（日本はUTC+9）
    // UTC時間のミリ秒を取得し、日本時間に変換
    const jstDate = new Date(date.getTime() + jstOffset * 60 * 1000);
    return jstDate; // 日本時間を反映した Date オブジェクトを返す
  };

  // 今日送信されたログを取得（`mail_send_logs`から）
  let result = null;
  if (id) {
    result = await prisma.mail_send_logs.groupBy({
      by: ['mail_account_id'], // mail_account_idでグループ化
      where: {
        mail_list_id: Number(id)
      },
      _count: {
        mail_account_id: true // mail_account_idごとにカウント
      }
    });
  } else {
    result = await prisma.mail_send_logs.groupBy({
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
  }

  const mailAccounts = await Promise.all(
    result.map(async (log) => {
      const mailAccount = await prisma.mail_account.findUnique({
        where: { id: log.mail_account_id }
      });

      return {
        id: mailAccount?.id,
        name: mailAccount?.name,
        count: log._count.mail_account_id
      };
    })
  );

  return mailAccounts;
};

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
        complete_flg: true,
        log: true,
        create_at: true,
        update_at: true
      },
      orderBy: {
        staff_id: 'asc'
      }
    });

    const sent_account = await getMailAccountsSentToday();
    const sent_account_with_mail_list = await getMailAccountsSentToday(Number(id));

    return response.status(200).json({ mailList, mailDestination, sent_account, sent_account_with_mail_list });
  } catch (error) {
    console.error('エラーが発生しました:', error);
    return response.status(500).json({ error: 'データを取得できませんでした。' });
  }
}
