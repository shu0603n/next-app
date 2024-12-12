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
// 改行時のハイフンを空文字にする
Font.registerHyphenationCallback((word) => Array.from(word).flatMap((char) => [char, '']));

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
    borderRadius: 2,
    padding: 20,
    width: '48%'
  },
  contents: {
    gap: 20,
    margin: 0,
    width: '100%',
    height: '100%'
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
  padding2: {
    paddingLeft: 2,
    paddingRight: 2
  },
  padding5: {
    paddingLeft: 5,
    paddingRight: 5
  },
  borderRight: {
    borderRight: `1px solid ${border}`,
    margin: 0
  },
  border: {
    border: `1px solid ${border}`,
    borderRadius: 2,
    margin: 0
  },
  tableTitle: {
    alignItems: 'center',
    fontFamily: 'NotoSansJP',
    fontWeight: 500,
    color: textPrimary,
    fontSize: '10px',
    margin: 0
  },
  tableCell: {
    fontFamily: 'NotoSansJP',
    fontWeight: 400,
    color: textPrimary,
    fontSize: '10px',
    margin: 0
  },
  leftTop: {
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    flexDirection: 'column'
  },
  centerTop: {
    justifyContent: 'flex-start',
    alignItems: 'center'
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center'
  },
  procces: {
    justifyContent: 'center',
    alignItems: 'flex-start',
    textAlign: 'center',
    gap: 2
  },
  proccesText: {
    fontSize: '9px',
    lineHeight: 1.2,
    lineWeight: 3
  },
  skill: {
    gap: 1
  },
  left: {
    justifyContent: 'center',
    alignItems: 'flex-start'
  },
  right: {
    justifyContent: 'center',
    alignItems: 'flex-end'
  },
  side: {
    display: 'flex',
    flexDirection: 'column'
  },
  bold: {
    fontFamily: 'NotoSansJP',
    fontWeight: 500,
    color: textPrimary,
    fontSize: '12px'
  },
  subRow: {
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    margin: 0,
    paddingBottom: 20
  },
  row: {
    display: 'flex',
    flexDirection: 'row'
  },

  column: {
    display: 'flex',
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
    paddingTop: 10,
    paddingBottom: 10,
    margin: 0
  },
  paddingTopBottom10: {
    paddingTop: 10,
    paddingBottom: 10
  },
  paddingTopBottom20: {
    paddingTop: 20,
    paddingBottom: 20
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
  const checkList = ['要件定義', '基本設計', '詳細設計', '製造', '単体テスト', '結合テスト', 'システムテスト', '運用保守', 'データ移行'];

  const getProcesses = (processes: ParameterType[]): string[] => {
    // checkList に全角スペースで補完を加える
    const newCheckList = checkList.map((item) => {
      // checkItem に '●' が付いているかをチェック
      const hasMatch = processes.some((process) => process.name === item);
      // '●' を追加する場合はその分の長さを調整
      const itemWithMarker = hasMatch ? '●' + item : '-' + item;
      // 最大長より長くならないように調整
      const itemWithNewlines = itemWithMarker.split('').join('\n');
      return itemWithNewlines.replace('ー', '｜'); // 各文字列の間に改行を追加
    });
    return newCheckList;
  };
  const calculatePeriod = (startDate: string | null, endDate: string | null): string => {
    // 開始日がない場合は空文字を返す
    if (!startDate) {
      return '';
    }
    // 開始日と終了日をDateオブジェクトに変換
    const start = new Date(startDate);
    const end = endDate ? new Date(endDate) : new Date();
    // 日付の順序や有効性を確認
    if (isNaN(start.getTime()) || isNaN(end.getTime()) || start > end) {
      return '';
    }
    // 差分の年と月を計算
    let years = end.getFullYear() - start.getFullYear();
    let months = end.getMonth() - start.getMonth();
    if (months < 0) {
      years -= 1;
      months += 12;
    }
    // 結果をフォーマットして返す
    if (years === 0 && months < 12) {
      return `(${months}ヶ月)`;
    } else {
      return `(${years}年${months}ヶ月)`;
    }
  };

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
      <View style={[styles.contents]}>
        {list?.project.map((row: any) => (
          <View style={[styles.border]} key={row.id}>
            <View style={[styles.row, styles.tableHeader, { backgroundColor: theme.palette.grey[100] }]}>
              <View style={[styles.borderRight, styles.tableTitle, styles.flex03]}>
                <Text style={[styles.tableTitle, styles.paddingTopBottom10]}>案件名</Text>
              </View>
              <View style={[styles.borderRight, styles.tableTitle, styles.flex15]}>
                <Text style={[styles.tableTitle, styles.paddingTopBottom10]}>{row.project_title}</Text>
              </View>
              <View style={[styles.borderRight, styles.tableTitle, styles.flex05]}>
                <Text style={[styles.tableTitle, styles.paddingTopBottom10]}>環境・言語</Text>
              </View>
              <View style={[styles.tableTitle, styles.flex05]}>
                <Text style={[styles.tableTitle, styles.paddingTopBottom10]}>役割・役職</Text>
              </View>
            </View>
            <View style={[styles.row]}>
              <View
                style={[styles.borderRight, styles.column, styles.centerTop, styles.tableCell, styles.flex03, styles.paddingTopBottom10]}
              >
                <Text style={[styles.padding2]}>{format(new Date(row.end_date), 'yyyy/MM/dd')}</Text>
                <Text style={[styles.padding2]}>~</Text>
                <Text style={[styles.padding2]}>{format(new Date(row.start_date), 'yyyy/MM/dd')}</Text>
                <Text style={[styles.padding2, styles.paddingTopBottom10]}>{calculatePeriod(row.start_date, row.end_date)}</Text>
              </View>
              <View style={[styles.borderRight, styles.flex15, styles.leftTop, styles.tableCell, styles.paddingTopBottom10]}>
                <Text style={[styles.padding5]}>{row.description}</Text>
              </View>
              <View style={[styles.borderRight, styles.tableCell, styles.flex05, styles.paddingTopBottom10]}>
                {row.employee_project_skills.map((skill: SkillParameterType, index: number) => (
                  <Text key={`skill-${index}`} style={[styles.skill, styles.padding5]}>
                    {skill.name}
                  </Text>
                ))}
              </View>
              <View style={[styles.column, styles.flex05, styles.side]}>
                <View style={[styles.tableCell, styles.center, styles.paddingTopBottom20]}>
                  <Text>PG</Text>
                </View>
                <View style={[styles.tableTitle, styles.tableHeader, { backgroundColor: theme.palette.grey[100] }]}>
                  <Text style={[styles.tableTitle, styles.paddingTopBottom10]}>規模・人数</Text>
                </View>
                <View style={[styles.tableCell, styles.center, styles.paddingTopBottom20]}>
                  <Text>{row.people_number ? `${row.people_number}人` : ''}</Text>
                </View>
                <View style={[styles.tableTitle, styles.tableHeader, { backgroundColor: theme.palette.grey[100] }]}>
                  <Text style={[styles.tableTitle, styles.paddingTopBottom10]}>担当工程</Text>
                </View>
                <View style={[styles.tableCell, styles.row, styles.procces]}>
                  {getProcesses(row.employee_project_processes).map((procces, index) => (
                    <Text style={[styles.centerTop, styles.proccesText]} key={`process-${index}`}>
                      {procces}
                    </Text>
                  ))}
                </View>
              </View>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
};

export default Content;
