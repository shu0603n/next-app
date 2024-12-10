import { useState } from 'react';

// material-ui
import { DialogContent, DialogTitle, Divider, Grid, FormHelperText, Stack } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers';

import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import ja from 'date-fns/locale/ja';

// third-party
import * as Yup from 'yup';
import { useFormik, Form, FormikProvider } from 'formik';

import * as yup from 'yup';

// assets
import { EmployeeType } from 'types/employee/employee';
import CsvFile from 'components/third-party/dropzone/CsvFile';
import { CustomFile } from 'types/dropzone';

// ==============================|| CUSTOMER ADD / EDIT ||============================== //

export interface Props {
  customer?: any;
  onCancel: () => void;
  onReload: (data: EmployeeType) => void;
}

const AddCustomer = ({ customer, onCancel, onReload }: Props) => {
  const [data, setData] = useState<CustomFile[] | null>();
  const CustomerSchema = Yup.object().shape({
    files: yup.mixed().required('Avatar is a required.')
  });

  const formik = useFormik({
    initialValues: { files: null },
    validationSchema: CustomerSchema,
    onSubmit: (values: any) => {
      setData({ ...values, flag: '未送信' });
    }
  });
  const { errors, touched, handleSubmit, setFieldValue } = formik;

  return (
    <>
      <FormikProvider value={formik}>
        <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ja}>
          <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
            <DialogTitle>{customer ? 'Edit Customer' : 'New Customer'}</DialogTitle>
            <Divider />
            <DialogContent sx={{ p: 2.5 }}>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  {JSON.stringify(data)}
                  <Stack spacing={1.5} alignItems="center">
                    <CsvFile setFieldValue={setFieldValue} onRelode={setData} file={data ?? null} error={touched.files && !!errors.files} />
                    {touched.files && errors.files && (
                      <FormHelperText error id="standard-weight-helper-text-password-login">
                        {errors.files}
                      </FormHelperText>
                    )}
                  </Stack>
                </Grid>
              </Grid>
            </DialogContent>
            <Divider />
          </Form>
        </LocalizationProvider>
      </FormikProvider>
    </>
  );
};

export default AddCustomer;
