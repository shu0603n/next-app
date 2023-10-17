// material-ui
import { useRouter } from 'next/router';
import { Grid } from '@mui/material';
import InvoiceTable from './invoice-table/InvoiceTable';
import { useState, useEffect } from 'react';
import { InvoiceTableType } from 'types/employee/invoice-table';

// アセット

// ==============================|| アカウントプロファイル - 役割 ||============================== //

async function fetchTableData(id: string) {
  try {
    const response = await fetch(`/api/db/employee/invoice/select?id=${id}`);
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

const TabInvoice = () => {
  const [data, setData] = useState<InvoiceTableType[]>([]); // デフォルト値を空の配列に設定
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
        <InvoiceTable data={data} />
      </Grid>
    </Grid>
  );
};

export default TabInvoice;
