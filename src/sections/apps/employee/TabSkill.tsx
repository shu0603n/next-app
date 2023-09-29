// material-ui
import { Button, Grid, Stack } from '@mui/material';
import SkillTable from './skill-table/SkillTable';

// アセット

// ==============================|| アカウントプロファイル - 役割 ||============================== //

const TabRole = () => {
  const skill = [
    {
      experience_years: 15,
      technic_name: '言語',
      skill_name: 'JAVA'
    },
    {
      experience_years: 4,
      technic_name: '言語',
      skill_name: 'Ptyhon'
    },
    {
      experience_years: 0,
      technic_name: '言語',
      skill_name: 'TypeScript'
    },
    {
      experience_years: 1.5,
      technic_name: 'DataBase',
      skill_name: 'Oracle'
    },
    {
      experience_years: 5,
      technic_name: 'DataBase',
      skill_name: 'postgreSQL'
    },
    {
      experience_years: 1.5,
      technic_name: 'library',
      skill_name: 'React'
    },
    {
      experience_years: 10,
      technic_name: 'library',
      skill_name: 'Flask'
    }
  ];
  console.log(skill);
  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <SkillTable skill={skill} />
      </Grid>
      <Grid item xs={12}>
        <Stack direction="row" justifyContent="flex-end" alignItems="center" spacing={2}>
          <Button color="error">キャンセル</Button>
          <Button variant="contained">プロフィールを更新</Button>
        </Stack>
      </Grid>
    </Grid>
  );
};

export default TabRole;
