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
  ControlOutlined
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
  ControlOutlined
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
      icon: icons.ControlOutlined,
      children: [
        {
          id: 'skill',
          title: <FormattedMessage id="skill" />,
          type: 'item',
          url: '/parameter/skill'
        },
        {
          id: 'position',
          title: <FormattedMessage id="position" />,
          type: 'item',
          url: '/parameter/position'
        },
        {
          id: 'contract',
          title: <FormattedMessage id="contract" />,
          type: 'item',
          url: '/parameter/contract'
        },
        {
          id: 'job_category',
          title: <FormattedMessage id="job_category" />,
          type: 'item',
          url: '/parameter/job_category'
        },
        {
          id: 'process',
          title: <FormattedMessage id="process" />,
          type: 'item',
          url: '/parameter/process'
        },
        {
          id: 'project_type',
          title: <FormattedMessage id="project_type" />,
          type: 'item',
          url: '/parameter/project_type'
        },
        {
          id: 'skill',
          title: <FormattedMessage id="skill" />,
          type: 'item',
          url: '/parameter/skill'
        },
        {
          id: 'technic',
          title: <FormattedMessage id="technic" />,
          type: 'item',
          url: '/parameter/technic'
        },
        {
          id: 'working',
          title: <FormattedMessage id="working" />,
          type: 'item',
          url: '/parameter/working'
        }
      ]
    }
  ]
};

export default parameter;
