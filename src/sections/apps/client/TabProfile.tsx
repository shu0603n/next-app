// material-ui
import { Theme } from '@mui/material/styles';
import { useRouter } from 'next/router';
import {
  useMediaQuery,
  Button,
  Dialog,
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
import TabPersonal from './TabPersonal';

// assets
import { AimOutlined, MailOutlined, PhoneOutlined } from '@ant-design/icons';
import { Fragment, useEffect, useState } from 'react';
import { PatternFormat } from 'react-number-format';
import { ClientType } from 'types/client/client';

// ==============================|| ACCOUNT PROFILE - BASIC ||============================== //

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

const TabProfile = () => {
  const router = useRouter();
  const id = router.query.id as string;

  const matchDownMD = useMediaQuery((theme: Theme) => theme.breakpoints.down('md'));

  const [data, setData] = useState<ClientType>();

  const [open, setOpen] = useState<boolean>(false);

  const [editData, setEditData] = useState<ClientType | null>(null);

  const getUpdateData = () => {
    fetchTableData(id)
      .then((data) => {
        setData(data.data.rows[0]);
      })
      .catch((error) => {
        // エラーハンドリング
        console.error('Error:', error);
      });
  };

  useEffect(() => {
    // ページがロードされたときにデータを取得
    getUpdateData();
  }, []); // 空の依存リストを指定することで、一度だけ実行される

  const handleEdit = () => {
    setOpen(true);
    setEditData(data || null); // 現在のデータをセット
  };

  const handleSave = () => {
    setOpen(false);
    fetchTableData(id);
  };

  const updateIsComplete = async (result: boolean) => {
    if (result) {
      getUpdateData();
    }
  };

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
      {data && (
        <>
          <Grid item xs={12} sm={5} md={4} xl={3}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <MainCard>
                  <Grid container spacing={3}>
                    <Grid item xs={12}>
                      <Stack spacing={2.5} alignItems="center">
                        <Avatar alt="Avatar 1" size="xl" src={`/assets/images/users/avatar-${data.avatar}.png`} />
                        <Stack spacing={0.5} alignItems="center">
                          <Typography variant="h5">{data.name}</Typography>
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
                              <PatternFormat value={data.phone} displayType="text" type="text" format="###-####-####" />
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
                <MainCard title="Projects">
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
                            <Typography color="secondary">会社名</Typography>
                            <Typography>{data.name}</Typography>
                          </Stack>
                        </Grid>
                        <Grid item xs={12} md={6}>
                          <Stack spacing={0.5}>
                            <Typography color="secondary">フリガナ</Typography>
                            <Typography>{data.name_k}</Typography>
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
                              <PatternFormat value={data.phone} displayType="text" type="text" format="###-####-####" />
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
                  <Typography color="secondary" component="div">
                    {data.remarks?.split(/\r?\n/).map((line, index) => (
                      <Fragment key={index}>
                        {line}
                        <br />
                      </Fragment>
                    ))}
                  </Typography>
                </MainCard>
              </Grid>
              <Grid item xs={12}>
                <Stack direction="row" justifyContent="flex-end" alignItems="center" spacing={2}>
                  <Button variant="contained" onClick={handleEdit}>
                    編集
                  </Button>
                </Stack>
              </Grid>
              {/* 編集用ダイアログ */}
              <Dialog maxWidth="lg" onClose={() => setOpen(false)} open={open} fullWidth>
                <TabPersonal
                  data={editData} // 編集するデータを渡す
                  closeHandle={handleSave} // ダイアログを閉じる
                  updateIsComplete={updateIsComplete}
                />
              </Dialog>
            </Grid>
          </Grid>
        </>
      )}
    </Grid>
  );
};

export default TabProfile;