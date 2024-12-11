import { useState, ReactElement } from 'react';

// next
import { useRouter } from 'next/router';

// material-ui
import { Box, Tab, Tabs } from '@mui/material';

// project import
import Layout from 'layout';
import Page from 'components/Page';
import MainCard from 'components/MainCard';
import TabProfile from 'sections/apps/client/TabProfile';
import TabProject from 'sections/apps/client/TabProject';
import TabHistory from 'sections/apps/client/TabHistory';

// assets
import { FileTextOutlined, UserOutlined } from '@ant-design/icons';
import useUser from 'hooks/useUser';

// ==============================|| PROFILE - ACCOUNT ||============================== //

const ClientDetail = () => {
  const router = useRouter();
  const user = useUser();
  const { id, tab } = router.query;

  const [value, setValue] = useState(tab);

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
    router.push(`/client/detail/${id}/${newValue}`);
  };

  return (
    <Page title="企業詳細">
      <MainCard border={false} boxShadow>
        <Box sx={{ borderBottom: 1, borderColor: 'divider', width: '100%' }}>
          <Tabs value={value} onChange={handleChange} variant="scrollable" scrollButtons="auto" aria-label="account profile tab">
            <Tab label="プロフィール" icon={<UserOutlined />} value="basic" iconPosition="start" />
            <Tab label="対応履歴" icon={<FileTextOutlined />} value="history" iconPosition="start" />
            <Tab
              label="案件一覧"
              icon={<FileTextOutlined />}
              value="project"
              iconPosition="start"
              disabled={!(user?.roles.superRole || user?.roles.systemRole || user?.roles.projectView)}
            />
            <Tab label="担当者一覧" icon={<FileTextOutlined />} value="member" iconPosition="start" disabled />
          </Tabs>
        </Box>
        <Box sx={{ mt: 2.5 }}>
          {tab === 'basic' && <TabProfile />}
          {tab === 'history' && <TabHistory />}
          {tab === 'project' && <TabProject />}
          {tab === 'member' && <TabProfile />}
        </Box>
      </MainCard>
    </Page>
  );
};

ClientDetail.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export default ClientDetail;
