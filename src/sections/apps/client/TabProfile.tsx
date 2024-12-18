// material-ui
import { Theme, useTheme } from '@mui/material/styles';
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
  Typography,
  Tooltip
} from '@mui/material';

// third-party
// import { PatternFormat } from 'react-number-format';

// project import
import MainCard from 'components/MainCard';
import Avatar from 'components/@extended/Avatar';
import TabPersonal from './TabPersonal';
import IconButton from 'components/@extended/IconButton';
import AlertCustomerDelete from 'sections/apps/client/AlertCustomerDelete';

// assets
import { AimOutlined, DeleteTwoTone, MailOutlined, PhoneOutlined } from '@ant-design/icons';
import { Fragment, useEffect, useState } from 'react';
import { PatternFormat } from 'react-number-format';
import { ClientType } from 'types/client/client';
import useUser from 'hooks/useUser';

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
  const user = useUser();
  const id = router.query.id as string;

  const matchDownMD = useMediaQuery((theme: Theme) => theme.breakpoints.down('md'));

  const theme = useTheme();

  const [data, setData] = useState<ClientType>();

  const [open, setOpen] = useState<boolean>(false);
  const [deleteOpen, setDeleteOpen] = useState<boolean>(false);

  const [editData, setEditData] = useState<ClientType | null>(null);

  const [customerDeleteId, setCustomerDeleteId] = useState<any>('');
  const [customerDeleteName, setCustomerDeleteName] = useState<any>('');

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

  const handleClose = () => {
    setDeleteOpen(!deleteOpen);
  };

  const assign = [
    {
      employee: '村井俊介',
      end_date: '2024/01/31',
      flg: true
    },
    {
      employee: '高橋直樹',
      end_date: '2024/03/31',
      flg: false
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
                        <Avatar
                          alt="Avatar 1"
                          size="xl"
                          // src={`/assets/images/users/avatar-${data.avatar}.png`}
                        />
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
                <MainCard title="アサイン状況(仮)">
                  <Grid container spacing={1.25}>
                    <Fragment>
                      <Grid item xs={6}>
                        <Typography color="secondary">社員名</Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography color="secondary">次回更新月</Typography>
                      </Grid>
                    </Fragment>
                    {assign.map((val) => (
                      // eslint-disable-next-line react/jsx-key
                      <Fragment>
                        <Grid item xs={6}>
                          <Typography>{val.employee}</Typography>
                        </Grid>
                        <Grid item xs={6}>
                          {val.flg ? (
                            <Typography color="error">{val.end_date}</Typography>
                          ) : (
                            <Typography color="primary">{val.end_date}</Typography>
                          )}
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
                  <Button
                    variant="contained"
                    onClick={handleEdit}
                    disabled={!(user?.roles.superRole || user?.roles.systemRole || user?.roles.clientEdit)}
                  >
                    編集
                  </Button>
                  <Tooltip title="Delete">
                    <IconButton
                      color="error"
                      onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                        e.stopPropagation();
                        handleClose();
                        setCustomerDeleteId(data.id);
                        setCustomerDeleteName(data.name);
                      }}
                    >
                      <DeleteTwoTone twoToneColor={theme.palette.error.main} />
                    </IconButton>
                  </Tooltip>
                </Stack>
              </Grid>

              <AlertCustomerDelete
                deleteId={customerDeleteId}
                deleteName={customerDeleteName}
                open={deleteOpen}
                handleClose={handleClose}
              />

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
