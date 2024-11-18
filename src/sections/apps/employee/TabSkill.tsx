// material-ui
import { useRouter } from 'next/router';
import { Grid } from '@mui/material';
import SkillTable from './skill-table/SkillTable';
import { useState, useEffect } from 'react';
import { SkillTableType } from 'types/employee/skill-table';

// アセット

// ==============================|| アカウントプロファイル - 役割 ||============================== //

async function fetchTableData(id: string) {
  try {
    const response = await fetch(`/api/db/employee/project/select?id=${id}`);
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

const TabRole = () => {
  const [data, setData] = useState<SkillTableType[]>([]); // デフォルト値を空の配列に設定
  const router = useRouter();
  const id = router.query.id as string;

  useEffect(() => {
    // ページがロードされたときにデータを取得
    fetchTableData(id)
      .then((fetchedData) => {
        setData(fetchedData.data.rows);
      })
      .catch((error) => {
        // エラーハンドリング
        console.error('Error:', error);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <SkillTable data={data} />
      </Grid>
    </Grid>
  );
};

export default TabRole;
