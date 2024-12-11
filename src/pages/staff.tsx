import { useEffect, useMemo, useState, Fragment, MouseEvent, ReactElement } from 'react';

// material-ui
import { alpha, useTheme } from '@mui/material/styles';
import { Button, Chip, Dialog, Stack, Table, TableBody, TableCell, TableHead, TableRow, useMediaQuery } from '@mui/material';

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
  Cell,
  CellProps
} from 'react-table';

// project import
import Layout from 'layout';
import Page from 'components/Page';
import MainCard from 'components/MainCard';
import ScrollX from 'components/ScrollX';
import { CSVExport, HeaderSort, SortingSelect, TablePagination } from 'components/third-party/ReactTable';

import AddCustomer from 'sections/apps/staff/AddCustomer';

import {
  renderFilterTypes,
  GlobalFilter
  // NumberRangeColumnFilter,
  // SelectColumnFilter
} from 'utils/react-table';
// assets
import { PlusOutlined } from '@ant-design/icons';
import { useRouter } from 'next/router';
import useUser from 'hooks/useUser';
import { staffType } from 'types/staff/staff';

// ==============================|| REACT TABLE ||============================== //

interface Props {
  columns: Column[];
  data: Array<staffType>;
  handleAdd: () => void;
  updateData: () => void;
  getHeaderProps: (column: HeaderGroup) => {};
}

function ReactTable({ columns, data, handleAdd, updateData, getHeaderProps }: Props) {
  const theme = useTheme();
  const matchDownSM = useMediaQuery(theme.breakpoints.down('sm'));

  const filterTypes = useMemo(() => renderFilterTypes, []);
  const sortBy = { id: 'id', desc: false };

  const router = useRouter();
  const user = useUser();

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
      initialState: { pageIndex: 0, pageSize: 100, hiddenColumns: ['id'], sortBy: [sortBy] }
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
      setHiddenColumns(['birthday']);
    } else {
      setHiddenColumns(['birthday']);
    }
    // eslint-disable-next-line
  }, [matchDownSM]);

  const handleChangeDetail = (newValue: string) => {
    router.push(`/employee/detail/${newValue}/basic`);
  };

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
            <Button variant="outlined" onClick={updateData} size="small">
              更新
            </Button>
            <Button
              variant="contained"
              startIcon={<PlusOutlined />}
              onClick={handleAdd}
              size="small"
              disabled={!(user?.roles.superRole || user?.roles.systemRole || user?.roles.employeeEdit)}
            >
              一括インポート
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
                    onClick={(e: MouseEvent<HTMLTableRowElement>) => {
                      handleChangeDetail(row.values.id);
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
    const response = await fetch('/api/db/staff/select');
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

const CustomerStaffPage = () => {
  const theme = useTheme();

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const [tableData, setTableData] = useState<Array<staffType>>(); // データを保持する状態変数

  const updateData = () => {
    fetchTableData()
      .then((data) => {
        setTableData(data.data); // データを状態に設定
      })
      .catch((error) => {
        // エラーハンドリング
        console.error('Error:', error);
      });
  };
  useEffect(() => {
    // ページがロードされたときにデータを取得
    updateData();
  }, []); // 空の依存リストを指定することで、一度だけ実行される

  const [customer, setCustomer] = useState<any>(null);
  const [add, setAdd] = useState<boolean>(false);

  const handleAdd = () => {
    setAdd(!add);
    if (customer && !add) setCustomer(null);
  };

  const columns = useMemo(
    () => [
      {
        Header: 'ID',
        accessor: 'id',
        // Filter: NumberRangeColumnFilter,
        filter: 'between'
      },
      {
        Header: '氏名',
        accessor: 'name'
      },
      {
        Header: 'メール',
        accessor: 'mail'
      },
      {
        Header: '生年月日',
        accessor: 'birthday'
      },
      {
        Header: '年齢',
        accessor: 'age',
        // Filter: NumberRangeColumnFilter,
        filter: 'between'
      },
      {
        Header: 'ステータス',
        accessor: 'staff_status',
        // Filter: SelectColumnFilter,
        filter: 'includes',
        Cell: ({ value }: CellProps<any>) => value?.name ?? null
      },
      {
        Header: 'インポートステータス',
        accessor: 'import_status',
        // Filter: SelectColumnFilter,
        filter: 'includes',
        Cell: ({ value }: CellProps<any>) => {
          if (value?.name === '処理待ち') {
            return <Chip color="info" label={value?.name} size="small" variant="light" />;
          } else if (value?.name === 'エラー') {
            return <Chip color="error" label={value?.name} size="small" variant="light" />;
          } else {
            return <Chip color="success" label={value?.name} size="small" variant="light" />;
          }
        }
      }
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [theme]
  );

  return (
    <Page title="社員一覧">
      <MainCard content={false}>
        {tableData && (
          <ScrollX>
            <ReactTable
              columns={columns}
              data={tableData}
              handleAdd={handleAdd}
              updateData={updateData}
              getHeaderProps={(column: HeaderGroup) => column.getSortByToggleProps()}
            />
          </ScrollX>
        )}

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

CustomerStaffPage.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export default CustomerStaffPage;
