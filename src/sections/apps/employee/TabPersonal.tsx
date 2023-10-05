import { useEffect, useState, ChangeEvent } from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';
import { Box, Button, FormLabel, Grid, InputLabel, MenuItem, Select, SelectChangeEvent, Stack, TextField, Typography } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import ja from 'date-fns/locale/ja';
// third-party
import { PatternFormat } from 'react-number-format';

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

async function fetchTableData() {
  try {
    const response = await fetch(`/api/db/employee/basic/select?id=${2}`);
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

const TabPersonal = () => {
  const theme = useTheme();
  type Parameter = {
    id: number;
    name: string;
  };
  const [selectedImage, setSelectedImage] = useState<File | undefined>(undefined);
  const [avatar, setAvatar] = useState<string | undefined>('/assets/images/users/default.png');

  const [data, setData] = useState<EmployeeType>();
  const [positionData, setPositionData] = useState<Array<Parameter>>();
  const [employmentData, setEmploymentData] = useState<Array<Parameter>>();

  const [birthday, setBirthday] = useState<Date | null>();
  const [joiningDate, setJoiningDate] = useState<Date | null>();
  const [returementDate, setReturementDate] = useState<Date | null>();
  const [gender, setGender] = useState<string>();
  const [position, setPosition] = useState<string>();
  const [employment, setEmployment] = useState<string>();

  useEffect(() => {
    // ページがロードされたときにデータを取得
    fetchTableData()
      .then((data) => {
        const row = data.data.rows[0];
        setData(row);
        setBirthday(new Date(row.birthday));
        setJoiningDate(new Date(row.joining_date));
        setReturementDate(new Date(row.retirement_date));
        setGender(row.gender);
        setEmployment(row.employment_id);
        setPosition(row.position_id);
      })
      .catch((error) => {
        console.error('Error:', error);
      });

    fetchPositionData()
      .then((data) => {
        setPositionData(data.data.rows);
      })
      .catch((error) => {
        console.error('Error:', error);
      });

    fetchEmploymentData()
      .then((data) => {
        setEmploymentData(data.data.rows);
      })
      .catch((error) => {
        console.error('Error:', error);
      });
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

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ja}>
      {data && (
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <MainCard title="基本情報">
              <Grid container spacing={3}>
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
                    <InputLabel htmlFor="personal-last_name">性</InputLabel>
                    <TextField fullWidth defaultValue={data.sei} id="sei" placeholder="last_name" autoFocus />
                  </Stack>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Stack spacing={1.25}>
                    <InputLabel htmlFor="personal-first_name">名</InputLabel>
                    <TextField fullWidth defaultValue={data.mei} id="first_name" placeholder="first_name" />
                  </Stack>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Stack spacing={1.25}>
                    <InputLabel htmlFor="personal-last_name_k">性（カナ）</InputLabel>
                    <TextField fullWidth defaultValue={data.sei_k} id="last_name_k" placeholder="last_name_k" />
                  </Stack>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Stack spacing={1.25}>
                    <InputLabel htmlFor="personal-first_name_k">名（カナ）</InputLabel>
                    <TextField fullWidth defaultValue={data.mei_k} id="first_name_k" placeholder="first_name_k" />
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
                        <DatePicker value={returementDate} onChange={(newValue) => setReturementDate(newValue)} format="yyyy/MM/dd" />
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
                          {/* <MenuItem value="0">正社員</MenuItem>
                          <MenuItem value="1">契約社員</MenuItem>
                          <MenuItem value="2">派遣社員</MenuItem>
                          <MenuItem value="3">アルバイト</MenuItem> */}
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
                  </Grid>
                </MainCard>
              </Grid>
            </Grid>
          </Grid>

          <Grid item xs={12}>
            <Stack direction="row" justifyContent="flex-end" alignItems="center" spacing={2}>
              <Button variant="outlined" color="secondary">
                キャンセル
              </Button>
              <Button variant="contained">更新</Button>
            </Stack>
          </Grid>
        </Grid>
      )}
    </LocalizationProvider>
  );
};

export default TabPersonal;
