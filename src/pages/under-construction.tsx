import { ReactElement } from 'react';

// next
import Image from 'next/legacy/image';
import NextLink from 'next/link';

// material-ui
import { Box, Button, Grid, Stack, Typography } from '@mui/material';

// project import
import { APP_DEFAULT_PATH } from 'config';
import Layout from 'layout';
import Page from 'components/Page';

// assets
const construction = '/assets/images/maintenance/under-construction.svg';

// ==============================|| 工事中 - メイン ||============================== //

function UnderConstruction() {
  return (
    <Page title="工事中">
      <Grid container spacing={4} direction="column" alignItems="center" justifyContent="center" sx={{ minHeight: '100vh', py: 2 }}>
        <Grid item xs={12}>
          <Box sx={{ position: 'relative', width: { xs: 300, sm: 480 }, height: { xs: 265, sm: 430 } }}>
            <Image src={construction} alt="工事中" layout="fill" />
          </Box>
        </Grid>
        <Grid item xs={12}>
          <Stack spacing={2} justifyContent="center" alignItems="center">
            <Typography variant="h1" align="center">
              工事中
            </Typography>
            <Typography color="textSecondary" align="center" sx={{ width: { xs: '73%', sm: '82%' } }}>
              現在、このサイトはメンテナンス中です。後ほど再度アクセスしてください。
            </Typography>
            <NextLink href={APP_DEFAULT_PATH} passHref legacyBehavior>
              <Button variant="contained">ホームに戻る</Button>
            </NextLink>
          </Stack>
        </Grid>
      </Grid>
    </Page>
  );
}

UnderConstruction.getLayout = function getLayout(page: ReactElement) {
  return <Layout variant="blank">{page}</Layout>;
};

export default UnderConstruction;
