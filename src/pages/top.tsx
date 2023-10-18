import { ReactElement } from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';
import { Grid } from '@mui/material';

// project imports
import Layout from 'layout';
import Page from 'components/Page';
import HoverSocialCard from 'components/cards/statistics/HoverSocialCard';

// ===========================|| WIDGET - STATISTICS ||=========================== //

const Top = () => {
  const theme = useTheme();

  return (
    <Page title="Top">
      <Grid container spacing={3}>
        <Grid item xs={12} lg={3} sm={6}>
          <HoverSocialCard primary="出勤" secondary="9:00" color={theme.palette.primary.main} />
        </Grid>
        <Grid item xs={12} lg={3} sm={6}>
          <HoverSocialCard primary="退勤" secondary="18:00" color={theme.palette.error.main} />
        </Grid>
      </Grid>
    </Page>
  );
};

Top.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export default Top;
