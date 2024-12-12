import { ReactElement } from 'react';

// next
import Image from 'next/legacy/image';

// material-ui
import { useTheme } from '@mui/material/styles';
import { Box, Button, Grid, Stack, TextField, Typography, useMediaQuery } from '@mui/material';

// third party
import { useTimer } from 'react-timer-hook';

// project import
import Layout from 'layout';
import Page from 'components/Page';
import MainCard from 'components/MainCard';

// assets
const coming = '/assets/images/maintenance/coming-soon.png';

// ==============================|| 近日公開 - タイマー ||============================== //

const TimerBox = ({ count, label }: { count: number; label: string }) => {
  const theme = useTheme();
  const matchDownSM = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <MainCard content={false} sx={{ width: { xs: 60, sm: 80 } }}>
      <Stack justifyContent="center" alignItems="center">
        <Box sx={{ py: 1.75 }}>
          <Typography variant={matchDownSM ? 'h4' : 'h2'}>{count}</Typography>
        </Box>
        <Box sx={{ p: 0.5, bgcolor: 'secondary.lighter', width: '100%' }}>
          <Typography align="center" variant="subtitle2">
            {label}
          </Typography>
        </Box>
      </Stack>
    </MainCard>
  );
};

// 公開日の日時を取得してタイマーの終了時間を計算する関数
const calculateExpiryDate = (releaseDate: string): Date => {
  const releaseDateObj = new Date(releaseDate);
  if (isNaN(releaseDateObj.getTime())) {
    throw new Error('無効な日付形式です。正しい形式で公開日を指定してください。');
  }
  return releaseDateObj;
};

// ==============================|| 近日公開 - メイン ||============================== //

function ComingSoon() {
  const theme = useTheme();
  const matchDownSM = useMediaQuery(theme.breakpoints.down('sm'));

  const expiryDate = calculateExpiryDate('2025/01/01');
  const { seconds, minutes, hours, days } = useTimer({ expiryTimestamp: expiryDate });

  return (
    <Page title="近日公開">
      <Grid container spacing={4} direction="column" alignItems="center" justifyContent="center" sx={{ minHeight: '100vh', py: 2 }}>
        <Grid item xs={12}>
          <Image src={coming} alt="近日公開" layout="fixed" width={matchDownSM ? 360 : 490} height={matchDownSM ? 310 : 420} />
        </Grid>
        <Grid item xs={12}>
          <Stack spacing={1} justifyContent="center" alignItems="center" sx={{ mt: 4 }}>
            <Typography variant="h1" align="center">
              近日公開
            </Typography>
            <Typography color="textSecondary" align="center">
              新しい何かが間もなく登場します
            </Typography>
          </Stack>
        </Grid>
        <Grid item xs={12} sx={{ width: { xs: '90%', md: '40%' } }}>
          <Stack direction="row" alignItems="center" justifyContent="center" spacing={{ xs: 1, sm: 2 }}>
            <TimerBox count={days} label="日" />
            <Typography variant="h1"> : </Typography>
            <TimerBox count={hours} label="時" />
            <Typography variant="h1"> : </Typography>
            <TimerBox count={minutes} label="分" />
            <Typography variant="h1"> : </Typography>
            <TimerBox count={seconds} label="秒" />
          </Stack>
        </Grid>
        <Grid item xs={12} sx={{ width: { width: 380, md: '40%', lg: '30%' } }}>
          <Stack spacing={2} sx={{ mt: 2 }}>
            <Typography color="textSecondary" align="center">
              公開時に通知を受け取る
            </Typography>
            <Stack direction="row" spacing={1}>
              <TextField fullWidth placeholder="メールアドレス" />
              <Button variant="contained" sx={{ width: '50%' }}>
                通知する
              </Button>
            </Stack>
          </Stack>
        </Grid>
      </Grid>
    </Page>
  );
}

ComingSoon.getLayout = function getLayout(page: ReactElement) {
  return <Layout variant="blank">{page}</Layout>;
};

export default ComingSoon;
