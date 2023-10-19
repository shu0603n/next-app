import { useState } from 'react';

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
import { LocalizationProvider } from '@mui/x-date-pickers';

import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

// third-party
import _ from 'lodash';
import * as Yup from 'yup';
import { useFormik, Form, FormikProvider, FormikValues } from 'formik';

// project imports
import AlertCustomerDelete from './AlertCustomerDelete';
import IconButton from 'components/@extended/IconButton';

import { dispatch } from 'store';
import { openSnackbar } from 'store/reducers/snackbar';

// assets
import { DeleteFilled } from '@ant-design/icons';
import { AttendanceType } from 'types/attendance/attendance';

// constant
const getInitialValues = (customer: FormikValues | null) => {
  const newCustomer = {
    employee_id: 1, //セッションユーザーから取得する
    date: '',
    start_time: '',
    end_time: '',
    location: ''
  };

  if (customer) {
    newCustomer.employee_id = customer.employee_id;
    newCustomer.date = customer.date;
    newCustomer.start_time = customer.start_time;
    newCustomer.end_time = customer.end_time;
    newCustomer.location = customer.location;

    return _.merge({}, newCustomer, customer);
  }

  return newCustomer;
};

const locationList = ['自社', '就業先', '自宅'];

// ==============================|| CUSTOMER ADD / EDIT ||============================== //

export interface Props {
  customer?: any;
  onCancel: () => void;
  onReload: (data: Array<AttendanceType>) => void;
}

const AddCustomer = ({ customer, onCancel, onReload }: Props) => {
  const isCreating = !customer;

  const CustomerSchema = Yup.object().shape({
    start_time: Yup.string().max(255).required('Name is required'),
    end_time: Yup.string().max(255).required('Name is required')
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
        fetch(`/api/db/attendance/update`, {
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
            onReload(responseData.data.rows);
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
          });
        setSubmitting(false);
        onCancel();
      } catch (error) {
        console.error(error);
      }
    }
  });
  const { errors, touched, handleSubmit, isSubmitting, getFieldProps, setFieldValue } = formik;

  return (
    <>
      <FormikProvider value={formik}>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
            <DialogTitle>{customer ? 'Edit Customer' : 'New Customer'}</DialogTitle>
            <Divider />
            <DialogContent sx={{ p: 2.5 }}>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <Grid container spacing={3}>
                    <Grid item xs={12}>
                      <Stack spacing={1.25}>
                        <InputLabel htmlFor="customer-date">日付</InputLabel>
                        <TextField
                          fullWidth
                          id="date"
                          placeholder="date"
                          {...getFieldProps('date')}
                          error={Boolean(touched.date && errors.date)}
                          helperText={touched.date && errors.date}
                        />
                      </Stack>
                    </Grid>
                    <Grid item xs={6}>
                      <Stack spacing={1.25}>
                        <InputLabel htmlFor="customer-start_time">開始時刻</InputLabel>
                        <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={2}>
                          <TextField
                            id="start_time"
                            placeholder="start_time"
                            type="time"
                            {...getFieldProps('start_time')}
                            InputLabelProps={{
                              shrink: true
                            }}
                            inputProps={{
                              step: 300 // 5 min
                            }}
                            sx={{ width: '100%' }}
                          />
                        </Stack>
                      </Stack>
                    </Grid>
                    <Grid item xs={6}>
                      <Stack spacing={1.25}>
                        <InputLabel htmlFor="customer-end_time">終了時刻</InputLabel>
                        <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={2}>
                          <TextField
                            id="end_time"
                            placeholder="end_time"
                            type="time"
                            {...getFieldProps('end_time')}
                            InputLabelProps={{
                              shrink: true
                            }}
                            inputProps={{
                              step: 300 // 5 min
                            }}
                            sx={{ width: '100%' }}
                          />
                        </Stack>
                      </Stack>
                    </Grid>
                    <Grid item xs={12}>
                      <Stack spacing={1.25}>
                        <InputLabel htmlFor="customer-location">勤務場所</InputLabel>
                        <FormControl fullWidth>
                          <Select
                            id="column-hiding"
                            displayEmpty
                            {...getFieldProps('location')}
                            onChange={(event: SelectChangeEvent<string>) => setFieldValue('location', event.target.value as string)}
                            input={<OutlinedInput id="select-column-hiding" placeholder="Sort by" />}
                            renderValue={(selected) => {
                              if (!selected) {
                                return <Typography variant="subtitle1">勤務場所を選択してください</Typography>;
                              }

                              return <Typography variant="subtitle2">{selected}</Typography>;
                            }}
                          >
                            {locationList.map((column: any) => (
                              <MenuItem key={column} value={column}>
                                <ListItemText primary={column} />
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                        {touched.location && errors.location && (
                          <FormHelperText error id="standard-weight-helper-text-email-login" sx={{ pl: 1.75 }}>
                            {errors.location}
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
                    <Tooltip title="勤怠情報削除" placement="top">
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
                      更新
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
          employee_id={customer.employee_id}
          date={customer.date}
          open={openAlert}
          handleClose={handleAlertClose}
          onReload={onReload}
        />
      )}
    </>
  );
};

export default AddCustomer;
