import { Fragment, useState } from 'react';

// material-ui
import { Box, Chip, Dialog, Divider, Grid, List, ListItem, ListItemText, Typography } from '@mui/material';

import AddCustomer from 'sections/apps/customer/AddCustomer';
import MainCard from 'components/MainCard';
import { PopupTransition } from 'components/@extended/Transitions';
import { ProjectCard } from 'types/project/project';

// ==============================|| CUSTOMER - CARD ||============================== //
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
                  <>
                    <Typography variant="h4" component="span">
                      <Typography variant="h3" component="span" color="primary">
                        {customer.project_title}
                      </Typography>
                      {customer.working_start_time && `(${customer.working_start_time}~${customer.working_end_time})`}
                    </Typography>
                  </>
                }
                secondary={
                  <Typography variant="caption" color="secondary">
                    {customer.client && customer.client.name}
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
                {customer.description?.split('\r\n').map((val, index) => (
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
                  {customer.project_skills.map((skill: any, index: number) => (
                    <ListItem disablePadding key={index} sx={{ width: 'auto', pr: 0.75, pb: 0.75 }}>
                      <Chip color="secondary" variant="outlined" size="small" label={skill.skill.name} />
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
                  {customer.project_process.map((process: any, index: number) => (
                    <ListItem disablePadding key={index} sx={{ width: 'auto', pr: 0.75, pb: 0.75 }}>
                      <Chip color="secondary" variant="outlined" size="small" label={process.process.name} />
                    </ListItem>
                  ))}
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Grid>
        {/* <Stack
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
        </Stack> */}
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
