import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { PopupTransition } from 'components/@extended/Transitions';
// material-ui
import {
  Box,
  Button,
  Dialog,
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
import { PlusOutlined, DeleteFilled } from '@ant-design/icons';
import SkillAddCustomer from 'sections/apps/parameter/skill/AddCustomer';

// material-ui
import { createFilterOptions, Autocomplete, Chip } from '@mui/material';

// assets
import { SkillTableType, skill, processType, projectPositionType, clientType } from 'types/employee/skill-table';
import { ParameterType } from 'types/parameter/parameter';

// constant
const getInitialValues = (customer: FormikValues | null) => {
  const newCustomer = {
    id: null as number | null,
    start_date: null as Date | null,
    end_date: null as Date | null,
    project_title: '',
    client_name: ``,
    description: '',
    people_number: '',
    skills: [],
    process: [],
    project_position_name: ''
  };

  if (customer) {
    newCustomer.id = customer.id;
    newCustomer.start_date = customer.start_date;
    newCustomer.end_date = customer.end_date;
    newCustomer.project_title = customer.project_title;
    newCustomer.client_name = customer.client_name;
    newCustomer.description = customer.description;
    newCustomer.people_number = customer.people_number;
    newCustomer.skills = customer.skills || [];
    newCustomer.process = customer.process || [];
    newCustomer.project_position_name = customer.project_position_name;
    return _.merge({}, newCustomer, customer);
  }

  return newCustomer;
};

const filterprocess = createFilterOptions<string>();
const filterSkills = createFilterOptions<string>();

// ==============================|| 顧客の追加/編集 ||============================== //
export interface Props {
  customer?: any;
  onCancel: (status: boolean) => void;
  reloadDataAfterAdd: (data: SkillTableType[]) => void;
  candidate_skills: skill[];
  candidate_technics: ParameterType[];
  candidate_processes: processType[];
  candidate_roles: projectPositionType[];
  candidate_client: clientType[];
}

const AddCustomer = ({
  customer,
  onCancel,
  reloadDataAfterAdd,
  candidate_skills,
  candidate_technics,
  candidate_processes,
  candidate_roles,
  candidate_client
}: Props) => {
  const isCreating = !customer;
  const router = useRouter();
  const id = router.query.id as string;

  // candidate_flagがtrueのものだけ抽出
  const filteredSkills = candidate_skills.filter((skill) => skill.candidate_flag);
  const skills = candidate_skills.map((skill) => String(skill.name));
  const CandidateSkillList = filteredSkills.map((skill) => skill.name);

  const process = candidate_processes.map((process) => String(process.name));
  const role = candidate_roles.map((role) => String(role.name));
  const client = candidate_client.map((client) => String(client.name));

  const CustomerSchema = Yup.object().shape({
    project_title: Yup.string().max(255).required('プロジェクト名は必須です')
  });

  const [openAlert, setOpenAlert] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const handleAlertClose = () => {
    setOpenAlert(!openAlert);
    onCancel(false);
  };
  const [skillAdd, setSkillAdd] = useState<boolean>(false);

  const handleSkillAdd = () => {
    setSkillAdd(!skillAdd);
  };

  const skillReload = () => {
    alert('再取得処理を追加');
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
            <DialogTitle>{customer ? 'スキル情報の編集' : '新しいスキルの追加'}</DialogTitle>
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
                    <Grid item xs={12}>
                      <Stack spacing={1.25}>
                        <InputLabel htmlFor="customer-project_title">プロジェクト名</InputLabel>
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
                        <InputLabel htmlFor="customer-people_number">人数</InputLabel>
                        <TextField
                          fullWidth
                          id="customer-people_number"
                          placeholder="人数を入力"
                          {...getFieldProps('people_number')}
                          error={Boolean(touched.people_number && errors.people_number)}
                          helperText={touched.people_number && errors.people_number}
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
                            {...getFieldProps('project_position_name')}
                            onChange={(event: SelectChangeEvent<string>) =>
                              setFieldValue('project_position_name', event.target.value as string)
                            }
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
                        {touched.project_position_name && errors.project_position_name && (
                          <FormHelperText error id="standard-weight-helper-text-email-login" sx={{ pl: 1.75 }}>
                            {errors.project_position_name}
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
                      <Tooltip title="スキルを追加">
                        <IconButton shape="rounded" variant="contained" onClick={handleSkillAdd}>
                          <PlusOutlined />
                        </IconButton>
                      </Tooltip>
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
                            const exist = process.includes(newValue[newValue.length - 1]);
                            if (exist) {
                              setFieldValue('process', newValue);
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
                                {!process.some((v) => option.includes(v)) ? `絞り込み:「${option}」` : option}
                              </Box>
                            );
                          }}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              placeholder="担当した工程を入力してください"
                              error={formik.touched.process && Boolean(formik.errors.process)}
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
                                onClick={() => setFieldValue('process', [...formik.values.process, option])}
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
      <Dialog
        maxWidth="sm"
        TransitionComponent={PopupTransition}
        keepMounted
        onClose={handleSkillAdd}
        open={skillAdd}
        sx={{ '& .MuiDialog-paper': { p: 0 }, transition: 'transform 225ms' }}
        aria-describedby="alert-dialog-slide-description"
      >
        {skillAdd && (
          <SkillAddCustomer customer={customer} technicAll={candidate_technics} onCancel={handleSkillAdd} onReload={skillReload} />
        )}
      </Dialog>
      {!isCreating && (
        <AlertCustomerDelete
          title={customer.fatherName}
          open={openAlert}
          handleClose={handleAlertClose}
          reloadDataAfterDelete={(data: SkillTableType[]) => {}}
        />
      )}
    </>
  );
};

export default AddCustomer;
