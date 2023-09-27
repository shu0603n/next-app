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
  StopOutlined,
  RocketOutlined
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
  SmileOutlined,
  RocketOutlined
};

// ==============================|| MENU ITEMS - SUPPORT ||============================== //

const parameter: NavItemType = {
  id: 'parameter',
  title: <FormattedMessage id="parameter" />,
  type: 'group',
  children: [
    {
      id: 'parameter',
      title: <FormattedMessage id="parameter" />,
      type: 'collapse',
      icon: icons.RocketOutlined,
      children: [
        {
          id: 'skill',
          title: <FormattedMessage id="skill" />,
          type: 'item',
          url: '/',
          target: true
        },
        {
          id: 'position',
          title: <FormattedMessage id="position" />,
          type: 'item',
          url: '/parameter/position',
          target: true
        }
      ]
    }
  ]
};

export default parameter;
