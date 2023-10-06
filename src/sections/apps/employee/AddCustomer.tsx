import { useEffect, useState, ChangeEvent } from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';
import {
  Box,
  Button,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControl,
  FormLabel,
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
import { PatternFormat } from 'react-number-format';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

// third-party
import _ from 'lodash';
import * as Yup from 'yup';
import { useFormik, Form, FormikProvider, FormikValues } from 'formik';

// project imports
import AlertCustomerDelete from './AlertCustomerDelete';
import Avatar from 'components/@extended/Avatar';
import IconButton from 'components/@extended/IconButton';

import { dispatch } from 'store';
import { openSnackbar } from 'store/reducers/snackbar';

// types
import { ThemeMode } from 'types/config';

// assets
import { CameraOutlined, DeleteFilled } from '@ant-design/icons';

// constant
const getInitialValues = (customer: FormikValues | null) => {
  const newCustomer = {
    id: '',
    sei: '',
    mei: '',
    sei_k: '',
    mei_k: '',
    gender: '',
    birthday: null,
    remarks: '',
    phone_number: '',
    email: '',
    postal_code: '',
    address: '',
    joining_date: null,
    retirement_date: null,
    employment_id: '',
    position_id: ''
  };

  if (customer) {
    newCustomer.id = customer.id;
    newCustomer.sei = customer.sei;
    newCustomer.mei = customer.mei;
    newCustomer.sei_k = customer.sei_k;
    newCustomer.mei_k = customer.mei_k;
    newCustomer.gender = customer.gender;
    newCustomer.birthday = customer.birthday;
    newCustomer.remarks = customer.remarks;
    newCustomer.phone_number = customer.phone_number;
    newCustomer.email = customer.email;
    newCustomer.postal_code = customer.postal_code;
    newCustomer.address = customer.address;
    newCustomer.joining_date = customer.joining_date;
    newCustomer.retirement_date = customer.retirement_date;
    newCustomer.employment_id = customer.employment_id;
    newCustomer.position_id = customer.position_id;
    return _.merge({}, newCustomer, customer);
  }

  return newCustomer;
};

const genderList = ['男', '女'];
const allStatus = ['1', '2', '3'];

// ==============================|| CUSTOMER ADD / EDIT ||============================== //

export interface Props {
  customer?: any;
  onCancel: () => void;
}

const AddCustomer = ({ customer, onCancel }: Props) => {
  const theme = useTheme();
  const isCreating = !customer;

  const [selectedImage, setSelectedImage] = useState<File | undefined>(undefined);
  const [avatar, setAvatar] = useState<string | undefined>(
    `/assets/images/users/avatar-${isCreating && !customer?.avatar ? 1 : customer.avatar}.png`
  );

  useEffect(() => {
    if (selectedImage) {
      setAvatar(URL.createObjectURL(selectedImage));
    }
  }, [selectedImage]);

  const CustomerSchema = Yup.object().shape({
    sei: Yup.string().max(255).required('Name is required'),
    mei: Yup.string().max(255).required('Name is required')
    // orderStatus: Yup.string().required('Status is required'),
    // email: Yup.string().max(255).required('Email is required').email('Must be a valid email'),
    // location: Yup.string().max(500)
  });

  const [openAlert, setOpenAlert] = useState(false);

  const handleAlertClose = () => {
    setOpenAlert(!openAlert);
    onCancel();
  };
  const handleClear = () => {
    console.log('clear');
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
        alert(JSON.stringify(values));
        fetch(`/api/db/employee/insert`, {
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
        handleClear();
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
                <Grid item xs={12} md={3}>
                  <Stack direction="row" justifyContent="center" sx={{ mt: 3 }}>
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
                      <Avatar alt="Avatar 1" src={avatar} sx={{ width: 72, height: 72, border: '1px dashed' }} />
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
                          <CameraOutlined style={{ color: theme.palette.secondary.lighter, fontSize: '2rem' }} />
                          <Typography sx={{ color: 'secondary.lighter' }}>Upload</Typography>
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
                <Grid item xs={12} md={8}>
                  <Grid container spacing={3}>
                    <Grid item xs={6}>
                      <Stack spacing={1.25}>
                        <InputLabel htmlFor="customer-sei">性</InputLabel>
                        <TextField
                          fullWidth
                          id="customer-sei"
                          placeholder="Enter Customer sei"
                          {...getFieldProps('sei')}
                          error={Boolean(touched.sei && errors.sei)}
                          helperText={touched.sei && errors.sei}
                        />
                      </Stack>
                    </Grid>
                    <Grid item xs={6}>
                      <Stack spacing={1.25}>
                        <InputLabel htmlFor="customer-mei">名</InputLabel>
                        <TextField
                          fullWidth
                          id="customer-mei"
                          placeholder="Enter Customer mei"
                          {...getFieldProps('mei')}
                          error={Boolean(touched.mei && errors.mei)}
                          helperText={touched.mei && errors.mei}
                        />
                      </Stack>
                    </Grid>
                    <Grid item xs={6}>
                      <Stack spacing={1.25}>
                        <InputLabel htmlFor="customer-sei_k">性（カナ）</InputLabel>
                        <TextField
                          fullWidth
                          id="customer-sei_k"
                          placeholder="Enter Customer sei_k"
                          {...getFieldProps('sei_k')}
                          error={Boolean(touched.sei_k && errors.sei_k)}
                          helperText={touched.sei_k && errors.sei_k}
                        />
                      </Stack>
                    </Grid>
                    <Grid item xs={6}>
                      <Stack spacing={1.25}>
                        <InputLabel htmlFor="customer-mei_k">名（カナ）</InputLabel>
                        <TextField
                          fullWidth
                          id="customer-mei_k"
                          placeholder="Enter Customer mei_k"
                          {...getFieldProps('mei_k')}
                          error={Boolean(touched.mei_k && errors.mei_k)}
                          helperText={touched.mei_k && errors.mei_k}
                        />
                      </Stack>
                    </Grid>
                    <Grid item xs={6}>
                      <Stack spacing={1.25}>
                        <InputLabel htmlFor="customer-gender">性別</InputLabel>
                        <FormControl fullWidth>
                          <Select
                            id="column-hiding"
                            displayEmpty
                            {...getFieldProps('gender')}
                            onChange={(event: SelectChangeEvent<string>) => setFieldValue('gender', event.target.value as string)}
                            input={<OutlinedInput id="select-column-hiding" placeholder="Sort by" />}
                            renderValue={(selected) => {
                              if (!selected) {
                                return <Typography variant="subtitle1">性別を選択してください</Typography>;
                              }

                              return <Typography variant="subtitle2">{selected}</Typography>;
                            }}
                          >
                            {genderList.map((column: any) => (
                              <MenuItem key={column} value={column}>
                                <ListItemText primary={column} />
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                        {touched.gender && errors.gender && (
                          <FormHelperText error id="standard-weight-helper-text-email-login" sx={{ pl: 1.75 }}>
                            {errors.gender}
                          </FormHelperText>
                        )}
                      </Stack>
                    </Grid>
                    <Grid item xs={6}>
                      <Stack spacing={1.25}>
                        <InputLabel htmlFor="customer-birthday">生年月日</InputLabel>
                        <DatePicker
                          {...getFieldProps('birthday')}
                          onChange={(newValue) => setFieldValue('birthday', newValue)}
                          format="yyyy/MM/dd"
                        />
                        {/* <DatePicker format="dd/MM/yyyy" value={values.date} onChange={(newValue) => setFieldValue('date', newValue)} /> */}
                      </Stack>
                    </Grid>
                    <Grid item xs={12}>
                      <Stack spacing={1.25}>
                        <InputLabel htmlFor="customer-email">Email</InputLabel>
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
                        <InputLabel htmlFor="customer-phone_number">電話番号</InputLabel>
                        <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={2}>
                          <PatternFormat
                            id="customer-phone_number"
                            format="###-####-####"
                            mask="_"
                            fullWidth
                            customInput={TextField}
                            {...getFieldProps('phone_number')}
                            placeholder="phone_number"
                            error={Boolean(touched.phone_number && errors.phone_number)}
                            helperText={touched.phone_number && errors.phone_number}
                            // onBlur={() => {}}
                            // onChange={() => {}}
                          />
                        </Stack>
                        <TextField
                          fullWidth
                          id="customer-phone_number"
                          placeholder="Enter Customer phone_number"
                          {...getFieldProps('phone_number')}
                          error={Boolean(touched.phone_number && errors.phone_number)}
                          helperText={touched.phone_number && errors.phone_number}
                        />
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
                        <InputLabel htmlFor="customer-employment_id">雇用区分</InputLabel>
                        <FormControl fullWidth>
                          <Select
                            id="column-hiding"
                            displayEmpty
                            {...getFieldProps('employment_id')}
                            onChange={(event: SelectChangeEvent<string>) => setFieldValue('employment_id', event.target.value as string)}
                            input={<OutlinedInput id="select-column-hiding" placeholder="Sort by" />}
                            renderValue={(selected) => {
                              if (!selected) {
                                return <Typography variant="subtitle1">選択してください</Typography>;
                              }

                              return <Typography variant="subtitle2">{selected}</Typography>;
                            }}
                          >
                            {allStatus.map((column: any) => (
                              <MenuItem key={column} value={column}>
                                <ListItemText primary={column} />
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                        {touched.employment_id && errors.employment_id && (
                          <FormHelperText error id="standard-weight-helper-text-email-login" sx={{ pl: 1.75 }}>
                            {errors.employment_id}
                          </FormHelperText>
                        )}
                      </Stack>
                    </Grid>
                    <Grid item xs={12}>
                      <Stack spacing={1.25}>
                        <InputLabel htmlFor="customer-position_id">役職</InputLabel>
                        <FormControl fullWidth>
                          <Select
                            id="column-hiding"
                            displayEmpty
                            {...getFieldProps('position_id')}
                            onChange={(event: SelectChangeEvent<string>) => setFieldValue('position_id', event.target.value as string)}
                            input={<OutlinedInput id="select-column-hiding" placeholder="Sort by" />}
                            renderValue={(selected) => {
                              if (!selected) {
                                return <Typography variant="subtitle1">選択してください</Typography>;
                              }

                              return <Typography variant="subtitle2">{selected}</Typography>;
                            }}
                          >
                            {allStatus.map((column: any) => (
                              <MenuItem key={column} value={column}>
                                <ListItemText primary={column} />
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                        {touched.position_id && errors.position_id && (
                          <FormHelperText error id="standard-weight-helper-text-email-login" sx={{ pl: 1.75 }}>
                            {errors.position_id}
                          </FormHelperText>
                        )}
                      </Stack>
                    </Grid>
                    <Grid item xs={6}>
                      <Stack spacing={1.25}>
                        <InputLabel htmlFor="customer-joining_date">入社日</InputLabel>
                        <DatePicker
                          {...getFieldProps('joining_date')}
                          onChange={(newValue) => setFieldValue('joining_date', newValue)}
                          format="yyyy/MM/dd"
                        />
                      </Stack>
                    </Grid>
                    <Grid item xs={6}>
                      <Stack spacing={1.25}>
                        <InputLabel htmlFor="customer-retirement_date">退職日</InputLabel>
                        <DatePicker
                          {...getFieldProps('retirement_date')}
                          onChange={(newValue) => setFieldValue('retirement_date', newValue)}
                          format="yyyy/MM/dd"
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
                      Cancel
                    </Button>
                    <Button type="submit" variant="contained" disabled={isSubmitting}>
                      {customer ? 'Edit' : 'Add'}
                    </Button>
                  </Stack>
                </Grid>
              </Grid>
            </DialogActions>
          </Form>
        </LocalizationProvider>
      </FormikProvider>
      {!isCreating && <AlertCustomerDelete title={customer.fatherName} open={openAlert} handleClose={handleAlertClose} />}
    </>
  );
};

export default AddCustomer;
