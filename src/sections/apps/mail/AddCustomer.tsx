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
  Typography
} from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import _ from 'lodash';
import * as Yup from 'yup';
import { useFormik, Form, FormikProvider, FormikValues } from 'formik';
import { CircularProgress } from '@mui/material';
import { EmployeeParameterType, MailAccountParameterType } from 'types/parameter/parameter';
import Loader from 'components/Loader';
import { alertSnackBar } from 'function/alert/alertSnackBar';
import 'react-quill/dist/quill.snow.css';
import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import { mailListType } from 'types/mail/mail';

const ReactQuill = dynamic(() => import('react-quill'), {
  ssr: false
});

// constant
const getInitialValues = (customer: FormikValues | null) => {
  const newCustomer = {
    id: null as number | null,
    title: '',
    description: '',
    user: null as MailAccountParameterType | null,
    employee: null as EmployeeParameterType | null
  };

  if (customer) {
    newCustomer.id = customer.id;
    newCustomer.title = customer.title;
    newCustomer.description = customer.description;
    newCustomer.user = customer.user;
    newCustomer.employee = customer.employee;
    return _.merge({}, newCustomer, customer);
  }

  return newCustomer;
};

async function fetchMailAccountData() {
  try {
    const response = await fetch('/api/db/parameter/mail_account/select');
    if (!response.ok) {
      throw new Error('API request failed');
    }
    const data = await response.json();
    return data; // APIから返されたデータを返します
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
}
// ==============================|| 顧客の追加/編集 ||============================== //

export interface Props {
  old: Array<mailListType>;
  customer?: any;
  onCancel: () => void;
  onReload: (data: Array<any>) => void;
}
const AddCustomer = ({ old, customer, onCancel, onReload }: Props) => {
  const [loading, setLoading] = useState(true); // データの読み込み状態を管理
  const [mailAccount, setMailAccount] = useState<Array<MailAccountParameterType>>();

  useEffect(() => {
    // ページがロードされたときにデータを取得
    fetchMailAccountData()
      .then((data) => {
        console.log(data.data);
        setMailAccount(data.data);
        setLoading(false);
      })
      .catch((error) => {
        // エラーハンドリング
        console.error('Error:', error);
        onCancel();
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // 空の依存リストを指定することで、一度だけ実行される

  const CustomerSchema = Yup.object().shape({
    title: Yup.string().max(255).required('プロジェクト名は必須です')
    // description: Yup.string().max(1000).required('本文は必須です。'),
    // employee: Yup.string().trim().required('役割の選択は必須です')
  });

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

        alertSnackBar('処理中…', 'secondary');
        fetch(`/api/sendMail/sendAllAtOnce`, requestOptions)
          .then((response) => {
            if (!response.ok) {
              throw new Error('更新に失敗しました。');
            }
            return response.json();
          })
          .then((data) => {
            const updatedOld = old.map((oldItem) => {
              const matchingData = data.data.find((dataItem: any) => dataItem.id === oldItem.id);

              if (matchingData) {
                return { ...oldItem, flag: matchingData.flag };
              }

              return oldItem;
            });

            onReload(updatedOld);
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

  const [text, setText] = useState<string>(customer.description);
  const handleChange = (value: string) => {
    setText(value);
    setFieldValue('description', value);
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <>
      <FormikProvider value={formik}>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
            <DialogTitle>{'メール作成'}</DialogTitle>
            <Divider />
            <DialogContent sx={{ p: 2.5 }}>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <Grid item xs={12}>
                    <Grid item xs={12}>
                      <Stack spacing={1.25}>
                        <InputLabel>担当者</InputLabel>
                        <FormControl fullWidth>
                          <Select
                            id="user"
                            displayEmpty
                            {...getFieldProps('user')}
                            onChange={(event: SelectChangeEvent<string>) =>
                              setFieldValue(
                                'client',
                                mailAccount?.find((item: MailAccountParameterType) => item.name === (event.target.value as string)) ?? null
                              )
                            }
                            input={<OutlinedInput placeholder="ソート" />}
                            renderValue={(selected: any) => {
                              if (!selected) {
                                return <Typography variant="subtitle1">担当者を選択</Typography>;
                              }

                              return <Typography variant="subtitle2">{selected}</Typography>;
                            }}
                          >
                            <MenuItem value={undefined}>なし</MenuItem>

                            {mailAccount?.map((column: MailAccountParameterType) => (
                              <MenuItem key={column.id} value={column.name}>
                                <ListItemText primary={column.name} />
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                        {touched.user && errors.user && (
                          <FormHelperText error id="standard-weight-helper-text-email-login" sx={{ pl: 1.75 }}>
                            {errors.user}
                          </FormHelperText>
                        )}
                      </Stack>
                    </Grid>

                    <Grid item xs={12}>
                      <Stack spacing={1.25}>
                        <InputLabel>タイトル</InputLabel>
                        <TextField
                          fullWidth
                          id="title"
                          placeholder="企業名を入力"
                          {...getFieldProps('title')}
                          error={Boolean(touched.title && errors.title)}
                          helperText={touched.title && errors.title}
                        />
                      </Stack>
                    </Grid>
                    <Grid item xs={12}>
                      <Stack spacing={1.25}>
                        <InputLabel>メール本文</InputLabel>
                        <ReactQuill id="description" placeholder="メール本文を入力" value={text} onChange={handleChange} />
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
                      {`一斉送信(全${customer.length}件)`}
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
