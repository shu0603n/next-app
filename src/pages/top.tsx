import { ReactElement, useState, useEffect } from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';
import { Grid } from '@mui/material';

// project imports
import Layout from 'layout';
import Page from 'components/Page';
import HoverSocialCard from 'components/cards/statistics/HoverSocialCard';
import ReportCard from 'components/cards/statistics/ReportCard';

import { dispatch } from 'store';
import { openSnackbar } from 'store/reducers/snackbar';

import { ClockCircleOutlined } from '@ant-design/icons';
import { AttendanceType } from 'types/attendance/attendance';
// ===========================|| WIDGET - STATISTICS ||=========================== //
async function fetchTableData() {
  try {
    const selectData = {
      employee_id: 1,
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

  useEffect(() => {
    // ページがロードされたときにデータを取得
    fetchTableData()
      .then((data) => {
        setTableData(data.data.rows); // データを状態に設定
        console.log(data.data.rows);
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

  function getNow() {
    const now = new Date();
    const formattedTime = now.toLocaleString('ja-JP', {
      timeZone: 'Asia/Tokyo',
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric'
    });
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
    const seconds = now.getSeconds();

    // データベースに挿入する形式に整形
    const timeString = `${hours}:${minutes}:${seconds}`;

    const updatedData = {
      employee_id: 1,
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
    const seconds = now.getSeconds();

    // データベースに挿入する形式に整形
    const timeString = `${hours}:${minutes}:${seconds}`;

    const updatedData = {
      employee_id: 1,
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

  return (
    <Page title="Top">
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <ReportCard primary={currentTime} secondary="現在時刻" color={theme.palette.secondary.main} iconPrimary={ClockCircleOutlined} />
        </Grid>
        <Grid item xs={6}>
          <div onClick={workStart}>
            <HoverSocialCard primary="出勤" secondary={startTime ?? '打刻なし'} color={theme.palette.primary.main} />
          </div>
        </Grid>
        <Grid item xs={6}>
          <div onClick={workEnd}>
            <HoverSocialCard primary="退勤" secondary={endTime ?? '打刻なし'} color={theme.palette.error.main} />
          </div>
        </Grid>
      </Grid>
      {JSON.stringify(tableData)}
    </Page>
  );
};

Top.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export default Top;
