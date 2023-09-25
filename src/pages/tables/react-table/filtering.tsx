import { useMemo, ReactElement } from 'react';

// material-ui
import { Chip, Stack, Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';

// third-party
import { useTable, useFilters, useGlobalFilter, Column, Row, HeaderGroup, Cell } from 'react-table';

// project import
import Layout from 'layout';
import Page from 'components/Page';
import MainCard from 'components/MainCard';
import ScrollX from 'components/ScrollX';
import { CSVExport, EmptyTable } from 'components/third-party/ReactTable';
import LinearWithLabel from 'components/@extended/progress/LinearWithLabel';

import makeData from 'data/react-table';
import {
  GlobalFilter,
  DefaultColumnFilter,
  SelectColumnFilter,
  SliderColumnFilter,
  NumberRangeColumnFilter,
  renderFilterTypes,
  filterGreaterThan
} from 'utils/react-table';

// ==============================|| REACT TABLE ||============================== //

function ReactTable({ columns, data }: { columns: Column[]; data: [] }) {
  const filterTypes = useMemo(() => renderFilterTypes, []);
  const defaultColumn = useMemo(() => ({ Filter: DefaultColumnFilter }), []);
  const initialState = useMemo(() => ({ filters: [{ id: 'status', value: '' }] }), []);

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow, state, preGlobalFilteredRows, setGlobalFilter } = useTable(
    {
      columns,
      data,
      defaultColumn,
      initialState,
      filterTypes
    },
    useGlobalFilter,
    useFilters
  );

  const sortingRow = rows.slice(0, 10);

  return (
    <>
      <Stack direction="row" spacing={2} justifyContent="space-between" sx={{ padding: 2 }}>
        <GlobalFilter preGlobalFilteredRows={preGlobalFilteredRows} globalFilter={state.globalFilter} setGlobalFilter={setGlobalFilter} />
        <CSVExport data={rows.map((d: Row) => d.original)} filename={'filtering-table.csv'} />
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
          {sortingRow.length > 0 ? (
            sortingRow.map((row, i) => {
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
        </TableBody>
      </Table>
    </>
  );
}

// ==============================|| REACT TABLE - FILTERING ||============================== //

const FilteringTable = () => {
  const data = useMemo(() => makeData(2000), []);

  const columns = useMemo(
    () =>
      [
        {
          Header: 'First Name',
          accessor: 'firstName'
        },
        {
          Header: 'Last Name',
          accessor: 'lastName',
          filter: 'fuzzyText'
        },
        {
          Header: 'Email',
          accessor: 'email'
        },
        {
          Header: 'Age',
          accessor: 'age',
          className: 'cell-right',
          Filter: SliderColumnFilter,
          filter: 'equals'
        },
        {
          Header: 'Visits',
          accessor: 'visits',
          className: 'cell-right',
          Filter: NumberRangeColumnFilter,
          filter: 'between'
        },
        {
          Header: 'Status',
          accessor: 'status',
          Filter: SelectColumnFilter,
          filter: 'includes',
          Cell: ({ value }: { value: string }) => {
            switch (value) {
              case 'Complicated':
                return <Chip color="error" label="Complicated" size="small" variant="light" />;
              case 'Relationship':
                return <Chip color="success" label="Relationship" size="small" variant="light" />;
              case 'Single':
              default:
                return <Chip color="info" label="Single" size="small" variant="light" />;
            }
          }
        },
        {
          Header: 'Profile Progress',
          accessor: 'progress',
          Filter: SliderColumnFilter,
          filter: filterGreaterThan,
          Cell: ({ value }: { value: number }) => <LinearWithLabel value={value} sx={{ minWidth: 75 }} />
        }
      ] as Column[],
    []
  );

  return (
    <Page title="Filtering Table">
      <MainCard content={false}>
        <ScrollX>
          <ReactTable columns={columns} data={data} />
        </ScrollX>
      </MainCard>
    </Page>
  );
};

FilteringTable.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export default FilteringTable;
