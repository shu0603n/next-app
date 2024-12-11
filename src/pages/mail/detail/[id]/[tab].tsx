import { useState, ReactElement } from 'react';

// next
import { useRouter } from 'next/router';

// material-ui
import { Box, Tab, Tabs } from '@mui/material';

// project import
import Layout from 'layout';
import Page from 'components/Page';
import MainCard from 'components/MainCard';

import TabProfile from 'sections/apps/mail/TabProfile';

// assets
import { FileTextOutlined, UserOutlined } from '@ant-design/icons';
import TabDestination from 'sections/apps/mail/TabTabDestination';

// ==============================|| PROFILE - ACCOUNT ||============================== //

const ClientDetail = () => {
  const router = useRouter();
  const { id, tab } = router.query;

  const [value, setValue] = useState(tab);

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
    router.push(`/mail/detail/${id}/${newValue}`);
  };

  return (
    <Page title="企業詳細">
      <MainCard border={false} boxShadow>
        <Box sx={{ borderBottom: 1, borderColor: 'divider', width: '100%' }}>
          <Tabs value={value} onChange={handleChange} variant="scrollable" scrollButtons="auto" aria-label="account profile tab">
            <Tab label="基本情報" icon={<UserOutlined />} value="basic" iconPosition="start" />
            <Tab label="送信先" icon={<FileTextOutlined />} value="destination" iconPosition="start" />
          </Tabs>
        </Box>
        <Box sx={{ mt: 2.5 }}>
          {tab === 'basic' && <TabProfile />}
          {tab === 'destination' && <TabDestination />}
        </Box>
      </MainCard>
    </Page>
  );
};

ClientDetail.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export default ClientDetail;
