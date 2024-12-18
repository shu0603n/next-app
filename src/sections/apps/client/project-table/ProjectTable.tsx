import { useCallback, useEffect, useMemo, useState, FC, Fragment, MouseEvent } from 'react';

// material-ui
import { alpha, useTheme } from '@mui/material/styles';
import { Button, Dialog, Stack, Table, TableBody, TableCell, TableHead, TableRow, Tooltip, useMediaQuery } from '@mui/material';

// third-party
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

// project import
import MainCard from 'components/MainCard';
import ScrollX from 'components/ScrollX';
import IconButton from 'components/@extended/IconButton';
import { PopupTransition } from 'components/@extended/Transitions';
import { CSVExport, HeaderSort, SortingSelect, TablePagination, TableRowSelection } from 'components/third-party/ReactTable';

import AddCustomer from 'sections/apps/client/project-table/AddCustomer';
import CustomerView from 'sections/apps/client/project-table/CustomerView';
import AlertCustomerDelete from 'sections/apps/client/project-table/AlertCustomerDelete';

// import makeData from 'data/react-table';
import { renderFilterTypes, GlobalFilter } from 'utils/react-table';

// assets
import { CloseOutlined, PlusOutlined, EyeTwoTone, EditTwoTone, DeleteTwoTone } from '@ant-design/icons';
import { ProjectTableType, ClientType, EmployeeType, ContractType, SkillType, ProcessType } from 'types/client/project-table';

// ==============================|| REACT TABLE - EDITABLE ROW ||============================== //

interface Props {
  columns: Column[];
  data: ProjectTableType[];
  handleAdd: () => void;
  renderRowSubComponent: FC<any>;
  getHeaderProps: (column: HeaderGroup) => {};
}

