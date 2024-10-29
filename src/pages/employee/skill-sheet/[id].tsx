import { ReactElement, useEffect, useState, useRef } from 'react';
// next
import { useRouter } from 'next/router';

import usePagination from 'hooks/usePagination';
import CustomerCard from 'sections/apps/employee/skill-sheet/CustomerCard';
import EmptyUserCard from 'components/cards/skeleton/EmptyUserCard';

// material-ui
import { useTheme } from '@mui/material/styles';
import { Box, Slide, Grid, IconButton, Chip, FormControl, Button, Stack, Typography, Divider } from '@mui/material';

// third-party
import ReactToPrint from 'react-to-print';
import { PDFDownloadLink } from '@react-pdf/renderer';

// project import
import Layout from 'layout';
import Page from 'components/Page';
import MainCard from 'components/MainCard';
import LogoSection from 'components/logo';
import ExportPDFView from 'sections/apps/employee/skill-sheet/export-pdf';

import { useSelector } from 'store';

// assets
import { DownloadOutlined, EditOutlined, PrinterFilled } from '@ant-design/icons';

// ==============================|| INVOICE - DETAILS ||============================== //

const SkillSheet = () => {
  const theme = useTheme();
  const router = useRouter();
  const { id } = router.query;
  const [projects, setProjects] = useState<Array<ProjectCard>>([]);
  const [basics, setBasics] = useState<Array<BasicCard>>([]);

  const { list } = useSelector((state) => state.invoice);

  const today = new Date().toLocaleDateString('ja-JP', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  });

  const componentRef: React.Ref<HTMLDivElement> = useRef(null);

  type ProjectCard = {
    id: number;
    start_date: string;
    end_date: string;
    people: number;
    client: string;
    project_title: string;
    description: string;
    skills: string[];
    process: string[];
    time: string;
  };

  type BasicCard = {
    id: number;
    sei: string;
    mei: string;
    birthday: number;
    address: string;
  };

  async function fetchTableData(id: string) {
    try {
      const response = await fetch(`/api/db/employee/skill/select?id=${id}`);
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

  async function fetchBasicData(id: string) {
    try {
      const response = await fetch(`/api/db/employee/basic/select?id=${id}`);
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

  const [sortBy] = useState('Default');
  const [globalFilter] = useState('');
  const [userCard, setUserCard] = useState<Array<ProjectCard>>([]);
  const PER_PAGE = 20;

  const _DATA = usePagination(userCard, PER_PAGE);

  useEffect(() => {
    if (typeof id === 'string') {
      fetchTableData(id)
        .then((data) => {
          setProjects(data.data.rows);
        })
        .catch((error) => {
          console.error('Error:', error);
        });

      fetchBasicData(id)
        .then((data) => {
          setBasics(data.data.rows);
        })
        .catch((error) => {
          console.error('Error:', error);
        });
    } else {
      console.error('Invalid ID:', id);
    }
  }, [id]);

  // search
  useEffect(() => {
    const newData = projects.filter((value: any) => {
      if (globalFilter) {
        return value.title.toLowerCase().includes(globalFilter.toLowerCase());
      } else {
        return true;
      }
    });
    setUserCard(newData);
  }, [globalFilter, projects]);

  function calculateAge(birthday: number) {
    const birthDate = new Date(birthday);
    const today = new Date();

    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDifference = today.getMonth() - birthDate.getMonth();

    if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }

    return age;
  }

  return (
    <Page title="SkillSheet">
      <MainCard content={false}>
        <Stack spacing={2.5}>
          <Box sx={{ p: 2.5, pb: 0 }}>
            <MainCard content={false} sx={{ p: 1.25, bgcolor: 'primary.lighter', borderColor: theme.palette.primary[100] }}>
              <Stack direction="row" justifyContent="flex-end" spacing={1}>
                <IconButton onClick={() => router.push(`/employee/detail/${id}/skill`)}>
                  <EditOutlined style={{ color: theme.palette.grey[900] }} />
                </IconButton>
                <PDFDownloadLink document={<ExportPDFView list={list} />} fileName={`${list?.invoice_id}-${list?.customer_name}.pdf`}>
                  <IconButton>
                    <DownloadOutlined style={{ color: theme.palette.grey[900] }} />
                  </IconButton>
                </PDFDownloadLink>
                <ReactToPrint
                  trigger={() => (
                    <IconButton>
                      <PrinterFilled style={{ color: theme.palette.grey[900] }} />
                    </IconButton>
                  )}
                  content={() => componentRef.current}
                />
              </Stack>
            </MainCard>
          </Box>
          <Box sx={{ p: 2.5 }} id="print" ref={componentRef}>
            <Grid container spacing={2.5}>
              <Grid item xs={12}>
                <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between">
                  <Box>
                    <Stack direction="row" spacing={2}>
                      <LogoSection />
                      <Chip label="Paid" variant="light" color="success" size="small" />
                    </Stack>
                    <Typography color="secondary">{list?.invoice_id}</Typography>
                  </Box>
                  <Box>
                    <Stack direction="row" spacing={1} justifyContent="flex-end">
                      <Typography variant="subtitle1">作成日</Typography>
                      <Typography color="secondary">{today}</Typography>
                    </Stack>
                  </Box>
                </Stack>
              </Grid>
              <Grid item xs={12}>
                <MainCard>
                  <Stack spacing={1}>
                    <Typography variant="h5">エンジニア情報</Typography>
                    <FormControl sx={{ width: '100%' }}>
                      {basics.length > 0 ? (
                        <>
                          <Typography color="secondary">氏名 : {`${basics[0].sei} ${basics[0].mei}`}</Typography>
                          <Typography color="secondary">年齢 : {calculateAge(basics[0].birthday)}歳</Typography>
                          <Typography color="secondary">住所 : {basics[0].address}</Typography>
                        </>
                      ) : (
                        <Typography color="secondary">読み込み中...</Typography>
                      )}
                    </FormControl>
                  </Stack>
                </MainCard>
              </Grid>
              <Grid item xs={12}>
                <Grid container spacing={3}>
                  {userCard.length > 0 ? (
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
                    <EmptyUserCard title={'You have not created any customer yet.'} />
                  )}
                </Grid>
              </Grid>
              <Grid item xs={12}>
                <Divider sx={{ borderWidth: 1 }} />
              </Grid>
            </Grid>
          </Box>
          <Stack direction="row" justifyContent="flex-end" spacing={2} sx={{ p: 2.5, a: { textDecoration: 'none', color: 'inherit' } }}>
            <PDFDownloadLink document={<ExportPDFView list={list} />} fileName={`${list?.invoice_id}-${list?.customer_name}.pdf`}>
              <Button variant="contained" color="primary">
                Download
              </Button>
            </PDFDownloadLink>
          </Stack>
        </Stack>
      </MainCard>
    </Page>
  );
};

SkillSheet.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export default SkillSheet;
