// third-party
import { FormattedMessage } from 'react-intl';

// assets
import {
  HomeOutlined,
  SolutionOutlined,
  TeamOutlined,
  ShopOutlined,
  SnippetsOutlined,
  MailOutlined,
  UnorderedListOutlined
} from '@ant-design/icons';

// type
import { NavItemType } from 'types/menu';

// icons
const icons = {
  TeamOutlined,
  ShopOutlined,
  HomeOutlined,
  SolutionOutlined,
  SnippetsOutlined,
  MailOutlined,
  UnorderedListOutlined
};

// ==============================|| MENU ITEMS - SUPPORT ||============================== //

const main: NavItemType = {
  id: 'main',
  title: <FormattedMessage id="main" />,
  type: 'group',
  children: [
    {
      id: 'attendance',
      title: <FormattedMessage id="attendance" />,
      type: 'item',
      url: '/attendance',
      icon: icons.HomeOutlined
    },
    {
      id: 'employee',
      title: <FormattedMessage id="employee" />,
      type: 'item',
      url: '/employee',
      icon: icons.TeamOutlined,
      children: [
        {
          id: 'employee-detail',
          title: <FormattedMessage id="employee-detail" />,
          type: 'item',
          url: '/employee/detail/[id]/[section]',
          icon: icons.TeamOutlined
        }
      ]
    }
  ]
};

export default main;
