// pages/api/your-api-route.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
  // デバッグモードを有効にする
  log: ['query']
});

export default async function handler(request: NextApiRequest, response: NextApiResponse) {
  try {
    // nullまたは空文字列を処理するユーティリティ関数
    const toNull = (str: string) => (str === null || str === '' ? null : str);

    // リクエストボディをデストラクチャリング
    const {
      id,
      hp_posting_flag,
      client,
      contract,
      working_postal_code,
      working_address,
      working_start_time,
      working_end_time,
      holiday,
      project_title,
      description
    } = request.body;

    // project_title が存在しない場合はエラーをスロー
    if (!project_title) {
      throw new Error('パラメーターが不足しています');
    }

    // id が存在する場合は更新を行う
    if (id) {
      await prisma.project.update({
        where: { id: Number(id) },
        data: {
          hp_posting_flag,
          client: { connect: { id: client.id } },
          contract: { connect: { id: contract.id } },
          working_postal_code: toNull(working_postal_code),
          working_address: toNull(working_address),
          working_start_time: toNull(working_start_time),
          working_end_time: toNull(working_end_time),
          holiday: toNull(holiday),
          project_title: toNull(project_title),
          description: toNull(description)
        }
      });

      // 更新結果を必要に応じて処理
    } else {
      // id が存在しない場合は新規挿入を行う
      await prisma.project.create({
        data: {
          hp_posting_flag,
          client: { connect: { id: client.id } },
          contract: { connect: { id: contract.id } },
          working_postal_code: toNull(working_postal_code),
          working_address: toNull(working_address),
          working_start_time: toNull(working_start_time),
          working_end_time: toNull(working_end_time),
          holiday: toNull(holiday),
          project_title: toNull(project_title),
          description: toNull(description)
        }
      });

      // 挿入結果を必要に応じて処理
    }

    // データを取得
    const data = await prisma.project.findMany({
      select: {
        id: true,
        hp_posting_flag: true,
        client: { select: { id: true, name: true } },
        contract: { select: { id: true, name: true } },
        working_postal_code: true,
        working_address: true,
        working_start_time: true,
        working_end_time: true,
        holiday: true,
        project_title: true,
        description: true
      }
    });

    // レスポンスを送信
    return response.status(200).json({ data });
  } catch (error) {
    console.error('エラーが発生しました:', error);
    return response.status(500).json({ error: 'データを取得できませんでした。' });
  }
}
