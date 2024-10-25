import { useEffect, useMemo, useState, Fragment, MouseEvent, ReactElement, useId } from 'react';
import { alpha, useTheme } from '@mui/material/styles';
import { Button, Dialog, Stack, Table, TableBody, TableCell, TableHead, TableRow, Tooltip, Typography, useMediaQuery } from '@mui/material';
import { PopupTransition } from 'components/@extended/Transitions';
import { ProjectDataList } from '../types/project/project';
import {
  useFilters,
  useExpanded,
  useGlobalFilter,
  useRowSelect,
  useSortBy,
  useTable,
  usePagination,
  Column,
  HeaderGroup,
  Row,
  Cell
} from 'react-table';
import Layout from 'layout';
import Page from 'components/Page';
import MainCard from 'components/MainCard';
import ScrollX from 'components/ScrollX';
import IconButton from 'components/@extended/IconButton';
import { CSVExport, HeaderSort, SortingSelect, TablePagination } from 'components/third-party/ReactTable';
import AddCustomer from 'sections/apps/project/AddCustomer';
import AlertCustomerDelete from 'sections/apps/project/AlertCustomerDelete';
import { renderFilterTypes, GlobalFilter } from 'utils/react-table';
import { EditTwoTone, PlusOutlined, DeleteTwoTone } from '@ant-design/icons';
import { ProjectType } from 'types/project/project';
import Loader from 'components/Loader';

// ==============================|| REACT TABLE ||============================== //

interface Props {
  columns: Column[];
  data: Array<ProjectType>;
  handleAdd: () => void;
  getHeaderProps: (column: HeaderGroup) => {};
}

function formatDateString(originalDateString: string, targetFormat: string) {
  const originalDate = new Date(originalDateString);

  const year = originalDate.getFullYear();
  const month = (originalDate.getMonth() + 1).toString().padStart(2, '0');
  const day = originalDate.getDate().toString().padStart(2, '0');

  let formattedDate = targetFormat.replace('yyyy', year.toString());
  formattedDate = formattedDate.replace('MM', month);
  formattedDate = formattedDate.replace('DD', day);

  return formattedDate;
}

