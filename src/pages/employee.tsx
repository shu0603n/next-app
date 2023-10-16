import { useEffect, useMemo, useState, Fragment, MouseEvent, ReactElement } from 'react';

// material-ui
import { alpha, useTheme } from '@mui/material/styles';
import {
  Button,
  Chip,
  Dialog,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
  useMediaQuery
} from '@mui/material';

import { PopupTransition } from 'components/@extended/Transitions';

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
import Layout from 'layout';
import Page from 'components/Page';
import MainCard from 'components/MainCard';
import ScrollX from 'components/ScrollX';
import Avatar from 'components/@extended/Avatar';
import IconButton from 'components/@extended/IconButton';
import { CSVExport, HeaderSort, SortingSelect, TablePagination } from 'components/third-party/ReactTable';

import AddCustomer from 'sections/apps/employee/AddCustomer';
import AlertCustomerDelete from 'sections/apps/employee/AlertCustomerDelete';

import { renderFilterTypes, GlobalFilter } from 'utils/react-table';
// assets
import { CloseOutlined, PlusOutlined, EyeTwoTone, DeleteTwoTone, FileTextOutlined } from '@ant-design/icons';
import { useRouter } from 'next/router';
import { EmployeeType } from 'types/employee/employee';

// ==============================|| REACT TABLE ||============================== //

interface Props {
  columns: Column[];
  data: Array<EmployeeType>;
  handleAdd: () => void;
  getHeaderProps: (column: HeaderGroup) => {};
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
      setHiddenColumns(['avatar', 'name_k', 'status', 'gender', 'employment_name', 'job_category_name']);
    } else {
      setHiddenColumns(['avatar', 'name_k']);
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
async function fetchTableData() {
  try {
    const response = await fetch('/api/db/employee/select');
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

const CustomerEmployeePage = () => {
  const theme = useTheme();

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const [tableData, setTableData] = useState<Array<EmployeeType>>(); // データを保持する状態変数

  useEffect(() => {
    // ページがロードされたときにデータを取得
    fetchTableData()
      .then((data) => {
        setTableData(data.data.rows); // データを状態に設定
      })
      .catch((error) => {
        // エラーハンドリング
        console.error('Error:', error);
      });
  }, []); // 空の依存リストを指定することで、一度だけ実行される

  const [open, setOpen] = useState<boolean>(false);
  const [customer, setCustomer] = useState<any>(null);
  const [customerDeleteId, setCustomerDeleteId] = useState<any>('');
  const [add, setAdd] = useState<boolean>(false);

  const handleAdd = () => {
    setAdd(!add);
    if (customer && !add) setCustomer(null);
  };

  const handleClose = () => {
    setOpen(!open);
  };
  const router = useRouter();

  const handleChangeDetail = (newValue: string) => {
    router.push(`/employee/${newValue}/basic`);
  };
  const handleChangeDetailSkill = (newValue: string) => {
    router.push(`/skill-sheet/${newValue}`);
  };

  const columns = useMemo(
    () => [
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
                <Typography variant="caption" color="textSecondary">
                  {values.name_k}
                </Typography>
                <Typography variant="subtitle1">{values.name}</Typography>
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
        Header: '画像',
        accessor: 'avatar',
        disableSortBy: true
      },
      {
        Header: '性別',
        accessor: 'gender',
        disableSortBy: true
      },
      {
        Header: '雇用形態',
        accessor: 'employment_name',
        disableSortBy: true
      },
      {
        Header: '職種',
        accessor: 'job_category_name',
        disableSortBy: true
      },
      {
        Header: '勤怠',
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
        Header: '詳細',
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
              <Tooltip title="詳細">
                <IconButton
                  color="secondary"
                  onClick={(e: MouseEvent<HTMLButtonElement>) => {
                    handleChangeDetail(row.values.id);
                  }}
                >
                  {collapseIcon}
                </IconButton>
              </Tooltip>
              <Tooltip title="スキルシート">
                <IconButton
                  color="secondary"
                  onClick={(e: MouseEvent<HTMLButtonElement>) => {
                    handleChangeDetailSkill(row.values.id);
                  }}
                >
                  <FileTextOutlined twoToneColor={theme.palette.secondary.main} />
                </IconButton>
              </Tooltip>
              <Tooltip title="削除">
                <IconButton
                  color="error"
                  onClick={(e: MouseEvent<HTMLButtonElement>) => {
                    e.stopPropagation();
                    handleClose();
                    setCustomerDeleteId(row.values.id);
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

  return (
    <Page title="Customer List">
      <MainCard content={false}>
        {tableData && (
          <ScrollX>
            <ReactTable
              columns={columns}
              data={tableData}
              handleAdd={handleAdd}
              getHeaderProps={(column: HeaderGroup) => column.getSortByToggleProps()}
            />
          </ScrollX>
        )}

        <AlertCustomerDelete title={customerDeleteId} open={open} handleClose={handleClose} />
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
          <AddCustomer customer={customer} onCancel={handleAdd} onReload={() => setTableData} />
        </Dialog>
      </MainCard>
    </Page>
  );
};

CustomerEmployeePage.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export default CustomerEmployeePage;
