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

const staffing: NavItemType = {
  id: 'staffing',
  title: <FormattedMessage id="staffing" />,
  type: 'group',
  children: [
    {
      id: 'staff',
      title: <FormattedMessage id="staff" />,
      type: 'item',
      url: '/staff',
      icon: icons.TeamOutlined,
      children: [
        {
          id: 'staff-detail',
          title: <FormattedMessage id="staff-detail" />,
          type: 'item',
          url: '/staff/detail/[id]/[section]',
          icon: icons.TeamOutlined
        }
      ]
    },
    {
      id: 'mail',
      title: <FormattedMessage id="mail" />,
      type: 'item',
      url: '/mail',
      icon: icons.MailOutlined,
      children: [
        {
          id: 'mail-detail',
          title: <FormattedMessage id="mail-detail" />,
          type: 'item',
          url: '/mail/detail/[id]/[section]',
          icon: icons.TeamOutlined
        }
      ]
    }
  ]
};

export default staffing;
