import { useEffect, useMemo, useState, Fragment, MouseEvent, ReactElement } from 'react';

// material-ui
import { alpha, useTheme } from '@mui/material/styles';
import { Grid, Dialog, Stack, Table, TableBody, TableCell, TableHead, TableRow, Tooltip, useMediaQuery } from '@mui/material';

// project imports
import Layout from 'layout';
import Page from 'components/Page';
import HoverSocialCard from 'components/cards/statistics/HoverSocialCard';
import ReportCard from 'components/cards/statistics/ReportCard';

import { dispatch } from 'store';
import { openSnackbar } from 'store/reducers/snackbar';

import { ClockCircleOutlined } from '@ant-design/icons';
import { AttendanceType } from 'types/attendance/attendance';
import ScrollX from 'components/ScrollX';
import IconButton from 'components/@extended/IconButton';

// material-ui

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
import { PopupTransition } from 'components/@extended/Transitions';
import { CSVExport, HeaderSort, TablePagination, TableRowSelection } from 'components/third-party/ReactTable';

import AddCustomer from 'sections/apps/attendance/AddCustomer';

import { renderFilterTypes } from 'utils/react-table';

// assets
import { EditTwoTone } from '@ant-design/icons';
import useUser from 'hooks/useUser';

function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month, 0).getDate();
}

export const processAttendanceData = (attendanceData: AttendanceType[]): Array<AttendanceType> => {
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth() + 1;
  const daysInMonth = getDaysInMonth(currentYear, currentMonth);

  const result: Record<string, AttendanceType> = {};

  for (let i = 1; i <= daysInMonth; i++) {
    const currentDateStr = new Date(currentYear, currentMonth - 1, i); // 日付を Date 型に保持
    const formattedDate = `${currentDateStr.getFullYear()}/${(currentDateStr.getMonth() + 1).toString().padStart(2, '0')}/${currentDateStr
      .getDate()
      .toString()
      .padStart(2, '0')}`;

    const matchingRecord = attendanceData.find((record) => {
      // 文字列から Date オブジェクトに変換
      const recordDate = new Date(record.date);
      const recordDateString = `${recordDate.getFullYear()}/${(recordDate.getMonth() + 1).toString().padStart(2, '0')}/${recordDate
        .getDate()
        .toString()
        .padStart(2, '0')}`;
      return recordDateString === formattedDate;
    });

    if (matchingRecord) {
      result[formattedDate] = matchingRecord;
    } else {
      result[formattedDate] = {
        employee_id: 1, // Replace with the appropriate default value
        date: formattedDate,
        start_time: '',
        end_time: '',
        location: ''
      };
    }
  }

  return Object.values(result);
};

// ==============================|| REACT TABLE ||============================== //

// Propsインターフェース
interface Props {
  columns: Column[];
  data: Array<AttendanceType>;
  handleAdd: () => void;
  getHeaderProps: (column: HeaderGroup) => {};
}

