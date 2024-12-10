// project import
import main from './main';
import staffing from './staffing';
import engineering from './engineering';
import other from './other';
import parameter from './parameter';

// types
import { NavItemType } from 'types/menu';

// ==============================|| MENU ITEMS ||============================== //

const menuItems: { items: NavItemType[] } = {
  items: [main, engineering, staffing, parameter, other]
};

export default menuItems;
