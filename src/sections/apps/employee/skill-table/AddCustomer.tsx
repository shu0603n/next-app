import { useState } from 'react';

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
  FormControlLabel,
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
  Switch,
  TextField,
  Tooltip,
  Typography
} from '@mui/material';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';

import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

// third-party
import _ from 'lodash';
import * as Yup from 'yup';
import { useFormik, Form, FormikProvider, FormikValues } from 'formik';

// project imports
import AlertCustomerDelete from './AlertCustomerDelete';
import IconButton from 'components/@extended/IconButton';

import { useDispatch } from 'store';
import { openSnackbar } from 'store/reducers/snackbar';

// assets
import { CameraOutlined, DeleteFilled } from '@ant-design/icons';

// types
import { ThemeMode } from 'types/config';

// --------------------------------------------------------

// material-ui
import { createFilterOptions, Autocomplete, Chip } from '@mui/material';

// third-party

// project imports

// assets
import { CloseOutlined } from '@ant-design/icons';

// 定数
const getInitialValues = (customer: FormikValues | null) => {
  const newCustomer = {
    name: '',
    email: '',
    location: '',
    orderStatus: ''
  };

  if (customer) {
    newCustomer.name = customer.fatherName;
    newCustomer.location = customer.address;
    return _.merge({}, newCustomer, customer);
  }

  return newCustomer;
};

const role = ['PG', 'L', 'PL', 'PM'];

const skills = [
  'Java',
  'HTML',
  'CSS',
  'Bootstrap',
  'JavaScript',
  'TypeScript',
  'NodeJS',
  'React',
  'Angular',
  'CI',
  'C言語',
  'C++',
  'Java',
  'C#',
  'JavaScript',
  'PHP',
  'Ruby',
  'TypeScript',
  'Python',
  'R言語',
  'Go言語',
  'Swift',
  'Kotlin',
  'Objective-C',
  'Visual Basic',
  'VBScript',
  'BASIC',
  'Google Apps Script',
  'Haskell',
  'Scala',
  'Groovy',
  'Delphi',
  'Dart',
  'D言語',
  'Perl',
  'COBOL',
  'SQL',
  'FORTRAN',
  'MATLAB',
  'Scratch'
];
const candidate_skills = ['Java', 'JavaScript', 'Python', 'PHP', 'TypeScript', 'C', 'C#', 'C++'];

const process = ['要件定義', '基本設計', '詳細設計', '製造', '単体テスト', '結合テスト', '運用テスト', '保守'];

const filterprocess = createFilterOptions<string>();
const filterSkills = createFilterOptions<string>();

// ==============================|| 顧客の追加/編集 ||============================== //

export interface Props {
  customer?: any;
  onCancel: () => void;
}

