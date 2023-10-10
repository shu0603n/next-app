import { useState, ReactElement } from 'react';

// next
import { useRouter } from 'next/router';

// material-ui
import { Box, Tab, Tabs } from '@mui/material';

// project import
import Layout from 'layout';
import Page from 'components/Page';
import MainCard from 'components/MainCard';
import TabProfile from 'sections/apps/project/TabProfile';
import TabPersonal from 'sections/apps/project/TabPersonal';
import TabAccount from 'sections/apps/project/TabAccount';
import TabPassword from 'sections/apps/project/TabPassword';
import TabRole from 'sections/apps/project/TabRole';
import TabSettings from 'sections/apps/project/TabSettings';

// assets
import { ContainerOutlined, FileTextOutlined, LockOutlined, SettingOutlined, TeamOutlined, UserOutlined } from '@ant-design/icons';

// ==============================|| PROFILE - ACCOUNT ||============================== //

const EmployeeDetail = () => {
  const router = useRouter();
  const { id, tab } = router.query;

  const [value, setValue] = useState(tab);

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
    router.push(`/project/${id}/${newValue}`);
  };

  return (
    <Page title="Account Profile">
      <MainCard border={false} boxShadow>
        <Box sx={{ borderBottom: 1, borderColor: 'divider', width: '100%' }}>
          <Tabs value={value} onChange={handleChange} variant="scrollable" scrollButtons="auto" aria-label="account profile tab">
            <Tab label="プロフィール" icon={<UserOutlined />} value="basic" iconPosition="start" />
            <Tab label="詳細情報" icon={<FileTextOutlined />} value="personal" iconPosition="start" />
            <Tab label="アカウント情報" icon={<ContainerOutlined />} value="my-account" iconPosition="start" />
            <Tab label="パスワード変更" icon={<LockOutlined />} value="password" iconPosition="start" />
            <Tab label="権限" icon={<TeamOutlined />} value="role" iconPosition="start" />
            <Tab label="設定" icon={<SettingOutlined />} value="settings" iconPosition="start" />
          </Tabs>
        </Box>
        <Box sx={{ mt: 2.5 }}>
          {tab === 'basic' && <TabProfile />}
          {tab === 'personal' && <TabPersonal />}
          {tab === 'my-account' && <TabAccount />}
          {tab === 'password' && <TabPassword />}
          {tab === 'role' && <TabRole />}
          {tab === 'settings' && <TabSettings />}
        </Box>
      </MainCard>
    </Page>
  );
};

EmployeeDetail.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export default EmployeeDetail;
