import { NextApiResponse, NextApiRequest } from 'next';
import { prisma } from '../../prisma';
import { selectData } from '../basic/select';

export default async function handler(request: NextApiRequest, response: NextApiResponse) {
  try {
    const toNull = (str: string | null | undefined) => {
      return str === null || str === '' ? null : str;
    };
    const {
      id,
      sei,
      mei,
      sei_k,
      mei_k,
      gender,
      birthday,
      remarks,
      phone_number,
      email,
      postal_code,
      address,
      joining_date,
      retirement_date,
      employment_id,
      position_id,
      job_category_id
    } = request.body;

    // 必須パラメーターのチェック
    if (!id || !sei || !mei) {
      throw new Error('パラメーターが不足しています');
    }

    // データの更新
    const updatedEmployee = await prisma.employee.update({
      where: { id: Number(id) },
      data: {
        sei: sei,
        mei: mei,
        sei_k: toNull(sei_k),
        mei_k: toNull(mei_k),
        gender: toNull(gender),
        birthday: toNull(birthday) ? new Date(birthday) : null,
        remarks: toNull(remarks),
        phone_number: toNull(phone_number),
        email: toNull(email),
        postal_code: toNull(postal_code),
        address: toNull(address),
        joining_date: toNull(joining_date) ? new Date(joining_date) : null,
        retirement_date: toNull(retirement_date) ? new Date(retirement_date) : null,
        employment_id: employment_id ? Number(employment_id) : null,
        position_id: position_id ? Number(position_id) : null,
        job_category_id: job_category_id ? Number(job_category_id) : null
      }
    });

    if (!updatedEmployee) {
      throw new Error('対象のIDが存在しませんでした');
    }

    // 更新後のデータを取得
    const data = await selectData(id);

    return response.status(200).json({ data: data });
  } catch (error) {
    console.error('エラーが発生しました:', error);
    return response.status(500).json({ error: 'データを取得できませんでした。' });
  }
}
