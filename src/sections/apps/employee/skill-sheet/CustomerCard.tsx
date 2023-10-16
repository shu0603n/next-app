import { useState } from 'react';

// material-ui
import { Box, Chip, Dialog, Divider, Grid, List, ListItem, ListItemText, Stack, Typography } from '@mui/material';

// third-party

// project import

import AddCustomer from 'sections/apps/customer/AddCustomer';
import MainCard from 'components/MainCard';
import { PopupTransition } from 'components/@extended/Transitions';

// assets

// types

// ==============================|| CUSTOMER - CARD ||============================== //

type PojectCard = {
  id: number;
  start_date: string;
  end_date: string;
  people: number;
  client: string;
  title: string;
  description: string;
  skills: string[];
  process: string[];
  time: string;
};

const CustomerCard = ({ customer }: { customer: PojectCard }) => {
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
                  <>
                    {customer.start_date && <Typography variant="subtitle1">{`(${customer.start_date}~${customer.end_date})`}</Typography>}
                    <Typography variant="subtitle1">{customer.title}</Typography>
                  </>
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
          <Grid item xs={12}>
            <Typography> {customer.description}</Typography>
          </Grid>
          <Grid item xs={12}>
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
                {customer.skills.map((skill: string, index: number) => (
                  <ListItem disablePadding key={index} sx={{ width: 'auto', pr: 0.75, pb: 0.75 }}>
                    <Chip color="secondary" variant="outlined" size="small" label={skill} />
                  </ListItem>
                ))}
              </Box>
            </Box>
          </Grid>
          <Grid item xs={12}>
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
                {customer.process.map((skill: string, index: number) => (
                  <ListItem disablePadding key={index} sx={{ width: 'auto', pr: 0.75, pb: 0.75 }}>
                    <Chip color="secondary" variant="outlined" size="small" label={skill} />
                  </ListItem>
                ))}
              </Box>
            </Box>
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
