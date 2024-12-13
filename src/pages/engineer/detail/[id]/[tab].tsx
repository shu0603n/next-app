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
import TabSkill from 'sections/apps/employee/TabSkill';
import TabInvoice from 'sections/apps/employee/TabInvoice';
import TabPassword from 'sections/apps/employee/TabPassword';
import TabSettings from 'sections/apps/employee/TabSettings';
import TabWorkHistory from 'sections/apps/employee/TabWorkHistory';

// assets
import { FileTextOutlined, LockOutlined, SettingOutlined, UserOutlined } from '@ant-design/icons';
import useUser from 'hooks/useUser';

// ==============================|| PROFILE - ACCOUNT ||============================== //

const EngineerDetail = () => {
  const router = useRouter();
  const user = useUser();
  const { id, tab } = router.query;

  const [value, setValue] = useState(tab);

  const handleChange = (_event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
    router.push(`/employee/detail/${id}/${newValue}`);
  };

  return (
    <Page title="社員詳細">
      <MainCard border={false} boxShadow>
        <Box sx={{ borderBottom: 1, borderColor: 'divider', width: '100%' }}>
          <Tabs value={value} onChange={handleChange} variant="scrollable" scrollButtons="auto" aria-label="account profile tab">
            <Tab label="プロフィール" icon={<UserOutlined />} value="basic" iconPosition="start" />
            <Tab label="営業情報" icon={<UserOutlined />} value="sales" iconPosition="start" disabled />
            <Tab label="スキル一覧" icon={<FileTextOutlined />} value="skill" iconPosition="start" />
            <Tab label="業務履歴" icon={<FileTextOutlined />} value="workHistory" iconPosition="start" />
            <Tab
              label="請求一覧"
              icon={<FileTextOutlined />}
              value="invoice"
              iconPosition="start"
              disabled={!(user?.roles.superRole || user?.roles.systemRole)}
            />
            <Tab
              label="パスワード変更"
              icon={<LockOutlined />}
              value="password"
              iconPosition="start"
              disabled={!(user?.roles.superRole || user?.roles.systemRole || id === user?.id.toString())}
            />
            <Tab
              label="設定"
              icon={<SettingOutlined />}
              value="settings"
              iconPosition="start"
              disabled={!(user?.roles.superRole || user?.roles.systemRole)}
            />
          </Tabs>
        </Box>
        <Box sx={{ mt: 2.5 }}>
          {tab === 'basic' && <TabProfile />}
          {tab === 'sales' && <TabProfile />}
          {tab === 'skill' && <TabSkill />}
          {tab === 'invoice' && <TabInvoice />}
          {tab === 'password' && <TabPassword />}
          {tab === 'settings' && <TabSettings />}
          {tab === 'workHistory' && <TabWorkHistory />}
        </Box>
      </MainCard>
    </Page>
  );
};

EngineerDetail.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export default EngineerDetail;
