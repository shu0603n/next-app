import { useState, ReactElement } from 'react';

// next
import { useRouter } from 'next/router';

// material-ui
import { Box, Tab, Tabs } from '@mui/material';

// project import
import Layout from 'layout';
import Page from 'components/Page';
import MainCard from 'components/MainCard';
import TabProfile from 'sections/apps/employee/TabProfile';
import TabPersonal from 'sections/apps/employee/TabPersonal';
import TabSkill from 'sections/apps/employee/TabSkill';
import TabInvoice from 'sections/apps/employee/TabInvoice';
import TabAccount from 'sections/apps/employee/TabAccount';
import TabPassword from 'sections/apps/employee/TabPassword';
import TabSettings from 'sections/apps/employee/TabSettings';

// assets
import { ContainerOutlined, FileTextOutlined, LockOutlined, SettingOutlined, UserOutlined } from '@ant-design/icons';

// ==============================|| PROFILE - ACCOUNT ||============================== //

const EmployeeDetail = () => {
  const router = useRouter();
  const { id, tab } = router.query;

  const [value, setValue] = useState(tab);

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
    router.push(`/employee/detail/${id}/${newValue}`);
  };

  return (
    <Page title="Account Profile">
      <MainCard border={false} boxShadow>
        <Box sx={{ borderBottom: 1, borderColor: 'divider', width: '100%' }}>
          <Tabs value={value} onChange={handleChange} variant="scrollable" scrollButtons="auto" aria-label="account profile tab">
            <Tab label="プロフィール" icon={<UserOutlined />} value="basic" iconPosition="start" />
            <Tab label="詳細情報" icon={<FileTextOutlined />} value="personal" iconPosition="start" />
            <Tab label="スキル一覧" icon={<FileTextOutlined />} value="skill" iconPosition="start" />
            <Tab label="請求一覧" icon={<FileTextOutlined />} value="invoice" iconPosition="start" />
            <Tab label="アカウント情報" icon={<ContainerOutlined />} value="my-account" iconPosition="start" />
            <Tab label="パスワード変更" icon={<LockOutlined />} value="password" iconPosition="start" />
            <Tab label="設定" icon={<SettingOutlined />} value="settings" iconPosition="start" />
          </Tabs>
        </Box>
        <Box sx={{ mt: 2.5 }}>
          {tab === 'basic' && <TabProfile />}
          {tab === 'personal' && <TabPersonal />}
          {tab === 'skill' && <TabSkill />}
          {tab === 'invoice' && <TabInvoice />}
          {tab === 'my-account' && <TabAccount />}
          {tab === 'password' && <TabPassword />}
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
