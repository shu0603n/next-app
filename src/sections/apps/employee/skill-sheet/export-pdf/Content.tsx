// material-ui
import { useTheme } from '@mui/material/styles';
import { format } from 'date-fns';
// third-party
import { Text, View, StyleSheet, Font } from '@react-pdf/renderer';

// types
import { SkillSheetList } from 'types/skillSheet';
import { ParameterType, SkillParameterType } from 'types/parameter/parameter';

// フォント登録
Font.register({
  family: 'NotoSansJP',
  fonts: [
    { src: '/fonts/NotoSansJP-Black.ttf', fontWeight: 900 },
    { src: '/fonts/NotoSansJP-Bold.ttf', fontWeight: 700 },
    { src: '/fonts/NotoSansJP-Medium.ttf', fontWeight: 500 },
    { src: '/fonts/NotoSansJP-Regular.ttf', fontWeight: 400 },
    { src: '/fonts/NotoSansJP-Light.ttf', fontWeight: 300 },
    { src: '/fonts/NotoSansJP-ExtraLight.ttf', fontWeight: 200 },
    { src: '/fonts/NotoSansJP-Thin.ttf', fontWeight: 100 }
  ]
});

const textPrimary = '#262626';
const textSecondary = '#8c8c8c';
const border = '#f0f0f0';

// custom Style
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 16,
    '@media max-width: 400': {
      paddingTop: 10,
      paddingLeft: 0
    }
  },
  card: {
    border: `1px solid ${border}`,
    borderRadius: '2px',
    padding: '20px',
    width: '48%'
  },
  title: {
    fontFamily: 'NotoSansJP',
    fontWeight: 500,
    color: textPrimary,
    fontSize: '12px'
  },
  caption: {
    fontFamily: 'NotoSansJP',
    fontWeight: 400,
    color: textSecondary,
    fontSize: '10px'
  },
  tableTitle: {
    alignItems: 'center',
    fontFamily: 'NotoSansJP',
    fontWeight: 500,
    color: textPrimary,
    fontSize: '10px'
  },
  tableCell: {
    fontFamily: 'NotoSansJP',
    fontWeight: 400,
    color: textPrimary,
    fontSize: '10px'
  },
  bold: {
    fontFamily: 'NotoSansJP',
    fontWeight: 500,
    color: textPrimary,
    fontSize: '12px'
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24
  },

  subRow: {
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    margin: 0,
    paddingBottom: 20
  },
  column: {
    flexDirection: 'column'
  },

  paragraph: {
    color: '#1F2937',
    fontSize: '12px'
  },

  tableHeader: {
    justifyContent: 'space-between',
    borderBottom: '1px solid #f0f0f0',
    borderTop: '1px solid #f0f0f0',
    paddingTop: '10px',
    paddingBottom: '10px',
    margin: 0,
    paddingLeft: 10
  },
  tableRow: {
    alignItems: 'center',
    justifyContent: 'center',
    borderBottom: '1px solid #f0f0f0',
    paddingBottom: 10,
    paddingTop: 10,
    margin: 0,
    paddingLeft: 10
  },
  amountSection: { margin: 0, paddingRight: 25, paddingTop: 16, justifyContent: 'flex-end' },
  amountRow: { margin: 0, width: '40%', justifyContent: 'space-between' },
  pb5: { paddingBottom: 5 },
  flex01: { flex: '0.1 1 0px' },
  flex02: { flex: '0.2 1 0px' },
  flex03: { flex: '0.3 1 0px' },
  flex04: { flex: '0.4 1 0px' },
  flex05: { flex: '0.5 1 0px' },
  flex06: { flex: '0.6 1 0px' },
  flex07: { flex: '0.7 1 0px' },
  flex08: { flex: '0.8 1 0px' },
  flex09: { flex: '0.9 1 0px' },
  flex10: { flex: '1 1 0px' },
  flex11: { flex: '1.1 1 0px' },
  flex12: { flex: '1.2 1 0px' },
  flex13: { flex: '1.3 1 0px' },
  flex14: { flex: '1.4 1 0px' },
  flex15: { flex: '1.5 1 0px' },
  flex16: { flex: '1.6 1 0px' },
  flex17: { flex: '1.7 1 0px' },
  flex18: { flex: '1.8 1 0px' },
  flex19: { flex: '1.9 1 0px' },
  flex20: { flex: '2 1 0px' },
  flex21: { flex: '2.1 1 0px' },
  flex22: { flex: '2.2 1 0px' },
  flex23: { flex: '2.3 1 0px' },
  flex24: { flex: '2.4 1 0px' },
  flex25: { flex: '2.5 1 0px' }
});

