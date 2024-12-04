// material-ui
import { useTheme } from '@mui/material/styles';
import { useMediaQuery, Grid, List, ListItem, Stack, TableCell, TableRow, Typography } from '@mui/material';

// プロジェクトのインポート
import MainCard from 'components/MainCard';
import Transitions from 'components/@extended/Transitions';

// アセット
import { ProjectTableType } from 'types/client/project-table';

// ==============================|| 顧客 - 表示 ||============================== //
interface Props {
  data: ProjectTableType;
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

  return (
    <TableRow sx={{ '&:hover': { bgcolor: `transparent !important` }, overflow: 'hidden' }}>
      <TableCell colSpan={8} sx={{ p: 2.5, overflow: 'hidden' }}>
        <Transitions type="slide" direction="down" in={true}>
          {/* {JSON.stringify(data)} */}
          <Grid container spacing={2.5}>
            <Grid item xs={12}>
              <MainCard title="プロジェクト詳細">
                <List sx={{ py: 0 }}>
                  <ListItem divider={!matchDownMD}>
                    <Grid container spacing={3}>
                      {/* 左側カラム */}
                      <Grid item xs={12} md={5.5} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                        <Stack sx={{ mb: 2 }}>
                          <Typography color="secondary" sx={{ fontWeight: 'bold', marginBottom: 1 }}>
                            ID
                          </Typography>
                          <Typography sx={{ marginBottom: 2 }}>{data.id}</Typography>
                        </Stack>
                        <Stack sx={{ mb: 2 }}>
                          <Typography color="secondary" sx={{ fontWeight: 'bold', marginBottom: 1 }}>
                            開始日 / 終了日
                          </Typography>
                          <Typography sx={{ marginBottom: 2 }}>
                            {`${formatDate(data.start_date)} ~ ${formatDate(data.end_date)}`}
                          </Typography>
                        </Stack>
                        <Stack sx={{ mb: 2 }}>
                          <Typography color="secondary" sx={{ fontWeight: 'bold', marginBottom: 1 }}>
                            就業時間
                          </Typography>
                          <Typography sx={{ marginBottom: 2 }}>{`${data.working_start_time} ~ ${data.working_end_time}`}</Typography>
                        </Stack>
                        <Stack sx={{ mb: 2 }}>
                          <Typography color="secondary" sx={{ fontWeight: 'bold', marginBottom: 1 }}>
                            郵便番号
                          </Typography>
                          <Typography sx={{ marginBottom: 2 }}>{`〒 ${data.working_postal_code}`}</Typography>
                        </Stack>
                        <Stack sx={{ mb: 2 }}>
                          <Typography color="secondary" sx={{ fontWeight: 'bold', marginBottom: 1 }}>
                            住所
                          </Typography>
                          <Typography sx={{ marginBottom: 2 }}>{data.working_address}</Typography>
                        </Stack>
                        <Stack sx={{ mb: 2 }}>
                          <Typography color="secondary" sx={{ fontWeight: 'bold', marginBottom: 1 }}>
                            休日
                          </Typography>
                          <Typography sx={{ marginBottom: 2 }}>{data.holiday}</Typography>
                        </Stack>
                        <Stack sx={{ mb: 2 }}>
                          <Typography color="secondary" sx={{ fontWeight: 'bold', marginBottom: 1 }}>
                            最寄駅
                          </Typography>
                          <Typography sx={{ marginBottom: 2 }}>{data.fertilizer_type}</Typography>
                        </Stack>
                        <Stack sx={{ mb: 2 }}>
                          <Typography color="secondary" sx={{ fontWeight: 'bold', marginBottom: 1 }}>
                            担当者
                          </Typography>
                          <Typography sx={{ marginBottom: 2 }}>{data.sei}</Typography>
                        </Stack>
                        <Stack sx={{ mb: 2 }}>
                          <Typography color="secondary" sx={{ fontWeight: 'bold', marginBottom: 1 }}>
                            派遣元
                          </Typography>
                          <Typography sx={{ marginBottom: 2 }}>{data.dispatch_source}</Typography>
                        </Stack>
                        <Stack sx={{ mb: 2 }}>
                          <Typography color="secondary" sx={{ fontWeight: 'bold', marginBottom: 1 }}>
                            就業期間
                          </Typography>
                          <Typography sx={{ marginBottom: 2 }}>{data.contract_period}</Typography>
                        </Stack>
                        <Stack sx={{ mb: 2 }}>
                          <Typography color="secondary" sx={{ fontWeight: 'bold', marginBottom: 1 }}>
                            計算方法
                          </Typography>
                          <Typography sx={{ marginBottom: 2 }}>
                            {
                              <Typography>
                                {data.price_type === 1 ? '時給' : data.price_type === 2 ? '単価' : '計算方法を入力してください'}
                              </Typography>
                            }
                          </Typography>
                        </Stack>
                        <Stack sx={{ mb: 2 }}>
                          <Typography color="secondary" sx={{ fontWeight: 'bold', marginBottom: 1 }}>
                            環境備考
                          </Typography>
                          <Typography sx={{ marginBottom: 2 }}>{data.environmental_notes}</Typography>
                        </Stack>
                        <Stack sx={{ mb: 2 }}>
                          <Typography color="secondary" sx={{ fontWeight: 'bold', marginBottom: 1 }}>
                            特記事項
                          </Typography>
                          <Typography sx={{ marginBottom: 2 }}>{data.special_notes}</Typography>
                        </Stack>
                        <Stack sx={{ mb: 2 }}>
                          <Typography color="secondary" sx={{ fontWeight: 'bold', marginBottom: 1 }}>
                            人材要件
                          </Typography>
                          <Typography sx={{ marginBottom: 2 }}>{data.hr_requirements}</Typography>
                        </Stack>
                        <Stack sx={{ mb: 2 }}>
                          <Typography color="secondary" sx={{ fontWeight: 'bold', marginBottom: 1 }}>
                            男女
                          </Typography>
                          <Typography sx={{ marginBottom: 2 }}>{data.gender_requirements}</Typography>
                        </Stack>
                        <Stack sx={{ mb: 2 }}>
                          <Typography color="secondary" sx={{ fontWeight: 'bold', marginBottom: 1 }}>
                            年齢
                          </Typography>
                          <Typography sx={{ marginBottom: 2 }}>{data.age_requirements}</Typography>
                        </Stack>
                        <Stack sx={{ mb: 2 }}>
                          <Typography color="secondary" sx={{ fontWeight: 'bold', marginBottom: 1 }}>
                            募集人数
                          </Typography>
                          <Typography sx={{ marginBottom: 2 }}>{data.recruitment_count}</Typography>
                        </Stack>
                      </Grid>

                      {/* 右側カラム */}
                      <Grid item xs={12} md={6} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                        <Stack sx={{ mb: 2 }}>
                          <Typography color="secondary" sx={{ fontWeight: 'bold', marginBottom: 1 }}>
                            会社名
                          </Typography>
                          <Typography sx={{ marginBottom: 2 }}>{data.client_name}</Typography>
                        </Stack>
                        <Stack sx={{ mb: 2 }}>
                          <Typography color="secondary" sx={{ fontWeight: 'bold', marginBottom: 1 }}>
                            プロジェクト名
                          </Typography>
                          <Typography sx={{ marginBottom: 2 }}>{data.project_title}</Typography>
                        </Stack>
                        <Stack sx={{ mb: 2 }}>
                          <Typography color="secondary" sx={{ fontWeight: 'bold', marginBottom: 1 }}>
                            業務内容
                          </Typography>
                          <Typography sx={{ marginBottom: 2 }}>{data.description}</Typography>
                        </Stack>
                        <Stack sx={{ mb: 2 }}>
                          <Typography color="secondary" sx={{ fontWeight: 'bold', marginBottom: 1 }}>
                            勤務日数
                          </Typography>
                          <Typography sx={{ marginBottom: 2 }}>{data.working_days_count}</Typography>
                        </Stack>
                        <Stack sx={{ mb: 2 }}>
                          <Typography color="secondary" sx={{ fontWeight: 'bold', marginBottom: 1 }}>
                            勤務曜日
                          </Typography>
                          <Typography sx={{ marginBottom: 2 }}>{data.working_days_list}</Typography>
                        </Stack>
                        <Stack sx={{ mb: 2 }}>
                          <Typography color="secondary" sx={{ fontWeight: 'bold', marginBottom: 1 }}>
                            勤務時間
                          </Typography>
                          <Typography sx={{ marginBottom: 2 }}>{data.description}</Typography>
                        </Stack>
                        <Stack sx={{ mb: 2 }}>
                          <Typography color="secondary" sx={{ fontWeight: 'bold', marginBottom: 1 }}>
                            勤務備考
                          </Typography>
                          <Typography sx={{ marginBottom: 2 }}>{data.work_notes}</Typography>
                        </Stack>
                        <Stack sx={{ mb: 2 }}>
                          <Typography color="secondary" sx={{ fontWeight: 'bold', marginBottom: 1 }}>
                            試用期間
                          </Typography>
                          <Typography sx={{ marginBottom: 2 }}>{data.trial_period_duration}</Typography>
                        </Stack>
                        <Stack sx={{ mb: 2 }}>
                          <Typography color="secondary" sx={{ fontWeight: 'bold', marginBottom: 1 }}>
                            研修日程
                          </Typography>
                          <Typography sx={{ marginBottom: 2 }}>{data.training_schedule}</Typography>
                        </Stack>
                        <Stack sx={{ mb: 2 }}>
                          <Typography color="secondary" sx={{ fontWeight: 'bold', marginBottom: 1 }}>
                            研修備考
                          </Typography>
                          <Typography sx={{ marginBottom: 2 }}>{data.training_memo}</Typography>
                        </Stack>
                      </Grid>
                    </Grid>
                  </ListItem>
                </List>
              </MainCard>
            </Grid>
          </Grid>
        </Transitions>
      </TableCell>
    </TableRow>
  );
};

export default CustomerView;
