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

const engineering: NavItemType = {
  id: 'engineering',
  title: <FormattedMessage id="engineering" />,
  type: 'group',
  children: [
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
      id: 'engineer',
      title: <FormattedMessage id="engineer" />,
      type: 'item',
      url: '/engineer',
      icon: icons.TeamOutlined,
      disabled: true,
      children: [
        {
          id: 'engineer-detail',
          title: <FormattedMessage id="engineer-detail" />,
          type: 'item',
          url: '/engineer/detail/[id]/[section]',
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
    }
  ]
};

export default engineering;
