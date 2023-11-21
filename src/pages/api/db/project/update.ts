// pages/api/your-api-route.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import { ParameterType, SkillParameterType } from 'types/parameter/parameter';

const prisma = new PrismaClient({
  // デバッグモードを有効にする
  log: ['query']
});

const createProjectSkills = async (projectId: number, skillId: number) => {
  await prisma.project_skills.create({
    data: {
      project_id: projectId,
      skill_id: skillId
    }
  });
};

const createProjectProcess = async (projectId: number, processId: number) => {
  await prisma.project_process.create({
    data: {
      project_id: projectId,
      process_id: processId
    }
  });
};

export default async function handler(request: NextApiRequest, response: NextApiResponse) {
  try {
    // nullまたは空文字列を処理するユーティリティ関数
    const toNull = (str: string) => (str === null || str === '' ? null : str);

    // リクエストボディをデストラクチャリング
    const {
      id,
      start_date,
      end_date,
      hp_posting_flag,
      client,
      contract,
      working_postal_code,
      working_address,
      working_start_time,
      working_end_time,
      holiday,
      project_title,
      description,
      price,
      skills,
      process
    } = request.body;

    console.log('body', request.body);

    const skillIds = skills?.map((skillItem: SkillParameterType) => skillItem?.id) ?? null;
    console.log(skillIds);

    const processIds = process?.map((processItem: ParameterType) => processItem?.id) ?? null;
    console.log(processIds);

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
          start_date,
          end_date,
          client: {
            connect: client ? { id: client.id } : undefined
          },
          contract: {
            connect: contract ? { id: contract.id } : undefined
          },
          working_postal_code: toNull(working_postal_code),
          working_address: toNull(working_address),
          working_start_time: toNull(working_start_time),
          working_end_time: toNull(working_end_time),
          holiday: toNull(holiday),
          project_title: toNull(project_title),
          description: toNull(description),
          price: toNull(price)
        }
      });

      // 既存データを削除
      await Promise.all([
        await prisma.project_skills.deleteMany({
          where: {
            project_id: Number(id)
          }
        }),
        await prisma.project_process.deleteMany({
          where: {
            project_id: Number(id)
          }
        })
      ]);

      await Promise.all([
        await Promise.all(skillIds.map((skillId: number) => createProjectSkills(Number(id), skillId))),
        await Promise.all(processIds.map((processId: number) => createProjectProcess(Number(id), processId)))
      ]);

      // 更新結果を必要に応じて処理
    } else {
      // id が存在しない場合は新規挿入を行う
      const res = await prisma.project.create({
        data: {
          hp_posting_flag,
          start_date,
          end_date,
          client: {
            connect: client ? { id: client.id } : undefined
          },
          contract: {
            connect: contract ? { id: contract.id } : undefined
          },
          working_postal_code,
          working_address,
          working_start_time,
          working_end_time,
          holiday,
          project_title,
          description,
          price
        }
      });

      await Promise.all([
        await Promise.all(skillIds.map((skillId: number) => createProjectSkills(Number(res.id), skillId))),
        await Promise.all(processIds.map((processId: number) => createProjectProcess(Number(res.id), processId)))
      ]);

      // 挿入結果を必要に応じて処理
    }

    // データを取得
    const projects = await prisma.project.findMany({
      select: {
        id: true,
        start_date: true,
        end_date: true,
        hp_posting_flag: true,
        client: { select: { id: true, name: true } },
        contract: { select: { id: true, name: true } },
        working_postal_code: true,
        working_address: true,
        working_start_time: true,
        working_end_time: true,
        holiday: true,
        project_title: true,
        description: true,
        price: true
      }
    });

    // レスポンスを送信
    return response.status(200).json({ projects });
  } catch (error) {
    console.error('エラーが発生しました:', error);
    return response.status(500).json({ error: 'データを取得できませんでした。' });
  }
}
