import { ReactElement, useEffect, useState } from 'react';

// material-ui
import { Typography } from '@mui/material';

// project imports
import Layout from 'layout';
import Page from 'components/Page';
import MainCard from 'components/MainCard';

async function fetchTableData() {
  try {
    const response = await fetch('/api/getTable?tableName=Users');
    if (!response.ok) {
      throw new Error('API request failed');
    }
    const data = await response.json();
    return data; // APIから返されたデータを返します
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
}

// ==============================|| SAMPLE PAGE ||============================== //

const Top = () => {
  const [tableData, setTableData] = useState<dbResponse>(); // データを保持する状態変数

  useEffect(() => {
    // ページがロードされたときにデータを取得
    fetchTableData()
      .then((data) => {
        setTableData(data); // データを状態に設定
      })
      .catch((error) => {
        // エラーハンドリング
        console.error('Error:', error);
      });
  }, []); // 空の依存リストを指定することで、一度だけ実行される

  type dbResponse = {
    data: sqlResult;
  };
  type sqlResult = {
    command: string;
    fields: Array<any>;
    rowAsArray: boolean;
    rowCount: number;
    rows: Array<Param>;
    viaNeonFetch: boolean;
  };

  type Param = {
    id: string;
    name: string;
  };

  return (
    <Page title="Sample Page">
      <MainCard title="Sample Card">
        <Typography variant="body2">
          {/* データをマップして表示 */}
          <p>-----------テーブル------------</p>
          {tableData?.data.rows.map((item) => (
            // <div key={item.user_id}>{item.email}</div>
            <p key={item.id}>
              {item.id} {item.name}
            </p>
          ))}
        </Typography>
      </MainCard>
    </Page>
  );
};
Top.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export default Top;
