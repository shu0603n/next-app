import { useEffect, useState } from 'react';

// material-ui
import {
  Button,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControl,
  Grid,
  FormHelperText,
  InputLabel,
  ListItemText,
  MenuItem,
  OutlinedInput,
  Select,
  SelectChangeEvent,
  Stack,
  TextField,
  Tooltip,
  Typography
} from '@mui/material';
import { DateTimePicker, LocalizationProvider } from '@mui/x-date-pickers';

import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { alertSnackBar } from 'function/alert/alertSnackBar';

// third-party
import _ from 'lodash';
import * as Yup from 'yup';
import { useFormik, Form, FormikProvider, FormikValues } from 'formik';

// project imports
import AlertCustomerDelete from './AlertCustomerDelete';
import IconButton from 'components/@extended/IconButton';

// assets
import { DeleteFilled } from '@ant-design/icons';

// material-ui
import { ParameterType } from 'types/parameter/parameter';
import { ClientHistoryType } from 'types/client/history';
import { useRouter } from 'next/router';
import useUser from 'hooks/useUser';
import ja from 'date-fns/locale/ja';

// constant
const getInitialValues = (customer: FormikValues | null, client_id: string, user_id?: string) => {
  const newCustomer = {
    id: null,
    client_id: client_id,
    name: '',
    gender: '',
    age: '',
    time: new Date(),
    remarks: '',
    client_position: null,
    employee_id: user_id
  };

  if (customer) {
    newCustomer.id = customer.id || null;
    newCustomer.name = customer.name || '';
    newCustomer.gender = customer.gender || '';
    newCustomer.age = customer.age || '';
    newCustomer.time = customer.time || '';
    newCustomer.remarks = customer.remarks || '';
    newCustomer.client_position = customer.client_position || null;
    return _.merge({}, newCustomer, customer);
  }

  return newCustomer;
};

// ==============================|| 顧客の追加/編集 ||============================== //
export interface Props {
  customer?: any;
  onCancel: (status: boolean) => void;
  reloadDataAfterAdd: (data: ClientHistoryType[]) => void;
  candidate_client_position: ParameterType[];
}

