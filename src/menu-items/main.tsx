// third-party
import { FormattedMessage } from 'react-intl';

// assets
import {
  BorderOutlined,
  BoxPlotOutlined,
  ChromeOutlined,
  DeploymentUnitOutlined,
  GatewayOutlined,
  MenuUnfoldOutlined,
  QuestionOutlined,
  SmileOutlined,
  StopOutlined
} from '@ant-design/icons';

// type
import { NavItemType } from 'types/menu';

// icons
const icons = {
  BorderOutlined,
  BoxPlotOutlined,
  ChromeOutlined,
  DeploymentUnitOutlined,
  GatewayOutlined,
  MenuUnfoldOutlined,
  QuestionOutlined,
  StopOutlined,
  SmileOutlined
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
      icon: icons.ChromeOutlined
    },
    {
      id: 'employee',
      title: <FormattedMessage id="employee" />,
      type: 'item',
      url: '/employee',
      icon: icons.ChromeOutlined
    },
    {
      id: 'client',
      title: <FormattedMessage id="client" />,
      type: 'item',
      url: '/client',
      icon: icons.ChromeOutlined
    },
    {
      id: 'project',
      title: <FormattedMessage id="project" />,
      type: 'item',
      url: '/project',
      icon: icons.ChromeOutlined
    }
  ]
};

export default other;