const AddCustomer = ({ customer, onCancel }: Props) => {
  const [birthday, setBirthday] = useState<Date | null>(new Date('2019/4/1'));
  const theme = useTheme();
  const isCreating = !customer;

  const CustomerSchema = Yup.object().shape({
    name: Yup.string().max(255).required('名前は必須です'),
    orderStatus: Yup.string().required('ステータスは必須です'),
    location: Yup.string().max(500),
    role: Yup.string()
      .trim()
      .required('役割の選択は必須です')
      .matches(/^[a-z\d\-/#_\s]+$/i, 'アルファベットと数字しか許可されていません')
      .max(50, '役割は最大50文字までです'),
    skills: Yup.array()
      .of(
        Yup.string()
          .trim()
          .required('タグに先頭の空白があります')
          .matches(/^[a-z\d\-/#.&_\s]+$/i, 'アルファベットと数字しか許可されていません')
          .max(50, 'スキルタグは最大50文字までです')
      )
      .required('スキルの選択は必須です')
      // .min(3, 'スキルタグは少なくとも3つ必要です')
      .max(15, '最大で15個のスキルを選択してください'),
    process: Yup.array()
      .of(
        Yup.string()
          .trim()
          .required('タグに先頭の空白があります')
          .matches(/^[a-z\d\-/#.&_\s]+$/i, 'アルファベットと数字しか許可されていません')
          .max(50, '担当工程タグは最大50文字までです')
      )
      .required('担当工程の選択は必須です')
      // .min(3, 'スキルタグは少なくとも3つ必要です')
      .max(15, '最大で15個の担当工程を選択してください')
  });

  const [openAlert, setOpenAlert] = useState(false);

  const handleAlertClose = () => {
    setOpenAlert(!openAlert);
    onCancel();
  };

  const formik2 = useFormik({
    initialValues: getInitialValues(customer!),
    validationSchema: CustomerSchema,
    onSubmit: (values, { setSubmitting }) => {
      try {
        // const newCustomer = {
        //   name: values.name,
        //   email: values.email,
        //   location: values.location,
        //   orderStatus: values.orderStatus
        // };

        if (customer) {
          // dispatch(updateCustomer(customer.id, newCustomer)); - update
          dispatch(
            openSnackbar({
              open: true,
              message: '顧客情報を正常に更新しました。',
              variant: 'alert',
              alert: {
                color: 'success'
              },
              close: false
            })
          );
        } else {
          // dispatch(createCustomer(newCustomer)); - add
          dispatch(
            openSnackbar({
              open: true,
              message: '顧客を正常に追加しました。',
              variant: 'alert',
              alert: {
                color: 'success'
              },
              close: false
            })
          );
        }

        setSubmitting(false);
        onCancel();
      } catch (error) {
        console.error(error);
      }
    }
  });

  const { errors, touched, handleSubmit, isSubmitting, getFieldProps, setFieldValue } = formik2;
  const dispatch = useDispatch();

  const formik = useFormik({
    initialValues: {
      role: '',
      skills: [],
      process: []
    },
    validationSchema: CustomerSchema,
    onSubmit: (values) => {
      dispatch(
        openSnackbar({
          open: true,
          message: 'Autocomplete - Submit Success',
          variant: 'alert',
          alert: {
            color: 'success'
          },
          close: false
        })
      );
    }
  });

  let TagsError: boolean | string | undefined = false;
  if (formik.touched.skills && typeof formik.errors.skills) {
    if (formik.touched.skills && typeof formik.errors.skills === 'string') {
      TagsError = formik.errors.skills;
    } else {
      formik.errors.skills &&
        typeof formik.errors.skills !== 'string' &&
        formik.errors.skills.map((item) => {
          // @ts-ignore
          if (typeof item === 'object') TagsError = item.label;
          return item;
        });
    }
  }

  const message = `■フロントエンド開発
  ユーザーインターフェース（UI）の設計と実装。HTML、CSS、JavaScriptを使用して、見栄えの良いウェブページを構築します。
  レスポンシブデザインを確保し、異なる画面サイズとデバイスでの適切な表示を保証します。
  フレームワーク（例: React、Angular、Vue.js）を使用して、動的なコンポーネントを開発し、ユーザーエクスペリエンスを向上させます。

  ■バックエンド開発

  サーバーサイドプログラムを設計・実装し、データベースとの通信を可能にします。主要なバックエンド言語（例: Node.js、Python、Ruby）を使用します。
  RESTful APIエンドポイントを設計し、データの受信と送信を管理します。セキュリティを確保し、APIエンドポイントを守ります。
  データベースの設計と管理。SQLデータベース（例: MySQL、PostgreSQL）やNoSQLデータベース（例: MongoDB）を使用します。`;

  return (
    <>
      <FormikProvider value={formik2}>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
            <DialogTitle>{customer ? 'スキル情報の編集' : '新しいスキルの追加'}</DialogTitle>
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
                          <Typography sx={{ color: 'secondary.lighter' }}>アップロード</Typography>
                        </Stack>
                      </Box>
                    </FormLabel>
                    <TextField type="file" id="change-avtar" placeholder="Outlined" variant="outlined" sx={{ display: 'none' }} />
                  </Stack>
                </Grid>
                <Grid item xs={12} md={8}>
                  <Grid container spacing={3}>
                    <Grid item xs={6}>
                      <Stack spacing={1.25}>
                        <InputLabel htmlFor="customer-name">開始日</InputLabel>
                        <DatePicker value={birthday} onChange={(newValue) => setBirthday(newValue)} format="yyyy/MM/dd" />
                      </Stack>
                    </Grid>
                    <Grid item xs={6}>
                      <Stack spacing={1.25}>
                        <InputLabel htmlFor="customer-name">終了日</InputLabel>
                        <DatePicker value={birthday} onChange={(newValue) => setBirthday(newValue)} format="yyyy/MM/dd" />
                      </Stack>
                    </Grid>
                    <Grid item xs={12}>
                      <Stack spacing={1.25}>
                        <InputLabel htmlFor="customer-name">名前</InputLabel>
                        <TextField
                          fullWidth
                          id="customer-name"
                          placeholder="顧客の名前を入力"
                          {...getFieldProps('name')}
                          error={Boolean(touched.name && errors.name)}
                          helperText={touched.name && errors.name}
                        />
                      </Stack>
                    </Grid>
                    <Grid item xs={12}>
                      <Stack spacing={1.25}>
                        <InputLabel htmlFor="customer-location">業務内容</InputLabel>
                        <TextField
                          fullWidth
                          id="customer-location"
                          multiline
                          rows={20}
                          placeholder={message}
                          {...getFieldProps('location')}
                          error={Boolean(touched.location && errors.location)}
                          helperText={touched.location && errors.location}
                        />
                      </Stack>
                    </Grid>
                    <Grid item xs={12}>
                      <Stack spacing={1.25}>
                        <InputLabel htmlFor="customer-email">人数</InputLabel>
                        <TextField
                          fullWidth
                          id="customer-email"
                          placeholder="人数を入力"
                          {...getFieldProps('email')}
                          error={Boolean(touched.email && errors.email)}
                          helperText={touched.email && errors.email}
                        />
                      </Stack>
                    </Grid>
                    <Grid item xs={12}>
                      <Stack spacing={1.25}>
                        <InputLabel htmlFor="customer-orderStatus">役割</InputLabel>
                        <FormControl fullWidth>
                          <Select
                            id="column-hiding"
                            displayEmpty
                            {...getFieldProps('orderStatus')}
                            onChange={(event: SelectChangeEvent<string>) => setFieldValue('orderStatus', event.target.value as string)}
                            input={<OutlinedInput id="select-column-hiding" placeholder="ソート" />}
                            renderValue={(selected) => {
                              if (!selected) {
                                return <Typography variant="subtitle1">役割を選択</Typography>;
                              }

                              return <Typography variant="subtitle2">{selected}</Typography>;
                            }}
                          >
                            {role.map((column: any) => (
                              <MenuItem key={column} value={column}>
                                <ListItemText primary={column} />
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                        {touched.orderStatus && errors.orderStatus && (
                          <FormHelperText error id="standard-weight-helper-text-email-login" sx={{ pl: 1.75 }}>
                            {errors.orderStatus}
                          </FormHelperText>
                        )}
                      </Stack>
                    </Grid>

                    <Grid item xs={12}>
                      <Stack spacing={1.25}>
                        <InputLabel htmlFor="customer-orderStatus">スキル</InputLabel>
                        <Autocomplete
                          id="skills"
                          multiple
                          fullWidth
                          autoHighlight
                          freeSolo
                          disableCloseOnSelect
                          options={skills}
                          value={formik.values.skills}
                          onBlur={formik.handleBlur}
                          getOptionLabel={(option) => option}
                          onChange={(event, newValue) => {
                            const jobExist = skills.includes(newValue[newValue.length - 1]);
                            if (!jobExist) {
                              formik.setFieldValue('skills', newValue);
                            } else {
                              formik.setFieldValue('skills', newValue);
                            }
                          }}
                          filterOptions={(options, params) => {
                            const filtered = filterSkills(options, params);
                            const { inputValue } = params;
                            const isExisting = options.some((option) => inputValue === option);
                            if (inputValue !== '' && !isExisting) {
                              filtered.push(inputValue);
                            }

                            return filtered;
                          }}
                          renderOption={(props, option) => {
                            return (
                              <Box component="li" {...props}>
                                {!skills.some((v) => option.includes(v)) ? `Add "${option}"` : option}
                              </Box>
                            );
                          }}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              name="skills"
                              placeholder="使用したスキルを入力してください"
                              error={formik.touched.skills && Boolean(formik.errors.skills)}
                              helperText={TagsError}
                            />
                          )}
                          renderTags={(value, getTagProps) =>
                            value.map((option, index) => {
                              let error = false;
                              if (formik.touched.skills && formik.errors.skills && typeof formik.errors.skills !== 'string') {
                                if (typeof formik.errors.skills[index] === 'object') error = true;
                              }

                              return (
                                // eslint-disable-next-line react/jsx-key
                                <Chip
                                  {...getTagProps({ index })}
                                  variant="combined"
                                  color={error ? 'error' : 'secondary'}
                                  label={
                                    <Typography variant="caption" color="secondary.dark">
                                      {option}
                                    </Typography>
                                  }
                                  // eslint-disable-next-line react/jsx-no-undef
                                  deleteIcon={<CloseOutlined style={{ fontSize: '0.875rem' }} />}
                                  size="small"
                                />
                              );
                            })
                          }
                        />
                        <Stack
                          direction="row"
                          spacing={1}
                          alignItems="center"
                          sx={{ mt: 1.5, flexWrap: { xs: 'wrap', sm: 'inherit' }, gap: { xs: 1, sm: 0 } }}
                        >
                          <Typography variant="caption">候補:</Typography>
                          {candidate_skills
                            .filter(
                              (skill: string) => formik.values.skills && !formik.values.skills.map((item) => item).includes(skill as never)
                            )
                            .slice(0, 5)
                            .map((option, index) => (
                              <Chip
                                key={index}
                                variant="outlined"
                                onClick={() => formik.setFieldValue('skills', [...formik.values.skills, option])}
                                label={<Typography variant="caption">{option}</Typography>}
                                size="small"
                              />
                            ))}
                        </Stack>
                      </Stack>
                    </Grid>

                    <Grid item xs={12}>
                      <Stack spacing={1.25}>
                        <InputLabel htmlFor="customer-orderStatus">担当工程</InputLabel>
                        <Autocomplete
                          id="process"
                          multiple
                          fullWidth
                          autoHighlight
                          freeSolo
                          disableCloseOnSelect
                          options={process}
                          value={formik.values.process}
                          onBlur={formik.handleBlur}
                          getOptionLabel={(option) => option}
                          onChange={(event, newValue) => {
                            const jobExist = process.includes(newValue[newValue.length - 1]);
                            if (!jobExist) {
                              formik.setFieldValue('process', newValue);
                            } else {
                              formik.setFieldValue('process', newValue);
                            }
                          }}
                          filterOptions={(options, params) => {
                            const filtered = filterprocess(options, params);
                            const { inputValue } = params;
                            const isExisting = options.some((option) => inputValue === option);
                            if (inputValue !== '' && !isExisting) {
                              filtered.push(inputValue);
                            }

                            return filtered;
                          }}
                          renderOption={(props, option) => {
                            return (
                              <Box component="li" {...props}>
                                {!process.some((v) => option.includes(v)) ? `Add "${option}"` : option}
                              </Box>
                            );
                          }}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              name="process"
                              placeholder="担当した工程を入力してください"
                              error={formik.touched.process && Boolean(formik.errors.process)}
                              helperText={TagsError}
                            />
                          )}
                          renderTags={(value, getTagProps) =>
                            value.map((option, index) => {
                              let error = false;
                              if (formik.touched.process && formik.errors.process && typeof formik.errors.process !== 'string') {
                                if (typeof formik.errors.process[index] === 'object') error = true;
                              }

                              return (
                                // eslint-disable-next-line react/jsx-key
                                <Chip
                                  {...getTagProps({ index })}
                                  variant="combined"
                                  color={error ? 'error' : 'secondary'}
                                  label={
                                    <Typography variant="caption" color="secondary.dark">
                                      {option}
                                    </Typography>
                                  }
                                  // eslint-disable-next-line react/jsx-no-undef
                                  deleteIcon={<CloseOutlined style={{ fontSize: '0.875rem' }} />}
                                  size="small"
                                />
                              );
                            })
                          }
                        />
                        <Stack
                          direction="row"
                          spacing={1}
                          alignItems="center"
                          sx={{ mt: 1.5, flexWrap: { xs: 'wrap', sm: 'inherit' }, gap: { xs: 1, sm: 0 } }}
                        >
                          <Typography variant="caption">候補:</Typography>
                          {process
                            .filter(
                              (process: string) =>
                                formik.values.process && !formik.values.process.map((item) => item).includes(process as never)
                            )
                            .slice(0, 5)
                            .map((option, index) => (
                              <Chip
                                key={index}
                                variant="outlined"
                                onClick={() => formik.setFieldValue('process', [...formik.values.process, option])}
                                label={<Typography variant="caption">{option}</Typography>}
                                size="small"
                              />
                            ))}
                        </Stack>
                      </Stack>
                    </Grid>

                    <Grid item xs={12}>
                      <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                        <Stack spacing={0.5}>
                          <Typography variant="subtitle1">スキルシートに掲載する</Typography>
                        </Stack>
                        <FormControlLabel control={<Switch defaultChecked sx={{ mt: 0 }} />} label="" labelPlacement="start" />
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
                    <Tooltip title="顧客の削除" placement="top">
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
      {!isCreating && <AlertCustomerDelete title={customer.fatherName} open={openAlert} handleClose={handleAlertClose} />}
    </>
  );
};

export default AddCustomer;
