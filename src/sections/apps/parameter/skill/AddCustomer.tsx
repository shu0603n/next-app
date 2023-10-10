import { useEffect, useState } from 'react';
import { useTheme } from '@mui/material/styles';
// material-ui
import {
  Button,
  DialogActions,
  DialogContent,
  DialogTitle,
  Autocomplete,
  Divider,
  FormHelperText,
  Grid,
  InputLabel,
  Stack,
  TextField,
  Tooltip,
  Switch
} from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

// サードパーティ
import _ from 'lodash';
import * as Yup from 'yup';
import { useFormik, Form, FormikProvider, FormikValues } from 'formik';

// プロジェクトインポート
import AlertCustomerDelete from './AlertCustomerDelete';
import IconButton from 'components/@extended/IconButton';

import { dispatch } from 'store';
import { openSnackbar } from 'store/reducers/snackbar';

// アセット
import { DeleteFilled } from '@ant-design/icons';
import { dbResponse } from 'types/dbResponse';

// 定数
const getInitialValues = (customer: FormikValues | null) => {
  const newCustomer = {
    id: '',
    name: '',
    technic_id: '',
    technic_name: '',
    candidate_flag: false
  };

  if (customer) {
    newCustomer.id = customer.id;
    newCustomer.name = customer.name;
    newCustomer.technic_id = customer.technic_id;
    newCustomer.technic_name = customer.technic_name;
    newCustomer.candidate_flag = customer.candidate_flag;
    return _.merge({}, newCustomer, customer);
  }

  return newCustomer;
};

