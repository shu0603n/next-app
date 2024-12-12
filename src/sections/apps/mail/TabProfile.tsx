// material-ui
import { Theme } from '@mui/material/styles';
import { useRouter } from 'next/router';
import { useMediaQuery, Button, Divider, Grid, List, ListItem, Stack, Typography, CircularProgress, Chip } from '@mui/material';

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
          alertSnackBar('処理を開始しました。', 'success');
        })
        .catch((error) => {
          console.error('エラー:', error);
          alertSnackBar('データの更新に失敗しました。', 'error');
        })
        .finally(() => {
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

  function areAllComplete() {
    return mailDestinationData?.every((item) => item.complete_flg === 1) ?? false;
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
                        <Typography
                          dangerouslySetInnerHTML={{ __html: data.main_text }}
                          style={{ fontSize: '14px', lineHeight: '0.5' }} // 長い単語も折り返し
                        />
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
                          {areAllComplete() ? '送信済み' : '送信する'}
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
                  {mailDestinationData && (
                    <Grid container spacing={3}>
                      <Grid item xs={12}>
                        <Button variant="outlined" onClick={getUpdateData}>
                          ステータスを更新する
                        </Button>
                      </Grid>
                    </Grid>
                  )}
                  <List sx={{ py: 0 }}>
                    <ListItem divider={!matchDownMD}>
                      <Grid container spacing={3}>
                        <Grid item xs={12}>
                          {mailDestinationData &&
                            mailDestinationData.map((item, i) => (
                              <Grid container spacing={1} key={i}>
                                {/* 送信状態を表示 */}
                                <Grid item xs={6}>
                                  {item.complete_flg === 1 ? (
                                    <Chip color="success" label="送信完了" onClick={() => alert(item?.log)} size="small" variant="light" />
                                  ) : item.complete_flg === -1 ? (
                                    <Chip color="error" label="送信エラー" onClick={() => alert(item?.log)} size="small" variant="light" />
                                  ) : (
                                    <Chip color="primary" label="未送信" onClick={() => alert(item?.log)} size="small" variant="light" />
                                  )}
                                </Grid>

                                {/* スタッフ名を表示 */}
                                <Grid item xs={6}>
                                  <Typography sx={{ lineHeight: 1.2 }}>{item?.staff?.name}</Typography>
                                </Grid>
                              </Grid>
                            ))}
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
