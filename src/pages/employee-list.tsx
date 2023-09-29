import { useCallback, useEffect, useMemo, useState, FC, Fragment, MouseEvent, ReactElement } from 'react';

// material-ui
import { alpha, useTheme } from '@mui/material/styles';
import { Button, Chip, Stack, Table, TableBody, TableCell, TableHead, TableRow, Tooltip, Typography, useMediaQuery } from '@mui/material';

// third-party
import { PatternFormat } from 'react-number-format';
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
  Cell,
  HeaderProps
} from 'react-table';

// project import
import Layout from 'layout';
import Page from 'components/Page';
import MainCard from 'components/MainCard';
import ScrollX from 'components/ScrollX';
import Avatar from 'components/@extended/Avatar';
import IconButton from 'components/@extended/IconButton';
import {
  CSVExport,
  HeaderSort,
  IndeterminateCheckbox,
  SortingSelect,
  TablePagination,
  TableRowSelection
} from 'components/third-party/ReactTable';

import CustomerView from 'sections/apps/customer/CustomerView';

import makeData from 'data/react-table';
import { renderFilterTypes, GlobalFilter } from 'utils/react-table';

// assets
import { CloseOutlined, PlusOutlined, EyeTwoTone } from '@ant-design/icons';

// ==============================|| REACT TABLE ||============================== //

interface Props {
  columns: Column[];
  data: [];
  handleAdd: () => void;
  renderRowSubComponent: FC<any>;
  getHeaderProps: (column: HeaderGroup) => {};
}

