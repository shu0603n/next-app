// material-ui
import { useTheme } from '@mui/material/styles';
import { useMediaQuery, Grid, Divider, List, ListItem, Stack, TableCell, TableRow, Typography, Box, Chip } from '@mui/material';

// プロジェクトのインポート
import MainCard from 'components/MainCard';
import Transitions from 'components/@extended/Transitions';

// アセット
import { SkillTableType } from 'types/employee/skill-table';
import { ParameterType, SkillParameterType } from 'types/parameter/parameter';

// ==============================|| 顧客 - 表示 ||============================== //
interface Props {
  data: SkillTableType;
}
const CustomerView = ({ data }: Props) => {
  const theme = useTheme();
  const matchDownMD = useMediaQuery(theme.breakpoints.down('md'));

  const formatDate = (isoDate: string) => {
    const date = new Date(isoDate);
    return date.toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  };

  // 期間を月数で計算
  const calculateMonthsBetween = (startDate: string, endDate: string): number => {
    const start = new Date(startDate);
    const end = new Date(endDate);

    // 開始日と終了日の年月を取り出す
    const startYear = start.getFullYear();
    const startMonth = start.getMonth(); // 0-based index (0 = January)
    const endYear = end.getFullYear();
    const endMonth = end.getMonth();

    // 月数の差を計算
    const monthDifference = (endYear - startYear) * 12 + (endMonth - startMonth);

    // 結果を返す
    return monthDifference;
  };

  // 期間（月数）の計算
  const monthsBetween = calculateMonthsBetween(formatDate(data.start_date), formatDate(data.end_date));

  return (
    <TableRow sx={{ '&:hover': { bgcolor: `transparent !important` }, overflow: 'hidden' }}>
      <TableCell colSpan={8} sx={{ p: 2.5, overflow: 'hidden' }}>
        <Transitions type="slide" direction="down" in={true}>
          <Grid container spacing={2.5} sx={{ pl: { xs: 0, sm: 5, md: 6, lg: 10, xl: 12 } }}>
            <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
              <Stack spacing={2.5}>
                <MainCard title="プロジェクト詳細">
                  <List sx={{ py: 0 }}>
                    <ListItem divider={!matchDownMD}>
                      <Grid container spacing={3}>
                        <Grid item xs={12} md={12}>
                          <Stack spacing={0.5}>
                            <Typography color="secondary">ID</Typography>
                            <Typography>{data.id}</Typography>
                          </Stack>
                        </Grid>
                        <Grid item xs={12} md={12}>
                          <Stack spacing={0.5}>
                            <Typography color="secondary">プロジェクト名</Typography>
                            <Typography>{data.project_title}</Typography>
                          </Stack>
                        </Grid>
                        <Grid item xs={12} md={12}>
                          <Stack spacing={0.5}>
                            <Typography color="secondary">会社名</Typography>
                            <Typography>{data.client_name}</Typography>
                          </Stack>
                        </Grid>
                        <Grid item xs={12} md={12}>
                          <Stack spacing={0.5}>
                            <Typography color="secondary">業務内容</Typography>
                            <Typography>{data.description}</Typography>
                          </Stack>
                        </Grid>
                      </Grid>
                      <Grid item xs={12} md={8} sx={{ ml: 6 }}>
                        <Stack spacing={2.5}>
                          <Typography color="secondary">使用スキル</Typography>
                          {data.employee_project_skills &&
                          data.employee_project_skills.filter((skill) => skill !== null && skill !== undefined).length > 0 ? (
                            <Box
                              sx={{
                                display: 'flex',
                                flexWrap: 'wrap',
                                listStyle: 'none',
                                p: 0.5,
                                m: 0
                              }}
                              component="ul"
                            >
                              {data.employee_project_skills.map((skills: SkillParameterType, index: number) => (
                                <ListItem disablePadding key={index} sx={{ width: 'auto', pr: 0.75, pb: 0.75 }}>
                                  <Chip variant="outlined" size="small" label={skills.name} />
                                </ListItem>
                              ))}
                            </Box>
                          ) : (
                            <Typography>スキル情報がありません</Typography>
                          )}

                          <Typography color="secondary">担当工程</Typography>
                          {data.employee_project_processes &&
                          data.employee_project_processes.filter((process) => process !== null && process !== undefined).length > 0 ? (
                            <Box
                              sx={{
                                display: 'flex',
                                flexWrap: 'wrap',
                                listStyle: 'none',
                                p: 0.5,
                                m: 0
                              }}
                              component="ul"
                            >
                              {data.employee_project_processes.map((process: ParameterType, index: number) => (
                                <ListItem disablePadding key={index} sx={{ width: 'auto', pr: 0.75, pb: 0.75 }}>
                                  <Chip variant="outlined" size="small" label={process.name} />
                                </ListItem>
                              ))}
                            </Box>
                          ) : (
                            <Typography>担当工程情報がありません</Typography>
                          )}
                        </Stack>
                      </Grid>
                    </ListItem>
                  </List>
                </MainCard>
                <MainCard>
                  <Grid container spacing={3}>
                    <Grid item xs={12}>
                      <Stack direction="row" justifyContent="space-around" alignItems="center">
                        <Stack spacing={0.5} alignItems="center">
                          <Typography color="secondary">期間</Typography>
                          <Typography variant="h5">{monthsBetween}ヵ月</Typography>
                        </Stack>
                        <Divider orientation="vertical" flexItem />
                        <Stack spacing={0.5} alignItems="center">
                          <Typography color="secondary">役割</Typography>
                          <Typography variant="h5">{data.project_position?.description}</Typography>
                        </Stack>
                        <Divider orientation="vertical" flexItem />
                        <Stack spacing={0.5} alignItems="center">
                          <Typography color="secondary">人数</Typography>
                          <Typography variant="h5">{data.people_number}人</Typography>
                        </Stack>
                      </Stack>
                    </Grid>
                  </Grid>
                </MainCard>
              </Stack>
            </Grid>
          </Grid>
        </Transitions>
      </TableCell>
    </TableRow>
  );
};

export default CustomerView;
