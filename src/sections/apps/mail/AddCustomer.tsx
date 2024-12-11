import { Button, DialogActions, DialogContent, DialogTitle, Divider, Grid, InputLabel, Stack, TextField } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import ja from 'date-fns/locale/ja';
import _ from 'lodash';
import * as Yup from 'yup';
import { useFormik, Form, FormikProvider, FormikValues } from 'formik';
import { CircularProgress } from '@mui/material';
import Loader from 'components/Loader';
import { alertSnackBar } from 'function/alert/alertSnackBar';
import 'react-quill/dist/quill.snow.css';
import dynamic from 'next/dynamic';
import { useState } from 'react';
import { mailListType } from 'types/mail/mail';
import useUser from 'hooks/useUser';

const ReactQuill = dynamic(() => import('react-quill'), {
  ssr: false
});

// constant
const getInitialValues = (customer: FormikValues | null) => {
  const newCustomer = {
    title: '',
    main_text: '',
    employee_id: ''
  };

  if (customer) {
    newCustomer.title = customer.title;
    newCustomer.main_text = customer.main_text;
    return _.merge({}, newCustomer, customer);
  }

  return newCustomer;
};

// ==============================|| 顧客の追加/編集 ||============================== //

export interface Props {
  customer?: any;
  onCancel: () => void;
  onReload: (data: Array<mailListType>) => void;
}
const AddCustomer = ({ customer, onCancel, onReload }: Props) => {
  const CustomerSchema = Yup.object().shape({
    title: Yup.string().max(255).required('プロジェクト名は必須です'),
    main_text: Yup.string().required('本文は必須です。')
    // employee: Yup.string().trim().required('役割の選択は必須です')
  });
  const user = useUser();

  const formik = useFormik({
    initialValues: getInitialValues(customer!),
    validationSchema: CustomerSchema,
    onSubmit: (values, { setSubmitting }) => {
      values.employee_id = user?.id ?? '';
      try {
        const requestOptions = {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json' // 必要に応じてヘッダーを調整
          },
          body: JSON.stringify(values) // valuesをJSON文字列に変換してbodyに設定
        };

        alertSnackBar('処理中…', 'secondary');
        fetch(`/api/db/mail/insert`, requestOptions)
          .then((response) => {
            if (!response.ok) {
              throw new Error('更新に失敗しました。');
            }
            return response.json();
          })
          .then((data) => {
            onReload(data.data);
            alertSnackBar('正常に送信されました。', 'success');
          })
          .catch((error) => {
            console.error('エラー:', error);
            alertSnackBar('データの更新に失敗しました。', 'error');
          })
          .finally(() => {
            setSubmitting(false);
            onCancel();
          });
      } catch (error) {
        console.error(error);
      }
    }
  });

  const { errors, touched, handleSubmit, isSubmitting, getFieldProps, setFieldValue } = formik;

  const [text, setText] = useState<string>(customer?.main_text ?? '');

  const handleChange = (value: string) => {
    setText(value);
    setFieldValue('main_text', value);
  };

  return (
    <>
      <FormikProvider value={formik}>
        <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ja}>
          <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
            <DialogTitle>{'メール作成'}</DialogTitle>
            <Divider />
            <DialogContent sx={{ p: 2.5 }}>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <Grid item xs={12}>
                    <Grid item xs={12}>
                      <Stack spacing={1.25}>
                        <InputLabel>タイトル</InputLabel>
                        <TextField
                          fullWidth
                          id="title"
                          placeholder="タイトルを入力"
                          {...getFieldProps('title')}
                          error={Boolean(touched.title && errors.title)}
                          helperText={touched.title && errors.title}
                        />
                      </Stack>
                    </Grid>
                    <Grid item xs={12}>
                      <Stack spacing={1.25}>
                        <InputLabel>メール本文</InputLabel>
                        <ReactQuill id="main_text" placeholder="メール本文を入力" value={text} onChange={handleChange} />
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
                  <Button color="error" onClick={onCancel}>
                    キャンセル
                  </Button>
                </Grid>
                {isSubmitting && (
                  <Grid item>
                    <Loader />
                    <CircularProgress />
                  </Grid>
                )}
                <Grid item>
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Button type="submit" variant="contained" disabled={isSubmitting}>
                      追加
                    </Button>
                  </Stack>
                </Grid>
              </Grid>
            </DialogActions>
          </Form>
        </LocalizationProvider>
      </FormikProvider>
    </>
  );
};

export default AddCustomer;
