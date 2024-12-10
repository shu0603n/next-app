import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../prisma';

export const selectStaff = async () => {
  const data = await prisma.staff.findMany({
    select: {
      id: true,
      name: true,
      mail: true,
      birthday: true,
      import_status: {
        select: {
          id: true,
          name: true
        }
      },
      staff_status: {
        select: {
          id: true,
          name: true
        }
      }
    }
  });
  // 年齢を計算して追加
  const staffWithAge = data.map((staff) => {
    if (!staff.birthday) {
      // birthday が null の場合は age を null に設定
      return {
        ...staff,
        age: null
      };
    }

    const birthday = new Date(staff.birthday);
    const age =
      new Date().getFullYear() -
      birthday.getFullYear() -
      (new Date().getMonth() < birthday.getMonth() ||
      (new Date().getMonth() === birthday.getMonth() && new Date().getDate() < birthday.getDate())
        ? 1
        : 0);

    return {
      ...staff,
      age
    };
  });

  return staffWithAge;
};

export default async function handler(request: NextApiRequest, response: NextApiResponse) {
  try {
    const data = await selectStaff();
    return response.status(200).json({ data });
  } catch (error) {
    console.error('エラーが発生しました:', error);
    return response.status(500).json({ error: 'データを取得できませんでした。' });
  }
}
