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
  SettingOutlined
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
  SettingOutlined
};

// ==============================|| MENU ITEMS - SUPPORT ||============================== //

const parameter: NavItemType = {
  id: 'system_setting',
  title: <FormattedMessage id="system_setting" />,
  type: 'group',
  children: [
    {
      id: 'parameter',
      title: <FormattedMessage id="parameter" />,
      type: 'collapse',
      icon: icons.SettingOutlined,
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
          id: 'client_position',
          title: <FormattedMessage id="client_position" />,
          type: 'item',
          url: '/parameter/client_position'
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
          id: 'employment',
          title: <FormattedMessage id="employment" />,
          type: 'item',
          url: '/parameter/employment'
        },
        {
          id: 'project_type',
          title: <FormattedMessage id="project_type" />,
          type: 'item',
          url: '/parameter/project_type'
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
        },
        {
          id: 'skill',
          title: <FormattedMessage id="skill" />,
          type: 'item',
          url: '/parameter/skill'
        },
        {
          id: 'mail_account',
          title: <FormattedMessage id="mail_account" />,
          type: 'item',
          url: '/parameter/mail_account'
        },
        {
          id: 'project_position',
          title: <FormattedMessage id="project_position" />,
          type: 'item',
          url: '/parameter/project_position'
        }
      ]
    }
  ]
};

export default parameter;
