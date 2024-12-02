// material-ui
import { useRouter } from 'next/router';
import { Grid } from '@mui/material';
import SkillTable from './skill-table/SkillTable';
import { useState, useEffect } from 'react';
import { ClientType, ProcessType, SkillTableType, SkillType } from 'types/employee/skill-table';
import { ParameterType } from 'types/parameter/parameter';

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
  const [candidate_skills, setCandidate_skills] = useState<SkillType[]>([]);
  const [candidate_technics, setCandidate_technics] = useState<ParameterType[]>([]);
  const [candidate_processes, setCandidate_processes] = useState<ProcessType[]>([]);
  const [candidate_roles, setCandidate_roles] = useState<ParameterType[]>([]);
  const [candidate_client, setCandidate_client] = useState<ClientType[]>([]);
  const router = useRouter();
  const id = router.query.id as string;

  useEffect(() => {
    // ページがロードされたときにデータを取得
    fetchTableData(id)
      .then((fetchedData) => {
        setData(fetchedData.data);
        setCandidate_skills(fetchedData.skill);
        setCandidate_technics(fetchedData.technic);
        setCandidate_processes(fetchedData.process);
        setCandidate_roles(fetchedData.role);
        setCandidate_client(fetchedData.client);
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
        <SkillTable
          data={data}
          candidate_skills={candidate_skills}
          candidate_technics={candidate_technics}
          candidate_processes={candidate_processes}
          candidate_roles={candidate_roles}
          candidate_client={candidate_client}
        />
      </Grid>
    </Grid>
  );
};

export default TabRole;