// ReactTableコンポーネント
function ReactTable({ columns, data, handleAdd, getHeaderProps }: Props) {
  const theme = useTheme();
  const matchDownSM = useMediaQuery(theme.breakpoints.down('sm'));

  const filterTypes = useMemo(() => renderFilterTypes, []);

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    setHiddenColumns,
    rows,
    page,
    gotoPage,
    setPageSize,
    state: { selectedRowIds, pageIndex, pageSize },
    selectedFlatRows
  } = useTable(
    {
      columns,
      data,
      filterTypes,
      initialState: { pageIndex: 0, pageSize: 50 }
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
      setHiddenColumns(['employee_id', 'location']);
    } else {
      setHiddenColumns(['employee_id']);
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
          <Stack direction={matchDownSM ? 'column' : 'row'} alignItems="center" spacing={1}>
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
// ===========================|| WIDGET - STATISTICS ||=========================== //
async function fetchTableData(id: number) {
  try {
    const selectData = {
      employee_id: id,
      date: new Date()
    };

    // 2. APIにデータを送信

    const response = await fetch(`/api/db/attendance/select`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(selectData)
    });
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

const Top = () => {
  const theme = useTheme();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const [tableData, setTableData] = useState<Array<AttendanceType>>(); // データを保持する状態変数
  const user = useUser();

  useEffect(() => {
    // ページがロードされたときにデータを取得
    fetchTableData(Number(user?.id))
      .then((data) => {
        setTableData(data.data.rows); // データを状態に設定
        const now = new Date();

        const today = data.data.rows.filter((item: AttendanceType) => {
          const itemDate = new Date(item.date);
          return (
            itemDate.getFullYear() === now.getFullYear() && itemDate.getMonth() === now.getMonth() && itemDate.getDate() === now.getDate()
          );
        });
        setStartTime(today[0].start_time);
        setEndTime(today[0].end_time);
      })

      .catch((error) => {
        // エラーハンドリング
        console.error('Error:', error);
      });
  }, []); // 空の依存リストを指定することで、一度だけ実行される

  const [startTime, setStartTime] = useState<string>();
  const [endTime, setEndTime] = useState<string>();
  const [currentTime, setCurrentTime] = useState<string>(getNow()); // 現在時刻のステート

  function getDayOfWeek(date: Date) {
    const daysOfWeek = ['日', '月', '火', '水', '木', '金', '土'];
    const dayIndex = date.getDay();
    return daysOfWeek[dayIndex];
  }

  function getNow() {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth() + 1;
    const day = now.getDate();
    const dayOfWeek = getDayOfWeek(now);
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const seconds = now.getSeconds().toString().padStart(2, '0');
    const formattedTime = `${year}/${month}/${day}(${dayOfWeek}) ${hours}:${minutes}:${seconds}`;
    return formattedTime;
  }

  // 1秒ごとに現在時刻を更新
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(getNow());
    }, 1000);

    return () => {
      clearInterval(interval);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const workStart = () => {
    dispatch(
      openSnackbar({
        open: true,
        message: '更新処理中…',
        variant: 'alert',
        alert: {
          color: 'secondary'
        },
        close: false
      })
    );

    const now = new Date();

    // 時、分、秒を取得
    const hours = now.getHours();
    const minutes = now.getMinutes();

    // データベースに挿入する形式に整形
    const timeString = `${hours}:${minutes}`;

    const updatedData = {
      employee_id: Number(user?.id),
      date: now,
      start_time: timeString,
      location: ''
    };

    // 2. APIにデータを送信
    fetch(`/api/db/attendance/start/update`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(updatedData)
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('API request failed');
        }
        return response.json();
      })
      .then((responseData) => {
        setStartTime(timeString);
        setTableData(responseData.data.rows);
        dispatch(
          openSnackbar({
            open: true,
            message: '正常に更新されました。',
            variant: 'alert',
            alert: {
              color: 'success'
            },
            close: false
          })
        );
      })
      .catch((error) => {
        console.error('Error updating data:', error);
        dispatch(
          openSnackbar({
            open: true,
            message: 'データの更新に失敗しました。',
            variant: 'alert',
            alert: {
              color: 'error'
            },
            close: false
          })
        );
      });
  };

  const workEnd = () => {
    dispatch(
      openSnackbar({
        open: true,
        message: '更新処理中…',
        variant: 'alert',
        alert: {
          color: 'secondary'
        },
        close: false
      })
    );

    const now = new Date();

    // 時、分、秒を取得
    const hours = now.getHours();
    const minutes = now.getMinutes();

    // データベースに挿入する形式に整形
    const timeString = `${hours}:${minutes}`;

    const updatedData = {
      employee_id: Number(user?.id),
      date: now,
      end_time: timeString,
      location: ''
    };

    // 2. APIにデータを送信
    fetch(`/api/db/attendance/end/update`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(updatedData)
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('API request failed');
        }
        return response.json();
      })
      .then((responseData) => {
        setEndTime(timeString);
        setTableData(responseData.data.rows);
        dispatch(
          openSnackbar({
            open: true,
            message: '正常に更新されました。',
            variant: 'alert',
            alert: {
              color: 'success'
            },
            close: false
          })
        );
      })
      .catch((error) => {
        console.error('Error updating data:', error);
        dispatch(
          openSnackbar({
            open: true,
            message: 'データの更新に失敗しました。',
            variant: 'alert',
            alert: {
              color: 'error'
            },
            close: false
          })
        );
      });
  };
  const [customer, setCustomer] = useState<any>(null);
  const [add, setAdd] = useState<boolean>(false);

  const handleAdd = () => {
    setAdd(!add);
    if (customer && !add) setCustomer(null);
  };

  const columns = useMemo(
    () => [
      {
        Header: '社員ID',
        accessor: 'employee_id'
      },
      {
        Header: '日付',
        accessor: 'date'
      },
      {
        Header: '開始時刻',
        accessor: 'start_time'
      },
      {
        Header: '終了時刻',
        accessor: 'end_time'
      },
      {
        Header: '勤務場所',
        accessor: 'location'
      },
      {
        Header: 'アクション',
        disableSortBy: true,
        Cell: ({ row }: { row: Row<{}> }) => {
          return (
            <Stack direction="row" spacing={0}>
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
            </Stack>
          );
        }
      }
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [theme]
  );
  return (
    <Page title="Top">
      {tableData && (
        <>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <ReportCard
                primary={currentTime}
                secondary="現在時刻"
                color={theme.palette.secondary.main}
                iconPrimary={ClockCircleOutlined}
              />
            </Grid>
            <Grid item xs={6}>
              {startTime ? (
                <HoverSocialCard primary="出勤済み" secondary={startTime} color={theme.palette.grey[500]} />
              ) : (
                <div onClick={workStart}>
                  <HoverSocialCard primary="打刻なし" secondary={'出勤'} color={theme.palette.primary.main} />
                </div>
              )}
            </Grid>
            <Grid item xs={6}>
              {endTime ? (
                <HoverSocialCard primary="退勤済み" secondary={endTime} color={theme.palette.grey[500]} />
              ) : (
                <div onClick={workEnd}>
                  <HoverSocialCard primary="打刻なし" secondary={'退勤'} color={theme.palette.warning.main} />
                </div>
              )}
            </Grid>
          </Grid>
          <ScrollX>
            <ReactTable
              columns={columns}
              data={processAttendanceData(tableData)}
              handleAdd={handleAdd}
              getHeaderProps={(column: HeaderGroup) => column.getSortByToggleProps()}
            />
          </ScrollX>
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
            {add && <AddCustomer customer={customer} onCancel={handleAdd} onReload={setTableData} />}
          </Dialog>
        </>
      )}
    </Page>
  );
};

Top.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export default Top;
