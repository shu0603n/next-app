import { NextApiResponse, NextApiRequest } from 'next';
import { getMailAccounts } from './select';
import { prisma } from '../../prisma';

export default async function handler(request: NextApiRequest, response: NextApiResponse) {
  try {
    const name = request.query.name as string;
    const user = request.query.user as string;
    const pass = request.query.pass as string;

    if (!name || !user || !pass) throw new Error('パラメーターが不足しています');

    await prisma.mail_account.update({
      where: {
        name
      },
      data: {
        name,
        user,
        pass
      }
    });

    const data = await getMailAccounts();
    return response.status(200).json({ data });
  } catch (error) {
    console.error('エラーが発生しました:', error);
    return response.status(500).json({ error: 'データを取得できませんでした。' });
  }
}
