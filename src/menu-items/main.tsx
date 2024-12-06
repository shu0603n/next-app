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

const other: NavItemType = {
  id: 'main',
  title: <FormattedMessage id="main" />,
  type: 'group',
  children: [
    {
      id: 'top',
      title: <FormattedMessage id="top" />,
      type: 'item',
      url: '/top',
      icon: icons.HomeOutlined
    },
    {
      id: 'client',
      title: <FormattedMessage id="client" />,
      type: 'item',
      url: '/client',
      icon: icons.ShopOutlined,
      children: [
        {
          id: 'client-detail',
          title: <FormattedMessage id="client-detail" />,
          type: 'item',
          url: '/client/detail/[id]/[section]',
          icon: icons.ShopOutlined
        }
      ]
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
    },
    {
      id: 'project',
      title: <FormattedMessage id="project" />,
      type: 'item',
      url: '/project',
      icon: icons.SnippetsOutlined
    },
    {
      id: 'home-page',
      title: <FormattedMessage id="home-page" />,
      type: 'item',
      url: '/hp',
      icon: icons.UnorderedListOutlined
    },
    {
      id: 'mail',
      title: <FormattedMessage id="mail" />,
      type: 'item',
      url: '/mail',
      icon: icons.MailOutlined
    }
  ]
};

export default other;
