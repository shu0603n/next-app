import { ReactElement, useEffect, useState } from 'react';
import { Typography } from '@mui/material';
import Layout from 'layout';
import Page from 'components/Page';
import MainCard from 'components/MainCard';

const Employee = () => {
  const [responseData, setResponseData] = useState(null);

  useEffect(() => {
    // api/test.ts を呼び出す
    fetch('/api/test')
      .then((response) => {
        if (!response.ok) {
          // throw new Error('データの取得に失敗しました。');
          throw response;
        }
        return response.json();
      })
      .then((data) => {
        setResponseData(data);
      })
      .catch((error) => {
        console.error('エラー:', error);
      });
  }, []);

  return (
    <Page title="Sample Page">
      <MainCard title="Sample Card">
        <Typography variant="body2">employeeemployeeemployeeemployeeemployeeemployeeemployeeemployeeemployee</Typography>
        {/* responseData を表示 */}
        {responseData && (
          <div>
            <Typography variant="body2">取得したデータ:</Typography>
            <pre>{JSON.stringify(responseData, null, 2)}</pre>
          </div>
        )}
      </MainCard>
    </Page>
  );
};

Employee.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export default Employee;
