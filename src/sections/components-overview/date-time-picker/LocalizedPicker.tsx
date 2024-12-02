// material-ui
import { Stack } from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import ja from 'date-fns/locale/ja';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateField } from '@mui/x-date-pickers/DateField';
import { TimeField } from '@mui/x-date-pickers/TimeField';

// project import
import MainCard from 'components/MainCard';

// types

// ==============================|| DATE PICKER - LOCALIZED ||============================== //

export default function LocalizedPicker() {
  return (
    <MainCard title="Localization Picker">
      <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ja}>
        <Stack spacing={3} sx={{ width: 300 }}>
          <DateField label="Date" defaultValue={new Date('2022-04-17')} />
          <TimeField label="Time" defaultValue={new Date('2022-04-17T18:30')} />
        </Stack>
      </LocalizationProvider>
    </MainCard>
  );
}
