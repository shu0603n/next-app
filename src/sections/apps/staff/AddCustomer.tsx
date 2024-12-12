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
    onSubmit: async () => {
      setLoading(true); // ローディング開始
      alertSnackBar('処理中…', 'secondary');
      try {
        // 最初にimport_delete APIを呼び出し
        const deleteResponse = await fetch('/api/db/staff/import', {
          method: 'DELETE'
        });

        if (!deleteResponse.ok) {
          throw new Error('データ削除に失敗しました。');
        }

        const deleteData = await deleteResponse.json();
        console.log('削除完了:', deleteData.message);

        // バックエンドで処理を分けるので、データはそのまま送信
        const response = await fetch('/api/db/staff/import', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data), // ここで全データを一度に送信
        });

        if (!response.ok) {
          throw new Error('データの更新に失敗しました。');
        }

        const responseData = await response.json();
        console.log('データ処理完了:', responseData);
        alertSnackBar('処理が完了しました。', 'success');

      } catch (error) {
        console.error('エラー:', error);
        alertSnackBar('データ削除に失敗しました。', 'error');
        setLoading(false); // ローディング終了
      }
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
