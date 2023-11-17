import { useEffect, useState } from 'react';

// material-ui
import {
  Box,
  Button,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControl,
  FormControlLabel,
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

import { dispatch } from 'store';
import { openSnackbar } from 'store/reducers/snackbar';

// assets
import { DeleteFilled } from '@ant-design/icons';

// material-ui
import { createFilterOptions, Autocomplete, Chip } from '@mui/material';

// assets
import { CloseOutlined } from '@ant-design/icons';
import { ProjectType } from 'types/project/project';
import { ParameterType, SkillParameterType, SkillArrayType, ProcessArrayType } from 'types/parameter/parameter';
// constant
const getInitialValues = (
  customer: FormikValues | null,
  projectSkills: SkillParameterType[] | undefined,
  projectProcess: ParameterType[] | undefined
) => {
  const newCustomer = {
    project_title: '',
    description: '',
    client: {
      id: 0,
      name: ''
    } as ParameterType | null,
    contract: {
      id: 0,
      name: ''
    } as ParameterType | null,
    working_start_time: '',
    working_end_time: '',
    working_postal_code: '',
    working_address: '',
    holiday: '',
    hp_posting_flag: false,
    skills: [
      {
        id: 0,
        name: '',
        technic: {
          id: 0,
          name: ''
        } as ParameterType | null,
        candidate_flag: false
      } as SkillParameterType | null
    ] as SkillParameterType[] | undefined,
    process: [
      {
        id: 0,
        name: ''
      } as ParameterType | null
    ] as ParameterType[] | undefined,
    role: '',
    price: 0
  };

  if (customer) {
    newCustomer.project_title = customer.project_title;
    newCustomer.description = customer.description;
    newCustomer.client = customer.client;
    newCustomer.contract = customer.contract;
    newCustomer.working_start_time = customer.working_start_time;
    newCustomer.working_end_time = customer.working_end_time;
    newCustomer.working_postal_code = customer.working_postal_code;
    newCustomer.working_address = customer.working_address;
    newCustomer.holiday = customer.holiday;
    newCustomer.hp_posting_flag = customer.hp_posting_flag;
    newCustomer.skills = projectSkills;
    newCustomer.process = projectProcess;
    newCustomer.role = customer.role;
    newCustomer.price = customer.price;
    return _.merge({}, newCustomer, customer);
  }

  return newCustomer;
};

const role = ['PG', 'L', 'PL', 'PM'];

const filterProcess = createFilterOptions<string>();
const filterSkills = createFilterOptions<string>();

// ==============================|| 顧客の追加/編集 ||============================== //

async function fetchAllData() {
  try {
    const response = await fetch('/api/db/project/update/select');
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

export interface Props {
  customer?: any;
  skillAll: Array<SkillParameterType>;
  contractAll: Array<ParameterType>;
  clientAll: Array<ParameterType>;
  processAll: Array<ParameterType>;
  onCancel: () => void;
  onReload: (data: Array<ProjectType>) => void;
}
const AddCustomer = ({ customer, skillAll, contractAll, clientAll, processAll, onCancel, onReload }: Props) => {
  const isCreating = !customer;

  const [projectSkills, setProjectSkills] = useState<Array<SkillParameterType>>();
  const [projectProcess, setProjectProcess] = useState<Array<ParameterType>>();
  const [loading, setLoading] = useState(true); // データの読み込み状態を管理

  useEffect(() => {
    // ページがロードされたときにデータを取得
    fetchAllData()
      .then((data) => {
        const skills = data.project_skills?.map((item: SkillArrayType) => item.skill);
        const process = data.project_process?.map((item: ProcessArrayType) => item.process);

        setProjectSkills(skills);
        setProjectProcess(process);
        setFieldValue('skills', skills);
        setFieldValue('process', process);
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
    project_title: Yup.string().max(255).required('プロジェクト名は必須です')
    // orderStatus: Yup.string().required('ステータスは必須です'),
    // location: Yup.string().max(500),
    // role: Yup.string()
    //   .trim()
    //   .required('役割の選択は必須です')
    //   .matches(/^[a-z\d\-/#_\s]+$/i, 'アルファベットと数字しか許可されていません')
    //   .max(50, '役割は最大50文字までです'),
    // skills: Yup.array()
    //   .of(
    //     Yup.string()
    //       .trim()
    //       .required('タグに先頭の空白があります')
    //       .matches(/^[a-z\d\-/#.&_\s]+$/i, 'アルファベットと数字しか許可されていません')
    //       .max(50, 'スキルタグは最大50文字までです')
    //   )
    //   .required('スキルの選択は必須です')
    //   // .min(3, 'スキルタグは少なくとも3つ必要です')
    //   .max(15, '最大で15個のスキルを選択してください'),
    // process: Yup.array()
    //   .of(
    //     Yup.string()
    //       .trim()
    //       .required('タグに先頭の空白があります')
    //       .matches(/^[a-z\d\-/#.&_\s]+$/i, 'アルファベットと数字しか許可されていません')
    //       .max(50, '担当工程タグは最大50文字までです')
    //   )
    //   .required('担当工程の選択は必須です')
    //   // .min(3, 'スキルタグは少なくとも3つ必要です')
    //   .max(15, '最大で15個の担当工程を選択してください')
  });

  const [openAlert, setOpenAlert] = useState(false);

  const handleAlertClose = () => {
    setOpenAlert(!openAlert);
    onCancel();
  };
  const formik = useFormik({
    initialValues: getInitialValues(customer!, projectSkills, projectProcess),
    validationSchema: CustomerSchema,
    onSubmit: (values, { setSubmitting }) => {
      try {
        const matchingSkills = skillAll?.filter((skillItem: SkillParameterType) => values.skills?.includes(skillItem));
        const skillIds = matchingSkills?.map((skillItem: SkillParameterType) => skillItem.id);

        const matchingProcess = processAll?.filter((processItem: ParameterType) => values.process?.includes(processItem));
        const processIds = matchingProcess?.map((processItem: ParameterType) => processItem.id);

        const newValues = { ...values, skills_id: skillIds, process_id: processIds };
        const requestOptions = {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json' // 必要に応じてヘッダーを調整
          },
          body: JSON.stringify(newValues) // valuesをJSON文字列に変換してbodyに設定
        };

        fetch(`/api/db/project/update`, requestOptions)
          .then((response) => {
            if (!response.ok) {
              throw new Error('更新に失敗しました。');
            }
            return response.json();
          })
          .then((data) => {
            onReload(data.data.rows);
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

        setSubmitting(false);
        onCancel();
      } catch (error) {
        console.error(error);
      }
    }
  });

  console.log('formik', formik);
  const { errors, touched, handleSubmit, isSubmitting, getFieldProps, setFieldValue } = formik;
  let TagsError: boolean | string | undefined = false;
  // if (formik.touched.skills && typeof formik.errors.skills) {
  //   // もし formik.errors.skills が文字列の場合
  //   if (formik.touched.skills && typeof formik.errors.skills === 'string') {
  //     TagsError = formik.errors.skills;
  //   } else {
  //     console.log(formik.errors.skills);
  //     // formik.errors.skills が文字列でない場合
  //     formik.errors.skills &&
  //       typeof formik.errors.skills !== 'string' &&
  //       formik.errors.skills?.map((item: any) => {
  //         // @ts-ignore
  //         // もし item がオブジェクトの場合、その label を TagsError に設定
  //         if (typeof item === 'object') TagsError = item.label;
  //         return item;
  //       });
  //   }
  // }

  const message = `■フロントエンド開発
  ユーザーインターフェース（UI）の設計と実装。HTML、CSS、JavaScriptを使用して、見栄えの良いウェブページを構築します。
  レスポンシブデザインを確保し、異なる画面サイズとデバイスでの適切な表示を保証します。
  フレームワーク（例: React、Angular、Vue.js）を使用して、動的なコンポーネントを開発し、ユーザーエクスペリエンスを向上させます。

  ■バックエンド開発

  サーバーサイドプログラムを設計・実装し、データベースとの通信を可能にします。主要なバックエンド言語（例: Node.js、Python、Ruby）を使用します。
  RESTful APIエンドポイントを設計し、データの受信と送信を管理します。セキュリティを確保し、APIエンドポイントを守ります。
  データベースの設計と管理。SQLデータベース（例: MySQL、PostgreSQL）やNoSQLデータベース（例: MongoDB）を使用します。`;

  if (loading) {
    return <div>待機中</div>;
  }

  return (
    <>
      <FormikProvider value={formik}>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
            <DialogTitle>{customer ? '編集' : '新規追加'}</DialogTitle>
            <Divider />
            <DialogContent sx={{ p: 2.5 }}>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <Grid container spacing={3}>
                    <Grid item xs={6}>
                      <Stack spacing={1.25}>
                        <InputLabel htmlFor="customer-working_start_time">掲載開始日</InputLabel>
                        <DatePicker format="yyyy/MM/dd" />
                      </Stack>
                    </Grid>
                    <Grid item xs={6}>
                      <Stack spacing={1.25}>
                        <InputLabel htmlFor="customer-working_end_time">掲載終了日</InputLabel>
                        <DatePicker format="yyyy/MM/dd" />
                      </Stack>
                    </Grid>
                    <Grid item xs={6}>
                      <Stack spacing={1.25}>
                        <InputLabel htmlFor="customer-working_start_time">就業開始時刻</InputLabel>
                        <TextField
                          id="time"
                          placeholder="Alarm Clock"
                          type="time"
                          InputLabelProps={{
                            shrink: true
                          }}
                          inputProps={{
                            step: 300 // 5 min
                          }}
                          sx={{ width: 150 }}
                          {...getFieldProps('working_start_time')}
                          onChange={(event: any) => setFieldValue('working_start_time', event.target.value as string)}
                        />
                      </Stack>
                    </Grid>
                    <Grid item xs={6}>
                      <Stack spacing={1.25}>
                        <InputLabel htmlFor="customer-working_end_time">就業終了時刻</InputLabel>
                        <TextField
                          id="time"
                          placeholder="Alarm Clock"
                          type="time"
                          InputLabelProps={{
                            shrink: true
                          }}
                          inputProps={{
                            step: 300 // 5 min
                          }}
                          sx={{ width: 150 }}
                          {...getFieldProps('working_end_time')}
                          onChange={(event: any) => setFieldValue('working_end_time', event.target.value as string)}
                        />
                      </Stack>
                    </Grid>
                    <Grid item xs={12}>
                      <Stack spacing={1.25}>
                        <InputLabel htmlFor="customer-client">プロジェクト名</InputLabel>
                        <TextField
                          fullWidth
                          id="customer-project_title"
                          placeholder="企業名を入力"
                          {...getFieldProps('project_title')}
                          error={Boolean(touched.project_title && errors.project_title)}
                          helperText={touched.project_title && errors.project_title}
                        />
                      </Stack>
                    </Grid>
                    <Grid item xs={12}>
                      <Stack spacing={1.25}>
                        <InputLabel htmlFor="customer-client">企業名</InputLabel>
                        <FormControl fullWidth>
                          <Select
                            id="column-hiding"
                            displayEmpty
                            {...getFieldProps('client')}
                            onChange={(event: SelectChangeEvent<string>) =>
                              setFieldValue(
                                'client',
                                clientAll?.find((item: ParameterType) => item.name === (event.target.value as string)) ?? null
                              )
                            }
                            input={<OutlinedInput id="select-column-hiding" placeholder="ソート" />}
                            renderValue={(selected: any) => {
                              if (!selected) {
                                return <Typography variant="subtitle1">企業を選択</Typography>;
                              }

                              return <Typography variant="subtitle2">{selected.name}</Typography>;
                            }}
                          >
                            {clientAll?.map((column: ParameterType) => (
                              <MenuItem key={column.id} value={column.name}>
                                <ListItemText primary={column.name} />
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                        {touched.client && errors.client && (
                          <FormHelperText error id="standard-weight-helper-text-email-login" sx={{ pl: 1.75 }}>
                            {errors.client}
                          </FormHelperText>
                        )}
                      </Stack>
                    </Grid>
                    <Grid item xs={12}>
                      <Stack spacing={1.25}>
                        <InputLabel htmlFor="customer-description">業務内容</InputLabel>
                        <TextField
                          fullWidth
                          id="customer-description"
                          multiline
                          rows={20}
                          placeholder={message}
                          {...getFieldProps('description')}
                          error={Boolean(touched.description && errors.description)}
                          helperText={touched.description && errors.description}
                        />
                      </Stack>
                    </Grid>
                    <Grid item xs={12}>
                      <Stack spacing={1.25}>
                        <InputLabel htmlFor="customer-contract">契約区分</InputLabel>
                        <FormControl fullWidth>
                          <Select
                            id="column-hiding"
                            displayEmpty
                            {...getFieldProps('contract')}
                            onChange={(event: SelectChangeEvent<string>) =>
                              setFieldValue(
                                'contract',
                                contractAll?.find((item: ParameterType) => item.name === (event.target.value as string)) ?? null
                              )
                            }
                            input={<OutlinedInput id="select-column-hiding" placeholder="ソート" />}
                            renderValue={(selected: any) => {
                              if (!selected) {
                                return <Typography variant="subtitle1">役割を選択</Typography>;
                              }

                              return <Typography variant="subtitle2">{selected.name}</Typography>;
                            }}
                          >
                            {contractAll?.map((column: ParameterType) => (
                              <MenuItem key={column.id} value={column.name}>
                                <ListItemText primary={column.name} />
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                        {touched.contract && errors.contract && (
                          <FormHelperText error id="standard-weight-helper-text-email-login" sx={{ pl: 1.75 }}>
                            {errors.contract}
                          </FormHelperText>
                        )}
                      </Stack>
                    </Grid>
                    <Grid item xs={12}>
                      <Stack spacing={1.25}>
                        <InputLabel htmlFor="customer-price">金額</InputLabel>
                        <TextField
                          fullWidth
                          id="customer-price"
                          placeholder="金額を入力"
                          {...getFieldProps('price')}
                          error={Boolean(touched.price && errors.price)}
                          helperText={touched.price && errors.price}
                        />
                      </Stack>
                    </Grid>
                    <Grid item xs={12}>
                      <Stack spacing={1.25}>
                        <InputLabel htmlFor="customer-working_postal_code">郵便番号</InputLabel>
                        <TextField
                          fullWidth
                          id="customer-working_postal_code"
                          {...getFieldProps('working_postal_code')}
                          error={Boolean(touched.working_postal_code && errors.working_postal_code)}
                          helperText={touched.working_postal_code && errors.working_postal_code}
                        />
                      </Stack>
                    </Grid>
                    <Grid item xs={12}>
                      <Stack spacing={1.25}>
                        <InputLabel htmlFor="customer-working_address">住所</InputLabel>
                        <TextField
                          fullWidth
                          id="customer-working_address"
                          {...getFieldProps('working_address')}
                          error={Boolean(touched.working_address && errors.working_address)}
                          helperText={touched.working_address && errors.working_address}
                        />
                      </Stack>
                    </Grid>
                    <Grid item xs={12}>
                      <Stack spacing={1.25}>
                        <InputLabel htmlFor="customer-holiday">休日</InputLabel>
                        <TextField
                          fullWidth
                          id="customer-holiday"
                          {...getFieldProps('holiday')}
                          error={Boolean(touched.holiday && errors.holiday)}
                          helperText={touched.holiday && errors.holiday}
                        />
                      </Stack>
                    </Grid>
                    <Grid item xs={12}>
                      <Stack spacing={1.25}>
                        <InputLabel htmlFor="customer-role">役割</InputLabel>
                        <FormControl fullWidth>
                          <Select
                            id="column-hiding"
                            displayEmpty
                            {...getFieldProps('role')}
                            onChange={(event: SelectChangeEvent<string>) => setFieldValue('role', event.target.value as string)}
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
                        {touched.role && errors.role && (
                          <FormHelperText error id="standard-weight-helper-text-email-login" sx={{ pl: 1.75 }}>
                            {errors.role}
                          </FormHelperText>
                        )}
                      </Stack>
                    </Grid>
                    {skillAll && (
                      <Grid item xs={12}>
                        <Stack spacing={1.25}>
                          <InputLabel>スキル</InputLabel>
                          <Autocomplete
                            id="skills"
                            multiple
                            fullWidth
                            autoHighlight
                            disableCloseOnSelect
                            options={skillAll}
                            {...getFieldProps('skills')}
                            onBlur={formik.handleBlur}
                            getOptionLabel={(option) => option}
                            onChange={(event, newValue) => {
                              setFieldValue('skills', newValue);
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
                                  {option.name}
                                </Box>
                              );
                            }}
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                name="skills"
                                placeholder="使用したスキルを選択してください"
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
                                        {option.name}
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
                            {skillAll
                              ?.filter((item) => {
                                return (
                                  item.candidate_flag && formik.values.skills && !formik.values.skills.some((skill) => skill.id === item.id)
                                );
                              })
                              ?.slice(0, 5)
                              .map((option, index) => (
                                <Chip
                                  key={index}
                                  variant="outlined"
                                  onClick={() => setFieldValue('skills', [...(formik.values.skills || []), option])}
                                  label={<Typography variant="caption">{option.name}</Typography>}
                                  size="small"
                                />
                              ))}
                          </Stack>
                        </Stack>
                      </Grid>
                    )}
                    {processAll && (
                      <Grid item xs={12}>
                        <Stack spacing={1.25}>
                          <InputLabel>担当工程</InputLabel>
                          <Autocomplete
                            id="process"
                            multiple
                            fullWidth
                            autoHighlight
                            disableCloseOnSelect
                            options={processAll}
                            {...getFieldProps('process')}
                            onBlur={formik.handleBlur}
                            getOptionLabel={(option) => option}
                            onChange={(event, newValue) => {
                              setFieldValue('process', newValue);
                            }}
                            filterOptions={(options, params) => {
                              const filtered = filterProcess(options, params);
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
                                  {option.name}
                                </Box>
                              );
                            }}
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                name="process"
                                placeholder="担当した工程を選択してください"
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
                                        {option.name}
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
                            {processAll
                              ?.filter((item) => {
                                return formik.values.process && !formik.values.process.some((process) => process.id === item.id);
                              })
                              ?.slice(0, 5)
                              .map((option, index) => (
                                <Chip
                                  key={index}
                                  variant="outlined"
                                  onClick={() => setFieldValue('process', [...(formik.values.process || []), option])}
                                  label={<Typography variant="caption">{option.name}</Typography>}
                                  size="small"
                                />
                              ))}
                          </Stack>
                        </Stack>
                      </Grid>
                    )}
                    <Grid item xs={12}>
                      <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                        <Stack spacing={0.5}>
                          <Typography variant="subtitle1">スキルシートに掲載する</Typography>
                        </Stack>
                        <FormControlLabel
                          control={<Switch {...getFieldProps('hp_posting_flag')} defaultChecked sx={{ mt: 0 }} />}
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
                    <Tooltip title="スキルの削除" placement="top">
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
