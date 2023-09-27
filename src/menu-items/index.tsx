// project import
import applications from './applications';
import widget from './widget';
import formsTables from './forms-tables';
import chartsMap from './charts-map';
import other from './other';
import pages from './pages';
import parameter from './parameter';

// types
import { NavItemType } from 'types/menu';

// ==============================|| MENU ITEMS ||============================== //

const menuItems: { items: NavItemType[] } = {
  items: [other, parameter, widget, applications, formsTables, chartsMap, pages]
};

export default menuItems;
