// material-ui
import { Theme } from '@mui/material/styles';
import { useRouter } from 'next/router';
import { useMediaQuery, Button, Divider, Grid, List, ListItem, Stack, Typography, CircularProgress } from '@mui/material';

// end_date import
import MainCard from 'components/MainCard';

// assets
import { useEffect, useState } from 'react';
import useUser from 'hooks/useUser';
import { mailListType } from 'types/mail/mail';
import { alertSnackBar } from 'function/alert/alertSnackBar';

// ==============================|| ACCOUNT PROFILE - BASIC ||============================== //

const TabProfile = () => {
  const router = useRouter();
  const user = useUser();
  const id = router.query.id as string;
  const [loading, setLoading] = useState(false);

  const matchDownMD = useMediaQuery((theme: Theme) => theme.breakpoints.down('md'));

  const [data, setData] = useState<mailListType>();
  const [mailDestinationData, setMailDestinationData] = useState<Array<mailListType>>();

  async function fetchTableData(id: string) {
    try {
      const response = await fetch(`/api/db/mail/basic/select?id=${id}`);
      if (!response.ok) {
        throw new Error('API request failed');
      }
      const data = await response.json();
      return data; // APIから返されたデータを返します
    } catch (error) {
      console.error('Error fetching data:', error);
      throw error;
    }
  }
  async function sendMail() {
    try {
      const requestOptions = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json' // 必要に応じてヘッダーを調整
        }
      };

      setLoading(true); // ローディング開始
      alertSnackBar('処理中…', 'secondary');
      fetch(`/api/sendMail/sendAllAtOnce?id=${id}`, requestOptions)
        .then((response) => {
          if (!response.ok) {
            throw new Error('更新に失敗しました。');
          }
          return response.json();
        })
        .then((data) => {
          alertSnackBar('正常に送信されました。', 'success');
        })
        .catch((error) => {
          console.error('エラー:', error);
          alertSnackBar('データの更新に失敗しました。', 'error');
        })
        .finally(() => {
          getUpdateData();
          setLoading(false); // ローディング終了
        });
    } catch (error) {
      console.error(error);
    }
  }
  const getUpdateData = () => {
    fetchTableData(id)
      .then((data) => {
        setData(data.mailList);
        setMailDestinationData(data.mailDestination);
      })
      .catch((error) => {
        // エラーハンドリング
        console.error('Error:', error);
      });
  };

  useEffect(() => {
    // ページがロードされたときにデータを取得
    getUpdateData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // 空の依存リストを指定することで、一度だけ実行される

  const handleEdit = () => {
    sendMail();
  };

  function areAllComplete(): boolean {
    return !mailDestinationData?.some((item) => item.complete_flg === false);
  }

  return (
    <Grid container spacing={3}>
      {data && (
        <>
          <Grid item xs={12} sm={7} md={8} xl={9}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <MainCard>
                  <Grid container spacing={3}>
                    <Grid item xs={12}>
                      <Stack spacing={0.5}>
                        <Typography color="secondary">タイトル</Typography>
                        <Typography>{data.title}</Typography>
                      </Stack>
                    </Grid>
                    <Grid item xs={12}>
                      <Divider />
                    </Grid>
                    <Grid item xs={12}>
                      <Stack spacing={0.5}>
                        <Typography color="secondary">本文</Typography>
                        <Typography>{data.main_text}</Typography>
                      </Stack>
                    </Grid>
                  </Grid>
                  <Grid item xs={12}>
                    <Stack direction="row" justifyContent="flex-end" alignItems="center" spacing={2}>
                      {loading ? (
                        <CircularProgress size={24} />
                      ) : (
                        <Button
                          variant="contained"
                          onClick={handleEdit}
                          disabled={areAllComplete() || !(user?.roles.superRole || user?.roles.systemRole || user?.roles.clientEdit)}
                        >
                          送信する
                        </Button>
                      )}
                    </Stack>
                  </Grid>
                </MainCard>
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12} sm={5} md={4} xl={3}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <MainCard title="送信先一覧">
                  <List sx={{ py: 0 }}>
                    <ListItem divider={!matchDownMD}>
                      <Grid container spacing={3}>
                        <Grid item xs={12} md={6}>
                          <Stack spacing={0.5}>
                            {mailDestinationData &&
                              mailDestinationData.map((item, i) => {
                                return (
                                  <Typography key={i}>
                                    {item.complete_flg ? '送信済み' : 'エラー'}:{item?.staff?.name}
                                  </Typography>
                                );
                              })}
                          </Stack>
                        </Grid>
                      </Grid>
                    </ListItem>
                  </List>
                </MainCard>
              </Grid>
            </Grid>
          </Grid>
        </>
      )}
    </Grid>
  );
};

export default TabProfile;
