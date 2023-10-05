// material-ui
import { Theme } from '@mui/material/styles';
import {
  useMediaQuery,
  Chip,
  Divider,
  Grid,
  List,
  ListItem,
  ListItemIcon,
  ListItemSecondaryAction,
  Stack,
  Typography
} from '@mui/material';

// third-party
// import { PatternFormat } from 'react-number-format';

// project import
import MainCard from 'components/MainCard';
import Avatar from 'components/@extended/Avatar';

// assets
import { AimOutlined, MailOutlined, PhoneOutlined } from '@ant-design/icons';
import { Fragment, useEffect, useState } from 'react';
import { PatternFormat } from 'react-number-format';

// ==============================|| ACCOUNT PROFILE - BASIC ||============================== //

const calculateAge = (birthDate: string): number => {
  const birthDateObj: Date = new Date(birthDate);
  const currentDate: Date = new Date();
  const ageInMilliseconds: number = currentDate.getTime() - birthDateObj.getTime();
  const ageInYears: number = ageInMilliseconds / (1000 * 60 * 60 * 24 * 365.25);
  const roundedAge: number = Math.floor(ageInYears);
  return roundedAge;
};
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

type dataType = {
  id: number;
  sei: string;
  sei_k: string;
  mei: string;
  mei_k: string;
  gender: string;
  phone_number: string;
  email: string;
  address: string;
  birthday: string;
  joining_date: string;
  retirement_date: string;
  client_id: number;
  employee_skills_id: number;
  employment_id: number;
  job_category_id: number;
  position_id: number;
  postal_code: string;
  project_id: number;
  remarks: string;
};

const defaultData: dataType = {
  id: 0,
  sei: '',
  sei_k: '',
  mei: '',
  mei_k: '',
  gender: '',
  phone_number: '',
  email: '',
  address: '',
  birthday: '',
  joining_date: '',
  retirement_date: '',
  client_id: 0,
  employee_skills_id: 0,
  employment_id: 0,
  job_category_id: 0,
  position_id: 0,
  postal_code: '',
  project_id: 0,
  remarks: ''
};