const AddCustomer = ({ customer, onCancel, reloadDataAfterAdd, candidate_client_position }: Props) => {
  const isCreating = !customer;
  const router = useRouter();
  const user = useUser();
  const clientId = router.query.id as string;

  const CustomerSchema = Yup.object().shape({
    time: Yup.string().max(255).required('対応日時は必須です')
    // orderStatus: Yup.string().required('ステータスは必須です'),
    // location: Yup.string().max(500),
    // role: Yup.string()
    //   .trim()
    //   .required('役割の選択は必須です')
    //   .matches(/^[a-z\d\-/#_\s]+$/i, 'アルファベットと数字しか許可されていません')
    //   .max(50, '役割は最大50文字までです'),
    // skills: Yup.array()
    //   .of(
    //     Yup.string()
    //       .trim()
    //       .required('タグに先頭の空白があります')
    //       .matches(/^[a-z\d\-/#.&_\s]+$/i, 'アルファベットと数字しか許可されていません')
    //       .max(50, 'スキルタグは最大50文字までです')
    //   )
    //   .required('スキルの選択は必須です')
    //   // .min(3, 'スキルタグは少なくとも3つ必要です')
    //   .max(15, '最大で15個のスキルを選択してください'),
    // process: Yup.array()
    //   .of(
    //     Yup.string()
    //       .trim()
    //       .required('タグに先頭の空白があります')
    //       .matches(/^[a-z\d\-/#.&_\s]+$/i, 'アルファベットと数字しか許可されていません')
    //       .max(50, '担当工程タグは最大50文字までです')
    //   )
    //   .required('担当工程の選択は必須です')
    //   // .min(3, 'スキルタグは少なくとも3つ必要です')
    //   .max(15, '最大で15個の担当工程を選択してください')
  });

  const [openAlert, setOpenAlert] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const handleAlertClose = () => {
    setOpenAlert(!openAlert);
    onCancel(false);
  };

  const formik = useFormik({
    initialValues: getInitialValues(customer!, clientId, user?.id),
    validationSchema: CustomerSchema,
    onSubmit: (values, { setSubmitting }) => {
      try {
        if (customer) {
          alertSnackBar('処理中…', 'secondary');
          fetch(`/api/db/client/history/update?id=${clientId}`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(values)
          })
            .then((response) => {
              if (!response.ok) {
                throw new Error('更新に失敗しました。');
              }
              return response.json();
            })
            .then((data) => {
              alertSnackBar('正常に更新されました。', 'success');
              reloadDataAfterAdd(data.data);
              setIsEditing(false);
            })
            .catch((error) => {
              console.error('エラー:', error);
              alertSnackBar('データの更新に失敗しました。', 'error');
            })
            .finally(() => {
              onCancel(false);
            });
        } else {
          alertSnackBar('処理中…', 'secondary');
          fetch(`/api/db/client/history/insert?id=${clientId}`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(values)
          })
            .then((response) => {
              if (!response.ok) {
                throw new Error('更新に失敗しました。');
              }
              return response.json();
            })
            .then((data) => {
              alertSnackBar('正常に追加されました。', 'success');
              reloadDataAfterAdd(data.data);
              setIsEditing(false);
            })
            .catch((error) => {
              console.error('エラー:', error);
              alertSnackBar('データの追加に失敗しました。', 'error');
            })
            .finally(() => {
              setSubmitting(false);
              onCancel(false);
            });
        }
      } catch (error) {
        console.error(error);
      }
    }
  });

  useEffect(() => {
    if (isCreating) {
      // 新規作成時はフォームをリセットして初期値を設定
      formik.resetForm({ values: getInitialValues(null, clientId, user?.id) });
    } else if (customer) {
      // 編集時はcustomerが変更された場合のみフォームの値を更新
      formik.setValues(getInitialValues(customer, clientId, user?.id));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [customer, isCreating]);

  const { errors, touched, handleSubmit, getFieldProps, setFieldValue } = formik;

  return (
    <>
      <FormikProvider value={formik}>
        <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ja}>
          <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
            <DialogTitle>{customer ? '対応履歴の編集' : '新しい対応履歴の追加'}</DialogTitle>
            <Divider />
            <DialogContent sx={{ p: 2.5 }}>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <Grid container spacing={3}>
                    <Grid item xs={6}>
                      <Stack spacing={1.25}>
                        <InputLabel htmlFor="time">対応日時</InputLabel>
                        <DateTimePicker
                          value={getFieldProps('time').value ? new Date(getFieldProps('time').value) : new Date()}
                          onChange={(newValue: any) => setFieldValue('time', newValue)}
                        />
                      </Stack>
                    </Grid>
                    <Grid item xs={6}>
                      <Stack spacing={1.25}>
                        <InputLabel>担当者</InputLabel>
                        <TextField
                          fullWidth
                          id="name"
                          {...getFieldProps('name')}
                          error={Boolean(touched.name && errors.name)}
                          helperText={touched.name && errors.name}
                        />
                      </Stack>
                    </Grid>
                    <Grid item xs={6}>
                      <Stack spacing={1.25}>
                        <InputLabel htmlFor="customer-client">役職</InputLabel>
                        <FormControl fullWidth>
                          <Select
                            id="column-hiding"
                            displayEmpty
                            {...getFieldProps('client_position')}
                            onChange={(event: SelectChangeEvent<string>) =>
                              setFieldValue('client_position', JSON.parse(event.target.value))
                            }
                            input={<OutlinedInput id="select-column-hiding" placeholder="ソート" />}
                            renderValue={(selected) => {
                              if (!selected) {
                                return <Typography variant="subtitle1">役職を選択</Typography>;
                              }

                              return <Typography variant="subtitle2">{JSON.parse(JSON.stringify(selected)).name}</Typography>;
                            }}
                          >
                            {candidate_client_position.map((client_position: ParameterType) => (
                              <MenuItem key={client_position.name} value={JSON.stringify(client_position)}>
                                <ListItemText primary={client_position.name} />
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                        {touched.client_position && errors.client_position && (
                          <FormHelperText error id="standard-weight-helper-text-email-login" sx={{ pl: 1.75 }}>
                            {errors.client_position}
                          </FormHelperText>
                        )}
                      </Stack>
                    </Grid>
                    <Grid item xs={3}>
                      <Stack spacing={1.25}>
                        <InputLabel>年齢</InputLabel>
                        <TextField
                          fullWidth
                          id="age"
                          {...getFieldProps('age')}
                          error={Boolean(touched.age && errors.age)}
                          helperText={touched.age && errors.age}
                        />
                      </Stack>
                    </Grid>
                    <Grid item xs={3}>
                      <Stack spacing={1.25}>
                        <InputLabel>性別</InputLabel>
                        <TextField
                          fullWidth
                          id="gender"
                          {...getFieldProps('gender')}
                          error={Boolean(touched.gender && errors.gender)}
                          helperText={touched.gender && errors.gender}
                        />
                      </Stack>
                    </Grid>
                    <Grid item xs={12}>
                      <Stack spacing={1.25}>
                        <InputLabel htmlFor="remarks">対応内容</InputLabel>
                        <TextField
                          fullWidth
                          id="remarks"
                          {...getFieldProps('remarks')}
                          multiline
                          rows={20}
                          error={Boolean(touched.remarks && errors.remarks)}
                          helperText={touched.remarks && errors.remarks}
                        />
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
                    <Button color="error" onClick={() => onCancel(false)}>
                      キャンセル
                    </Button>
                    <Button type="submit" variant="contained" disabled={isEditing}>
                      {customer ? '編集' : '追加'}
                    </Button>
                  </Stack>
                </Grid>
              </Grid>
            </DialogActions>
          </Form>
        </LocalizationProvider>
      </FormikProvider>
      {!isCreating && (
        <AlertCustomerDelete
          id={customer.id}
          title={customer.name}
          open={openAlert}
          handleClose={handleAlertClose}
          reloadDataAfterDelete={(data: ClientHistoryType[]) => {}}
        />
      )}
    </>
  );
};

export default AddCustomer;
