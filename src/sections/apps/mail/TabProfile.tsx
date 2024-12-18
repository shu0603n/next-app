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
    let attemptCount = 0; // 試行回数
    const maxAttempts = 10; // 最大試行回数
    let isError = false;

    const sendRequest = async (requestOptions: any): Promise<boolean> => {
      attemptCount++;
      console.log(`試行回数: ${attemptCount}`);
      try {
        const response = await fetch(`/api/sendMail/sendAllAtOnce?id=${id}`, requestOptions);

        if (response.ok) {
          const data = await response.json();
          console.log('成功:', data);
          alertSnackBar('送信処理が完了しました。', 'success');
          setLoading(false); // 成功したらローディング終了
          getUpdateData();
          return true; // 成功
        } else {
          console.log('ステータス:', response.status);

          if (response.status === 429) {
            throw new Error('前回の処理が開始されてから3分以内です。少し時間をおいて再試行してください。');
          } else if (response.status === 408) {
            throw { retry: true, message: '送信処理がタイムアウトしました。処理を続行します・・・' };
          } else if (response.status === 422) {
            throw { retry: true, message: '送信処理中にエラーが発生しました。処理を続行します・・・' };
          } else {
            throw new Error('予期せぬエラーが発生しました。');
          }
        }
      } catch (error: any) {
        if (error.retry) {
          console.warn(`再試行: ${error.message}`);
          alertSnackBar(`${error.message} (${attemptCount}/${maxAttempts})`, 'secondary');
        } else {
          isError = true;
          console.error('エラー:', error);
          alertSnackBar(error.message || 'エラーが発生しました。', 'error');
        }
        return false; // 処理失敗
      }
    };

    const requestOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json' // 必要に応じてヘッダーを調整
      }
    };

    // メイン処理
    try {
      setLoading(true); // ローディング開始
      alertSnackBar('処理中…', 'secondary');

      while (attemptCount < maxAttempts && !isError) {
        getUpdateData();
        const success = await sendRequest(requestOptions);
        if (success) {
          break; // 成功したらループ終了
        }
      }

      if (attemptCount >= maxAttempts) {
        alertSnackBar('最大試行回数に到達しました。リクエストを停止します。', 'error');
      }
    } catch (error) {
      console.error('致命的なエラー:', error);
      alertSnackBar('処理中に予期せぬエラーが発生しました。', 'error');
    } finally {
      setLoading(false); // 最終的にローディング終了
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

  const handleEdit = async () => {
    getUpdateData();
    sendMail();
  };

  const areAllComplete = () => {
    return mailDestinationData?.every((item) => item.complete_flg === 0 || item.complete_flg === 1) ?? false;
  };
  const getErrorReason = (item: any) => {
    try {
      // JSONを解析
      const data = JSON.parse(item.log);

      // 必要なプロパティが存在するか確認
      if (!data.responseCode) {
        return 'エラーコードがありません';
      }

      // responseCodeに基づいてエラー理由を返す
      switch (data.responseCode) {
        case 454:
          return item.staff.mail + '試行回数が多すぎます';
        case 535:
          return item.staff.mail + 'アカウント情報に誤りがあります';
        case 543:
          return item.staff.mail + 'ログインパスワードが設定されています。アプリパスワードを登録してください。';
        case 550:
          return item.staff.mail + '1日に送信できるメールの上限を超えました';
        default:
          return item.staff.mail + `不明なエラーコード: ${data.responseCode}`;
      }
    } catch (e) {
      // JSON解析エラーの場合
      return item;
    }
  };

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
                      <Grid container spacing={1}>
                        {mailDestinationData &&
                          mailDestinationData.map((item, i) => (
                            <Grid container spacing={12} key={i}>
                              {/* 送信状態を表示 */}
                              <Grid item xs={6}>
                                {item.complete_flg === 1 ? (
                                  <Chip
                                    color="success"
                                    label="送信完了"
                                    onClick={() => alert(getErrorReason(item))}
                                    size="small"
                                    variant="light"
                                  />
                                ) : item.complete_flg === 0 ? (
                                  <Chip
                                    color="secondary"
                                    label="アドレス無し"
                                    onClick={() => alert(getErrorReason(item))}
                                    size="small"
                                    variant="light"
                                  />
                                ) : item.complete_flg === -1 ? (
                                  <Chip
                                    color="error"
                                    label="送信エラー"
                                    onClick={() => alert(getErrorReason(item))}
                                    size="small"
                                    variant="light"
                                  />
                                ) : (
                                  <Chip
                                    color="primary"
                                    label="未送信"
                                    onClick={() => alert(getErrorReason(item))}
                                    size="small"
                                    variant="light"
                                  />
                                )}
                              </Grid>

                              {/* スタッフ名を表示 */}
                              <Grid item xs={6}>
                                <Typography sx={{ lineHeight: 1.2 }}>{item?.staff?.name}</Typography>
                              </Grid>
                            </Grid>
                          ))}
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
