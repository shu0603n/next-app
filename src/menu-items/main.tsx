// third-party
import { FormattedMessage } from 'react-intl';

// assets
import { HomeOutlined, ProjectOutlined, ApartmentOutlined, SolutionOutlined } from '@ant-design/icons';

// type
import { NavItemType } from 'types/menu';

// icons
const icons = {
  HomeOutlined,
  ProjectOutlined,
  ApartmentOutlined,
  SolutionOutlined
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
      icon: icons.ApartmentOutlined
    },
    {
      id: 'employee',
      title: <FormattedMessage id="employee" />,
      type: 'item',
      url: '/employee',
      icon: icons.SolutionOutlined
    },
    {
      id: 'project',
      title: <FormattedMessage id="project" />,
      type: 'item',
      url: '/project',
      icon: icons.ProjectOutlined
    },
    {
      id: 'home-page',
      title: <FormattedMessage id="home-page" />,
      type: 'item',
      url: '/hp',
      icon: icons.ProjectOutlined
    },
    {
      id: 'mail',
      title: <FormattedMessage id="mail" />,
      type: 'item',
      url: '/mail',
      icon: icons.ProjectOutlined
    }
  ]
};

export default other;
