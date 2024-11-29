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
import AlertCustomerDelete from 'sections/apps/employee/skill-table/AlertCustomerDelete';

// import makeData from 'data/react-table';
import { renderFilterTypes, GlobalFilter } from 'utils/react-table';

// assets
import { CloseOutlined, PlusOutlined, EyeTwoTone, EditTwoTone, DeleteTwoTone } from '@ant-design/icons';
import { ProjectTableType, clientType, employeeType } from 'types/client/project-table';

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
        `name`,
        'start_date',
        'client_name',
        'working_start_time',
        `working_end_time`,
        `end_date`,
        `description`,
        `project_position_id`,
        'project_position_name',
        `skills`,
        `process`
      ]);
    } else {
      setHiddenColumns([
        `id`,
        `name`,
        'client_name',
        'working_start_time',
        `working_end_time`,
        `description`,
        `project_position_id`,
        'project_position_name',
        `skills`,
        `process`
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
  candidate_employee
}: {
  data: ProjectTableType[];
  candidate_client: clientType[];
  candidate_employee: employeeType[];
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
        Header: '企業名',
        accessor: 'name'
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
        Header: '役割ID',
        accessor: `project_position_id`
      },
      {
        Header: '役割',
        accessor: 'project_position_name'
      },
      {
        Header: 'スキル',
        accessor: 'skills',
        className: 'cell-right'
      },
      {
        Header: '担当工程',
        accessor: 'process'
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
      {/* <AlertCustomerDelete title={customerDeleteId} open={open} handleClose={handleClose} reloadDataAfterDelete={handleReloadData} /> */}
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
        />
      </Dialog>
    </MainCard>
  );
};

export default ProjectTable;