const TabProfile = () => {
  const matchDownMD = useMediaQuery((theme: Theme) => theme.breakpoints.down('md'));

  const [data, setData] = useState<dataType>(defaultData);

  useEffect(() => {
    // ページがロードされたときにデータを取得
    fetchTableData()
      .then((data) => {
        setData(data.data.rows[0]);
      })
      .catch((error) => {
        // エラーハンドリング
        console.error('Error:', error);
      });
  }, []); // 空の依存リストを指定することで、一度だけ実行される

  const skill = [
    {
      experienct_years: 15,
      technic_name: '言語',
      skill_name: 'JAVA'
    },
    {
      experienct_years: 4,
      technic_name: '言語',
      skill_name: 'Ptyhon'
    },
    {
      experienct_years: 0,
      technic_name: '言語',
      skill_name: 'TypeScript'
    },
    {
      experienct_years: 1.5,
      technic_name: 'DataBase',
      skill_name: 'Oracle'
    },
    {
      experienct_years: 5,
      technic_name: 'DataBase',
      skill_name: 'postgreSQL'
    },
    {
      experienct_years: 1.5,
      technic_name: 'library',
      skill_name: 'React'
    },
    {
      experienct_years: 10,
      technic_name: 'library',
      skill_name: 'Flask'
    }
  ];

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} sm={5} md={4} xl={3}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <MainCard>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <Stack direction="row" justifyContent="flex-end">
                    <Chip label={data.client_id} size="small" color="primary" />
                  </Stack>
                  <Stack spacing={2.5} alignItems="center">
                    <Avatar alt="Avatar 1" size="xl" src="/assets/images/users/default.png" />
                    <Stack spacing={0.5} alignItems="center">
                      <Typography variant="h5">{`${data.sei} ${data.mei}`}</Typography>
                      <Typography color="secondary">{data.position_id}</Typography>
                    </Stack>
                  </Stack>
                </Grid>
                <Grid item xs={12}>
                  <Divider />
                </Grid>
                <Grid item xs={12}>
                  <Stack direction="row" justifyContent="space-around" alignItems="center">
                    <Stack spacing={0.5} alignItems="center">
                      <Typography variant="h5">{calculateAge(data.birthday)}</Typography>
                      <Typography color="secondary">年齢</Typography>
                    </Stack>
                    <Divider orientation="vertical" flexItem />
                    <Stack spacing={0.5} alignItems="center">
                      <Typography variant="h5">{calculateAge(data.joining_date)}</Typography>
                      <Typography color="secondary">勤続年数</Typography>
                    </Stack>
                    <Divider orientation="vertical" flexItem />
                    <Stack spacing={0.5} alignItems="center">
                      <Typography variant="h5">{calculateAge(data.joining_date)}</Typography>
                      <Typography color="secondary">勤続年数</Typography>
                    </Stack>
                  </Stack>
                </Grid>
                <Grid item xs={12}>
                  <Divider />
                </Grid>
                <Grid item xs={12}>
                  <List component="nav" aria-label="main mailbox folders" sx={{ py: 0, '& .MuiListItem-root': { p: 0, py: 1 } }}>
                    <ListItem>
                      <ListItemIcon>
                        <MailOutlined />
                      </ListItemIcon>
                      <ListItemSecondaryAction>
                        <Typography align="right">{data.email}</Typography>
                      </ListItemSecondaryAction>
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <PhoneOutlined />
                      </ListItemIcon>
                      <ListItemSecondaryAction>
                        <Typography align="right">
                          <PatternFormat value={data.phone_number} displayType="text" type="text" format="###-####-####" />
                        </Typography>
                      </ListItemSecondaryAction>
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <AimOutlined />
                      </ListItemIcon>
                      <ListItemSecondaryAction>
                        <Typography align="right">{data.address}</Typography>
                      </ListItemSecondaryAction>
                    </ListItem>
                  </List>
                </Grid>
              </Grid>
            </MainCard>
          </Grid>
          <Grid item xs={12}>
            <MainCard title="Skills">
              <Grid container spacing={1.25}>
                {skill.map((val) => (
                  // eslint-disable-next-line react/jsx-key
                  <Fragment>
                    <Grid item xs={6}>
                      <Typography color="secondary">{val.skill_name}</Typography>
                    </Grid>
                    <Grid item xs={6}>
                      {/* <LinearWithLabelYear value={val.experienct_years} /> */}
                    </Grid>
                  </Fragment>
                ))}
              </Grid>
            </MainCard>
          </Grid>
        </Grid>
      </Grid>
      <Grid item xs={12} sm={7} md={8} xl={9}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <MainCard title="個人情報">
              <List sx={{ py: 0 }}>
                <ListItem divider={!matchDownMD}>
                  <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                      <Stack spacing={0.5}>
                        <Typography color="secondary">氏名</Typography>
                        <Typography>{`${data.sei} ${data.mei}`}</Typography>
                      </Stack>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Stack spacing={0.5}>
                        <Typography color="secondary">フリガナ</Typography>
                        <Typography>{`${data.sei_k} ${data.mei_k}`}</Typography>
                      </Stack>
                    </Grid>
                  </Grid>
                </ListItem>
                <ListItem divider={!matchDownMD}>
                  <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                      <Stack spacing={0.5}>
                        <Typography color="secondary">性別</Typography>
                        <Typography>{data.gender}</Typography>
                      </Stack>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Stack spacing={0.5}>
                        <Typography color="secondary">生年月日</Typography>
                        <Typography>{data.birthday}</Typography>
                      </Stack>
                    </Grid>
                  </Grid>
                </ListItem>
                <ListItem divider={!matchDownMD}>
                  <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                      <Stack spacing={0.5}>
                        <Typography color="secondary">電話番号</Typography>
                        <Typography>
                          <PatternFormat value={data.phone_number} displayType="text" type="text" format="###-####-####" />
                        </Typography>
                      </Stack>
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <Stack spacing={0.5}>
                        <Typography color="secondary">メールアドレス</Typography>
                        <Typography>{data.email}</Typography>
                      </Stack>
                    </Grid>
                  </Grid>
                </ListItem>
                <ListItem divider={!matchDownMD}>
                  <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                      <Stack spacing={0.5}>
                        <Typography color="secondary">郵便番号</Typography>
                        <Typography>
                          <PatternFormat value={data.postal_code} displayType="text" type="text" format="###-####" />
                        </Typography>
                      </Stack>
                    </Grid>
                  </Grid>
                </ListItem>
                <ListItem>
                  <Stack spacing={0.5}>
                    <Typography color="secondary">住所</Typography>
                    <Typography>{data.address}</Typography>
                  </Stack>
                </ListItem>
              </List>
            </MainCard>
          </Grid>
          <Grid item xs={12}>
            <MainCard title="備考">
              <Typography color="secondary">{data.remarks}</Typography>
            </MainCard>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default TabProfile;
