import { NextApiResponse, NextApiRequest } from 'next';
import { prisma } from '../../prisma';
import { selectClientHistory } from './select';

export default async function handler(request: NextApiRequest, response: NextApiResponse) {
  try {
    const clientId = request.query.id as string;

    const { id, client_id, time, name, gender, age, remarks, client_position, employee_id } = request.body;

    // 必須パラメータのチェック
    if (!id || !client_id || !time || !employee_id) {
      return response.status(400).json({ error: 'パラメーターが不足しています' });
    }

    // 更新クエリ
    await prisma.client_history.updateMany({
      where: {
        id: Number(id)
      },
      data: {
        time: time,
        name: name,
        gender: gender,
        age: age,
        remarks: remarks,
        client_position_id: client_position ? client_position.id : null,
        employee_id: employee_id
      }
    });

    const data = await selectClientHistory(clientId);

    return response.status(200).json({ data });
  } catch (error: any) {
    console.error('エラーが発生しました:', error);
    return response.status(500).json({ error: error.message || 'データを取得できませんでした。' });
  } finally {
    await prisma.$disconnect();
  }
}
