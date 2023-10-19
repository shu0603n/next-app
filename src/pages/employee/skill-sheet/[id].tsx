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
    title: string;
    description: string;
    skills: string[];
    process: string[];
    time: string;
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const data: Array<ProjectCard> = [
    {
      id: 1,
      title: '法人電話営業',
      start_date: '2013/06',
      end_date: '2017/07',
      people: 1,
      client: '',
      description: `【業務内容】・光回線の営業\r\n
      ・テクニカルサポート\r\n
      ・8人規模のチームの教育`,
      skills: ['Windows 7'],
      process: ['企画設計', '運用・保守'],
      time: ''
    },
    {
      id: 2,
      title: '法人訪問営業',
      start_date: '2017/11',
      end_date: '2019/03',
      people: 1,
      client: '',
      description: `【業務内容】・OA機器の訪問営業\r\n
      ・顧客のインフラ環境構築、整備`,
      skills: ['Windows 7', 'Windows 10', 'VBA(Excel)'],
      process: ['企画設計', '運用・保守', 'その他'],
      time: ''
    },
    {
      id: 3,
      title: '高圧顧客システムの改修',
      start_date: '2019/04',
      end_date: '2020/03',
      people: 5,
      client: 'ほくでん情報株式会社',
      description: `【担当プロジェクト概要】高圧顧客システムの改修\r\n
      【担当プロジェクト規模】5人\r\n
      【担当工程】要件定義〜リリースまでを担当\r\n
      【業務内容】・修正箇所の要件定義\r\n
      ・画面の項目追加に伴う修正\r\n
      ・新規画面の追加\r\n
      ・画面レイアウトの変更`,
      skills: [
        'Windows 7',
        'Windows 10',
        'Java',
        'JavaScript',
        'Java Servlet',
        'PL/SQL',
        'SQL',
        'HTML',
        'VBA(Excel)',
        'Oracle WebLogic Server',
        'JavaServlet Page(JSP)',
        'J2EE',
        'SVN',
        'Apache Jmeter',
        'Windows 7',
        'Oracle Database'
      ],
      process: ['企画設計', '要件定義', '基本設計', '詳細設計', 'プログラミング', 'テスト・評価', '運用・保守'],
      time: ''
    },
    {
      id: 4,
      title: '宿泊施設用 顧客情報/売上管理システムの作成',
      start_date: '2022/06',
      end_date: '2022/09',
      people: 1,
      client: '',
      description: `【担当プロジェクト概要】宿泊施設用 顧客情報/売上管理システムの作成\r\n
      【業務内容】※知人が経営している宿泊施設へのシステム提供、保守\r\n
      \r\n
      顧客情報、顧客履歴、予約管理、売り上げ管理等の情報管理が行えるシステムの開発。\r\n
      \r\n
      サーバー:Heroku\r\n
      フロントエンド:bootstrap\r\n
      バックエンド:Python(Flask)\r\n
      \r\n
      \r\n
      基本的な顧客管理機能に加え、ダッシュボード画面には月間/年間の売上状況、単価等を表示。\r\n
      \r\n
      予約管理については、Googleカレンダー上の予定をシステムに反映させるためGoogleAPIを利用。`,
      skills: ['Python', 'HTML', 'JavaScript', 'jQuery', 'Flask', 'Vue.JS', 'Visual Studio Code', 'Windows 11', 'PostgreSQL'],
      process: ['企画設計', '要件定義', '基本設計', '詳細設計', 'プログラミング', 'テスト・評価', '運用・保守'],
      time: ''
    },
    {
      id: 5,
      title: '人事給与システムの保守・改修',
      start_date: '2020/06',
      end_date: '2022/11',
      people: 3,
      client: '株式会社HID',
      description: `【担当プロジェクト概要】自治体向けパッケージ型人事給与システムの保守・改修\r\n
      【担当工程】設計〜総合テスト\r\n
      【業務内容】①制度改正に伴う新機能の追加、利用者毎のカスタマイズ対応\r\n
      ⇒利用者からの問い合わせがタスク表に溜まっていく為、\r\n
      　 タスクごとに仕様から考え、順次対応を行う。\r\n
      ②OracleからPostgreSQLへのマイグレーション対応\r\n
      ⇒マイグレーション計画から総合テストまで。`,
      skills: ['Java', 'JavaScript', 'PL/SQL', 'SQL', 'Windows 10', 'Oracle Database', 'ストアドプロシ－ジャ', 'PostgreSQL'],
      process: ['調査・分析', '要件定義', '基本設計', '詳細設計', 'プログラミング', 'テスト・評価', '運用・保守', 'その他'],
      time: ''
    },
    {
      id: 6,
      title: '社内ツール開発',
      start_date: '2020/06',
      end_date: '2022/11',
      people: 1,
      client: '株式会社HID',
      description: `【担当プロジェクト概要】業務効率化ツールの作成\r\n
      【担当工程】設計〜開発、保守\r\n
      【業務内容】※「人事給与システムの保守・改修」の業務内で作成\r\n
      ①対応管理システムの作成(Python(Flask),PostgreSQL,Vue.JS,selenium)\r\n
      →日々の業務記録を登録するシステム。\r\n
      　 対応した課題番号、進捗状況、修正内容、日報作成、勤怠管理システムへの反映等を行う。\r\n
      ②DB比較ツールの作成(Pyhon,Bat)\r\n
      →マイグレーション時のテストの際に使用。\r\n
      　 OracleとPostgreSQLでの結果の一致を確認するため、全テーブルの出力結果を抽出し、比較するツール。\r\n
      　 約50団体分のテストを手動で行っていたため、大幅な工数削減に成功。\r\n
      ③DB操作ツールの作成(各種DB環境からのDMPエクスポート/インポート、SQL適用等)(Bat)\r\n
      →約50団体の環境それぞれに独自ソースが割り振られているため、都度ローカルに環境構築する必要がある。\r\n
      　 今までExcelから対象のサーバーを探し、リモートデスクトップ接続し、SQLplusから取得していたDMPファイルを\r\n
      　 ワンクリックでローカルに環境構築が可能になるシステム。\r\n
      　 チーム全体に共有し、環境構築の業務の効率化が可能となった。\r\n
      ④エビデンス自動取得ツールの作成(VBA)\r\n
      →ブラウザ上でクリックを行う毎にスクリーンショットをエビデンスに貼り付けを行うアドインの作成。\r\n
      　 □や〇などの図形操作もドラッグで行えるようにし、図形整形の時間を短縮\r\n
      ⑤マイグレーション用変換ツール(Java)\r\n
      →パラメータ設定ファイルに置換パターンを複数登録することで、\r\n
      　 ソース内から指定パターンで置換を行うツールの作成。`,
      skills: ['Python', 'JavaScript', 'VBA(Excel)', 'Vue.js', 'Flask', 'Bat', 'selenium', 'Windows 11', 'PostgreSQL'],
      process: ['調査・分析', '基本設計', '詳細設計', 'プログラミング'],
      time: ''
    },
    {
      id: 7,
      title: 'カーナビ テストシミュレーター開発',
      start_date: '2022/12',
      end_date: '2023/03',
      people: 4,
      client: '富士ソフト株式会社',
      description: `【担当プロジェクト概要】カーナビゲーション テストツールの開発\r\n
      【担当プロジェクト規模】4名体制\r\n
      【担当工程】設計〜総合テスト\r\n
      【業務内容】カーナビテストシミュレータの作成業務。\r\n
      設計からテストまでを担当。\r\n
      ・ルート情報取り込み機能(CSV,nmea,kml)の実装。\r\n
      ・ルートを探索し、緯度経度から情報を算出後(距離、標高、勾配、曲率)、集計結果出力する機能を実装。\r\n
      ・WSL内にDockerコンテナを複数作成し、フロントエンド、バックエンド、データベースのそれぞれの実行環境を作成。\r\n
      　 ーフロントエンド:React,TypeScript\r\n
      　 ーBFF:node.js\r\n
      　 ーバックエンド:Python(FLASK,django)\r\n
      　 ーデータベース:PostgreSQL`,
      skills: [
        'Python',
        'JavaScript',
        'Shellスクリプト',
        'TypeScript',
        'React',
        'FLASK',
        'django',
        'node.js',
        'C++',
        'Windows 10',
        'Ubuntu',
        'Linux',
        'WSL,docker',
        'PostgreSQL'
      ],
      process: ['調査・分析', '基本設計', 'プログラミング', 'テスト・評価'],
      time: ''
    },
    {
      id: 8,
      title: '日経新聞電子版のテスト環境の作成',
      start_date: '2023/04',
      end_date: '2023/04',
      people: 8,
      client: 'SKY株式会社',
      description: `【担当プロジェクト概要】日経新聞電子版のフロントエンド改修\r\n
      【担当プロジェクト規模】8名体制\r\n
      【担当工程】設計、製造、テスト\r\n
      【業務内容】日経新聞電子版のテスト環境の作成。\r\n
      フロント改修のチームにて、コンポーネント設計及び作成。\r\n
      ・APIからのデータ取得を行うBFF層の実装\r\n
      ・Figmaを元にスタイル適用し、レスポンシブ対応の追加`,
      skills: ['TypeScript', 'React', 'CSS', 'Figma', 'Windows 10', 'Ubuntu'],
      process: ['調査・分析', '基本設計', 'プログラミング', 'テスト・評価'],
      time: ''
    },
    {
      id: 9,
      title: '人材派遣会社向け統合管理システムの開発',
      start_date: '2023/09',
      end_date: '',
      people: 1,
      client: '',
      description: `以下機能を取り込んだ統合管理ツールの作成\r\n
      ・勤怠情報\r\n
      ・企業情報\r\n
      ・社員情報\r\n
      ・案件情報\r\n
      ・スキルシート作成・出力\r\n
      \r\n
      フロントエンドにMaterial-UIを使用し、バックエンドにNEXT-APIを使用\r\n
      サーバーはプレビュー環境をXServer、本番環境はVercelを使用。\r\n
      git hub actionsからメインブランチにプッシュ時に自動公開。\r\n`,
      skills: ['TypeScript', 'React', 'Next.js', 'node.js', 'WSL', 'docker', 'postgreSQL', 'Material-UI', 'Vercel'],
      process: ['基本設計', '詳細設計', '製造'],
      time: ''
    }
  ];
  const [sortBy] = useState('Default');
  const [globalFilter] = useState('');
  const [userCard, setUserCard] = useState<Array<ProjectCard>>([]);
  const PER_PAGE = 20;

  const _DATA = usePagination(userCard, PER_PAGE);

  // search
  useEffect(() => {
    const newData = data.filter((value: any) => {
      if (globalFilter) {
        return value.title.toLowerCase().includes(globalFilter.toLowerCase());
      } else {
        return value;
      }
    });
    setUserCard(newData);
  }, [globalFilter, data]);

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
                      <Typography color="secondary">氏名 : {list?.cashierInfo.name}</Typography>
                      <Typography color="secondary">年齢 : {list?.cashierInfo.address}歳</Typography>
                      <Typography color="secondary">住所 : {list?.cashierInfo.phone}</Typography>
                      <Typography color="secondary">{list?.cashierInfo.email}</Typography>
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
