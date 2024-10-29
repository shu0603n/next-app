import { useEffect, useState, ChangeEvent } from 'react';
import { useRouter } from 'next/router';
// material-ui
import { useTheme } from '@mui/material/styles';
import {
  Box,
  Chip,
  Button,
  FormLabel,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Stack,
  TextField,
  Typography
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
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
import { EmployeeType } from 'types/employee/employee';

// styles & constant
const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP
    }
  }
};

// ==============================|| ACCOUNT PROFILE - PERSONAL ||============================== //

async function fetchTableData(id: string) {
  try {
    const response = await fetch(`/api/db/employee/basic/select?id=${id}`);
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
async function fetchPositionData() {
  try {
    const response = await fetch('/api/db/parameter/position/select');
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
async function fetchEmploymentData() {
  try {
    const response = await fetch('/api/db/parameter/employment/select');
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

async function fetchJobCategory() {
  try {
    const response = await fetch('/api/db/parameter/job_category/select');
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
  data: EmployeeType | null;
  closeHandle: () => void;
  updateIsComplete: (result: boolean) => void;
}

const TabPersonal: React.FC<TabPersonalProps> = ({ closeHandle, updateIsComplete }) => {
  const theme = useTheme();
  const router = useRouter();
  const id = router.query.id as string;
  type Parameter = {
    id: number;
    name: string;
  };
  const [selectedImage, setSelectedImage] = useState<File | undefined>(undefined);
  const [avatar, setAvatar] = useState<string | undefined>('/assets/images/users/default.png');

  const [data, setData] = useState<EmployeeType>();
  const [positionData, setPositionData] = useState<Array<Parameter>>();
  const [employmentData, setEmploymentData] = useState<Array<Parameter>>();
  const [jobCategoryData, setJobCategoryData] = useState<Array<Parameter>>();

  const [birthday, setBirthday] = useState<Date | null>();
  const [joiningDate, setJoiningDate] = useState<Date | null>();
  const [retirementDate, setRetirementDate] = useState<Date | null>();
  const [gender, setGender] = useState<string>();
  const [position, setPosition] = useState<string>();
  const [employment, setEmployment] = useState<string>();
  const [jobCategory, setJobCategory] = useState<string>();

  useEffect(() => {
    // ページがロードされたときにデータを取得
    fetchTableData(id)
      .then((data) => {
        const row = data.data.rows[0];
        setData(row);
        setBirthday(row.birthday ? new Date(row.birthday) : null);
        setJoiningDate(row.joining_date ? new Date(row.joining_date) : null);
        setRetirementDate(row.retirement_date ? new Date(row.retirement_date) : null);
        setGender(row.gender);
        setEmployment(row.employment_id);
        setPosition(row.position_id);
        setJobCategory(row.job_category_id);
      })
      .catch((error) => {
        console.error('Error:', error);
      });

    fetchPositionData()
      .then((data) => {
        setPositionData(data.data);
      })
      .catch((error) => {
        console.error('Error:', error);
      });

    fetchEmploymentData()
      .then((data) => {
        setEmploymentData(data.data);
      })
      .catch((error) => {
        console.error('Error:', error);
      });

    fetchJobCategory()
      .then((data) => {
        setJobCategoryData(data.data);
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

  const handleChangeGender = (event: SelectChangeEvent<string>) => {
    setGender(event.target.value);
  };
  const handleChangePosition = (event: SelectChangeEvent<string>) => {
    setPosition(event.target.value);
  };
  const handleChangeEmployment = (event: SelectChangeEvent<string>) => {
    setEmployment(event.target.value);
  };
  const handleChangeJobCategory = (event: SelectChangeEvent<string>) => {
    setJobCategory(event.target.value);
  };
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
    const seiInputElement = document.getElementById('sei') as HTMLInputElement | null;
    const firstNameInputElement = document.getElementById('mei') as HTMLInputElement | null;
    const seiKInputElement = document.getElementById('sei_k') as HTMLInputElement | null;
    const firstNameKInputElement = document.getElementById('mei_k') as HTMLInputElement | null;
    const remarksInputElement = document.getElementById('personal-remarks') as HTMLInputElement | null;
    const phoneNumberInputElement = document.getElementById('phone_number') as HTMLInputElement | null;
    const emailInputElement = document.getElementById('personal-email') as HTMLInputElement | null;
    const postalCodeInputElement = document.getElementById('postal_code') as HTMLInputElement | null;
    const addressInputElement = document.getElementById('personal-address') as HTMLInputElement | null;

    const updatedData = {
      id: id,
      sei: seiInputElement ? seiInputElement.value : null, // nullの場合は空文字列をセット
      mei: firstNameInputElement ? firstNameInputElement.value : null,
      sei_k: seiKInputElement ? seiKInputElement.value : null,
      mei_k: firstNameKInputElement ? firstNameKInputElement.value : null,
      gender: gender || null, // genderがundefinedの場合に備えて空文字列をセット
      birthday: birthday || null, // birthdayがnullの場合も考慮
      remarks: remarksInputElement ? remarksInputElement.value : null,
      phone_number: phoneNumberInputElement ? phoneNumberInputElement.value.replaceAll('-', '') : null,
      email: emailInputElement ? emailInputElement.value : null,
      postal_code: postalCodeInputElement ? postalCodeInputElement.value.replaceAll('-', '') : null,
      address: addressInputElement ? addressInputElement.value : null,
      joining_date: joiningDate || null, // joiningDateがnullの場合も考慮
      retirement_date: retirementDate || null, // retirementDateがnullの場合も考慮
      employment_id: employment || null, // employmentがundefinedの場合に備えて空文字列をセット
      position_id: position || null, // positionがundefinedの場合に備えて空文字列をセット
      job_category_id: jobCategory || null
    };

    // 2. APIにデータを送信
    fetch(`/api/db/employee/personal/update`, {
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
                    <Chip id="id" label={`社員ID:${data.id}`} size="small" color="secondary" />
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
                <Grid item xs={12} sm={6}>
                  <Stack spacing={1.25}>
                    <InputLabel htmlFor="personal-sei">性</InputLabel>
                    <TextField fullWidth defaultValue={data.sei} id="sei" placeholder="sei" autoFocus />
                  </Stack>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Stack spacing={1.25}>
                    <InputLabel htmlFor="personal-mei">名</InputLabel>
                    <TextField fullWidth defaultValue={data.mei} id="mei" placeholder="mei" />
                  </Stack>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Stack spacing={1.25}>
                    <InputLabel htmlFor="personal-sei_k">性（カナ）</InputLabel>
                    <TextField fullWidth defaultValue={data.sei_k} id="sei_k" placeholder="sei_k" />
                  </Stack>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Stack spacing={1.25}>
                    <InputLabel htmlFor="personal-mei_k">名（カナ）</InputLabel>
                    <TextField fullWidth defaultValue={data.mei_k} id="mei_k" placeholder="mei_k" />
                  </Stack>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Stack spacing={1.25}>
                    <InputLabel htmlFor="personal-gender">性別</InputLabel>
                    <Select fullWidth id="personal-experience" value={gender} onChange={handleChangeGender} MenuProps={MenuProps}>
                      <MenuItem value="男">男</MenuItem>
                      <MenuItem value="女">女</MenuItem>
                    </Select>
                  </Stack>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Stack spacing={1.25}>
                    <InputLabel htmlFor="personal-birthday">生年月日</InputLabel>
                    <DatePicker value={birthday} onChange={(newValue) => setBirthday(newValue)} format="yyyy/MM/dd" />
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
          <Grid item xs={12} sm={6}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <MainCard title="連絡先情報">
                  <Grid container spacing={3}>
                    <Grid item xs={12} sm={6}>
                      <Stack spacing={1.25}>
                        <InputLabel htmlFor="personal-phone_number">携帯電話</InputLabel>
                        <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={2}>
                          <PatternFormat
                            id="phone_number"
                            format="###-####-####"
                            mask="_"
                            fullWidth
                            customInput={TextField}
                            placeholder="phone_number"
                            defaultValue={data.phone_number}
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
                  </Grid>
                </MainCard>
              </Grid>
              <Grid item xs={12}>
                <MainCard title="入社情報">
                  <Grid container spacing={3}>
                    <Grid item xs={12} sm={6}>
                      <Stack spacing={1.25}>
                        <InputLabel htmlFor="personal-location">入社日</InputLabel>
                        <DatePicker value={joiningDate} onChange={(newValue) => setJoiningDate(newValue)} format="yyyy/MM/dd" />
                      </Stack>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Stack spacing={1.25}>
                        <InputLabel htmlFor="personal-location">退職日</InputLabel>
                        <DatePicker value={retirementDate} onChange={(newValue) => setRetirementDate(newValue)} format="yyyy/MM/dd" />
                      </Stack>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Stack spacing={1.25}>
                        <InputLabel htmlFor="personal-employment_name">雇用形態</InputLabel>
                        <Select
                          fullWidth
                          id="personal-employment_name"
                          value={employment}
                          onChange={handleChangeEmployment}
                          MenuProps={MenuProps}
                        >
                          {employmentData?.map((item) => {
                            // eslint-disable-next-line react/jsx-key
                            return <MenuItem value={`${item.id}`}>{item.name}</MenuItem>;
                          })}
                        </Select>
                      </Stack>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Stack spacing={1.25}>
                        <InputLabel htmlFor="personal-employment_name">役職</InputLabel>
                        <Select
                          fullWidth
                          id="personal-employment_name"
                          value={position}
                          onChange={handleChangePosition}
                          MenuProps={MenuProps}
                        >
                          <MenuItem value="0">なし</MenuItem>
                          {positionData?.map((item) => {
                            // eslint-disable-next-line react/jsx-key
                            return <MenuItem value={`${item.id}`}>{item.name}</MenuItem>;
                          })}
                        </Select>
                      </Stack>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Stack spacing={1.25}>
                        <InputLabel htmlFor="personal-job_category">職種</InputLabel>
                        <Select
                          fullWidth
                          id="personal-job_category"
                          value={jobCategory}
                          onChange={handleChangeJobCategory}
                          MenuProps={MenuProps}
                        >
                          <MenuItem value="0">なし</MenuItem>
                          {jobCategoryData?.map((item) => {
                            // eslint-disable-next-line react/jsx-key
                            return <MenuItem value={`${item.id}`}>{item.name}</MenuItem>;
                          })}
                        </Select>
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
