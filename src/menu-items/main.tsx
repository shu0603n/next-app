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
  title: <FormattedMessage id="others" />,
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
      id: 'parameter',
      title: <FormattedMessage id="parameter" />,
      type: 'collapse',
      icon: icons.MenuUnfoldOutlined,
      children: [
        {
          id: 'position',
          title: <FormattedMessage id="position" />,
          type: 'item',
          url: '/parameter/position',
          icon: icons.ChromeOutlined
        }
      ]
    }
  ]
};

export default other;
