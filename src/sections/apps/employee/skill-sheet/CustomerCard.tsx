import { Fragment, useState } from 'react';

// material-ui
import { Box, Chip, Dialog, Divider, Grid, List, ListItem, ListItemText, Stack, Typography } from '@mui/material';

// third-party

// project import

import AddCustomer from 'sections/apps/customer/AddCustomer';
import MainCard from 'components/MainCard';
import { PopupTransition } from 'components/@extended/Transitions';
import { ProjectCardType } from 'types/skillSheet';
import { ParameterType, SkillParameterType } from 'types/parameter/parameter';

// ==============================|| CUSTOMER - CARD ||============================== //

const formatDate = (isoDate: string) => {
  const date = new Date(isoDate);
  return date.toLocaleDateString('ja-JP', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  });
};

const CustomerCard = ({ customer }: { customer: ProjectCardType }) => {
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
                  <Stack
                    direction={{ xs: 'column', sm: 'row' }} // xsでは縦表示、sm以上では横表示
                    justifyContent={{ xs: 'flex-start', sm: 'space-between' }} // xsでは左揃え
                    alignItems="flex-start" // xsでもsmでも左揃え
                    sx={{ width: '100%' }}
                  >
                    <Typography variant="h4" component="span">
                      <Typography variant="h3" component="span" color="primary">
                        {customer.project_title || ''}
                      </Typography>
                    </Typography>
                    <Typography variant="h4" color="text.secondary">
                      {customer.start_date ? formatDate(customer.start_date) : ''} ~{' '}
                      {customer.end_date ? formatDate(customer.end_date) : '現在就業中'}
                    </Typography>
                  </Stack>
                }
                secondary={
                  <Typography variant="caption" color="secondary">
                    {customer.client?.name}
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
                {customer?.description
                  ? customer.description.split('\n').map((val, index) => (
                      <Fragment key={index}>
                        {val}
                        <br />
                      </Fragment>
                    ))
                  : ``}
              </Typography>
            </Grid>
          </Grid>
          <Grid item xs={12} md={5}>
            {customer?.people_number !== null && (
              <Grid item xs={12}>
                <Typography variant="h5" component="span">
                  規模・人数
                </Typography>
                <Typography>{`${customer?.people_number}人`}</Typography>
              </Grid>
            )}

            {customer.employee_project_skills?.some((skill) => skill) && (
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
                    {customer.employee_project_skills.map((skill: SkillParameterType, index: number) => (
                      <ListItem disablePadding key={index} sx={{ width: 'auto', pr: 0.75, pb: 0.75 }}>
                        <Chip color="secondary" variant="outlined" size="small" label={skill.name} />
                      </ListItem>
                    ))}
                  </Box>
                </Box>
              </Grid>
            )}
            {customer.employee_project_processes?.some((employee_project_processes) => process) && (
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
                    {customer.employee_project_processes.map((process: ParameterType, index: number) => (
                      <ListItem disablePadding key={index} sx={{ width: 'auto', pr: 0.75, pb: 0.75 }}>
                        <Chip color="secondary" variant="outlined" size="small" label={process.name} />
                      </ListItem>
                    ))}
                  </Box>
                </Box>
              </Grid>
            )}
          </Grid>
        </Grid>
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
