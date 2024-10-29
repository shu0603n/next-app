import { Fragment, useState } from 'react';

// material-ui
import { Box, Chip, Dialog, Divider, Grid, List, ListItem, ListItemText, Stack, Typography } from '@mui/material';

// third-party

// project import

import AddCustomer from 'sections/apps/customer/AddCustomer';
import MainCard from 'components/MainCard';
import { PopupTransition } from 'components/@extended/Transitions';

// ==============================|| CUSTOMER - CARD ||============================== //

type ProjectCard = {
  id: number;
  start_date: string;
  end_date: string;
  people: number;
  client: string;
  project_title: string;
  description: string;
  skills: string[];
  process: string[];
  time: string;
};

const formatDate = (isoDate: string) => {
  const date = new Date(isoDate);
  return date
    .toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    })
    .replace(/\//g, '/');
};

const CustomerCard = ({ customer }: { customer: ProjectCard }) => {
  const [add, setAdd] = useState<boolean>(false);
  const handleAdd = () => {
    setAdd(!add);
  };

  return (
    <>
      <MainCard sx={{ height: 1, '& .MuiCardContent-root': { height: 1, display: 'flex', flexDirection: 'column' } }}>
        <Grid id="print" container spacing={2.25}>
          <Grid item xs={12}>
            <List sx={{ width: 1, p: 0 }}>
              <ListItemText
                primary={
                  <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ width: '100%' }}>
                    <Typography variant="h4" component="span">
                      <Typography variant="h3" component="span" color="primary">
                        {customer.project_title}
                      </Typography>
                    </Typography>
                    {customer.start_date && (
                      <Typography variant="h4" color="text.secondary">
                        ({formatDate(customer.start_date)}~{formatDate(customer.end_date)})
                      </Typography>
                    )}
                  </Stack>
                }
                secondary={
                  <Typography variant="caption" color="secondary">
                    {customer.client}
                  </Typography>
                }
              />
            </List>
          </Grid>
          <Grid item xs={12}>
            <Divider />
          </Grid>
          <Grid item xs={12} md={7}>
            <Grid item xs={12}>
              <Typography variant="h5" component="span">
                業務内容
              </Typography>
              <Typography>
                {customer.description.split('\r\n').map((val, index) => (
                  <Fragment key={index}>
                    {val}
                    <br />
                  </Fragment>
                ))}
              </Typography>
            </Grid>
          </Grid>
          <Grid item xs={12} md={5}>
            <Grid item xs={12}>
              <Typography variant="h5" component="span">
                使用スキル
              </Typography>
              <Box>
                <Box
                  sx={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    listStyle: 'none',
                    p: 0.5,
                    m: 0
                  }}
                  component="ul"
                >
                  {customer.skills?.map((skill: string, index: number) => (
                    <ListItem disablePadding key={index} sx={{ width: 'auto', pr: 0.75, pb: 0.75 }}>
                      <Chip color="secondary" variant="outlined" size="small" label={skill} />
                    </ListItem>
                  ))}
                </Box>
              </Box>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="h5" component="span">
                担当工程
              </Typography>
              <Box>
                <Box
                  sx={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    listStyle: 'none',
                    p: 0.5,
                    m: 0
                  }}
                  component="ul"
                >
                  {customer.process?.map((skill: string, index: number) => (
                    <ListItem disablePadding key={index} sx={{ width: 'auto', pr: 0.75, pb: 0.75 }}>
                      <Chip color="secondary" variant="outlined" size="small" label={skill} />
                    </ListItem>
                  ))}
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Grid>
        <Stack
          direction="row"
          className="hideforPDf"
          alignItems="center"
          spacing={1}
          justifyContent="space-between"
          sx={{ mt: 'auto', mb: 0, pt: 2.25 }}
        >
          <Typography variant="caption" color="secondary">
            Updated in {customer.time}
          </Typography>
        </Stack>
      </MainCard>

      {/* edit customer dialog */}
      <Dialog
        maxWidth="sm"
        fullWidth
        TransitionComponent={PopupTransition}
        onClose={handleAdd}
        open={add}
        sx={{ '& .MuiDialog-paper': { p: 0 } }}
      >
        <AddCustomer customer={customer} onCancel={handleAdd} />
      </Dialog>
    </>
  );
};

export default CustomerCard;
