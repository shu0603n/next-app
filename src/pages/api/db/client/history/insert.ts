import { NextApiResponse, NextApiRequest } from 'next';
import { prisma } from '../../prisma';
import { selectClientHistory } from './select';

export default async function handler(request: NextApiRequest, response: NextApiResponse) {
  try {
    const clientId = request.query.id as string;

    const { time, name, gender, age, remarks, client_position, employee_id } = request.body;

    // 必須パラメータのチェック
    if (!clientId || !time || !employee_id) {
      return response.status(400).json({ error: 'パラメーターが不足しています' });
    }

    // client_history を挿入するクエリ
    await prisma.client_history.create({
      data: {
        client_id: Number(clientId), // 受け取った client_id を設定
        time: time,
        name: name || '',
        gender: gender || null,
        age: age || null,
        remarks: remarks || null,
        client_position_id: client_position ? client_position.id : null,
        employee_id: employee_id
      }
    });

    const data = await selectClientHistory(clientId); // 必要に応じて clientId で取得

    return response.status(201).json({ data });
  } catch (error: any) {
    console.error('エラーが発生しました:', error);
    return response.status(500).json({ error: error.message || 'データを挿入できませんでした。' });
  } finally {
    await prisma.$disconnect();
  }
}
