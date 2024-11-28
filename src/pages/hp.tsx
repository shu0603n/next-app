import { ReactElement, useEffect, useState, useRef } from 'react';
// next

import usePagination from 'hooks/usePagination';
import CustomerCard from 'sections/apps/hp/CustomerCard';
import EmptyUserCard from 'components/cards/skeleton/EmptyUserCard';

// material-ui
import { Box, Slide, Grid, Stack, Divider } from '@mui/material';

// third-party

// project import
import Layout from 'layout';
import Page from 'components/Page';
import MainCard from 'components/MainCard';
import { ProjectCard } from 'types/project/project';

// assets

// ==============================|| INVOICE - DETAILS ||============================== //

// eslint-disable-next-line react-hooks/exhaustive-deps
async function fetchTableData() {
  try {
    const response = await fetch('/api/db/hp/select');
    if (!response.ok) {
      throw new Error('API request failed');
    }
    const data = await response.json();
    return data; // APIから返されたデータを返します
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
}

const Hp = () => {
  const componentRef: React.Ref<HTMLDivElement> = useRef(null);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const [tableData, setTableData] = useState<Array<ProjectCard>>([]); // データを保持する状態変数

  useEffect(() => {
    // ページがロードされたときにデータを取得
    fetchTableData()
      .then((data) => {
        setTableData(data.project); // データを状態に設定
      })
      .catch((error) => {
        // エラーハンドリング
        console.error('Error:', error);
      });
  }, []); // 空の依存リストを指定することで、一度だけ実行される

  console.log(tableData);

  const [sortBy] = useState('Default');
  const PER_PAGE = 20;

  const _DATA = usePagination(tableData, PER_PAGE);

  return (
    <Page title="SkillSheet">
      <MainCard content={false}>
        <Stack spacing={2.5}>
          <Box sx={{ p: 2.5 }} id="print" ref={componentRef}>
            <Grid container spacing={2.5}>
              <Grid item xs={12}>
                <Grid container spacing={3}>
                  {tableData?.length ?? 0 > 0 ? (
                    _DATA
                      .currentData()
                      .sort(function (a: any, b: any) {
                        if (sortBy === 'Customer Name') return a.title.localeCompare(b.title);
                        if (sortBy === 'Email') return a.email.localeCompare(b.email);
                        if (sortBy === 'Contact') return a.contact.localeCompare(b.contact);
                        if (sortBy === 'Age') return b.age < a.age ? 1 : -1;
                        if (sortBy === 'Country') return a.country.localeCompare(b.country);
                        if (sortBy === 'Status') return a.status.localeCompare(b.status);
                        return a;
                      })
                      .map((user: ProjectCard, index: number) => (
                        <Slide key={index} direction="up" in={true} timeout={50}>
                          <Grid item xs={12}>
                            <CustomerCard customer={user} />
                          </Grid>
                        </Slide>
                      ))
                  ) : (
                    <EmptyUserCard title={'読み込み中...'} />
                  )}
                </Grid>
              </Grid>
              <Grid item xs={12}>
                <Divider sx={{ borderWidth: 1 }} />
              </Grid>
            </Grid>
          </Box>
        </Stack>
      </MainCard>
    </Page>
  );
};

Hp.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export default Hp;
