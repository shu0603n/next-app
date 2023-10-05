// material-ui
import { Grid } from '@mui/material';
import SkillTable from './skill-table/SkillTable';
import { useState, useEffect } from 'react';
import { SkillTableType } from 'types/employee/skill-table';

// アセット

// ==============================|| アカウントプロファイル - 役割 ||============================== //

async function fetchSkillList(id: number) {
  try {
    const response = await fetch(`/api/db/employee/skill/skills/select?id=${id}`);
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

async function fetchTableData() {
  try {
    const response = await fetch(`/api/db/employee/skill/select?id=${1}`);
    if (!response.ok) {
      throw new Error('API request failed');
    }
    const data = await response.json();

    // マップ処理を非同期関数として実行し、Promise.allで待機します
    data.data.rows = await Promise.all(
      data.data.rows.map(async (row: SkillTableType) => {
        try {
          const skills = await fetchSkillList(row.skills_used_id);
          return { ...row, skill: skills.data.rows ?? [] };
        } catch (error) {
          console.error('Error fetching skills:', error);
          return { ...row, skill: [] };
        }
      })
    );

    return data; // APIから返されたデータを返します
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
}

const TabRole = () => {
  const [data, setData] = useState<SkillTableType[]>([]); // デフォルト値を空の配列に設定

  useEffect(() => {
    // ページがロードされたときにデータを取得
    fetchTableData()
      .then((fetchedData) => {
        setData(fetchedData.data.rows);
      })
      .catch((error) => {
        // エラーハンドリング
        console.error('Error:', error);
      });
  }, []);

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        {data.length > 0 && <SkillTable data={data} />}
      </Grid>
    </Grid>
  );
};

export default TabRole;
