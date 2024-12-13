import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../prisma';

export const selectEmployee = async () => {
  const data = await prisma.employee.findMany({
    select: {
      id: true,
      sei: true,
      mei: true,
      sei_k: true,
      mei_k: true,
      gender: true,
      avatar: true,
      job_category: {
        select: {
          id: true,
          name: true
        }
      },
      employment: {
        select: {
          id: true,
          name: true
        }
      },
      position: {
        select: {
          id: true,
          name: true
        }
      },
      retirement_date: true,
      joining_date: true,
      department_id: true
    }
  });

  // 状態を設定するロジックを追加
  return data.map((emp: any) => {
    let status = 2; // デフォルトで 2 (その他)
    if (emp.retirement_date && emp.retirement_date <= new Date()) {
      status = 4; // 退職している場合
    } else if (emp.joining_date && emp.joining_date <= new Date()) {
      const currentTime = new Date();
      const currentHours = currentTime.getHours();
      // 09:00 ~ 18:00 の時間帯
      if (currentHours >= 9 && currentHours < 18) {
        status = 1; // 勤務中
      }
    }
    return {
      ...emp,
      name: `${emp.sei} ${emp.mei}`,
      name_k: `${emp.sei_k} ${emp.mei_k}`,
      status
    };
  });
};

export default async function handler(request: NextApiRequest, response: NextApiResponse) {
  try {
    const data = await selectEmployee();
    return response.status(200).json({ data });
  } catch (error) {
    console.error('エラーが発生しました:', error);
    return response.status(500).json({ error: 'データを取得できませんでした。' });
  }
}
