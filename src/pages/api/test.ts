import { NextApiRequest, NextApiResponse } from 'next';
import * as mysql from 'promise-mysql';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // MySQLデータベース接続情報
  const dbConfig = {
    host: 'localhost', // SSHトンネルを介してローカルホストに接続
    port: 3306, // MySQLポート
    user: 'xs739875_demo',
    password: 'adminadmin',
    database: 'xs739875_demo'
  };
  console.log(dbConfig);

  try {
    console.log('connection start>>');
    const connection = await mysql.createConnection(dbConfig);
    console.log(connection);

    const sql = 'SELECT * FROM skill';
    const result = await connection.query(sql);

    connection.end();

    res.status(200).json(result);
  } catch (error) {
    console.error('エラー:', error);
    res.status(500).json({ error: 'データベースエラー' });
  }
}
