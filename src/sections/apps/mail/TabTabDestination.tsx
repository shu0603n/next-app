// material-ui
import { useRouter } from 'next/router';
import { Button, Chip, CircularProgress, Grid, Stack, Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';
import { useState, useEffect, useMemo } from 'react';
import { EmptyTable, TablePagination } from 'components/third-party/ReactTable';
import { GlobalFilter, DefaultColumnFilter, SelectColumnFilter, NumberRangeColumnFilter, renderFilterTypes } from 'utils/react-table';
import { PlusOutlined } from '@ant-design/icons';
import { useTable, useFilters, usePagination, useRowSelect, useGlobalFilter, Column, Row, HeaderGroup, Cell, CellProps } from 'react-table';
import { staffType } from 'types/staff/staff';
import { alertSnackBar } from 'function/alert/alertSnackBar';

// アセット

// ==============================|| アカウントプロファイル - 役割 ||============================== //

interface Props {
  columns: Column[];
  data: Array<staffType>;
  isComplete: boolean;
  onReload: (data: Array<any>) => void;
}

function ReactTable({ columns, data, isComplete, onReload }: Props) {
  const router = useRouter();
  const id = router.query.id as string;
  const filterTypes = useMemo(() => renderFilterTypes, []);
  const defaultColumn = useMemo(() => ({ Filter: DefaultColumnFilter }), []);
  const initialState = useMemo(
    () => ({ pageIndex: 0, pageSize: 100, selectedRowIds: { 0: true, 5: true, 7: true }, filters: [{ id: 'status', value: '' }] }),
    []
  );
  const [loading, setLoading] = useState(false);

  const handleAdd = () => {
    setLoading(true); // ローディング開始
    alertSnackBar('処理中…', 'secondary');
    fetch(`/api/db/mail/destination/insert?id=${id}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(rows.map((d: Row) => d.original))
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('更新に失敗しました。');
        }
        return response.json();
      })
      .then((data) => {
        alertSnackBar('正常に更新されました。', 'success');
        // reloadDataAfterAdd(data.data);
        // setIsEditing(false);
      })
      .catch((error) => {
        console.error('エラー:', error);
        alertSnackBar('データの更新に失敗しました。', 'error');
      })
      .finally(() => {
        // onCancel(false);
        setLoading(false); // ローディング終了
      });
  };
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    page,
    prepareRow,
    state,
    preGlobalFilteredRows,
    setGlobalFilter,
    gotoPage,
    setPageSize,
    state: { pageIndex, pageSize }
    // state: { selectedRowIds, pageIndex, pageSize },
    // selectedFlatRows
  } = useTable(
    {
      columns,
      data,
      defaultColumn,
      filterTypes,
      initialState
    },
    useGlobalFilter,
    useFilters,
    usePagination,
    useRowSelect
  );

  if (loading) {
    return <CircularProgress size={24} />;
  }
  return (
    <>
      {/* <TableRowSelection selected={Object.keys(selectedRowIds).length} /> */}
      <Stack direction="row" spacing={2} justifyContent="space-between" sx={{ padding: 2 }}>
        <GlobalFilter preGlobalFilteredRows={preGlobalFilteredRows} globalFilter={state.globalFilter} setGlobalFilter={setGlobalFilter} />
        <Button variant="contained" startIcon={<PlusOutlined />} onClick={handleAdd} size="small" disabled={isComplete}>
          {isComplete ? '設定済み' : '送信先を設定する'}
        </Button>
      </Stack>

      <Table {...getTableProps()}>
        <TableHead sx={{ borderTopWidth: 2 }}>
          {headerGroups.map((headerGroup, index: number) => (
            <TableRow {...headerGroup.getHeaderGroupProps()} key={index}>
              {headerGroup.headers.map((column: HeaderGroup, i: number) => (
                <TableCell {...column.getHeaderProps([{ className: column.className }])} key={i}>
                  {column.render('Header')}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableHead>
        <TableBody {...getTableBodyProps()}>
          {headerGroups.map((group: HeaderGroup<{}>, index: number) => (
            <TableRow {...group.getHeaderGroupProps()} key={index}>
              {group.headers.map((column: HeaderGroup, i: number) => (
                <TableCell {...column.getHeaderProps([{ className: column.className }])} key={i}>
                  {column.canFilter ? column.render('Filter') : null}
                </TableCell>
              ))}
            </TableRow>
          ))}
          {page.length > 0 ? (
            page.map((row, i) => {
              prepareRow(row);
              return (
                <TableRow {...row.getRowProps()} key={i}>
                  {row.cells.map((cell: Cell, index: number) => (
                    <TableCell {...cell.getCellProps([{ className: cell.column.className }])} key={index}>
                      {cell.render('Cell')}
                    </TableCell>
                  ))}
                </TableRow>
              );
            })
          ) : (
            <EmptyTable msg="No Data" colSpan={7} />
          )}
          <TableRow>
            <TableCell sx={{ p: 2, pb: 0 }} colSpan={8}>
              <TablePagination gotoPage={gotoPage} rows={rows} setPageSize={setPageSize} pageSize={pageSize} pageIndex={pageIndex} />
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </>
  );
}

async function fetchTableData(id: string) {
  try {
    const response = await fetch(`/api/db/mail/destination/select?id=${id}`);
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

const TabDestination = () => {
  const [data, setData] = useState<staffType[]>([]);
  const [isComplete, setisComplete] = useState<boolean>(false);
  const router = useRouter();
  const id = router.query.id as string;

  const handleRelod = (newData: Array<any>) => {
    setData(newData);
  };

  useEffect(() => {
    // ページがロードされたときにデータを取得
    fetchTableData(id)
      .then((fetchedData) => {
        setData(fetchedData.data);
        setisComplete(fetchedData.isComplete);
      })
      .catch((error) => {
        // エラーハンドリング
        console.error('Error:', error);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const columns = useMemo(
    () =>
      [
        {
          Header: 'ID',
          accessor: 'id',
          Filter: NumberRangeColumnFilter,
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
          Header: '年齢',
          accessor: 'age',
          Filter: NumberRangeColumnFilter,
          filter: 'between'
        },
        {
          Header: 'ステータス',
          accessor: 'staff_status',
          Filter: SelectColumnFilter,
          filter: 'includes',
          // Cell: ({ value }: { value: string }) => {
          Cell: ({ value }: CellProps<any>) => {
            switch (value?.name) {
              case '新規':
                return <Chip color="success" label="新規" size="small" variant="light" />;
              case '既存':
                return <Chip color="primary" label="既存" size="small" variant="light" />;
              case '稼働中':
                return <Chip color="primary" label="稼働中" size="small" variant="light" />;
              case 'BL':
                return <Chip color="primary" label="BL" size="small" variant="light" />;
              case '抹消':
                return <Chip color="error" label="抹消" size="small" variant="light" />;
              case '配信停止':
                return <Chip color="error" label="配信停止" size="small" variant="light" />;
              case '空白':
                return <Chip color="error" label="空白" size="small" variant="light" />;
              default:
                return <Chip color="info" label="None" size="small" variant="light" />;
            }
          }
        }
      ] as Column[],
    []
  );

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        {data && <ReactTable columns={columns} data={data} onReload={handleRelod} isComplete={isComplete}/>}
      </Grid>
    </Grid>
  );
};

export default TabDestination;
