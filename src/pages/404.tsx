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
const error404 = '/assets/images/maintenance/Error404.png';
const TwoCone = '/assets/images/maintenance/TwoCone.png';

// ==============================|| ERROR 404 - MAIN ||============================== //

function Error404() {
  return (
    <Page title="404">
      <Grid
        container
        spacing={10}
        direction="column"
        alignItems="center"
        justifyContent="center"
        sx={{ minHeight: '100vh', pt: 1.5, pb: 1, overflow: 'hidden' }}
      >
        <Grid item xs={12}>
          <Stack direction="row">
            <Grid
              item
              sx={{
                position: 'relative',
                width: { xs: 250, sm: 590 },
                height: { xs: 130, sm: 300 }
              }}
            >
              <Image src={error404} alt="mantis" layout="fill" />
            </Grid>
            <Grid item sx={{ position: 'relative' }}>
              <Box sx={{ position: 'absolute', top: 60, left: -40, width: { xs: 130, sm: 390 }, height: { xs: 115, sm: 330 } }}>
                <Image src={TwoCone} alt="mantis" layout="fill" />
              </Box>
            </Grid>
          </Stack>
        </Grid>
        <Grid item xs={12}>
          <Stack spacing={2} justifyContent="center" alignItems="center">
            <Typography variant="h1">ページが見つかりません</Typography>
            <Typography color="textSecondary" align="center" sx={{ width: { xs: '73%', sm: '61%' } }}>
              お探しのページは移動されたか、削除されたか、名前が変更されたか、または存在しない可能性があります！
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

Error404.getLayout = function getLayout(page: ReactElement) {
  return <Layout variant="blank">{page}</Layout>;
};

export default Error404;
