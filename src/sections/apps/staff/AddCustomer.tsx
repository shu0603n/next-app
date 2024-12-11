import { useState } from 'react';

// material-ui
import { DialogContent, DialogTitle, Divider, Grid, FormHelperText, Stack, Button, CircularProgress } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers';

import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import ja from 'date-fns/locale/ja';

// third-party
import * as Yup from 'yup';
import { useFormik, Form, FormikProvider } from 'formik';

// assets
import { EmployeeType } from 'types/employee/employee';
import CsvFile from './CsvFile';
import { CustomFile } from 'types/dropzone';
import { alertSnackBar } from 'function/alert/alertSnackBar';

// ==============================|| CUSTOMER ADD / EDIT ||============================== //

export interface Props {
  customer?: any;
  onCancel: () => void;
  onReload: (data: EmployeeType) => void;
}

const AddCustomer = ({ customer, onCancel, onReload }: Props) => {
  const [data, setData] = useState<CustomFile[] | null>();
  const [loading, setLoading] = useState(false); // ローディング状態の管理
  const CustomerSchema = Yup.object().shape({
    // files: yup.mixed().required('Avatar is a required.')
  });

  const formik = useFormik({
    initialValues: { files: null },
    validationSchema: CustomerSchema,
    onSubmit: () => {
      setLoading(true); // ローディング開始
      alertSnackBar('処理中…', 'secondary');
      fetch(`/api/db/staff/import`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error('更新に失敗しました。');
          }
          return response.json();
        })
        .then((data) => {
          alertSnackBar('処理を開始しました。', 'success');
          // reloadDataAfterAdd(data.data);
          // setIsEditing(false);
        })
        .catch((error) => {
          console.error('エラー:', error);
          alertSnackBar('データの更新に失敗しました。', 'error');
        })
        .finally(() => {
          // onCancel(false);
          setLoading(false); // ローディング終了
        });
    }
  });
  const { errors, touched, handleSubmit, setFieldValue } = formik;

  return (
    <>
      <FormikProvider value={formik}>
        <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ja}>
          <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
            <DialogTitle>{customer ? 'Edit Customer' : 'New Customer'}</DialogTitle>
            <Divider />
            <DialogContent sx={{ p: 2.5 }}>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <Stack spacing={1.5} alignItems="center">
                    <CsvFile setFieldValue={setFieldValue} onRelode={setData} file={data ?? null} error={touched.files && !!errors.files} />
                    {touched.files && errors.files && (
                      <FormHelperText error id="standard-weight-helper-text-password-login">
                        {errors.files}
                      </FormHelperText>
                    )}
                  </Stack>
                </Grid>
              </Grid>
            </DialogContent>
            <Divider />
            {data && (
              <Grid item xs={12}>
                {loading ? (
                  <CircularProgress size={24} />
                ) : (
                  <Button type="submit" color="primary">
                    インポートする
                  </Button>
                )}
              </Grid>
            )}
          </Form>
        </LocalizationProvider>
      </FormikProvider>
    </>
  );
};

export default AddCustomer;
