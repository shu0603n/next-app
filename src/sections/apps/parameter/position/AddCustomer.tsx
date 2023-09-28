import { useState } from 'react';

// material-ui
import { Button, DialogActions, DialogContent, DialogTitle, Divider, Grid, InputLabel, Stack, TextField, Tooltip } from '@mui/material';
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

// 定数
const getInitialValues = (customer: FormikValues | null) => {
  const newCustomer = {
    id: '',
    name: ''
  };

  if (customer) {
    newCustomer.name = customer.name;
    return _.merge({}, newCustomer, customer);
  }

  return newCustomer;
};

// ==============================|| 顧客の追加/編集 ||============================== //

export interface Props {
  customer?: any;
  onCancel: () => void;
}

const AddCustomer = ({ customer, onCancel }: Props) => {
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
        console.log(values.name);
        if (customer) {
          fetch(`/api/db/parameter/position/update?id=${values.id}&name=${values.name}`)
            .then((response) => {
              if (!response.ok) {
                throw new Error('データの更新に失敗しました。');
              }
              return response.json();
            })
            .then((data) => {
              dispatch(
                openSnackbar({
                  open: true,
                  message: 'パラメーターが正常に更新されました。',
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
          fetch(`/api/db/parameter/position/insert?name=${values.name}`)
            .then((response) => {
              if (!response.ok) {
                throw new Error('データの追追加に失敗しました。');
              }
              return response.json();
            })
            .then((data) => {
              dispatch(
                openSnackbar({
                  open: true,
                  message: 'パラメーターが正常に追加されました。',
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

        setSubmitting(false);
        onCancel();
      } catch (error) {
        console.error(error);
      }
    }
  });

  const { errors, touched, handleSubmit, isSubmitting, getFieldProps } = formik;

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
                    <Grid item xs={12}>
                      <Stack spacing={1.25}>
                        <InputLabel htmlFor="id">ID</InputLabel>
                        <TextField fullWidth id="id" {...getFieldProps('id')} />
                      </Stack>
                    </Grid>
                    <Grid item xs={12}>
                      <Stack spacing={1.25}>
                        <InputLabel htmlFor="name">パラメーター</InputLabel>
                        <TextField
                          fullWidth
                          id="name"
                          placeholder="パラメーターを入力してください"
                          {...getFieldProps('name')}
                          error={Boolean(touched.name && errors.name)}
                          helperText={touched.name && errors.name}
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
      {!isCreating && <AlertCustomerDelete title={customer.name} open={openAlert} handleClose={handleAlertClose} />}
    </>
  );
};

export default AddCustomer;
