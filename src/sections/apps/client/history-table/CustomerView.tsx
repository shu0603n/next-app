// material-ui
import { useTheme } from '@mui/material/styles';
import { useMediaQuery, Grid, List, ListItem, Stack, TableCell, TableRow, Typography } from '@mui/material';

// プロジェクトのインポート
import MainCard from 'components/MainCard';
import Transitions from 'components/@extended/Transitions';
import { ClientHistoryType } from 'types/client/history';
import { format } from 'date-fns';

// ==============================|| 顧客 - 表示 ||============================== //
interface Props {
  data: ClientHistoryType;
}

const CustomerView = ({ data }: Props) => {
  const theme = useTheme();
  const matchDownMD = useMediaQuery(theme.breakpoints.down('md'));
  const formatDate = (value: string) => {
    // value が文字列の場合、Date オブジェクトに変換
    const dateValue = new Date(value);
    // Date オブジェクトに変換できた場合はフォーマットして返す
    if (!isNaN(dateValue.getTime())) {
      return format(dateValue, 'yyyy/MM/dd HH:mm');
    }
    return '';
  };

  return (
    <TableRow sx={{ '&:hover': { bgcolor: `transparent !important` }, overflow: 'hidden' }}>
      <TableCell colSpan={8} sx={{ p: 2.5, overflow: 'hidden' }}>
        <Transitions type="slide" direction="down" in={true}>
          {/* {JSON.stringify(data)} */}
          <Grid container spacing={2.5}>
            <Grid item xs={12}>
              <MainCard title="対応履歴詳細">
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
                            対応日時
                          </Typography>
                          <Typography sx={{ marginBottom: 2 }}>{formatDate(data.time)}</Typography>
                        </Stack>
                        <Stack sx={{ mb: 2 }}>
                          <Typography color="secondary" sx={{ fontWeight: 'bold', marginBottom: 1 }}>
                            担当者
                          </Typography>
                          <Typography sx={{ marginBottom: 2 }}>{data.name}</Typography>
                        </Stack>
                        <Stack sx={{ mb: 2 }}>
                          <Typography color="secondary" sx={{ fontWeight: 'bold', marginBottom: 1 }}>
                            性別
                          </Typography>
                          <Typography sx={{ marginBottom: 2 }}>{data.gender}</Typography>
                        </Stack>
                        <Stack sx={{ mb: 2 }}>
                          <Typography color="secondary" sx={{ fontWeight: 'bold', marginBottom: 1 }}>
                            年齢
                          </Typography>
                          <Typography sx={{ marginBottom: 2 }}>{data.age}</Typography>
                        </Stack>
                      </Grid>

                      {/* 右側カラム */}
                      <Grid item xs={12} md={6} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                        <Stack sx={{ mb: 2 }}>
                          <Typography color="secondary" sx={{ fontWeight: 'bold', marginBottom: 1 }}>
                            対応内容
                          </Typography>
                          <Typography sx={{ marginBottom: 2 }}>{data.remarks}</Typography>
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
