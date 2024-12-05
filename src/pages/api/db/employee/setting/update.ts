import { NextApiResponse, NextApiRequest } from 'next';
import { prisma } from '../../prisma';
import { selectData } from './select';

export default async function handler(request: NextApiRequest, response: NextApiResponse) {
  try {
    // リクエストボディからデータを取得
    const { employee_id, super_role, system_role, employee_view, client_view, project_view, employee_edit, client_edit, project_edit } =
      request.body;

    // 必須パラメーターのチェック
    if (!employee_id) {
      return response.status(400).json({ error: 'パラメーターが不足しています: employee_id は必須です' });
    }

    // データの更新
    const updatedRole = await prisma.roles.update({
      where: { employee_id: Number(employee_id) },
      data: {
        super_role,
        system_role,
        employee_view,
        client_view,
        project_view,
        employee_edit,
        client_edit,
        project_edit,
      },
    });

    if (!updatedRole) {
      return response.status(404).json({ error: '対象のIDが存在しませんでした' });
    }

    // 更新後のデータを取得
    const data = await selectData(employee_id);

    return response.status(200).json({ data });
  } catch (error) {
    console.error('エラーが発生しました:', error);
    return response.status(500).json({ error: 'データの更新中にエラーが発生しました。' });
  }
}
