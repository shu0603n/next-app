import { useState } from 'react';
import { Button, DialogActions, DialogContent, DialogTitle, Divider, Grid, InputLabel, Stack, TextField, Tooltip } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import ja from 'date-fns/locale/ja';
import _ from 'lodash';
import * as Yup from 'yup';
import { useFormik, Form, FormikProvider, FormikValues } from 'formik';
import AlertCustomerDelete from './AlertCustomerDelete';
import IconButton from 'components/@extended/IconButton';
import { DeleteFilled } from '@ant-design/icons';
import { ParameterType } from 'types/parameter/parameter';
import { alertSnackBar } from 'function/alert/alertSnackBar';

const getInitialValues = (customer: FormikValues | null) => {
  const newCustomer = {
    id: null as null | number,
    name: '',
    user: '',
    pass: ''
  };

  if (customer) {
    newCustomer.id = customer.id;
    newCustomer.name = customer.name;
    newCustomer.user = customer.user;
    newCustomer.pass = customer.pass;
    return _.merge({}, newCustomer, customer);
  }

  return newCustomer;
};

// ==============================|| 顧客の追加/編集 ||============================== //

export interface Props {
  customer?: any;
  onCancel: () => void;
  onReload: (data: Array<ParameterType>) => void;
}

const AddCustomer = ({ customer, onCancel, onReload }: Props) => {
  const isCreating = !customer;

  const CustomerSchema = Yup.object().shape({
    name: Yup.string().max(255).required('パラメーターは必須です')
  });

  const [openAlert, setOpenAlert] = useState(false);

  const handleAlertClose = () => {
    setOpenAlert(!openAlert);
    onCancel();
  };

  const formik = useFormik({
    initialValues: getInitialValues(customer!),
    validationSchema: CustomerSchema,
    onSubmit: (values, { setSubmitting }) => {
      try {
        if (customer) {
          alertSnackBar('処理中…', 'secondary');
          fetch(`/api/db/parameter/mail_account/update?id=${values.id}&name=${values.name}&user=${values.user}&pass=${values.pass}`)
            .then((response) => {
              if (!response.ok) {
                throw new Error('更新に失敗しました。');
              }
              return response.json();
            })
            .then((data) => {
              onReload(data.data);
              alertSnackBar('正常に更新されました。', 'success');
            })
            .catch((error) => {
              console.error('エラー:', error);
              alertSnackBar('データの更新に失敗しました。', 'error');
            })
            .finally(() => {
              onCancel();
            });
        } else {
          alertSnackBar('処理中…', 'secondary');
          fetch(`/api/db/parameter/mail_account/insert?name=${values.name}&user=${values.user}&pass=${values.pass}`)
            .then((response) => {
              if (!response.ok) {
                throw new Error('更新に失敗しました。');
              }
              return response.json();
            })
            .then((data) => {
              onReload(data.data);
              alertSnackBar('正常に追加されました。', 'success');
            })
            .catch((error) => {
              console.error('エラー:', error);
              alertSnackBar('データの追加に失敗しました。', 'error');
            })
            .finally(() => {
              setSubmitting(false);
              onCancel();
            });
        }
      } catch (error) {
        console.error(error);
      }
    }
  });

  const { errors, touched, handleSubmit, isSubmitting, getFieldProps } = formik;

  return (
    <>
      <FormikProvider value={formik}>
        <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ja}>
          <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
            <DialogTitle>{customer ? 'パラメーターの編集' : '新しいパラメーター'}</DialogTitle>
            <Divider />
            <DialogContent sx={{ p: 2.5 }}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={8}>
                  <Grid container spacing={3}>
                    <Grid item xs={12}>
                      <Stack spacing={1.25}>
                        <InputLabel htmlFor="name">名前</InputLabel>
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
                        <InputLabel htmlFor="user">アカウント</InputLabel>
                        <TextField
                          fullWidth
                          id="user"
                          placeholder={customer !== null ? customer.user : 'アカウントを入力してください'}
                          {...getFieldProps('user')}
                          error={Boolean(touched.user && errors.user)}
                          helperText={touched.user && errors.user}
                        />
                      </Stack>
                    </Grid>
                    <Grid item xs={12}>
                      <Stack spacing={1.25}>
                        <InputLabel htmlFor="user">パスワード</InputLabel>
                        <TextField
                          fullWidth
                          id="pass"
                          type="password"
                          placeholder={customer !== null ? customer.pass : 'パスワードを入力してください'}
                          {...getFieldProps('pass')}
                          error={Boolean(touched.pass && errors.pass)}
                          helperText={touched.pass && errors.pass}
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
