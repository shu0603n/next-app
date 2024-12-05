import { NextApiResponse, NextApiRequest } from 'next';
import { prisma } from '../prisma'; // prisma インスタンスのインポート
import { selectEmployee } from './select';

export default async function handler(request: NextApiRequest, response: NextApiResponse) {
  try {
    const toNull = (str: string) => {
      return str === null || str === '' ? null : str;
    };
    const {
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
      employment,
      position,
      job_category
    } = request.body;

    // 必須パラメータのチェック
    if (!sei || !mei) {
      throw new Error('パラメーターが不足しています');
    }

    // employee を挿入
    const newEmployee = await prisma.employee.create({
      data: {
        sei: sei,
        mei: mei,
        sei_k: toNull(sei_k),
        mei_k: toNull(mei_k),
        gender: toNull(gender),
        birthday: toNull(birthday),
        remarks: toNull(remarks),
        phone_number: toNull(phone_number),
        email: toNull(email),
        postal_code: toNull(postal_code),
        address: toNull(address),
        joining_date: toNull(joining_date),
        retirement_date: toNull(retirement_date),
        employment_id: employment ? employment.id : null,
        position_id: position ? position.id : null,
        job_category_id: job_category ? job_category.id : null
      }
    });

    // 新しく挿入された employee の ID を取得
    const employeeId = newEmployee.id;

    // roles テーブルに関連するレコードを挿入
    await prisma.roles.create({
      data: {
        super_role: false,
        system_role: false,
        employee_view: false,
        client_view: false,
        project_view: false,
        employee_edit: false,
        client_edit: false,
        project_edit: false,
        employee: {
          connect: {
            id: employeeId
          }
        }
      }
    });

    // employee のデータを取得して返す
    const data = await selectEmployee();

    return response.status(200).json({ data });
  } catch (error) {
    console.error('エラーが発生しました:', error);
    return response.status(500).json({ error: 'データを取得できませんでした。' });
  }
}
