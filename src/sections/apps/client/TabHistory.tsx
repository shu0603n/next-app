// material-ui
import { useRouter } from 'next/router';
import { Grid } from '@mui/material';
import HistoryTable from './history-table/HistoryTable';
import { useState, useEffect } from 'react';
import { ParameterType } from 'types/parameter/parameter';
import { ClientHistoryType } from 'types/client/history';

// アセット

// ==============================|| アカウントプロファイル - 役割 ||============================== //

async function fetchTableData(id: string) {
  try {
    const response = await fetch(`/api/db/client/history/select?id=${id}`);
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

const TabHistory = () => {
  const [data, setData] = useState<ClientHistoryType[]>([]);
  const [candidate_client_position, setCandidate_client_position] = useState<ParameterType[]>([]);
  const router = useRouter();
  const id = router.query.id as string;

  useEffect(() => {
    // ページがロードされたときにデータを取得
    fetchTableData(id)
      .then((fetchedData) => {
        setData(fetchedData.clientHistory);
        setCandidate_client_position(fetchedData.clientPosition);
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
        <HistoryTable data={data} candidate_client_position={candidate_client_position} />
      </Grid>
    </Grid>
  );
};

export default TabHistory;
