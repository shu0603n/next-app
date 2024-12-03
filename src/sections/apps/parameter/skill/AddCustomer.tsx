import { useState } from 'react';
import {
  Button,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  OutlinedInput,
  ListItemText,
  Typography,
  Divider,
  FormHelperText,
  Grid,
  InputLabel,
  SelectChangeEvent,
  Stack,
  TextField,
  Tooltip,
  Switch,
  FormControl,
  Select,
  FormControlLabel
} from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import ja from 'date-fns/locale/ja';

// サードパーティ
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
    id: '',
    name: '',
    technic_id: '',
    technic: '',
    candidate_flag: false
  };

  if (customer) {
    newCustomer.id = customer.id;
    newCustomer.name = customer.name;
    newCustomer.technic_id = customer.technic_id;
    newCustomer.technic = customer.technic;
    newCustomer.candidate_flag = customer.candidate_flag;
    return _.merge({}, newCustomer, customer);
  }

  return newCustomer;
};

// ==============================|| 顧客の追加/編集 ||============================== //

export interface Props {
  customer?: any;
  technicAll: Array<ParameterType>;
  onCancel: () => void;
  onReload: (data: Array<ParameterType>) => void;
}

const AddCustomer = ({ customer, technicAll, onCancel, onReload }: Props) => {
  const isCreating = !customer;

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
        const requestOptions = {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json' // 必要に応じてヘッダーを調整
          },
          body: JSON.stringify(values) // valuesをJSON文字列に変換してbodyに設定
        };

        if (customer) {
          alertSnackBar('処理中…', 'secondary');
          fetch('/api/db/parameter/skill/update', requestOptions)
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
          fetch('/api/db/parameter/skill/insert', requestOptions)
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
              resetValues();
              setSubmitting(false);
              onCancel();
            });
        }
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
    setFieldValue('technic', '');
  };

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
                    {customer !== null && (
                      <Grid item xs={12}>
                        <Stack spacing={1.25}>
                          <InputLabel htmlFor="id">ID</InputLabel>
                          <TextField fullWidth id="id" {...getFieldProps('id')} placeholder={customer ? customer.id : ''} disabled />
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
                        <FormControl fullWidth>
                          <Select
                            id="technic"
                            displayEmpty
                            {...getFieldProps('technic')}
                            onChange={(event: SelectChangeEvent<string>) =>
                              setFieldValue(
                                'technic',
                                technicAll?.find((item: ParameterType) => item.name === (event.target.value as string)) ?? null
                              )
                            }
                            input={<OutlinedInput id="select-column-hiding" placeholder="ソート" />}
                            renderValue={(selected: any) => {
                              if (!selected?.name) {
                                return <Typography variant="subtitle1">技術区分を選択</Typography>;
                              }

                              return <Typography variant="subtitle2">{selected.name}</Typography>;
                            }}
                          >
                            <MenuItem value={undefined}>なし</MenuItem>
                            {technicAll?.map((column: ParameterType) => (
                              <MenuItem key={column.id} value={column.name}>
                                <ListItemText primary={column.name} />
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                        {touched.technic && errors.technic && (
                          <FormHelperText error id="helper-text-technic">
                            {errors.technic}
                          </FormHelperText>
                        )}
                      </Stack>
                    </Grid>
                    <Grid item xs={12}>
                      <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                        <Stack spacing={0.5}>
                          <Typography variant="subtitle1">スキルシートに掲載する</Typography>
                        </Stack>
                        <FormControlLabel
                          control={
                            <Switch
                              defaultChecked={getFieldProps('candidate_flag').value}
                              onChange={() => {
                                setFieldValue('candidate_flag', !getFieldProps('candidate_flag').value);
                              }}
                              sx={{ mt: 0 }}
                            />
                          }
                          label=""
                          labelPlacement="start"
                        />
                      </Stack>
                      <Divider sx={{ my: 2 }} />
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
