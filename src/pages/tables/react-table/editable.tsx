import { ReactElement } from 'react';

// material-ui
import { Grid } from '@mui/material';

// project import
import Layout from 'layout';
import Page from 'components/Page';
import EditableCell from 'sections/tables/react-table/EditableCell';
import EditableRow from 'sections/tables/react-table/EditableRow';

// ==============================|| REACT TABLE - EDITABLE ||============================== //

const EditableTable = () => (
  <Page title="Editable Table">
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <EditableRow />
      </Grid>
      <Grid item xs={12}>
        <EditableCell />
      </Grid>
    </Grid>
  </Page>
);

EditableTable.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export default EditableTable;
