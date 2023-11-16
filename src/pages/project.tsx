import { useEffect, useMemo, useState, Fragment, MouseEvent, ReactElement, useId } from 'react';

// material-ui
import { alpha, useTheme } from '@mui/material/styles';
import { Button, Dialog, Stack, Table, TableBody, TableCell, TableHead, TableRow, Tooltip, Typography, useMediaQuery } from '@mui/material';

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
import IconButton from 'components/@extended/IconButton';
import { CSVExport, HeaderSort, SortingSelect, TablePagination } from 'components/third-party/ReactTable';

import AddCustomer from 'sections/apps/project/AddCustomer';
import AlertCustomerDelete from 'sections/apps/project/AlertCustomerDelete';

import { renderFilterTypes, GlobalFilter } from 'utils/react-table';

// assets
import { EditTwoTone, PlusOutlined, DeleteTwoTone } from '@ant-design/icons';
import { ProjectType } from 'types/project/project';

// ==============================|| REACT TABLE ||============================== //
type ProjectDataList = {
  project: Array<ProjectType>;
};

interface Props {
  columns: Column[];
  data: Array<ProjectType>;
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
      setHiddenColumns([
        'description',
        // 'client',
        'working_start_time',
        'working_end_time',
        // 'contract',
        'working_postal_code',
        'working_postal_address',
        'holiday',
        'hp_posting_flag'
      ]);
    } else {
      setHiddenColumns([
        'description',
        'working_start_time',
        'working_end_time',
        // 'contract',
        'working_postal_code',
        'working_postal_address',
        'holiday',
        'hp_posting_flag'
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

  useEffect(() => {
    // ページがロードされたときにデータを取得
    fetchTableData()
      .then((data) => {
        setTableData(data); // データを状態に設定
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

  const columns = useMemo(
    () => [
      {
        Header: 'ID',
        accessor: 'id',
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
                {values.start_date && (
                  <Typography variant="caption" color="textSecondary">
                    {values.start_date}~{values.end_date}
                  </Typography>
                )}
                <Typography variant="subtitle1">{values.project_title}</Typography>
              </Stack>
            </Stack>
          );
        }
      },
      {
        Header: '企業名',
        accessor: 'client',
        disableSortBy: true
      },
      {
        Header: '業務内容',
        accessor: 'description',
        disableSortBy: true
      },
      {
        Header: '掲載開始日',
        accessor: 'working_start_time',
        disableSortBy: true
      },
      {
        Header: '掲載終了日',
        accessor: 'working_end_time',
        disableSortBy: true
      },
      {
        Header: '契約区分',
        accessor: 'contract',
        disableSortBy: true
      },
      {
        Header: '郵便番号',
        accessor: 'working_postal_code',
        disableSortBy: true
      },
      {
        Header: '住所',
        accessor: 'working_postal_address',
        disableSortBy: true
      },
      {
        Header: '休日',
        accessor: 'holiday',
        disableSortBy: true
      },
      {
        Header: 'HP掲載',
        accessor: 'hp_posting_flag',
        disableSortBy: true
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
          <Fragment>
            <ScrollX>
              <ReactTable
                columns={columns}
                data={tableData.project}
                handleAdd={handleAdd}
                getHeaderProps={(column: HeaderGroup) => column.getSortByToggleProps()}
              />
            </ScrollX>

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
              {add && <AddCustomer customer={customer} onCancel={handleAdd} onReload={() => setTableData} />}
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
