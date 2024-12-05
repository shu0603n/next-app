import { useState } from 'react';

// material-ui
import { Button, DialogActions, DialogContent, DialogTitle, InputLabel, Divider, Grid, Stack, TextField, Tooltip } from '@mui/material';
import { PatternFormat } from 'react-number-format';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import ja from 'date-fns/locale/ja';
import _ from 'lodash';
import * as Yup from 'yup';
import { useFormik, Form, FormikProvider, FormikValues } from 'formik';
import AlertCustomerDelete from './AlertCustomerDelete';
import IconButton from 'components/@extended/IconButton';
import { DeleteFilled } from '@ant-design/icons';
import { alertSnackBar } from 'function/alert/alertSnackBar';
import { ClientType } from 'types/client/client';

// constant
const getInitialValues = (customer: FormikValues | null) => {
  const newCustomer = {
    id: null as number | null,
    name: '',
    name_k: '',
    remarks: '',
    phone: '',
    email: '',
    postal_code: '',
    address: ''
  };

  if (customer) {
    newCustomer.id = customer.id;
    newCustomer.name = customer.name;
    newCustomer.name_k = customer.name_k;
    newCustomer.remarks = customer.remarks;
    newCustomer.phone = customer.phone;
    newCustomer.email = customer.email;
    newCustomer.postal_code = customer.postal_code;
    newCustomer.address = customer.address;

    return _.merge({}, newCustomer, customer);
  }

  return newCustomer;
};

// ==============================|| CUSTOMER ADD / EDIT ||============================== //

export interface Props {
  customer?: any;
  onCancel: () => void;
  onReload: (data: Array<ClientType>) => void;
}

const AddCustomer = ({ customer, onCancel, onReload }: Props) => {
  const isCreating = !customer;

  const CustomerSchema = Yup.object().shape({
    name: Yup.string().max(255).required('Name is required'),
    name_k: Yup.string().max(255).required('Name is required')
    // orderStatus: Yup.string().required('Status is required'),
    // email: Yup.string().max(255).required('Email is required').email('Must be a valid email'),
    // location: Yup.string().max(500)
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
        alertSnackBar('処理中…', 'secondary');
        fetch(`/api/db/client/insert`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(values)
        })
          .then((response) => {
            if (!response.ok) {
              throw new Error('API request failed');
            }
            return response.json();
          })
          .then((responseData) => {
            onReload(responseData.data);
            alertSnackBar('正常に更新されました。', 'success');
          })
          .catch((error) => {
            console.error('Error updating data:', error);
            alertSnackBar('データの更新に失敗しました。', 'error');
          });
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
        <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ja}>
          <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
            <DialogTitle>{customer ? '編集' : '追加'}</DialogTitle>
            <Divider />
            <DialogContent sx={{ p: 2.5 }}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={8}>
                  <Grid container spacing={3}>
                    <Grid item xs={12}>
                      <Stack spacing={1.25}>
                        <InputLabel htmlFor="customer-name">企業名</InputLabel>
                        <TextField
                          fullWidth
                          id="customer-name"
                          placeholder="Enter Customer name"
                          {...getFieldProps('name')}
                          error={Boolean(touched.name && errors.name)}
                          helperText={touched.name && errors.name}
                        />
                      </Stack>
                    </Grid>
                    <Grid item xs={12}>
                      <Stack spacing={1.25}>
                        <InputLabel htmlFor="customer-name_k">企業名（カナ）</InputLabel>
                        <TextField
                          fullWidth
                          id="customer-name_k"
                          placeholder="Enter Customer name_k"
                          {...getFieldProps('name_k')}
                          error={Boolean(touched.name_k && errors.name_k)}
                          helperText={touched.name_k && errors.name_k}
                        />
                      </Stack>
                    </Grid>
                    <Grid item xs={12}>
                      <Stack spacing={1.25}>
                        <InputLabel htmlFor="customer-email">メールアドレス</InputLabel>
                        <TextField
                          fullWidth
                          id="customer-email"
                          placeholder="Enter Customer Email"
                          {...getFieldProps('email')}
                          error={Boolean(touched.email && errors.email)}
                          helperText={touched.email && errors.email}
                        />
                      </Stack>
                    </Grid>
                    <Grid item xs={6}>
                      <Stack spacing={1.25}>
                        <InputLabel htmlFor="customer-phone">電話番号</InputLabel>
                        <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={2}>
                          <PatternFormat
                            id="customer-phone"
                            format="###-####-####"
                            mask="_"
                            fullWidth
                            customInput={TextField}
                            {...getFieldProps('phone')}
                            placeholder="phone"
                            error={Boolean(touched.phone && errors.phone)}
                            helperText={touched.phone && errors.phone}
                            // onBlur={() => {}}
                            // onChange={() => {}}
                          />
                        </Stack>
                      </Stack>
                    </Grid>
                    <Grid item xs={6}>
                      <Stack spacing={1.25}>
                        <InputLabel htmlFor="customer-postal_code">郵便番号</InputLabel>
                        <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={2}>
                          <PatternFormat
                            id="customer-postal_code"
                            format="###-####"
                            mask="_"
                            fullWidth
                            customInput={TextField}
                            {...getFieldProps('postal_code')}
                            placeholder="postal_code"
                            error={Boolean(touched.postal_code && errors.postal_code)}
                            helperText={touched.postal_code && errors.postal_code}
                            // onBlur={() => {}}
                            // onChange={() => {}}
                          />
                        </Stack>
                      </Stack>
                    </Grid>
                    <Grid item xs={12}>
                      <Stack spacing={1.25}>
                        <InputLabel htmlFor="customer-address">住所</InputLabel>
                        <TextField
                          fullWidth
                          id="customer-address"
                          placeholder="Enter Customer address"
                          {...getFieldProps('address')}
                          error={Boolean(touched.address && errors.address)}
                          helperText={touched.address && errors.address}
                        />
                      </Stack>
                    </Grid>
                    <Grid item xs={12}>
                      <Stack spacing={1.25}>
                        <InputLabel htmlFor="customer-remarks">備考</InputLabel>
                        <TextField
                          fullWidth
                          id="customer-remarks"
                          multiline
                          rows={2}
                          placeholder="Enter remarks"
                          {...getFieldProps('remarks')}
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
                    <Tooltip title="Delete Customer" placement="top">
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
          deleteId={customer.id}
          deleteName={customer.name}
          open={openAlert}
          handleClose={handleAlertClose}
          onReload={onReload}
        />
      )}
    </>
  );
};

export default AddCustomer;
