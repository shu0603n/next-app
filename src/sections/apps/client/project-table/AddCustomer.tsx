import { useRouter } from 'next/router';
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
import { alertSnackBar } from 'function/alert/alertSnackBar';

// third-party
import _ from 'lodash';
import * as Yup from 'yup';
import { useFormik, Form, FormikProvider, FormikValues } from 'formik';

// project imports
import AlertCustomerDelete from './AlertCustomerDelete';
import IconButton from 'components/@extended/IconButton';

// assets
import { DeleteFilled } from '@ant-design/icons';

// material-ui
import { createFilterOptions, Autocomplete, Chip } from '@mui/material';

// assets
import { ProjectTableType, ClientType, EmployeeType, ContractType, SkillType, ProcessType } from 'types/client/project-table';

// constant
const getInitialValues = (customer: FormikValues | null) => {
  const newCustomer = {
    id: null as number | null,
    client_name: ``,
    start_date: null as Date | null,
    end_date: null as Date | null,
    working_start_time: '',
    working_end_time: '',
    project_title: '',
    description: '',
    people_number: '',
    working_postal_code: ``,
    fertilizer_type: ``,
    working_address: ``,
    holiday: ``,
    trial_period_duration: ``,
    training_schedule: ``,
    training_memo: ``,
    contract_period: ``,
    working_days_count: ``,
    working_days_list: ``,
    working_hours_per_day: ``,
    work_notes: ``,
    price_type: ``,
    price: ``,
    transportation_expenses: ``,
    overtime_hours: ``,
    welfare_programs: ``,
    work_environment_description: ``,
    dress_code: ``,
    gender_ratio: ``,
    environmental_notes: ``,
    special_notes: ``,
    hr_requirements: ``,
    gender_requirements: ``,
    age_requirements: ``,
    recruitment_count: ``,
    skills: [],
    processes: [],
    project_position_name: '',
    sei: ``,
    dispatch_source: ``,
    contract_name: ``
  };

  if (customer) {
    newCustomer.id = customer.id;
    newCustomer.client_name = customer.client_name;
    newCustomer.start_date = customer.start_date;
    newCustomer.end_date = customer.end_date;
    newCustomer.working_start_time = customer.working_start_time;
    newCustomer.working_end_time = customer.working_end_time;
    newCustomer.project_title = customer.project_title;
    newCustomer.description = customer.description;
    newCustomer.people_number = customer.people_number;
    newCustomer.working_postal_code = customer.working_postal_code;
    newCustomer.fertilizer_type = customer.fertilizer_type;
    newCustomer.working_address = customer.working_address;
    newCustomer.holiday = customer.holiday;
    newCustomer.trial_period_duration = customer.trial_period_duration;
    newCustomer.training_schedule = customer.training_schedule;
    newCustomer.training_memo = customer.training_memo;
    newCustomer.contract_period = customer.contract_period;
    newCustomer.working_days_count = customer.working_days_count;
    newCustomer.working_days_list = customer.working_days_list;
    newCustomer.working_hours_per_day = customer.working_hours_per_day;
    newCustomer.work_notes = customer.work_notes;
    newCustomer.price_type = customer.price_type;
    newCustomer.transportation_expenses = customer.transportation_expenses;
    newCustomer.overtime_hours = customer.overtime_hours;
    newCustomer.welfare_programs = customer.welfare_programs;
    newCustomer.work_environment_description = customer.work_environment_description;
    newCustomer.dress_code = customer.dress_code;
    newCustomer.gender_ratio = customer.gender_ratio;
    newCustomer.environmental_notes = customer.environmental_notes;
    newCustomer.price = customer.price;
    newCustomer.special_notes = customer.special_notes;
    newCustomer.hr_requirements = customer.hr_requirements;
    newCustomer.gender_requirements = customer.gender_requirements;
    newCustomer.age_requirements = customer.age_requirements;
    newCustomer.recruitment_count = customer.recruitment_count;
    newCustomer.skills = customer.skills || [];
    newCustomer.processes = customer.processes || [];
    newCustomer.project_position_name = customer.project_position_name;
    newCustomer.sei = customer.sei;
    newCustomer.dispatch_source = customer.dispatch_source;
    newCustomer.contract_name = customer.contract_name;
    return _.merge({}, newCustomer, customer);
  }

  return newCustomer;
};

