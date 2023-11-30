import { ReactElement, useState } from 'react';
// material-ui
import { FormHelperText, Grid, Stack, Typography } from '@mui/material';

// project imports
import Layout from 'layout';
import Page from 'components/Page';
import MainCard from 'components/MainCard';
import CsvFile from 'components/third-party/dropzone/CsvFile';
import { PopupTransition } from 'components/@extended/Transitions';
// third-party
import { Formik } from 'formik';
import * as yup from 'yup';

import { useMemo } from 'react';

// material-ui
import { Button, Chip, Dialog, Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';

// third-party
import { useTable, useFilters, usePagination, useRowSelect, useGlobalFilter, Column, Row, HeaderGroup, Cell } from 'react-table';

// project import
import ScrollX from 'components/ScrollX';
import { CSVExport, EmptyTable, TablePagination } from 'components/third-party/ReactTable';
// import { IndeterminateCheckbox, TableRowSelection } from 'components/third-party/ReactTable';
import { PlusOutlined } from '@ant-design/icons';

import { GlobalFilter, DefaultColumnFilter, SelectColumnFilter, NumberRangeColumnFilter, renderFilterTypes } from 'utils/react-table';
import AddCustomer from 'sections/apps/mail/AddCustomer';

// ==============================|| SAMPLE PAGE ||============================== //
type mailListType = {
  id: number;
  name: string;
  mail: string;
  age: number;
  status: string;
  flag: string;
};

interface Props {
  columns: Column[];
  data: Array<mailListType>;
  onReload: (data: Array<any>) => void;
}

function ReactTable({ columns, data, onReload }: Props) {
  const filterTypes = useMemo(() => renderFilterTypes, []);
  const defaultColumn = useMemo(() => ({ Filter: DefaultColumnFilter }), []);
  const initialState = useMemo(
    () => ({ pageIndex: 0, pageSize: 10, selectedRowIds: { 0: true, 5: true, 7: true }, filters: [{ id: 'status', value: '' }] }),
    []
  );

  const [add, setAdd] = useState<boolean>(false);
  const handleAdd = () => {
    setAdd(!add);
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
    // (hooks) => {
    //   hooks.allColumns.push((columns: Column[]) => [
    //     {
    //       id: 'row-selection-chk',
    //       accessor: 'Selection',
    //       Header: ({ getToggleAllPageRowsSelectedProps }) => (
    //         <IndeterminateCheckbox indeterminate {...getToggleAllPageRowsSelectedProps()} />
    //       ),
    //       disableSortBy: true,
    //       disableFilters: true,
    //       Cell: ({ row }: any) => <IndeterminateCheckbox {...row.getToggleRowSelectedProps()} />
    //     },
    //     ...columns
    //   ]);
    // }
  );

  return (
    <>
      {/* <TableRowSelection selected={Object.keys(selectedRowIds).length} /> */}
      <Stack direction="row" spacing={2} justifyContent="space-between" sx={{ padding: 2 }}>
        <GlobalFilter preGlobalFilteredRows={preGlobalFilteredRows} globalFilter={state.globalFilter} setGlobalFilter={setGlobalFilter} />
        <CSVExport data={rows.map((d: Row) => d.original)} filename={'filtering-table.csv'} />
        <Button variant="contained" startIcon={<PlusOutlined />} onClick={handleAdd} size="small">
          メール作成
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
        {add && <AddCustomer customer={rows.map((d: Row) => d.original)} onCancel={handleAdd} onReload={onReload} />}
      </Dialog>
    </>
  );
}

const Mail = () => {
  const [data, setData] = useState<Array<any> | undefined>();

  const handleRelod = (newData: Array<any>) => {
    setData(newData);
  };
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
          accessor: 'email'
        },
        {
          Header: '年齢',
          accessor: 'age',
          Filter: NumberRangeColumnFilter,
          filter: 'between'
        },
        {
          Header: 'ステータス',
          accessor: 'status',
          Filter: SelectColumnFilter,
          filter: 'includes',
          Cell: ({ value }: { value: string | undefined }) => {
            switch (value) {
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
        },
        {
          Header: 'フラグ',
          accessor: 'flag',
          Filter: SelectColumnFilter,
          filter: 'includes',
          Cell: ({ value }: { value: string | undefined }) => {
            switch (value) {
              case '送信済み':
                return <Chip color="success" label="送信済み" size="small" variant="light" />;
              case 'エラー':
                return <Chip color="error" label="エラー" size="small" variant="light" />;
              default:
                return <Chip color="info" label="未送信" size="small" variant="light" />;
            }
          }
        }
      ] as Column[],
    []
  );

  return (
    <Page title="Mail">
      <MainCard title="Mail">
        <Typography variant="body2">
          <Grid item xs={12}>
            <Formik
              initialValues={{ files: null }}
              onSubmit={(values: any) => {
                setData({ ...values, flag: '未送信' });
              }}
              validationSchema={yup.object().shape({
                files: yup.mixed().required('Avatar is a required.')
              })}
            >
              {({ values, handleSubmit, setFieldValue, touched, errors }) => (
                <form onSubmit={handleSubmit}>
                  <Grid container spacing={3}>
                    <Grid item xs={12}>
                      <Stack spacing={1.5} alignItems="center">
                        <CsvFile
                          setFieldValue={setFieldValue}
                          onRelode={setData}
                          file={values.files}
                          error={touched.files && !!errors.files}
                        />
                        {touched.files && errors.files && (
                          <FormHelperText error id="standard-weight-helper-text-password-login">
                            {errors.files}
                          </FormHelperText>
                        )}
                      </Stack>
                    </Grid>
                  </Grid>
                </form>
              )}
            </Formik>
          </Grid>
        </Typography>
        {data && (
          <MainCard content={false}>
            <ScrollX>
              <ReactTable columns={columns} data={data} onReload={handleRelod} />
            </ScrollX>
          </MainCard>
        )}
      </MainCard>
    </Page>
  );
};

Mail.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export default Mail;