function ReactTable({ columns, data, renderRowSubComponent, handleAdd, getHeaderProps }: Props) {
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
      setHiddenColumns(['age', 'contact', 'visits', 'email', 'status', 'avatar']);
    } else {
      setHiddenColumns(['avatar', 'email']);
    }
    // eslint-disable-next-line
  }, [matchDownSM]);

  return (
    <>
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
              Add Customer
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
                    {row.cells.map((cell: Cell, i: number) => (
                      <TableCell {...cell.getCellProps([{ className: cell.column.className }])} key={i}>
                        {cell.render('Cell')}
                      </TableCell>
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
    </>
  );
}

// ==============================|| CUSTOMER - LIST ||============================== //

const CustomerEmployeeListPage = () => {
  const theme = useTheme();

  // const data = useMemo(() => makeData(200), []);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const data = [
    {
      id: 1,
      sei: '田中',
      mei: '太郎',
      sei_k: 'タナカ',
      mei_k: 'タロウ',
      gender: '男性',
      birthdate: '1980-01-15',
      job_category_id: 1,
      client_id: 101,
      project_id: 201,
      address: '東京都渋谷区',
      joining_date: '2005-03-20',
      retirement_date: '2035-04-30',
      phone_number: '123-4567-8901',
      email: 'tanaka.taro@example.com',
      employee_skills_id: 301,
      postal_code: '12345678',
      remarks: '備考1',
      position_id: 1,
      employment_id: 1
    },
    {
      id: 1,
      sei: '田中',
      mei: '太郎',
      sei_k: 'タナカ',
      mei_k: 'タロウ',
      gender: '男性',
      birthdate: '1980-01-15',
      job_category_id: 1,
      client_id: 101,
      project_id: 201,
      address: '東京都渋谷区',
      joining_date: '2005-03-20',
      retirement_date: '2035-04-30',
      phone_number: '123-4567-8901',
      email: 'tanaka.taro@example.com',
      employee_skills_id: 301,
      postal_code: '12345678',
      remarks: '備考1',
      position_id: 1,
      employment_id: 1
    }
  ];
  console.log(data);
  const [customer, setCustomer] = useState<any>(null);
  const [add, setAdd] = useState<boolean>(false);

  const handleAdd = () => {
    setAdd(!add);
    if (customer && !add) setCustomer(null);
  };

  const columns = useMemo(
    () => [
      {
        title: 'Row Selection',
        Header: ({ getToggleAllPageRowsSelectedProps }: HeaderProps<{}>) => (
          <IndeterminateCheckbox indeterminate {...getToggleAllPageRowsSelectedProps()} />
        ),
        accessor: 'selection',
        Cell: ({ row }: any) => <IndeterminateCheckbox {...row.getToggleRowSelectedProps()} />,
        disableSortBy: true
      },
      {
        Header: 'ID',
        accessor: 'id',
        className: 'cell-center'
      },
      {
        Header: '氏名',
        accessor: 'name',
        Cell: ({ row }: { row: Row }) => {
          const { values } = row;
          return (
            <Stack direction="row" spacing={1.5} alignItems="center">
              <Avatar alt="Avatar 1" size="sm" src={`/assets/images/users/avatar-${!values.avatar ? 1 : values.avatar}.png`} />
              <Stack spacing={0}>
                <Typography variant="subtitle1">{values.fatherName}</Typography>
                <Typography variant="caption" color="textSecondary">
                  {values.email}
                </Typography>
              </Stack>
            </Stack>
          );
        }
      },
      {
        Header: '氏名カナ',
        accessor: 'name_k',
        disableSortBy: true
      },
      {
        Header: 'Avatar',
        accessor: 'avatar',
        disableSortBy: true
      },
      {
        Header: 'gender',
        accessor: 'gender',
        disableSortBy: true
      },
      {
        Header: 'birthdate',
        accessor: 'birthdate',
        disableSortBy: true
      },
      {
        Header: 'job_category_id',
        accessor: 'job_category_id',
        disableSortBy: true
      },
      {
        Header: 'client_id',
        accessor: 'client_id',
        disableSortBy: true
      },
      {
        Header: 'project_id',
        accessor: 'project_id',
        disableSortBy: true
      },
      {
        Header: 'address',
        accessor: 'address',
        disableSortBy: true
      },
      {
        Header: 'joining_date',
        accessor: 'joining_date',
        disableSortBy: true
      },
      {
        Header: 'retirement_date',
        accessor: 'retirement_date',
        disableSortBy: true
      },
      {
        Header: 'phone_number',
        accessor: 'phone_number',
        Cell: ({ value }: { value: number }) => <PatternFormat displayType="text" format="+1 ###-####-####" mask="_" defaultValue={value} />
      },
      {
        Header: 'email',
        accessor: 'email',
        disableSortBy: true
      },
      {
        Header: 'employee_skills_id',
        accessor: 'employee_skills_id',
        disableSortBy: true
      },
      {
        Header: 'postal_code',
        accessor: 'postal_code',
        disableSortBy: true
      },
      {
        Header: 'remarks',
        accessor: 'remarks',
        disableSortBy: true
      },
      {
        Header: 'position_id',
        accessor: 'position_id',
        disableSortBy: true
      },
      {
        Header: 'employment_id',
        accessor: 'employment_id',
        disableSortBy: true
      },
      // {
      //   Header: 'Age',
      //   accessor: 'age',
      //   className: 'cell-right'
      // },
      // {
      //   Header: 'Country',
      //   accessor: 'country'
      // },
      {
        Header: 'Status',
        accessor: 'status',
        Cell: ({ value }: { value: string }) => {
          switch (value) {
            case '1':
              return <Chip color="error" label="Rejected" size="small" variant="light" />;
            case '2':
              return <Chip color="success" label="Verified" size="small" variant="light" />;
            case '3':
            default:
              return <Chip color="info" label="Pending" size="small" variant="light" />;
          }
        }
      },
      {
        Header: 'Actions',
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
                    console.log(row.values);
                    // e.stopPropagation();
                    // row.toggleRowExpanded();
                  }}
                >
                  {collapseIcon}
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
    <Page title="Customer List">
      <MainCard content={false}>
        <ScrollX>
          <ReactTable
            columns={columns}
            data={data}
            handleAdd={handleAdd}
            renderRowSubComponent={renderRowSubComponent}
            getHeaderProps={(column: HeaderGroup) => column.getSortByToggleProps()}
          />
        </ScrollX>
      </MainCard>
    </Page>
  );
};

CustomerEmployeeListPage.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export default CustomerEmployeeListPage;