const candidate_price = [
  { id: 1, name: '時給' },
  { id: 2, name: '単価' }
];

const filterprocess = createFilterOptions<string>();
const filterSkills = createFilterOptions<string>();

// ==============================|| 顧客の追加/編集 ||============================== //
export interface Props {
  customer?: any;
  onCancel: (status: boolean) => void;
  reloadDataAfterAdd: (data: ProjectTableType[]) => void;
  candidate_client: ClientType[];
  candidate_employee: EmployeeType[];
  candidate_contract: ContractType[];
  candidate_skills: SkillType[];
  candidate_processes: ProcessType[];
}

const AddCustomer = ({
  customer,
  onCancel,
  reloadDataAfterAdd,
  candidate_client,
  candidate_employee,
  candidate_contract,
  candidate_skills,
  candidate_processes
}: Props) => {
  const isCreating = !customer;
  const router = useRouter();
  const id = router.query.id as string;

  // candidate_flagがtrueのものだけ抽出
  const filteredSkills = candidate_skills.filter((skill) => skill.candidate_flag);
  const skills = candidate_skills.map((skill) => String(skill.name));
  const CandidateSkillList = filteredSkills.map((skill) => skill.name);

  const client = candidate_client.map((client) => String(client.client_name));
  const employee = candidate_employee.map((employee) => String(employee.sei));
  const contract = candidate_contract.map((contract) => String(contract.name));
  const processes = candidate_processes.map((processes) => String(processes.name));

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
  const [isEditing, setIsEditing] = useState(false);

  const handleAlertClose = () => {
    setOpenAlert(!openAlert);
    onCancel(false);
  };

  const formik = useFormik({
    initialValues: getInitialValues(customer!),
    validationSchema: CustomerSchema,
    onSubmit: (values, { setSubmitting }) => {
      try {
        if (customer) {
          alertSnackBar('処理中…', 'secondary');
          fetch(`/api/db/employee/project/update?id=${id}`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(values)
          })
            .then((response) => {
              if (!response.ok) {
                throw new Error('更新に失敗しました。');
              }
              return response.json();
            })
            .then((data) => {
              alertSnackBar('正常に更新されました。', 'success');
              reloadDataAfterAdd(data.data.rows);
              setIsEditing(false);
            })
            .catch((error) => {
              console.error('エラー:', error);
              alertSnackBar('データの更新に失敗しました。', 'error');
            })
            .finally(() => {
              onCancel(false);
            });
        } else {
          alertSnackBar('処理中…', 'secondary');
          fetch(`/api/db/employee/project/insert?id=${id}`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(values)
          })
            .then((response) => {
              if (!response.ok) {
                throw new Error('更新に失敗しました。');
              }
              return response.json();
            })
            .then((data) => {
              alertSnackBar('正常に追加されました。', 'success');
              reloadDataAfterAdd(data.data.rows);
              setIsEditing(false);
            })
            .catch((error) => {
              console.error('エラー:', error);
              alertSnackBar('データの追加に失敗しました。', 'error');
            })
            .finally(() => {
              setSubmitting(false);
              onCancel(false);
            });
        }
      } catch (error) {
        console.error(error);
      }
    }
  });

  useEffect(() => {
    if (isCreating) {
      // 新規作成時はフォームをリセットして初期値を設定
      formik.resetForm({ values: getInitialValues(null) });
    } else if (customer) {
      // 編集時はcustomerが変更された場合のみフォームの値を更新
      formik.setValues(getInitialValues(customer));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [customer, isCreating]);

  const { errors, touched, handleSubmit, getFieldProps, setFieldValue } = formik;
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

  const message = `
  ■フロントエンド開発
  ユーザーインターフェース（UI）の設計と実装。HTML、CSS、JavaScriptを使用して、見栄えの良いウェブページを構築します。
  レスポンシブデザインを確保し、異なる画面サイズとデバイスでの適切な表示を保証します。
  フレームワーク（例: React、Angular、Vue.js）を使用して、動的なコンポーネントを開発し、ユーザーエクスペリエンスを向上させます。

  ■バックエンド開発
  サーバーサイドプログラムを設計・実装し、データベースとの通信を可能にします。主要なバックエンド言語（例: Node.js、Python、Ruby）を使用します。
  RESTful APIエンドポイントを設計し、データの受信と送信を管理します。セキュリティを確保し、APIエンドポイントを守ります。
  データベースの設計と管理。SQLデータベース（例: MySQL、PostgreSQL）やNoSQLデータベース（例: MongoDB）を使用します。
  `;

  return (
    <>
      <FormikProvider value={formik}>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
            <DialogTitle>{customer ? '案件情報の編集' : '新しい案件の追加'}</DialogTitle>
            <Divider />
            <DialogContent sx={{ p: 2.5 }}>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <Grid container spacing={3}>
                    <Grid item xs={6}>
                      <Stack spacing={1.25}>
                        <InputLabel htmlFor="customer-name">開始日</InputLabel>
                        <DatePicker
                          format="yyyy/MM/dd"
                          value={getFieldProps('start_date').value ? new Date(getFieldProps('start_date').value) : null}
                          onChange={(newValue) => setFieldValue('start_date', newValue)}
                        />
                      </Stack>
                    </Grid>
                    <Grid item xs={6}>
                      <Stack spacing={1.25}>
                        <InputLabel htmlFor="customer-name">終了日</InputLabel>
                        <DatePicker
                          format="yyyy/MM/dd"
                          value={getFieldProps('end_date').value ? new Date(getFieldProps('end_date').value) : null}
                          onChange={(newValue) => setFieldValue('end_date', newValue)}
                        />
                      </Stack>
                    </Grid>
                    <Grid item xs={6}>
                      <Stack spacing={1.25}>
                        <InputLabel>就業開始時刻</InputLabel>
                        <TextField
                          id="working_start_time"
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
                        <InputLabel>就業終了時刻</InputLabel>
                        <TextField
                          id="working_end_time"
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
                        <InputLabel htmlFor="customer-project_title">プロジェクト名</InputLabel>
                        <TextField
                          fullWidth
                          id="customer-project_title"
                          placeholder="プロジェクト名を入力"
                          {...getFieldProps('project_title')}
                          error={Boolean(touched.project_title && errors.project_title)}
                          helperText={touched.project_title && errors.project_title}
                        />
                      </Stack>
                    </Grid>
                    <Grid item xs={6}>
                      <Stack spacing={1.25}>
                        <InputLabel htmlFor="customer-client">企業名</InputLabel>
                        <FormControl fullWidth>
                          <Select
                            id="column-hiding"
                            displayEmpty
                            {...getFieldProps('client_name')}
                            onChange={(event: SelectChangeEvent<string>) => setFieldValue('client_name', event.target.value as string)}
                            input={<OutlinedInput id="select-column-hiding" placeholder="ソート" />}
                            renderValue={(selected) => {
                              if (!selected) {
                                return <Typography variant="subtitle1">企業を選択</Typography>;
                              }

                              return <Typography variant="subtitle2">{selected}</Typography>;
                            }}
                          >
                            {client.map((column: any) => (
                              <MenuItem key={column} value={column}>
                                <ListItemText primary={column} />
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                        {touched.client_name && errors.client_name && (
                          <FormHelperText error id="standard-weight-helper-text-email-login" sx={{ pl: 1.75 }}>
                            {errors.client_name}
                          </FormHelperText>
                        )}
                      </Stack>
                    </Grid>
                    <Grid item xs={6}>
                      <Stack spacing={1.25}>
                        <InputLabel htmlFor="customer-employee">担当者</InputLabel>
                        <FormControl fullWidth>
                          <Select
                            id="column-hiding"
                            displayEmpty
                            {...getFieldProps('sei')}
                            onChange={(event: SelectChangeEvent<string>) => setFieldValue('sei', event.target.value as string)}
                            input={<OutlinedInput id="select-column-hiding" placeholder="ソート" />}
                            renderValue={(selected) => {
                              if (!selected) {
                                return <Typography variant="subtitle1">担当者を選択</Typography>;
                              }

                              return <Typography variant="subtitle2">{selected}</Typography>;
                            }}
                          >
                            {employee.map((column: any) => (
                              <MenuItem key={column} value={column}>
                                <ListItemText primary={column} />
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                        {touched.sei && errors.sei && (
                          <FormHelperText error id="standard-weight-helper-text-email-login" sx={{ pl: 1.75 }}>
                            {errors.sei}
                          </FormHelperText>
                        )}
                      </Stack>
                    </Grid>
                    <Grid item xs={6}>
                      <Stack spacing={1.25}>
                        <InputLabel>派遣元</InputLabel>
                        <TextField
                          fullWidth
                          id="dispatch_source"
                          {...getFieldProps('dispatch_source')}
                          error={Boolean(touched.dispatch_source && errors.dispatch_source)}
                          helperText={touched.dispatch_source && errors.dispatch_source}
                        />
                      </Stack>
                    </Grid>
                    <Grid item xs={6}>
                      <Stack spacing={1.25}>
                        <InputLabel htmlFor="customer-contract">契約区分</InputLabel>
                        <FormControl fullWidth>
                          <Select
                            id="column-hiding"
                            displayEmpty
                            {...getFieldProps('contract_name')}
                            onChange={(event: SelectChangeEvent<string>) => setFieldValue('contract_name', event.target.value as string)}
                            input={<OutlinedInput id="select-column-hiding" placeholder="ソート" />}
                            renderValue={(selected) => {
                              if (!selected) {
                                return <Typography variant="subtitle1">役割を選択</Typography>;
                              }

                              return <Typography variant="subtitle2">{selected}</Typography>;
                            }}
                          >
                            {contract.map((column: any) => (
                              <MenuItem key={column} value={column}>
                                <ListItemText primary={column} />
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                        {touched.contract_name && errors.contract_name && (
                          <FormHelperText error id="standard-weight-helper-text-email-login" sx={{ pl: 1.75 }}>
                            {errors.contract_name}
                          </FormHelperText>
                        )}
                      </Stack>
                    </Grid>
                    <Grid item xs={6}>
                      <Stack spacing={1.25}>
                        <InputLabel>郵便番号</InputLabel>
                        <TextField
                          fullWidth
                          id="working_postal_code"
                          {...getFieldProps('working_postal_code')}
                          error={Boolean(touched.working_postal_code && errors.working_postal_code)}
                          helperText={touched.working_postal_code && errors.working_postal_code}
                        />
                      </Stack>
                    </Grid>
                    <Grid item xs={6}>
                      <Stack spacing={1.25}>
                        <InputLabel>最寄り駅</InputLabel>
                        <TextField
                          fullWidth
                          id="fertilizer_type"
                          {...getFieldProps('fertilizer_type')}
                          error={Boolean(touched.fertilizer_type && errors.fertilizer_type)}
                          helperText={touched.fertilizer_type && errors.fertilizer_type}
                        />
                      </Stack>
                    </Grid>
                    <Grid item xs={12}>
                      <Stack spacing={1.25}>
                        <InputLabel>住所</InputLabel>
                        <TextField
                          fullWidth
                          id="working_address"
                          {...getFieldProps('working_address')}
                          error={Boolean(touched.working_address && errors.working_address)}
                          helperText={touched.working_address && errors.working_address}
                        />
                      </Stack>
                    </Grid>
                    <Grid item xs={6}>
                      <Stack spacing={1.25}>
                        <InputLabel>休日</InputLabel>
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
                    <Grid item xs={6}>
                      <Stack spacing={1.25}>
                        <InputLabel>研修日程</InputLabel>
                        <TextField
                          fullWidth
                          id="training_schedule"
                          {...getFieldProps('training_schedule')}
                          error={Boolean(touched.training_schedule && errors.training_schedule)}
                          helperText={touched.training_schedule && errors.training_schedule}
                        />
                      </Stack>
                    </Grid>
                    <Grid item xs={6}>
                      <Stack spacing={1.25}>
                        <InputLabel>試用期間</InputLabel>
                        <TextField
                          fullWidth
                          id="trial_period_duration"
                          {...getFieldProps('trial_period_duration')}
                          error={Boolean(touched.trial_period_duration && errors.trial_period_duration)}
                          helperText={touched.trial_period_duration && errors.trial_period_duration}
                        />
                      </Stack>
                    </Grid>
                    <Grid item xs={12}>
                      <Stack spacing={1.25}>
                        <InputLabel>研修備考</InputLabel>
                        <TextField
                          fullWidth
                          id="training_memo"
                          {...getFieldProps('training_memo')}
                          error={Boolean(touched.training_memo && errors.training_memo)}
                          helperText={touched.training_memo && errors.training_memo}
                        />
                      </Stack>
                    </Grid>
                    <Grid item xs={6}>
                      <Stack spacing={1.25}>
                        <InputLabel>就業期間</InputLabel>
                        <TextField
                          fullWidth
                          id="contract_period"
                          {...getFieldProps('contract_period')}
                          error={Boolean(touched.contract_period && errors.contract_period)}
                          helperText={touched.contract_period && errors.contract_period}
                        />
                      </Stack>
                    </Grid>
                    <Grid item xs={6}>
                      <Stack spacing={1.25}>
                        <InputLabel>勤務日数</InputLabel>
                        <TextField
                          fullWidth
                          id="working_days_count"
                          {...getFieldProps('working_days_count')}
                          error={Boolean(touched.working_days_count && errors.working_days_count)}
                          helperText={touched.working_days_count && errors.working_days_count}
                        />
                      </Stack>
                    </Grid>
                    <Grid item xs={6}>
                      <Stack spacing={1.25}>
                        <InputLabel>勤務曜日</InputLabel>
                        <TextField
                          fullWidth
                          id="working_days_list"
                          {...getFieldProps('working_days_list')}
                          error={Boolean(touched.working_days_list && errors.working_days_list)}
                          helperText={touched.working_days_list && errors.working_days_list}
                        />
                      </Stack>
                    </Grid>
                    <Grid item xs={6}>
                      <Stack spacing={1.25}>
                        <InputLabel>勤務時間</InputLabel>
                        <TextField
                          fullWidth
                          id="working_hours_per_day"
                          {...getFieldProps('working_hours_per_day')}
                          error={Boolean(touched.working_hours_per_day && errors.working_hours_per_day)}
                          helperText={touched.working_hours_per_day && errors.working_hours_per_day}
                        />
                      </Stack>
                    </Grid>
                    <Grid item xs={12}>
                      <Stack spacing={1.25}>
                        <InputLabel>勤務備考</InputLabel>
                        <TextField
                          fullWidth
                          id="work_notes"
                          {...getFieldProps('work_notes')}
                          error={Boolean(touched.work_notes && errors.work_notes)}
                          helperText={touched.work_notes && errors.work_notes}
                        />
                      </Stack>
                    </Grid>

                    <Grid item xs={6}>
                      <Stack spacing={1.25}>
                        <InputLabel htmlFor="customer-price_type">計算方法</InputLabel>
                        <FormControl fullWidth>
                          <Select
                            id="column-hiding"
                            displayEmpty
                            {...getFieldProps('price_type')}
                            onChange={(event: SelectChangeEvent<string>) => setFieldValue('price_type', event.target.value as string)}
                            input={<OutlinedInput id="select-column-hiding" placeholder="ソート" />}
                            renderValue={(selected) => {
                              if (!selected) {
                                return <Typography variant="subtitle1">計算方法を選択</Typography>;
                              }

                              return <Typography variant="subtitle2">{selected}</Typography>;
                            }}
                          >
                            {candidate_price.map((column: any) => (
                              <MenuItem key={column.id} value={column.name}>
                                <ListItemText primary={column.name} />
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                        {touched.client_name && errors.client_name && (
                          <FormHelperText error id="standard-weight-helper-text-email-login" sx={{ pl: 1.75 }}>
                            {errors.client_name}
                          </FormHelperText>
                        )}
                      </Stack>
                    </Grid>

                    <Grid item xs={6}>
                      <Stack spacing={1.25}>
                        <InputLabel>金額</InputLabel>
                        <TextField
                          fullWidth
                          id="price"
                          type="number"
                          placeholder="金額を入力"
                          {...getFieldProps('price')}
                          error={Boolean(touched.price && errors.price)}
                          helperText={touched.price && errors.price}
                        />
                      </Stack>
                    </Grid>
                    <Grid item xs={6}>
                      <Stack spacing={1.25}>
                        <InputLabel>交通費</InputLabel>
                        <TextField
                          fullWidth
                          id="transportation_expenses"
                          {...getFieldProps('transportation_expenses')}
                          error={Boolean(touched.transportation_expenses && errors.transportation_expenses)}
                          helperText={touched.transportation_expenses && errors.transportation_expenses}
                        />
                      </Stack>
                    </Grid>
                    <Grid item xs={6}>
                      <Stack spacing={1.25}>
                        <InputLabel>時間外労働</InputLabel>
                        <TextField
                          fullWidth
                          id="overtime_hours"
                          {...getFieldProps('overtime_hours')}
                          error={Boolean(touched.overtime_hours && errors.overtime_hours)}
                          helperText={touched.overtime_hours && errors.overtime_hours}
                        />
                      </Stack>
                    </Grid>
                    <Grid item xs={6}>
                      <Stack spacing={1.25}>
                        <InputLabel>福利厚生</InputLabel>
                        <TextField
                          fullWidth
                          id="welfare_programs"
                          {...getFieldProps('welfare_programs')}
                          error={Boolean(touched.welfare_programs && errors.welfare_programs)}
                          helperText={touched.welfare_programs && errors.welfare_programs}
                        />
                      </Stack>
                    </Grid>
                    <Grid item xs={6}>
                      <Stack spacing={1.25}>
                        <InputLabel>職場環境</InputLabel>
                        <TextField
                          fullWidth
                          id="work_environment_description"
                          {...getFieldProps('work_environment_description')}
                          error={Boolean(touched.work_environment_description && errors.work_environment_description)}
                          helperText={touched.work_environment_description && errors.work_environment_description}
                        />
                      </Stack>
                    </Grid>
                    <Grid item xs={6}>
                      <Stack spacing={1.25}>
                        <InputLabel>服装</InputLabel>
                        <TextField
                          fullWidth
                          id="dress_code"
                          {...getFieldProps('dress_code')}
                          error={Boolean(touched.dress_code && errors.dress_code)}
                          helperText={touched.dress_code && errors.dress_code}
                        />
                      </Stack>
                    </Grid>
                    <Grid item xs={6}>
                      <Stack spacing={1.25}>
                        <InputLabel>男女比</InputLabel>
                        <TextField
                          fullWidth
                          id="gender_ratio"
                          {...getFieldProps('gender_ratio')}
                          error={Boolean(touched.gender_ratio && errors.gender_ratio)}
                          helperText={touched.gender_ratio && errors.gender_ratio}
                        />
                      </Stack>
                    </Grid>
                    <Grid item xs={12}>
                      <Stack spacing={1.25}>
                        <InputLabel>環境備考</InputLabel>
                        <TextField
                          fullWidth
                          id="environmental_notes"
                          {...getFieldProps('environmental_notes')}
                          error={Boolean(touched.environmental_notes && errors.environmental_notes)}
                          helperText={touched.environmental_notes && errors.environmental_notes}
                        />
                      </Stack>
                    </Grid>
                    <Grid item xs={12}>
                      <Stack spacing={1.25}>
                        <InputLabel>特記事項</InputLabel>
                        <TextField
                          fullWidth
                          id="special_notes"
                          {...getFieldProps('special_notes')}
                          error={Boolean(touched.special_notes && errors.special_notes)}
                          helperText={touched.special_notes && errors.special_notes}
                        />
                      </Stack>
                    </Grid>
                    <Grid item xs={6}>
                      <Stack spacing={1.25}>
                        <InputLabel>人材要件</InputLabel>
                        <TextField
                          fullWidth
                          id="hr_requirements"
                          {...getFieldProps('hr_requirements')}
                          error={Boolean(touched.hr_requirements && errors.hr_requirements)}
                          helperText={touched.hr_requirements && errors.hr_requirements}
                        />
                      </Stack>
                    </Grid>
                    <Grid item xs={6}>
                      <Stack spacing={1.25}>
                        <InputLabel>男女</InputLabel>
                        <TextField
                          fullWidth
                          id="gender_requirements"
                          {...getFieldProps('gender_requirements')}
                          error={Boolean(touched.gender_requirements && errors.gender_requirements)}
                          helperText={touched.gender_requirements && errors.gender_requirements}
                        />
                      </Stack>
                    </Grid>
                    <Grid item xs={6}>
                      <Stack spacing={1.25}>
                        <InputLabel>年齢</InputLabel>
                        <TextField
                          fullWidth
                          id="age_requirements"
                          {...getFieldProps('age_requirements')}
                          error={Boolean(touched.age_requirements && errors.age_requirements)}
                          helperText={touched.age_requirements && errors.age_requirements}
                        />
                      </Stack>
                    </Grid>
                    <Grid item xs={6}>
                      <Stack spacing={1.25}>
                        <InputLabel>募集人数</InputLabel>
                        <TextField
                          fullWidth
                          id="recruitment_count"
                          {...getFieldProps('recruitment_count')}
                          error={Boolean(touched.recruitment_count && errors.recruitment_count)}
                          helperText={touched.recruitment_count && errors.recruitment_count}
                        />
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
                            const exist = skills.includes(newValue[newValue.length - 1]);
                            if (exist) {
                              setFieldValue('skills', newValue);
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
                                {!skills.some((v) => option.includes(v)) ? `絞り込み:「${option}」` : option}
                              </Box>
                            );
                          }}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              placeholder="使用したスキルを入力してください"
                              error={formik.touched.skills && Boolean(formik.errors.skills)}
                              helperText={TagsError}
                            />
                          )}
                        />
                        <Stack
                          direction="row"
                          spacing={1}
                          alignItems="center"
                          sx={{ mt: 1.5, flexWrap: { xs: 'wrap', sm: 'inherit' }, gap: { xs: 1, sm: 0 } }}
                        >
                          <Typography variant="caption">候補:</Typography>
                          {CandidateSkillList.map((option, index) => (
                            <Chip
                              key={index}
                              variant="outlined"
                              onClick={() => setFieldValue('skills', [...formik.values.skills, option])}
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
                          id="processes"
                          multiple
                          fullWidth
                          autoHighlight
                          freeSolo
                          disableCloseOnSelect
                          options={processes}
                          value={formik.values.processes}
                          onBlur={formik.handleBlur}
                          getOptionLabel={(option) => option}
                          onChange={(event, newValue) => {
                            const exist = processes.includes(newValue[newValue.length - 1]);
                            if (exist) {
                              setFieldValue('processes', newValue);
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
                                {!processes.some((v) => option.includes(v)) ? `絞り込み:「${option}」` : option}
                              </Box>
                            );
                          }}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              placeholder="担当した工程を入力してください"
                              error={formik.touched.processes && Boolean(formik.errors.processes)}
                              helperText={TagsError}
                            />
                          )}
                        />
                        <Stack
                          direction="row"
                          spacing={1}
                          alignItems="center"
                          sx={{ mt: 1.5, flexWrap: { xs: 'wrap', sm: 'inherit' }, gap: { xs: 1, sm: 0 } }}
                        >
                          <Typography variant="caption">候補:</Typography>
                          {processes
                            .filter(
                              (processes: string) =>
                                formik.values.processes && !formik.values.processes.map((item) => item).includes(processes as never)
                            )
                            .slice(0, 5)
                            .map((option, index) => (
                              <Chip
                                key={index}
                                variant="outlined"
                                onClick={() => setFieldValue('processes', [...formik.values.processes, option])}
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
                    <Tooltip title="スキルの削除" placement="top">
                      <IconButton onClick={() => setOpenAlert(true)} size="large" color="error">
                        <DeleteFilled />
                      </IconButton>
                    </Tooltip>
                  )}
                </Grid>
                <Grid item>
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Button color="error" onClick={() => onCancel(false)}>
                      キャンセル
                    </Button>
                    <Button type="submit" variant="contained" disabled={isEditing}>
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
          title={customer.fatherName}
          open={openAlert}
          handleClose={handleAlertClose}
          reloadDataAfterDelete={(data: ProjectTableType[]) => {}}
        />
      )}
    </>
  );
};

export default AddCustomer;