function ReactTable({ columns, data, handleAdd, getHeaderProps }: Props) {
  const theme = useTheme();
  const matchDownSM = useMediaQuery(theme.breakpoints.down('sm'));

  const filterTypes = useMemo(() => renderFilterTypes, []);
  const sortBy = { id: 'id', desc: false };

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    setHiddenColumns,
    allColumns,
    rows,
    page,
    gotoPage,
    setPageSize,
    state: { globalFilter, pageIndex, pageSize },
    preGlobalFilteredRows,
    setGlobalFilter,
    setSortBy,
    selectedFlatRows
  } = useTable(
    {
      columns,
      data,
      filterTypes,
      initialState: { pageIndex: 0, pageSize: 10, hiddenColumns: ['avatar', 'email'], sortBy: [sortBy] }
    },
    useGlobalFilter,
    useFilters,
    useSortBy,
    useExpanded,
    usePagination,
    useRowSelect
  );

  useEffect(() => {
    if (matchDownSM) {
      setHiddenColumns([
        'id',
        'description',
        // 'start_date',
        'end_date',
        'client',
        'working_start_time',
        'working_end_time',
        'contract',
        'working_postal_code',
        'working_address',
        'holiday',
        'hp_posting_flag',
        'price',
        // 'employee',
        'dispatch_source',
        'fertilizer_type',
        'training_schedule',
        'trial_period_duration',
        'training_memo',
        'contract_period',
        'working_days_count',
        'working_days_list',
        'working_hours_per_day',
        'work_notes',
        'price_type',
        'transportation_expenses',
        'overtime_hours',
        'welfare_programs',
        'work_environment_description',
        'dress_code',
        'gender_ratio',
        'environmental_notes',
        'special_notes',
        'hr_requirements',
        'gender_requirements',
        'age_requirements',
        'recruitment_count'
      ]);
    } else {
      setHiddenColumns([
        'id',
        'description',
        // 'start_date',
        'end_date',
        'client',
        'working_start_time',
        'working_end_time',
        'contract',
        'working_postal_code',
        // 'working_address',
        'holiday',
        'hp_posting_flag',
        'price',
        // 'employee',
        'dispatch_source',
        'fertilizer_type',
        'training_schedule',
        'trial_period_duration',
        'training_memo',
        'contract_period',
        'working_days_count',
        'working_days_list',
        'working_hours_per_day',
        'work_notes',
        'price_type',
        'transportation_expenses',
        'overtime_hours',
        'welfare_programs',
        'work_environment_description',
        'dress_code',
        'gender_ratio',
        'environmental_notes',
        'special_notes',
        'hr_requirements',
        'gender_requirements',
        'age_requirements',
        'recruitment_count'
      ]);
    }
    // eslint-disable-next-line
  }, [matchDownSM]);

  return (
    <>
      <Stack spacing={3}>
        <Stack
          direction={matchDownSM ? 'column' : 'row'}
          spacing={1}
          justifyContent="space-between"
          alignItems="center"
          sx={{ p: 3, pb: 0 }}
        >
          <GlobalFilter
            preGlobalFilteredRows={preGlobalFilteredRows}
            globalFilter={globalFilter}
            setGlobalFilter={setGlobalFilter}
            size="small"
          />
          <Stack direction={matchDownSM ? 'column' : 'row'} alignItems="center" spacing={1}>
            <SortingSelect sortBy={sortBy.id} setSortBy={setSortBy} allColumns={allColumns} />
            <Button variant="contained" startIcon={<PlusOutlined />} onClick={handleAdd} size="small">
              追加
            </Button>
            <CSVExport
              data={selectedFlatRows.length > 0 ? selectedFlatRows.map((d: Row) => d.original) : data}
              filename={'customer-list.csv'}
            />
          </Stack>
        </Stack>
        <Table {...getTableProps()}>
          <TableHead>
            {headerGroups.map((headerGroup: HeaderGroup<{}>, index: number) => (
              <TableRow {...headerGroup.getHeaderGroupProps()} key={index} sx={{ '& > th:first-of-type': { width: '58px' } }}>
                {headerGroup.headers.map((column: HeaderGroup, i: number) => (
                  <TableCell {...column.getHeaderProps([{ className: column.className }, getHeaderProps(column)])} key={i}>
                    <HeaderSort column={column} />
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableHead>
          <TableBody {...getTableBodyProps()}>
            {page.map((row: Row, i: number) => {
              prepareRow(row);

              return (
                <Fragment key={i}>
                  <TableRow
                    {...row.getRowProps()}
                    onClick={() => {
                      row.toggleRowSelected();
                    }}
                    sx={{ cursor: 'pointer', bgcolor: row.isSelected ? alpha(theme.palette.primary.lighter, 0.35) : 'inherit' }}
                  >
                    {row.cells.map((cell: Cell, i: number) => (
                      <TableCell {...cell.getCellProps([{ className: cell.column.className }])} key={i}>
                        {/* 特定の列のIDが 'client' または 'contract' の場合、'name' プロパティを表示 */}
                        {cell.column.id === 'client' &&
                          'client' in cell.row.original &&
                          (cell.row.original.client as { name: string })?.name}
                        {cell.column.id === 'contract' &&
                          'contract' in cell.row.original &&
                          (cell.row.original.contract as { name: string })?.name}
                        {!(cell.column.id === 'client' || cell.column.id === 'contract') && cell.render('Cell')}
                      </TableCell>
                    ))}
                  </TableRow>
                </Fragment>
              );
            })}
            <TableRow sx={{ '&:hover': { bgcolor: 'transparent !important' } }}>
              <TableCell sx={{ p: 2, py: 3 }} colSpan={9} key={useId()}>
                <TablePagination gotoPage={gotoPage} rows={rows} setPageSize={setPageSize} pageSize={pageSize} pageIndex={pageIndex} />
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </Stack>
    </>
  );
}

// ==============================|| CUSTOMER - LIST ||============================== //
async function fetchTableData() {
  try {
    const response = await fetch('/api/db/project/select');
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

const CustomerProjectPage = () => {
  const theme = useTheme();

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const [tableData, setTableData] = useState<ProjectDataList>(); // データを保持する状態変数
  const [projectData, setProjectData] = useState<Array<ProjectType>>(); // データを保持する状態変数
  const [loading, setLoading] = useState(true); // データの読み込み状態を管理

  useEffect(() => {
    // ページがロードされたときにデータを取得
    fetchTableData()
      .then((data) => {
        setTableData(data); // データを状態に設定
        setProjectData(data.project);
        setLoading(false);
      })
      .catch((error) => {
        // エラーハンドリング
        console.error('Error:', error);
      });
  }, []); // 空の依存リストを指定することで、一度だけ実行される

  const [open, setOpen] = useState<boolean>(false);
  const [customer, setCustomer] = useState<any>(null);
  const [customerDeleteId, setCustomerDeleteId] = useState<any>('');
  const [customerDeleteTitle, setCustomerDeleteTitle] = useState<any>('');
  const [add, setAdd] = useState<boolean>(false);

  const handleAdd = () => {
    setAdd(!add);
    if (customer && !add) setCustomer(null);
  };

  const handleClose = () => {
    setOpen(!open);
  };

  const columns = useMemo(
    () => [
      {
        Header: 'ID',
        accessor: 'id',
        className: 'cell-center'
      },
      {
        Header: '掲載開始日',
        accessor: 'start_date',
        className: 'cell-center',
        Cell: ({ row }: { row: Row }) => {
          const { values } = row;
          return (
            <Stack direction="row" spacing={1.5} alignItems="center">
              <Stack spacing={0}>
                {values.start_date && (
                  <>
                    <Typography variant="subtitle2">
                      {values.start_date ? formatDateString(values.start_date, 'yyyy/MM/DD') : ''}
                    </Typography>
                    <Typography variant="subtitle1" align="center">
                      {'~'}
                    </Typography>
                    <Typography variant="subtitle2">{values.end_date ? formatDateString(values.end_date, 'yyyy/MM/DD') : ''}</Typography>
                  </>
                )}
              </Stack>
            </Stack>
          );
        }
      },
      {
        Header: '掲載終了日',
        accessor: 'end_date',
        className: 'cell-center'
      },
      {
        Header: 'プロジェクト名',
        accessor: 'project_title',
        Cell: ({ row }: { row: Row }) => {
          const { values } = row;
          return (
            <Stack direction="row" spacing={1.5} alignItems="center">
              <Stack spacing={0}>
                {values.client && values.client.name && (
                  <Typography variant="caption" color="textSecondary">
                    {values.client.name}
                  </Typography>
                )}
                <Typography variant="subtitle1">{values.project_title}</Typography>
                {values.price && (
                  <Typography variant="caption" color="textSecondary">
                    {values.price}
                  </Typography>
                )}
              </Stack>
            </Stack>
          );
        }
      },
      {
        Header: '企業名',
        accessor: 'client'
      },
      {
        Header: '業務内容',
        accessor: 'description'
      },
      {
        Header: '掲載開始日',
        accessor: 'working_start_time'
      },
      {
        Header: '掲載終了日',
        accessor: 'working_end_time'
      },
      {
        Header: '契約区分',
        accessor: 'contract'
      },
      {
        Header: '金額',
        accessor: 'price'
      },
      {
        Header: '郵便番号',
        accessor: 'working_postal_code'
      },
      {
        Header: '住所',
        accessor: 'working_address'
      },
      {
        Header: '休日',
        accessor: 'holiday'
      },
      {
        Header: '担当者',
        accessor: 'employee',
        Cell: ({ row }: { row: Row }) => {
          const { values } = row;
          return (
            <Stack direction="row" spacing={1.5} alignItems="center">
              <Stack spacing={0}>
                {values.employee && (
                  <>
                    <Typography variant="subtitle2">{`${values.employee.sei} ${values.employee.mei}`}</Typography>
                  </>
                )}
              </Stack>
            </Stack>
          );
        }
      },
      {
        Header: '派遣元',
        accessor: 'dispatch_source'
      },
      {
        Header: '最寄り駅',
        accessor: 'fertilizer_type'
      },
      {
        Header: '研修日程',
        accessor: 'training_schedule'
      },
      {
        Header: '試用期間',
        accessor: 'trial_period_duration'
      },
      {
        Header: '研修備考',
        accessor: 'training_memo'
      },
      {
        Header: '就業期間',
        accessor: 'contract_period'
      },
      {
        Header: '勤務日数',
        accessor: 'working_days_count'
      },
      {
        Header: '勤務曜日',
        accessor: 'working_days_list'
      },
      {
        Header: '勤務時間',
        accessor: 'working_hours_per_day'
      },
      {
        Header: '勤務備考',
        accessor: 'work_notes'
      },
      {
        Header: '計算方法',
        accessor: 'price_type'
      },
      {
        Header: '交通費',
        accessor: 'transportation_expenses'
      },
      {
        Header: '時間外労働',
        accessor: 'overtime_hours'
      },
      {
        Header: '福利厚生',
        accessor: 'welfare_programs'
      },
      {
        Header: '職場環境',
        accessor: 'work_environment_description'
      },
      {
        Header: '服装',
        accessor: 'dress_code'
      },
      {
        Header: '男女比',
        accessor: 'gender_ratio'
      },
      {
        Header: '環境備考',
        accessor: 'environmental_notes'
      },
      {
        Header: '特記事項',
        accessor: 'special_notes'
      },
      {
        Header: '人材要件',
        accessor: 'hr_requirements'
      },
      {
        Header: '男女',
        accessor: 'gender_requirements'
      },
      {
        Header: '年齢',
        accessor: 'age_requirements'
      },
      {
        Header: '募集人数',
        accessor: 'recruitment_count'
      },
      {
        Header: 'HP掲載',
        accessor: 'hp_posting_flag'
      },
      {
        Header: '詳細',
        className: 'cell-center',
        disableSortBy: true,
        Cell: ({ row }: { row: Row<{}> }) => {
          return (
            <Stack direction="row" alignItems="center" justifyContent="center" spacing={0}>
              <Tooltip title="編集">
                <IconButton
                  color="primary"
                  onClick={(e: MouseEvent<HTMLButtonElement>) => {
                    e.stopPropagation();
                    setCustomer(row.values);
                    handleAdd();
                  }}
                >
                  <EditTwoTone twoToneColor={theme.palette.primary.main} />
                </IconButton>
              </Tooltip>
              <Tooltip title="Delete">
                <IconButton
                  color="error"
                  onClick={(e: MouseEvent<HTMLButtonElement>) => {
                    e.stopPropagation();
                    handleClose();
                    setCustomerDeleteId(row.values.id);
                    setCustomerDeleteTitle(row.values.project_title);
                  }}
                >
                  <DeleteTwoTone twoToneColor={theme.palette.error.main} />
                </IconButton>
              </Tooltip>
            </Stack>
          );
        }
      }
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [theme]
  );

  if (loading) {
    return <Loader />;
  }

  return (
    <Page title="案件一覧">
      <MainCard content={false}>
        {projectData && (
          <Fragment>
            <ScrollX>
              <ReactTable
                columns={columns}
                data={projectData}
                handleAdd={handleAdd}
                getHeaderProps={(column: HeaderGroup) => column.getSortByToggleProps()}
              />
            </ScrollX>

            <AlertCustomerDelete
              deleteId={customerDeleteId}
              title={customerDeleteTitle}
              open={open}
              handleClose={handleClose}
              onReload={setProjectData}
            />
            {/* add customer dialog */}
            <Dialog
              maxWidth="sm"
              TransitionComponent={PopupTransition}
              keepMounted
              fullWidth
              onClose={handleAdd}
              open={add}
              sx={{ '& .MuiDialog-paper': { p: 0 }, transition: 'transform 225ms' }}
              aria-describedby="alert-dialog-slide-description"
            >
              {add && (
                <AddCustomer
                  customer={customer}
                  onCancel={handleAdd}
                  onReload={setProjectData}
                  skillAll={tableData?.skill ?? []}
                  contractAll={tableData?.contract ?? []}
                  clientAll={tableData?.client ?? []}
                  processAll={tableData?.process ?? []}
                  employeeAll={tableData?.employee ?? []}
                />
              )}
            </Dialog>
          </Fragment>
        )}
      </MainCard>
    </Page>
  );
};

CustomerProjectPage.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export default CustomerProjectPage;
