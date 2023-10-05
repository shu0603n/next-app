// material-ui
import { useTheme } from '@mui/material/styles';
import { useMediaQuery, Grid, Divider, List, ListItem, Stack, TableCell, TableRow, Typography } from '@mui/material';

// プロジェクトのインポート
import MainCard from 'components/MainCard';
import Transitions from 'components/@extended/Transitions';

// アセット
import { SkillTableType, skill } from 'types/employee/skill-table';

// ==============================|| 顧客 - 表示 ||============================== //
interface Props {
  data: SkillTableType;
}
const CustomerView = ({ data }: Props) => {
  const theme = useTheme();
  const matchDownMD = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <TableRow sx={{ '&:hover': { bgcolor: `transparent !important` }, overflow: 'hidden' }}>
      <TableCell colSpan={8} sx={{ p: 2.5, overflow: 'hidden' }}>
        <Transitions type="slide" direction="down" in={true}>
          <Grid container spacing={2.5} sx={{ pl: { xs: 0, sm: 5, md: 6, lg: 10, xl: 12 } }}>
            <Grid item xs={12} sm={7} md={8} lg={8} xl={9}>
              <Stack spacing={2.5}>
                <MainCard title="プロジェクト詳細">
                  <List sx={{ py: 0 }}>
                    <ListItem divider={!matchDownMD}>
                      <Grid container spacing={3}>
                        <Grid item xs={12} md={6}>
                          <Stack spacing={0.5}>
                            <Typography color="secondary">プロジェクト名</Typography>
                            <Typography>{data.project_title}</Typography>
                          </Stack>
                        </Grid>
                        <Grid item xs={12} md={6}>
                          <Stack spacing={0.5}>
                            <Typography color="secondary">会社名</Typography>
                            <Typography>{data.client_name}</Typography>
                          </Stack>
                        </Grid>
                        <Grid item xs={12} md={6}>
                          <Stack spacing={0.5}>
                            <Typography color="secondary">業務内容</Typography>
                            <Typography>{data.job_description}</Typography>
                          </Stack>
                        </Grid>
                      </Grid>
                    </ListItem>
                  </List>
                </MainCard>
                <MainCard>
                  <Grid container spacing={3}>
                    <Grid item xs={12}>
                      <Stack direction="row" justifyContent="space-around" alignItems="center">
                        <Stack spacing={0.5} alignItems="center">
                          <Typography variant="h5">{data.people_number}ヵ月</Typography>
                          <Typography color="secondary">期間</Typography>
                        </Stack>
                        <Divider orientation="vertical" flexItem />
                        <Stack spacing={0.5} alignItems="center">
                          <Typography variant="h5">{data.people_number}</Typography>
                          <Typography color="secondary">役割</Typography>
                        </Stack>
                        <Divider orientation="vertical" flexItem />
                        <Stack spacing={0.5} alignItems="center">
                          <Typography variant="h5">{data.people_number}</Typography>
                          <Typography color="secondary">人数</Typography>
                        </Stack>
                      </Stack>
                    </Grid>
                  </Grid>
                </MainCard>
                {data.skill && (
                  <MainCard title="使用スキル">
                    {data.skill?.map((item: skill) => {
                      // eslint-disable-next-line react/jsx-key
                      return <Typography color="secondary">{`${item.skills_name} (${item.technic_name})`}</Typography>;
                    })}
                  </MainCard>
                )}
              </Stack>
            </Grid>
          </Grid>
        </Transitions>
      </TableCell>
    </TableRow>
  );
};

export default CustomerView;