function ReactTable({ columns, data, renderRowSubComponent, handleAdd, getHeaderProps }: Props) {
  const theme = useTheme();
  const matchDownSM = useMediaQuery(theme.breakpoints.down('sm'));

  const filterTypes = useMemo(() => renderFilterTypes, []);
  const sortBy = { id: 'start_date', desc: true };

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    setHiddenColumns,
    allColumns,
    visibleColumns,
    rows,
    page,
    gotoPage,
    setPageSize,
    state: { globalFilter, selectedRowIds, pageIndex, pageSize, expanded },
    preGlobalFilteredRows,
    setGlobalFilter,
    setSortBy,
    selectedFlatRows
  } = useTable(
    {
      columns,
      data,
      filterTypes,
      initialState: { pageIndex: 0, pageSize: 10, hiddenColumns: ['cliant'], sortBy: [sortBy] }
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
        `id`,
        `client_name`,
        'start_date',
        'working_start_time',
        `working_end_time`,
        `end_date`,
        `description`,
        `sei`,
        'dispatch_source',
        `skills`,
        `processes`,
        `contract_name`,
        `working_postal_code`,
        `fertilizer_type`,
        `working_address`,
        `holiday`,
        `trial_period_duration`,
        `training_schedule`,
        `training_memo`,
        `contract_period`,
        'working_days_count',
        'working_days_list',
        'working_hours_per_day',
        'work_notes',
        'price_type',
        `price`,
        'transportation_expenses',
        'overtime_hours',
        'welfare_programs',
        'work_environment_description',
        'dress_code',
        'gender_ratio',
        'environmental_notes',
        `special_notes`,
        `hr_requirements`,
        `gender_requirements`,
        `age_requirements`,
        `recruitment_count`,
        `hp_posting_flag`
      ]);
    } else {
      setHiddenColumns([
        `id`,
        `client_name`,
        'working_start_time',
        `working_end_time`,
        `description`,
        `sei`,
        'dispatch_source',
        `skills`,
        `processes`,
        `contract_name`,
        `working_postal_code`,
        `fertilizer_type`,
        `working_address`,
        `holiday`,
        `trial_period_duration`,
        `training_schedule`,
        `training_memo`,
        `contract_period`,
        'working_days_count',
        'working_days_list',
        'working_hours_per_day',
        'work_notes',
        'price_type',
        `price`,
        'transportation_expenses',
        'overtime_hours',
        'welfare_programs',
        'work_environment_description',
        'dress_code',
        'gender_ratio',
        'environmental_notes',
        `special_notes`,
        `hr_requirements`,
        `gender_requirements`,
        `age_requirements`,
        `recruitment_count`,
        `hp_posting_flag`
      ]);
    }
    // eslint-disable-next-line
  }, [matchDownSM]);

  return (
    <Fragment>
      <TableRowSelection selected={Object.keys(selectedRowIds).length} />
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
              新規追加
            </Button>
            <CSVExport
              data={selectedFlatRows.length > 0 ? selectedFlatRows.map((d: Row) => d.original) : data}
              filename={'customer-list.csv'}
            />
          </Stack>
        </Stack>
        <Table {...getTableProps()}>
          <TableHead>
            {headerGroups.map((headerGroup: HeaderGroup<{}>) => (
              // eslint-disable-next-line react/jsx-key
              <TableRow {...headerGroup.getHeaderGroupProps()} sx={{ '& > th:first-of-type': { width: '58px' } }}>
                {headerGroup.headers.map((column: HeaderGroup) => (
                  // eslint-disable-next-line react/jsx-key
                  <TableCell {...column.getHeaderProps([{ className: column.className }, getHeaderProps(column)])}>
                    <HeaderSort column={column} />
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableHead>
          <TableBody {...getTableBodyProps()}>
            {page.map((row: Row, i: number) => {
              prepareRow(row);
              const rowProps = row.getRowProps();

              return (
                <Fragment key={i}>
                  <TableRow
                    {...row.getRowProps()}
                    onClick={() => {
                      row.toggleRowSelected();
                    }}
                    sx={{ cursor: 'pointer', bgcolor: row.isSelected ? alpha(theme.palette.primary.lighter, 0.35) : 'inherit' }}
                  >
                    {row.cells.map((cell: Cell) => (
                      // eslint-disable-next-line react/jsx-key
                      <TableCell {...cell.getCellProps([{ className: cell.column.className }])}>{cell.render('Cell')}</TableCell>
                    ))}
                  </TableRow>
                  {row.isExpanded && renderRowSubComponent({ row, rowProps, visibleColumns, expanded })}
                </Fragment>
              );
            })}
            <TableRow sx={{ '&:hover': { bgcolor: 'transparent !important' } }}>
              <TableCell sx={{ p: 2, py: 3 }} colSpan={9}>
                <TablePagination gotoPage={gotoPage} rows={rows} setPageSize={setPageSize} pageSize={pageSize} pageIndex={pageIndex} />
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </Stack>
    </Fragment>
  );
}

// ==============================|| CUSTOMER - LIST ||============================== //
const ProjectTable = ({
  data,
  candidate_client,
  candidate_employee,
  candidate_contract,
  candidate_skills,
  candidate_processes
}: {
  data: ProjectTableType[];
  candidate_client: ClientType[];
  candidate_employee: EmployeeType[];
  candidate_contract: ContractType[];
  candidate_skills: SkillType[];
  candidate_processes: ProcessType[];
}) => {
  const theme = useTheme();

  const [open, setOpen] = useState<boolean>(false);
  const [customer, setCustomer] = useState<any>(null);
  const [customerDeleteId, setCustomerDeleteId] = useState<any>('');
  const [add, setAdd] = useState<boolean>(false);
  const [updatedData, setUpdatedData] = useState<ProjectTableType[]>(data);

  useEffect(() => {
    setUpdatedData(data);
  }, [data]);

  const handleAdd = () => {
    setAdd(!add);
    if (customer && !add) setCustomer(null);
  };

  const handleClose = () => {
    setOpen(!open);
    if (customerDeleteId) {
      setUpdatedData((prevData) => prevData.filter((item) => item.id !== customerDeleteId));
    }
  };

  const formatDate = (isoDate: string) => {
    const date = new Date(isoDate);
    return date.toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  };

  useEffect(() => {
    if (data) {
      const formattedData = data.map((item) => ({
        ...item,
        start_date: formatDate(item.start_date),
        end_date: item.end_date ? formatDate(item.end_date) : ''
      }));
      setUpdatedData(formattedData);
    }
  }, [data]);

  const handleReloadData = (newData: ProjectTableType[]) => {
    if (Array.isArray(newData)) {
      const formattedData = newData.map((item) => ({
        ...item,
        start_date: formatDate(item.start_date),
        end_date: item.end_date ? formatDate(item.end_date) : ''
      }));
      setUpdatedData(formattedData);
    }
  };

  const columns = useMemo(
    () => [
      {
        Header: 'ID',
        accessor: 'id'
      },
      {
        Header: '開始日',
        accessor: 'start_date'
      },
      {
        Header: '終了日',
        accessor: 'end_date'
      },
      {
        Header: 'プロジェクト名',
        accessor: 'project_title'
      },
      {
        Header: '業務内容',
        accessor: 'description'
      },
      {
        Header: '企業名',
        accessor: 'client_name'
      },
      {
        Header: '業務開始時間',
        accessor: 'working_start_time'
      },
      {
        Header: '業務終了時間',
        accessor: 'working_end_time'
      },
      {
        Header: '担当者',
        accessor: `sei`
      },
      {
        Header: '派遣元',
        accessor: 'dispatch_source'
      },
      {
        Header: '契約区分',
        accessor: 'contract_name'
      },
      {
        Header: '郵便番号',
        accessor: 'working_postal_code'
      },
      {
        Header: '最寄り駅',
        accessor: 'fertilizer_type'
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
        Header: '試用期間',
        accessor: 'trial_period_duration'
      },
      {
        Header: '研修日程',
        accessor: 'training_schedule'
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
        Header: '金額',
        accessor: 'price'
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
        Header: 'スキル',
        accessor: 'skills',
        className: 'cell-right'
      },
      {
        Header: '担当工程',
        accessor: 'processes'
      },
      {
        Header: 'スキルシート登録フラグ',
        accessor: 'hp_posting_flag'
      },
      {
        Header: 'アクション',
        className: 'cell-center',
        disableSortBy: true,
        Cell: ({ row }: { row: Row<{}> }) => {
          const collapseIcon = row.isExpanded ? (
            <CloseOutlined style={{ color: theme.palette.error.main }} />
          ) : (
            <EyeTwoTone twoToneColor={theme.palette.secondary.main} />
          );
          return (
            <Stack direction="row" alignItems="center" justifyContent="center" spacing={0}>
              <Tooltip title="View">
                <IconButton
                  color="secondary"
                  onClick={(e: MouseEvent<HTMLButtonElement>) => {
                    e.stopPropagation();
                    row.toggleRowExpanded();
                  }}
                >
                  {collapseIcon}
                </IconButton>
              </Tooltip>
              <Tooltip title="Edit">
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
                    setCustomerDeleteId(row.values.id);
                    setOpen(true);
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

  const renderRowSubComponent = useCallback(({ row }: { row: Row<{}> }) => <CustomerView data={data[Number(row.id)]} />, [data]);
  return (
    <MainCard content={false}>
      <ScrollX>
        <ReactTable
          columns={columns}
          data={updatedData}
          handleAdd={handleAdd}
          renderRowSubComponent={renderRowSubComponent}
          getHeaderProps={(column: HeaderGroup) => column.getSortByToggleProps()}
        />
      </ScrollX>
      <AlertCustomerDelete title={customerDeleteId} open={open} handleClose={handleClose} reloadDataAfterDelete={handleReloadData} />
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
        <AddCustomer
          customer={customer}
          onCancel={handleAdd}
          reloadDataAfterAdd={handleReloadData}
          candidate_client={candidate_client}
          candidate_employee={candidate_employee}
          candidate_contract={candidate_contract}
          candidate_skills={candidate_skills}
          candidate_processes={candidate_processes}
        />
      </Dialog>
    </MainCard>
  );
};

export default ProjectTable;
