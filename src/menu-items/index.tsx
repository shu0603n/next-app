// project import
import main from './main';
import other from './other';
import parameter from './parameter';

// types
import { NavItemType } from 'types/menu';

// ==============================|| MENU ITEMS ||============================== //

const menuItems: { items: NavItemType[] } = {
  items: [main, parameter, other]
};

export default menuItems;