async function fetchTableData() {
  try {
    const response = await fetch('/api/db/parameter/technic/select');
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

const defaultRes: dbResponse = {
  data: {
    command: '',
    fields: [],
    rowAsArray: false,
    rowCount: 0,
    rows: [],
    viaNeonFetch: false
  }
};

// ==============================|| 顧客の追加/編集 ||============================== //

export interface Props {
  customer?: any;
  onCancel: () => void;
  onReload: (data: dbResponse) => void;
}

const AddCustomer = ({ customer, onCancel, onReload }: Props) => {
  const theme = useTheme();
  const isCreating = !customer;

  const [tableData, setTableData] = useState<dbResponse>(defaultRes); // データを保持する状態変数
  const [checked, setChecked] = useState(['candidate_flag']);
  const handleToggle = (value: string) => () => {
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setChecked(newChecked);
  };
  useEffect(() => {
    // ページがロードされたときにデータを取得
    fetchTableData()
      .then((data) => {
        setTableData(data); // データを状態に設定
      })
      .catch((error) => {
        // エラーハンドリング
        console.error('Error:', error);
      });
  }, []); // 空の依存リストを指定することで、一度だけ実行される

  const CustomerSchema = Yup.object().shape({
    name: Yup.string().max(255).required('パラメーターは必須です')
  });

  const [openAlert, setOpenAlert] = useState(false);

  const handleAlertClose = () => {
    resetValues();
    setOpenAlert(!openAlert);
    onCancel();
  };

  const formik = useFormik({
    initialValues: getInitialValues(customer!),
    validationSchema: CustomerSchema,
    onSubmit: (values, { setSubmitting }) => {
      try {
        if (customer) {
          fetch(`/api/db/parameter/skill/update?id=${values.id}&name=${values.name}&technic_id=${values.technic_id}`)
            .then((response) => {
              if (!response.ok) {
                throw new Error('更新に失敗しました。');
              }
              return response.json();
            })
            .then((data) => {
              console.log(data);
              onReload(data);
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
            })
            .catch((error) => {
              console.error('エラー:', error);
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
            });
        } else {
          fetch(`/api/db/parameter/skill/insert?name=${values.name}&technic_id=${values.technic_id}`)
            .then((response) => {
              if (!response.ok) {
                throw new Error('更新に失敗しました。');
              }
              return response.json();
            })
            .then((data) => {
              onReload(data);
              dispatch(
                openSnackbar({
                  open: true,
                  message: '正常に追加されました。',
                  variant: 'alert',
                  alert: {
                    color: 'success'
                  },
                  close: false
                })
              );
            })
            .catch((error) => {
              console.error('エラー:', error);
              dispatch(
                openSnackbar({
                  open: true,
                  message: 'データの追加に失敗しました。',
                  variant: 'alert',
                  alert: {
                    color: 'error'
                  },
                  close: false
                })
              );
            });
        }
        resetValues();
        setSubmitting(false);
        onCancel();
      } catch (error) {
        console.error(error);
      }
    }
  });

  const { errors, touched, handleSubmit, isSubmitting, getFieldProps, setFieldValue } = formik;

  const resetValues = () => {
    setFieldValue('id', '');
    setFieldValue('name', '');
    setFieldValue('technic_id', '');
    setFieldValue('technic_name', '');
  };

  return (
    <>
      <FormikProvider value={formik}>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
            <DialogTitle>{customer ? 'パラメーターの編集' : '新しいパラメーター'}</DialogTitle>
            <Divider />
            <DialogContent sx={{ p: 2.5 }}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={8}>
                  <Grid container spacing={3}>
                    {customer !== null && (
                      <Grid item xs={12}>
                        <Stack spacing={1.25}>
                          <InputLabel htmlFor="id">ID</InputLabel>
                          <TextField
                            fullWidth
                            id="id"
                            {...getFieldProps('id')}
                            placeholder={customer ? customer.id : ''}
                            // disabled
                          />
                        </Stack>
                      </Grid>
                    )}

                    <Grid item xs={12}>
                      <Stack spacing={1.25}>
                        <InputLabel htmlFor="name">パラメーター</InputLabel>
                        <TextField
                          fullWidth
                          id="name"
                          placeholder={customer !== null ? customer.name : 'パラメーターを入力してください'}
                          {...getFieldProps('name')}
                          error={Boolean(touched.name && errors.name)}
                          helperText={touched.name && errors.name}
                        />
                      </Stack>
                    </Grid>

                    <Grid item xs={12}>
                      <Stack spacing={1.25}>
                        <InputLabel htmlFor="name">技術区分</InputLabel>
                        <Autocomplete
                          id="technic_name"
                          // value={customer.technic_name}
                          {...getFieldProps('technic_name')}
                          onChange={(event: any, newValue: string | null) => {
                            const technic = tableData.data.rows.find((technic: any) => technic.name === newValue);
                            setFieldValue('technic_id', technic.id);
                            setFieldValue('technic_name', technic.name);
                          }}
                          options={tableData.data.rows.map((technic: any) => technic.name)}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              placeholder="技術区分を選択してください"
                              sx={{ '& .MuiAutocomplete-input.Mui-disabled': { WebkitTextFillColor: theme.palette.text.primary } }}
                            />
                          )}
                        />
                        {touched.technic_name && errors.technic_name && (
                          <FormHelperText error id="helper-text-technic_name">
                            {errors.technic_name}
                          </FormHelperText>
                        )}
                      </Stack>
                    </Grid>

                    <Grid item xs={12}>
                      <Stack spacing={1.25}>
                        <InputLabel htmlFor="name">候補に表示する</InputLabel>
                        <Switch
                          edge="end"
                          onChange={handleToggle('candidate_flag')}
                          checked={checked.indexOf('candidate_flag') !== -1}
                          inputProps={{
                            'aria-labelledby': 'switch-list-label-candidate_flag'
                          }}
                        />
                        {touched.candidate_flag && errors.candidate_flag && (
                          <FormHelperText error id="helper-text-candidate_flag">
                            {errors.candidate_flag}
                          </FormHelperText>
                        )}
                      </Stack>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </DialogContent>
            <Divider />
            <DialogActions sx={{ p: 2.5 }}>
              <Grid container justifyContent="space-between" alignItems="center">
                <Grid item>
                  {!isCreating && (
                    <Tooltip title="削除" placement="top">
                      <IconButton onClick={() => setOpenAlert(true)} size="large" color="error">
                        <DeleteFilled />
                      </IconButton>
                    </Tooltip>
                  )}
                </Grid>
                <Grid item>
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Button color="error" onClick={onCancel}>
                      キャンセル
                    </Button>
                    <Button type="submit" variant="contained" disabled={isSubmitting}>
                      {customer ? '更新' : '追加'}
                    </Button>
                  </Stack>
                </Grid>
              </Grid>
            </DialogActions>
          </Form>
        </LocalizationProvider>
      </FormikProvider>
      {!isCreating && <AlertCustomerDelete id={customer.id} open={openAlert} handleClose={handleAlertClose} onReload={onReload} />}
    </>
  );
};

export default AddCustomer;
