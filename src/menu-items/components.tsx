// third-party
import { FormattedMessage } from 'react-intl';

// project import
import { NavItemType } from 'types/menu';

// ==============================|| MENU ITEMS - COMPONENTS ||============================== //

const menuItems: NavItemType[] = [
  {
    id: 'group-inputs',
    title: <FormattedMessage id="inputs" />,
    type: 'group'
  }
];

export default menuItems;
