// material-ui
import { useRouter } from 'next/router';
import { Grid } from '@mui/material';
import SkillTable from './skill-table/SkillTable';
import { useState, useEffect } from 'react';
import { SkillTableType, skill, processType } from 'types/employee/skill-table';

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
  const [data, setData] = useState<SkillTableType[]>([]);
  const [candidate_skills, setCandidate_skills] = useState<skill[]>([]);
  const [candidate_processes, setCandidate_processes] = useState<processType[]>([]);
  const router = useRouter();
  const id = router.query.id as string;

  useEffect(() => {
    // ページがロードされたときにデータを取得
    fetchTableData(id)
      .then((fetchedData) => {
        setData(fetchedData.data.rows);
        setCandidate_skills(fetchedData.skill);
        setCandidate_processes(fetchedData.process);
        console.log(fetchedData);
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
        <SkillTable data={data} candidate_skills={candidate_skills} candidate_processes={candidate_processes} />
      </Grid>
    </Grid>
  );
};

export default TabRole;
