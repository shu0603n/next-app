// third-party
import { Text, View, StyleSheet, Image } from '@react-pdf/renderer';
import { format } from 'date-fns';

// assets
const Logo = '/assets/images/tribe-logo.png';

// types
import { InvoiceList } from 'types/invoice';

const textPrimary = '#262626';
const textSecondary = '#8c8c8c';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row'
  },
  detailColumn: {
    marginBottom: '12px',
    flexDirection: 'column',
    flexGrow: 2
  },
  chipTitle: {
    fontSize: '8px',
    padding: 4
  },
  chip: {
    alignItems: 'center',
    borderRadius: '4px',
    marginLeft: 52,
    marginRight: 4,
    marginBottom: 8
  },
  leftColumn: {
    flexDirection: 'column',
    width: 36,
    marginRight: 10,
    paddingLeft: 4,
    marginTop: 4
  },
  image: {
    width: 150,
    height: 30
  },
  mainContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'stretch'
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'flex-end'
  },
  title: {
    color: textPrimary,
    fontSize: '10px'
  },
  caption: {
    color: textSecondary,
    fontSize: '10px'
  }
});

interface Props {
  list: InvoiceList | null;
}

// ==============================|| INVOICE EXPORT - HEADER  ||============================== //

const Header = ({ list }: Props) => {
  return (
    <View style={styles.mainContainer}>
      <View style={styles.container}>
        <View style={styles.leftColumn}>
          {/* eslint-disable-next-line */}
          <Image src={Logo} style={styles.image} />
        </View>
      </View>
      <View>
        <View style={[styles.row, { marginTop: 8 }]}>
          <Text style={styles.title}>作成日付</Text>
          <Text style={styles.caption}> {format(new Date(), 'yyyy/mm/dd')}</Text>
        </View>
      </View>
    </View>
  );
};

export default Header;
