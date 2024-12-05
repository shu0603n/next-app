import { NextApiResponse, NextApiRequest } from 'next';
import { prisma } from '../prisma';

export default async function handler(request: NextApiRequest, response: NextApiResponse) {
  try {
    console.log('Request Body:', request.body);
    const toNull = (str: any) => {
      return str === null || str === '' || str === undefined ? null : str;
    };

    const { name, name_k, address, phone, email, postal_code, remarks } = request.body;

    // 必須パラメータのチェック
    if (!name) {
      return response.status(400).json({ error: 'パラメーターが不足しています' });
    }

    // 新しいプロジェクトの作成
    await prisma.client.create({
      data: {
        name: toNull(name),
        name_k: toNull(name_k),
        address: toNull(address),
        phone: toNull(phone),
        email: toNull(email),
        postal_code: toNull(postal_code),
        remarks: toNull(remarks)
      }
    });

    const getClients = () => prisma.client.findMany();
    const data = await getClients();

    return response.status(200).json({ data });
  } catch (error: any) {
    console.error('エラーが発生しました:', error);
    return response.status(500).json({ error: error.message || 'データを作成できませんでした。' });
  } finally {
    await prisma.$disconnect();
  }
}