interface Props {
  list: SkillSheetList | null;
}

// ==============================|| INVOICE EXPORT - CONTENT  ||============================== //

const Content = ({ list }: Props) => {
  const theme = useTheme();
  const now = new Date(); // 現在の日時を取得
  const birthday = new Date(String(list?.birthday)); // list?.birthday を Date オブジェクトに変換
  const ageInMilliseconds = now.getTime() - birthday.getTime();
  const age = Math.floor(ageInMilliseconds / (1000 * 60 * 60 * 24 * 365.25));

  return (
    <View style={styles.container}>
      <View style={[styles.row, styles.subRow]}>
        <View style={styles.card}>
          <Text style={[styles.title, { marginBottom: 8 }]}>From:トライブ株式会社</Text>
          <Text style={[styles.caption, styles.pb5]}>{`${list?.sei} ${list?.mei}`}</Text>
          <Text style={[styles.caption, styles.pb5]}>{age}歳</Text>
          <Text style={[styles.caption, styles.pb5]}>{list?.address}</Text>
        </View>
      </View>
      <View>
        <View style={[styles.row, styles.tableHeader, { backgroundColor: theme.palette.grey[100] }]}>
          <Text style={[styles.tableTitle, styles.flex03]}>No</Text>
          <Text style={[styles.tableTitle, styles.flex05]}>期間</Text>
          <View style={styles.flex20}>
            <Text style={styles.tableTitle}>プロジェクト名</Text>
            <Text style={styles.tableTitle}>詳細</Text>
          </View>
          <View style={styles.flex05}>
            <Text style={[styles.tableTitle]}>人数</Text>
            <Text style={[styles.tableTitle]}>役割</Text>
          </View>
          <View style={styles.flex05}>
            <Text style={[styles.tableTitle]}>スキル</Text>
            <Text style={[styles.tableTitle]}>工程</Text>
          </View>
        </View>
        {list?.project.map((row: any, index: number) => (
          <View style={[styles.row, styles.tableRow]} key={row.id}>
            <Text style={[styles.tableCell, styles.flex03]}>{index + 1}</Text>
            <View style={styles.flex05}>
              <Text style={styles.tableCell}>{format(new Date(row.end_date), 'yyyy/MM/dd')}</Text>
              <Text style={styles.tableCell}>~</Text>
              <Text style={styles.tableCell}>{format(new Date(row.start_date), 'yyyy/MM/dd')}</Text>
            </View>
            <View style={styles.flex20}>
              <Text style={[styles.tableCell, styles.bold]}>{row.project_title}</Text>
              <Text style={styles.tableCell}>{row.description}</Text>
            </View>
            <View style={styles.flex05}>
              <Text style={styles.tableCell}>{row.people}人</Text>
              <Text style={styles.tableCell}>{row.end_date}</Text>
            </View>
            <View style={styles.flex05}>
              {row.employee_project_skills.map((skill: SkillParameterType, index: number) => (
                <Text key={`skill-${index}`} style={styles.tableCell}>
                  {skill.name}
                </Text>
              ))}
              {row.employee_project_processes.map((proces: ParameterType, index: number) => (
                <Text key={`process-${index}`} style={styles.tableCell}>
                  {proces.name}
                </Text>
              ))}
            </View>
          </View>
        ))}
      </View>
    </View>
  );
};

export default Content;
