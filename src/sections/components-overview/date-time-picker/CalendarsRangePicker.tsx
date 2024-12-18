import { useState } from 'react';

// material-ui
import { Typography } from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import ja from 'date-fns/locale/ja';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateRangePicker } from '@mui/x-date-pickers-pro/DateRangePicker';

// project import
import MainCard from 'components/MainCard';

// ==============================|| DATE PICKER - NO. OF CALENDERS ||============================== //

export default function CalendarsRangePicker() {
  const [value, setValue] = useState<any>([null, null]);

  return (
    <MainCard title="Calendars Range Picker">
      <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ja}>
        <DateRangePicker
          calendars={1}
          value={value}
          onChange={(newValue: any) => {
            setValue(newValue);
          }}
        />
        <Typography sx={{ mt: 2, mb: 1 }}>2 calendars</Typography>
        <DateRangePicker
          calendars={2}
          value={value}
          onChange={(newValue: any) => {
            setValue(newValue);
          }}
        />
        <Typography sx={{ mt: 2, mb: 1 }}>3 calendars</Typography>
        <DateRangePicker
          calendars={3}
          value={value}
          onChange={(newValue: any) => {
            setValue(newValue);
          }}
        />
      </LocalizationProvider>
    </MainCard>
  );
}
