import { ReactElement } from 'react';

// material-ui
import { Typography } from '@mui/material';

// project imports
import Layout from 'layout';
import Page from 'components/Page';
import MainCard from 'components/MainCard';

// ==============================|| SAMPLE PAGE ||============================== //

const Top = () => (
  <Page title="Sample Page">
    <MainCard title="Sample Card">
      <Typography variant="body2">TopTopTopTopTopTopTopTop</Typography>
    </MainCard>
  </Page>
);

Top.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export default Top;
