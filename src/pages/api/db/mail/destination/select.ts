import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../prisma';

export const selectDestination = async () => {
  const data = await prisma.staff.findMany({
    where: {
      staff_status_id: {
        in: [1, 2, 3, 4] // staff_status_idが1(新規), 2（既存）, 3,（稼働中）のいずれかであるデータを取得
      }
    },
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
    const id = request.query.id as string;
    const data = await selectDestination();
    const count = await prisma.mail_destination.count({
      where: {
        mail_list_id: Number(id)
      },
    });

    // 件数が 0 なら true、それ以外なら false を返す
    const isComplete = count === 0;

    return response.status(200).json({ data, isComplete });
  } catch (error) {
    console.error('エラーが発生しました:', error);
    return response.status(500).json({ error: 'データを取得できませんでした。' });
  }
}
