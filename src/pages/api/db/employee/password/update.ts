import { sql } from '@vercel/postgres';
import { NextApiResponse, NextApiRequest } from 'next';

export default async function handler(request: NextApiRequest, response: NextApiResponse) {
  try {
    const { id, old_password, new_password } = request.body;

    if (!id || !old_password || !new_password) {
      throw new Error('パラメーターが不足しています');
    }

    // 古いパスワードの確認
    const userResult = await sql`
      SELECT password FROM employee WHERE id = ${Number(id)};
    `;

    if (userResult.rowCount === 0) {
      throw new Error('対象のIDが存在しませんでした');
    }

    const user = userResult.rows[0];

    // パスワードが一致するか確認
    if (user.password !== old_password) {
      throw new Error('古いパスワードが正しくありません');
    }

    // 新しいパスワードに更新
    const updateResult = await sql`
      UPDATE employee
      SET password = ${new_password}
      WHERE id = ${Number(id)}
    `;

    if (updateResult.rowCount !== 1) {
      throw new Error('パスワードの更新に失敗しました');
    }

    return response.status(200).json({ message: 'パスワードが正常に更新されました' });
  } catch (error) {
    console.error('エラーが発生しました:', error);
    return response.status(500).json({ error: 'データを更新できませんでした。' });
  }
}
