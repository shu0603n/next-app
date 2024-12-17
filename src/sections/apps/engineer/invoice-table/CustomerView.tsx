// material-ui
import { useTheme } from '@mui/material/styles';
import { useMediaQuery, Grid, Divider, List, ListItem, Stack, TableCell, TableRow, Typography } from '@mui/material';

// プロジェクトのインポート
import MainCard from 'components/MainCard';
import Transitions from 'components/@extended/Transitions';

// アセット
import { InvoiceTableType } from 'types/engineer/invoice-table';

// ==============================|| 顧客 - 表示 ||============================== //
interface Props {
  data: InvoiceTableType;
}
const CustomerView = ({ data }: Props) => {
  const theme = useTheme();
  const matchDownMD = useMediaQuery(theme.breakpoints.down('md'));

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
                        <Grid item xs={12} md={6}>
                          <Stack spacing={0.5}>
                            <Typography color="secondary">請求日</Typography>
                            <Typography>{data.invoice_date}</Typography>
                          </Stack>
                        </Grid>
                        <Grid item xs={12} md={6}>
                          <Stack spacing={0.5}>
                            <Typography color="secondary">契約期間</Typography>
                            <Typography>{`${data.start_date}～${data.end_date}`}</Typography>
                          </Stack>
                        </Grid>
                        <Grid item xs={12} md={6}>
                          <Stack spacing={0.5}>
                            <Typography color="secondary">プロジェクト名</Typography>
                            <Typography>{data.project_name}</Typography>
                          </Stack>
                        </Grid>
                        <Grid item xs={12} md={6}>
                          <Stack spacing={0.5}>
                            <Typography color="secondary">会社名</Typography>
                            <Typography>{data.client_name}</Typography>
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
                          <Typography color="secondary">契約単価</Typography>
                          <Typography variant="h5">{data.contract_price}円</Typography>
                        </Stack>
                        <Divider orientation="vertical" flexItem />
                        <Stack spacing={0.5} alignItems="center">
                          <Typography color="secondary">稼働時間</Typography>
                          <Typography variant="h5">{data.working_hours}h</Typography>
                        </Stack>
                        <Divider orientation="vertical" flexItem />
                        <Stack spacing={0.5} alignItems="center">
                          <Typography color="secondary">請求金額</Typography>
                          <Typography variant="h5">{data.invoice_amount}円</Typography>
                        </Stack>
                        <Divider orientation="vertical" flexItem />
                        <Stack spacing={0.5} alignItems="center">
                          <Typography color="secondary">支払い状況</Typography>
                          <Typography variant="h5">{data.payment_flg ? '済' : '未'}</Typography>
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
