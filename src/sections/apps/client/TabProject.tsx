// material-ui
import { useRouter } from 'next/router';
import { Grid } from '@mui/material';
import ProjectTable from './project-table/ProjectTable';
import { useState, useEffect } from 'react';
import { ProjectTableType, clientType, employeeType } from 'types/client/project-table';

// アセット

// ==============================|| アカウントプロファイル - 役割 ||============================== //

async function fetchTableData(id: string) {
  try {
    const response = await fetch(`/api/db/client/project/select?id=${id}`);
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
  const [data, setData] = useState<ProjectTableType[]>([]);
  const [candidate_client, setCandidate_client] = useState<clientType[]>([]);
  const [candidate_employee, setCandidate_employee] = useState<employeeType[]>([]);
  const router = useRouter();
  const id = router.query.id as string;

  useEffect(() => {
    // ページがロードされたときにデータを取得
    fetchTableData(id)
      .then((fetchedData) => {
        setData(fetchedData.data.rows);
        setCandidate_client(fetchedData.client);
        setCandidate_employee(fetchedData.employee);
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
        <ProjectTable data={data} candidate_client={candidate_client} candidate_employee={candidate_employee} />
      </Grid>
    </Grid>
  );
};

export default TabRole;
