import { useEffect, useState, ChangeEvent } from 'react';
import { useRouter } from 'next/router';
// material-ui
import { useTheme } from '@mui/material/styles';
import { Box, Chip, Button, FormLabel, Grid, InputLabel, Stack, TextField, Typography } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import ja from 'date-fns/locale/ja';
// third-party
import { PatternFormat } from 'react-number-format';
import { dispatch } from 'store';
import { openSnackbar } from 'store/reducers/snackbar';

// project import
import Avatar from 'components/@extended/Avatar';
import MainCard from 'components/MainCard';

// assets
import { CameraOutlined } from '@ant-design/icons';

// types
import { ThemeMode } from 'types/config';
import { ClientType } from 'types/client/client';

// ==============================|| ACCOUNT PROFILE - PERSONAL ||============================== //

async function fetchTableData(id: string) {
  try {
    const response = await fetch(`/api/db/client/basic/select?id=${id}`);
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

interface TabPersonalProps {
  data: ClientType | null;
  closeHandle: () => void;
  updateIsComplete: (result: boolean) => void;
}

const TabPersonal: React.FC<TabPersonalProps> = ({ closeHandle, updateIsComplete }) => {
  const theme = useTheme();
  const router = useRouter();
  const id = router.query.id as string;

  const [selectedImage, setSelectedImage] = useState<File | undefined>(undefined);
  const [avatar, setAvatar] = useState<string | undefined>('/assets/images/users/default.png');

  const [data, setData] = useState<ClientType>();

  useEffect(() => {
    // ページがロードされたときにデータを取得
    fetchTableData(id)
      .then((data) => {
        const row = data.data.rows[0];
        setData(row);
      })
      .catch((error) => {
        console.error('Error:', error);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // 空の依存リストを指定することで、一度だけ実行される

  useEffect(() => {
    if (selectedImage) {
      setAvatar(URL.createObjectURL(selectedImage));
    }
  }, [selectedImage]);

  const handleUpdateButtonClick = (id: number) => {
    dispatch(
      openSnackbar({
        open: true,
        message: '更新処理中…',
        variant: 'alert',
        alert: {
          color: 'secondary'
        },
        close: false
      })
    );
    // 更新ボタンがクリックされたときの処理
    const nameInputElement = document.getElementById('name') as HTMLInputElement | null;
    const nameKInputElement = document.getElementById('name_k') as HTMLInputElement | null;
    const remarksInputElement = document.getElementById('personal-remarks') as HTMLInputElement | null;
    const phoneInputElement = document.getElementById('phone') as HTMLInputElement | null;
    const emailInputElement = document.getElementById('personal-email') as HTMLInputElement | null;
    const postalCodeInputElement = document.getElementById('postal_code') as HTMLInputElement | null;
    const addressInputElement = document.getElementById('personal-address') as HTMLInputElement | null;

    const updatedData = {
      id: id,
      name: nameInputElement ? nameInputElement.value : null, // nullの場合は空文字列をセット
      name_k: nameKInputElement ? nameKInputElement.value : null,
      remarks: remarksInputElement ? remarksInputElement.value : null,
      phone: phoneInputElement ? phoneInputElement.value.replaceAll('-', '') : null,
      email: emailInputElement ? emailInputElement.value : null,
      postal_code: postalCodeInputElement ? postalCodeInputElement.value.replaceAll('-', '') : null,
      address: addressInputElement ? addressInputElement.value : null
    };

    // 2. APIにデータを送信
    fetch(`/api/db/client/personal/update`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(updatedData)
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('API request failed');
        }
        return response.json();
      })
      .then((responseData) => {
        const row = responseData.data.rows[0];
        setData(row);
        dispatch(
          openSnackbar({
            open: true,
            message: '正常に更新されました。',
            variant: 'alert',
            alert: {
              color: 'success'
            },
            close: false
          })
        );
        closeHandle();
        updateIsComplete(true);
      })
      .catch((error) => {
        console.error('Error updating data:', error);
        dispatch(
          openSnackbar({
            open: true,
            message: 'データの更新に失敗しました。',
            variant: 'alert',
            alert: {
              color: 'error'
            },
            close: false
          })
        );
        updateIsComplete(false);
      });
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ja}>
      {data && (
        <Grid container spacing={3} sx={{ padding: 2 }}>
          <Grid item xs={12} sm={6}>
            <MainCard title="基本情報">
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <Stack direction="row" justifyContent="flex-start">
                    <Chip id="id" label={`企業ID:${data.id}`} size="small" color="secondary" />
                  </Stack>
                </Grid>
                <Grid item xs={12}>
                  <Stack spacing={2.5} alignItems="center" sx={{ m: 3 }}>
                    <FormLabel
                      htmlFor="change-avtar"
                      sx={{
                        position: 'relative',
                        borderRadius: '50%',
                        overflow: 'hidden',
                        '&:hover .MuiBox-root': { opacity: 1 },
                        cursor: 'pointer'
                      }}
                    >
                      <Avatar alt="Avatar 1" src={avatar} sx={{ width: 76, height: 76 }} />
                      <Box
                        sx={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          backgroundColor: theme.palette.mode === ThemeMode.DARK ? 'rgba(255, 255, 255, .75)' : 'rgba(0,0,0,.65)',
                          width: '100%',
                          height: '100%',
                          opacity: 0,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                      >
                        <Stack spacing={0.5} alignItems="center">
                          <CameraOutlined style={{ color: theme.palette.secondary.lighter, fontSize: '1.5rem' }} />
                          <Typography sx={{ color: 'secondary.lighter' }} variant="caption">
                            Upload
                          </Typography>
                        </Stack>
                      </Box>
                    </FormLabel>
                    <TextField
                      type="file"
                      id="change-avtar"
                      placeholder="Outlined"
                      variant="outlined"
                      sx={{ display: 'none' }}
                      onChange={(e: ChangeEvent<HTMLInputElement>) => setSelectedImage(e.target.files?.[0])}
                    />
                  </Stack>
                </Grid>
                <Grid item xs={12} sm={12}>
                  <Stack spacing={1.25}>
                    <InputLabel htmlFor="personal-name">会社名</InputLabel>
                    <TextField fullWidth defaultValue={data.name} id="name" placeholder="name" autoFocus />
                  </Stack>
                </Grid>
                <Grid item xs={12} sm={12}>
                  <Stack spacing={1.25}>
                    <InputLabel htmlFor="personal-name_k">会社名（カナ）</InputLabel>
                    <TextField fullWidth defaultValue={data.name_k} id="name_k" placeholder="name_k" />
                  </Stack>
                </Grid>
              </Grid>
            </MainCard>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <MainCard title="連絡先情報">
                  <Grid container spacing={3}>
                    <Grid item xs={12} sm={6}>
                      <Stack spacing={1.25}>
                        <InputLabel htmlFor="personal-phone">携帯電話</InputLabel>
                        <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={2}>
                          <PatternFormat
                            id="phone"
                            format="###-####-####"
                            mask="_"
                            fullWidth
                            customInput={TextField}
                            placeholder="phone"
                            defaultValue={data.phone}
                            onBlur={() => {}}
                            onChange={() => {}}
                          />
                        </Stack>
                      </Stack>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Stack spacing={1.25}>
                        <InputLabel htmlFor="personal-email">メールアドレス</InputLabel>
                        <TextField type="email" fullWidth defaultValue={data.email} id="personal-email" placeholder="email" />
                      </Stack>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Stack spacing={1.25}>
                        <InputLabel htmlFor="personal-postal_code">郵便番号</InputLabel>
                        <PatternFormat
                          id="postal_code"
                          format="###-####"
                          mask="_"
                          fullWidth
                          customInput={TextField}
                          placeholder="postal_code"
                          defaultValue={data.postal_code}
                          onBlur={() => {}}
                          onChange={() => {}}
                        />
                      </Stack>
                    </Grid>
                    <Grid item xs={12}>
                      <Stack spacing={1.25}>
                        <InputLabel htmlFor="personal-address">住所</InputLabel>
                        <TextField fullWidth defaultValue={data.address} id="personal-address" placeholder="address" />
                      </Stack>
                    </Grid>
                    <Grid item xs={12}>
                      <Stack spacing={1.25}>
                        <InputLabel htmlFor="personal-remarks">備考</InputLabel>
                        <TextField fullWidth multiline rows={3} defaultValue={data.remarks} id="personal-remarks" placeholder="remarks" />
                      </Stack>
                    </Grid>
                  </Grid>
                </MainCard>
              </Grid>
            </Grid>
          </Grid>

          <Grid item xs={12}>
            <Stack direction="row" justifyContent="flex-end" alignItems="center" spacing={2}>
              <Button variant="outlined" color="secondary" onClick={closeHandle}>
                キャンセル
              </Button>
              <Button variant="contained" onClick={() => handleUpdateButtonClick(data.id)}>
                更新
              </Button>
            </Stack>
          </Grid>
        </Grid>
      )}
    </LocalizationProvider>
  );
};

export default TabPersonal;
