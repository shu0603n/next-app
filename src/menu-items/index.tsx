// project import
import other from './other';
import pages from './pages';
import parameter from './parameter';

//types
import { NavItemType } from 'types/menu';

// ==============================|| MENU ITEMS ||============================== //

const menuItems: { items: NavItemType[] } = {
  items: [pages, other, parameter]
};

export default menuItems;
