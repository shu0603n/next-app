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
  DollarOutlined,
  LoginOutlined,
  PhoneOutlined,
  RocketOutlined,
  PieChartOutlined,
  CloudUploadOutlined,
  FileDoneOutlined,
  FormOutlined,
  StepForwardOutlined,
  TableOutlined,
  InsertRowAboveOutlined,
  IdcardOutlined,
  DatabaseOutlined,
  LineChartOutlined,
  AppstoreAddOutlined,
  MessageOutlined,
  CalendarOutlined,
  BuildOutlined,
  CustomerServiceOutlined,
  FileTextOutlined,
  UserOutlined,
  ShoppingCartOutlined
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
  SmileOutlined,
  StopOutlined,
  DollarOutlined,
  LoginOutlined,
  PhoneOutlined,
  RocketOutlined,
  PieChartOutlined,
  CloudUploadOutlined,
  FileDoneOutlined,
  FormOutlined,
  StepForwardOutlined,
  TableOutlined,
  InsertRowAboveOutlined,
  IdcardOutlined,
  DatabaseOutlined,
  LineChartOutlined,
  AppstoreAddOutlined,
  MessageOutlined,
  CalendarOutlined,
  BuildOutlined,
  CustomerServiceOutlined,
  FileTextOutlined,
  UserOutlined,
  ShoppingCartOutlined
};
// ==============================|| MENU ITEMS - SUPPORT ||============================== //

const other: NavItemType = {
  id: 'other',
  title: <FormattedMessage id="others" />,
  type: 'group',
  children: [
    {
      id: 'other',
      title: <FormattedMessage id="others" />,
      type: 'collapse',
      children: [
        {
          id: 'other',
          title: <FormattedMessage id="others" />,
          type: 'collapse',
          children: [
            {
              id: 'group-inputs',
              title: <FormattedMessage id="inputs" />,
              type: 'collapse',
              children: [
                {
                  id: 'autocomplete',
                  search: 'autocomplete, combo box, country select, grouped, multi select',
                  title: <FormattedMessage id="autocomplete" />,
                  type: 'item',
                  url: '/components-overview/autocomplete'
                },
                {
                  id: 'buttons',
                  search: 'buttons, button group, icon button, toggle button, loading button',
                  title: <FormattedMessage id="button" />,
                  type: 'item',
                  url: '/components-overview/buttons'
                },
                {
                  id: 'checkbox',
                  search: 'checkbox, indeterminate',
                  title: <FormattedMessage id="checkbox" />,
                  type: 'item',
                  url: '/components-overview/checkbox'
                },
                {
                  id: 'radio',
                  search: 'radio',
                  title: <FormattedMessage id="radio" />,
                  type: 'item',
                  url: '/components-overview/radio'
                },
                {
                  id: 'rating',
                  search: 'rating, star rating, feedback',
                  title: <FormattedMessage id="rating" />,
                  type: 'item',
                  url: '/components-overview/rating'
                },
                {
                  id: 'switch',
                  search: 'switch',
                  title: <FormattedMessage id="switch" />,
                  type: 'item',
                  url: '/components-overview/switch'
                },
                {
                  id: 'select',
                  search: 'select, multi-select',
                  title: <FormattedMessage id="select" />,
                  type: 'item',
                  url: '/components-overview/select'
                },
                {
                  id: 'slider',
                  search: 'slider, range',
                  title: <FormattedMessage id="slider" />,
                  type: 'item',
                  url: '/components-overview/slider'
                },
                {
                  id: 'textfield',
                  search: 'textfield, input, form input, search',
                  title: <FormattedMessage id="text-field" />,
                  type: 'item',
                  url: '/components-overview/textfield'
                }
              ]
            },
            {
              id: 'data-display',
              title: <FormattedMessage id="data-display" />,
              type: 'collapse',
              children: [
                {
                  id: 'avatars',
                  search: 'avatars, fallbacks, group avatar',
                  title: <FormattedMessage id="avatar" />,
                  type: 'item',
                  url: '/components-overview/avatars'
                },
                {
                  id: 'badges',
                  search: 'badges',
                  title: <FormattedMessage id="badges" />,
                  type: 'item',
                  url: '/components-overview/badges'
                },
                {
                  id: 'chips',
                  search: 'chips, tags, ',
                  title: <FormattedMessage id="chip" />,
                  type: 'item',
                  url: '/components-overview/chips'
                },
                {
                  id: 'lists',
                  search: 'lists, folder list, nested list',
                  title: <FormattedMessage id="list" />,
                  type: 'item',
                  url: '/components-overview/lists'
                },
                {
                  id: 'tooltip',
                  search: 'tooltip',
                  title: <FormattedMessage id="tooltip" />,
                  type: 'item',
                  url: '/components-overview/tooltip'
                },
                {
                  id: 'typography',
                  search: 'typography, h1, h2,h3, h4, h5, h6, caption, subtitle, body',
                  title: <FormattedMessage id="typography" />,
                  type: 'item',
                  url: '/components-overview/typography'
                }
              ]
            },
            {
              id: 'feedback',
              title: <FormattedMessage id="feedback" />,
              type: 'collapse',
              children: [
                {
                  id: 'alert',
                  search: 'alert',
                  title: <FormattedMessage id="alert" />,
                  type: 'item',
                  url: '/components-overview/alert'
                },
                {
                  id: 'dialogs',
                  search: 'dialogs, modal, sweetalert, confirmation box',
                  title: <FormattedMessage id="dialogs" />,
                  type: 'item',
                  url: '/components-overview/dialogs'
                },
                {
                  id: 'progress',
                  search: 'progress, circular, linear, buffer',
                  title: <FormattedMessage id="progress" />,
                  type: 'item',
                  url: '/components-overview/progress'
                },
                {
                  id: 'snackbar',
                  search: 'snackbar, notification, notify',
                  title: <FormattedMessage id="snackbar" />,
                  type: 'item',
                  url: '/components-overview/snackbar'
                }
              ]
            },
            {
              id: 'navigation',
              title: <FormattedMessage id="navigation" />,
              type: 'collapse',
              children: [
                {
                  id: 'breadcrumbs',
                  search: 'breadcrumbs',
                  title: <FormattedMessage id="breadcrumb" />,
                  type: 'item',
                  url: '/components-overview/breadcrumbs'
                },
                {
                  id: 'pagination',
                  search: 'pagination, table pagination',
                  title: <FormattedMessage id="pagination" />,
                  type: 'item',
                  url: '/components-overview/pagination'
                },
                {
                  id: 'speeddial',
                  search: 'speeddial, speed dial, quick access button, fab button',
                  title: <FormattedMessage id="speed-dial" />,
                  type: 'item',
                  url: '/components-overview/speeddial'
                },
                {
                  id: 'stepper',
                  search: 'stepper, form wizard, vertical stepper, vertical wizard',
                  title: <FormattedMessage id="stepper" />,
                  type: 'item',
                  url: '/components-overview/stepper'
                },
                {
                  id: 'tabs',
                  search: 'tabs, vertical tab',
                  title: <FormattedMessage id="tabs" />,
                  type: 'item',
                  url: '/components-overview/tabs'
                }
              ]
            },
            {
              id: 'surfaces',
              title: <FormattedMessage id="surfaces" />,
              type: 'collapse',
              children: [
                {
                  id: 'accordion',
                  search: 'accordion',
                  title: <FormattedMessage id="accordion" />,
                  type: 'item',
                  url: '/components-overview/accordion'
                },
                {
                  id: 'cards',
                  search: 'cards',
                  title: <FormattedMessage id="cards" />,
                  type: 'item',
                  url: '/components-overview/cards'
                }
              ]
            },
            {
              id: 'utils',
              title: <FormattedMessage id="utils" />,
              type: 'collapse',
              children: [
                {
                  id: 'color',
                  search: 'color',
                  title: <FormattedMessage id="color" />,
                  type: 'item',
                  url: '/components-overview/color'
                },
                {
                  id: 'date-time-picker',
                  search: 'datetime, date, time date time, picker, date range picker',
                  title: <FormattedMessage id="datetime" />,
                  type: 'item',
                  url: '/components-overview/date-time-picker'
                },
                {
                  id: 'modal',
                  search: 'modal, dialog',
                  title: <FormattedMessage id="modal" />,
                  type: 'item',
                  url: '/components-overview/modal'
                },
                {
                  id: 'shadows',
                  search: 'shadows, color shadow',
                  title: <FormattedMessage id="shadow" />,
                  type: 'item',
                  url: '/components-overview/shadows'
                },
                {
                  id: 'timeline',
                  search: 'timeline, list of event',
                  title: <FormattedMessage id="timeline" />,
                  type: 'item',
                  url: '/components-overview/timeline'
                },
                {
                  id: 'treeview',
                  search: 'treeview, email clone',
                  title: <FormattedMessage id="treeview" />,
                  type: 'item',
                  url: '/components-overview/treeview'
                }
              ]
            },
            {
              id: 'sample-page',
              title: <FormattedMessage id="sample-page" />,
              type: 'item',
              url: '/sample-page',
              icon: icons.ChromeOutlined
            },
            {
              id: 'menu-level',
              title: <FormattedMessage id="menu-level" />,
              type: 'collapse',
              icon: icons.MenuUnfoldOutlined,
              children: [
                {
                  id: 'menu-level-1.1',
                  title: (
                    <>
                      <FormattedMessage id="level" /> 1
                    </>
                  ),
                  type: 'item',
                  url: '#'
                },
                {
                  id: 'menu-level-1.2',
                  title: (
                    <>
                      <FormattedMessage id="level" /> 1
                    </>
                  ),
                  type: 'collapse',
                  children: [
                    {
                      id: 'menu-level-2.1',
                      title: (
                        <>
                          <FormattedMessage id="level" /> 2
                        </>
                      ),
                      type: 'item',
                      url: '#'
                    },
                    {
                      id: 'menu-level-2.2',
                      title: (
                        <>
                          <FormattedMessage id="level" /> 2
                        </>
                      ),
                      type: 'collapse',
                      children: [
                        {
                          id: 'menu-level-3.1',
                          title: (
                            <>
                              <FormattedMessage id="level" /> 3
                            </>
                          ),
                          type: 'item',
                          url: '#'
                        },
                        {
                          id: 'menu-level-3.2',
                          title: (
                            <>
                              <FormattedMessage id="level" /> 3
                            </>
                          ),
                          type: 'item',
                          url: '#'
                        }
                      ]
                    }
                  ]
                }
              ]
            },
            {
              id: 'menu-level-subtitle',
              title: <FormattedMessage id="menu-level-subtitle" />,
              caption: <FormattedMessage id="menu-level-subtitle-caption" />,
              type: 'collapse',
              icon: icons.BoxPlotOutlined,
              children: [
                {
                  id: 'sub-menu-level-1.1',
                  title: (
                    <>
                      <FormattedMessage id="level" /> 1
                    </>
                  ),
                  caption: <FormattedMessage id="menu-level-subtitle-item" />,
                  type: 'item',
                  url: '#'
                },
                {
                  id: 'sub-menu-level-1.2',
                  title: (
                    <>
                      <FormattedMessage id="level" /> 1
                    </>
                  ),
                  caption: <FormattedMessage id="menu-level-subtitle-collapse" />,
                  type: 'collapse',
                  children: [
                    {
                      id: 'sub-menu-level-2.1',
                      title: (
                        <>
                          <FormattedMessage id="level" /> 2
                        </>
                      ),
                      caption: <FormattedMessage id="menu-level-subtitle-sub-item" />,
                      type: 'item',
                      url: '#'
                    }
                  ]
                }
              ]
            },
            {
              id: 'disabled-menu',
              title: <FormattedMessage id="disabled-menu" />,
              type: 'item',
              url: '#',
              icon: icons.StopOutlined,
              disabled: true
            },
            {
              id: 'oval-chip-menu',
              title: <FormattedMessage id="oval-chip-menu" />,
              type: 'item',
              url: '#',
              icon: icons.BorderOutlined
            },
            {
              id: 'documentation',
              title: <FormattedMessage id="documentation" />,
              type: 'item',
              url: 'https://codedthemes.gitbook.io/mantis/',
              icon: icons.QuestionOutlined,
              external: true,
              target: true,
              chip: {
                label: 'gitbook',
                color: 'secondary',
                size: 'small'
              }
            },
            {
              id: 'roadmap',
              title: <FormattedMessage id="roadmap" />,
              type: 'item',
              url: 'https://codedthemes.gitbook.io/mantis/roadmap',
              icon: icons.DeploymentUnitOutlined,
              external: true,
              target: true
            }
          ]
        },
        {
          id: 'group-widget',
          title: <FormattedMessage id="widgets" />,
          icon: icons.IdcardOutlined,
          type: 'collapse',
          children: [
            {
              id: 'statistics',
              title: <FormattedMessage id="statistics" />,
              type: 'item',
              url: '/widget/statistics',
              icon: icons.IdcardOutlined
            },
            {
              id: 'data',
              title: <FormattedMessage id="data" />,
              type: 'item',
              url: '/widget/data',
              icon: icons.DatabaseOutlined
            },
            {
              id: 'chart',
              title: <FormattedMessage id="chart" />,
              type: 'item',
              url: '/widget/chart',
              icon: icons.LineChartOutlined
            }
          ]
        },
        {
          id: 'group-applications',
          title: <FormattedMessage id="applications" />,
          icon: icons.AppstoreAddOutlined,
          type: 'collapse',
          children: [
            {
              id: 'chat',
              title: <FormattedMessage id="chat" />,
              type: 'item',
              url: '/apps/chat',
              icon: icons.MessageOutlined,
              breadcrumbs: false
            },
            {
              id: 'calendar',
              title: <FormattedMessage id="calendar" />,
              type: 'item',
              url: '/apps/calendar',
              icon: icons.CalendarOutlined
            },
            {
              id: 'kanban',
              title: <FormattedMessage id="kanban" />,
              type: 'item',
              icon: BuildOutlined,
              url: '/apps/kanban/board'
            },
            {
              id: 'customer',
              title: <FormattedMessage id="customer" />,
              type: 'collapse',
              icon: icons.CustomerServiceOutlined,
              children: [
                {
                  id: 'customer-list',
                  title: <FormattedMessage id="list" />,
                  type: 'item',
                  url: '/apps/customer/list'
                },
                {
                  id: 'customer-card',
                  title: <FormattedMessage id="cards" />,
                  type: 'item',
                  url: '/apps/customer/card'
                }
              ]
            },
            {
              id: 'invoice',
              title: <FormattedMessage id="invoice" />,
              url: '/apps/invoice/dashboard',
              type: 'collapse',
              icon: icons.FileTextOutlined,
              breadcrumbs: true,
              children: [
                {
                  id: 'create',
                  title: <FormattedMessage id="create" />,
                  type: 'item',
                  url: '/apps/invoice/create'
                },
                {
                  id: 'details',
                  title: <FormattedMessage id="details" />,
                  type: 'item',
                  url: '/apps/invoice/details/1'
                },
                {
                  id: 'list',
                  title: <FormattedMessage id="list" />,
                  type: 'item',
                  url: '/apps/invoice/list'
                },
                {
                  id: 'edit',
                  title: <FormattedMessage id="edit" />,
                  type: 'item',
                  url: '/apps/invoice/edit/1'
                }
              ]
            },
            {
              id: 'profile',
              title: <FormattedMessage id="profile" />,
              type: 'collapse',
              icon: icons.UserOutlined,
              children: [
                {
                  id: 'user-profile',
                  title: <FormattedMessage id="user-profile" />,
                  type: 'item',
                  url: '/apps/profiles/user/personal',
                  breadcrumbs: false
                },
                {
                  id: 'account-profile',
                  title: <FormattedMessage id="account-profile" />,
                  type: 'item',
                  url: '/apps/profiles/account/basic'
                }
              ]
            },
            {
              id: 'e-commerce',
              title: <FormattedMessage id="e-commerce" />,
              type: 'collapse',
              icon: icons.ShoppingCartOutlined,
              children: [
                {
                  id: 'products',
                  title: <FormattedMessage id="products" />,
                  type: 'item',
                  url: '/apps/e-commerce/products'
                },
                {
                  id: 'product-details',
                  title: <FormattedMessage id="product-details" />,
                  type: 'item',
                  url: '/apps/e-commerce/product-details/1',
                  breadcrumbs: false
                },
                {
                  id: 'product-list',
                  title: <FormattedMessage id="product-list" />,
                  type: 'item',
                  url: '/apps/e-commerce/products-list',
                  breadcrumbs: false
                },
                {
                  id: 'add-new-product',
                  title: <FormattedMessage id="add-new-product" />,
                  type: 'item',
                  url: '/apps/e-commerce/add-product'
                },
                {
                  id: 'checkout',
                  title: <FormattedMessage id="checkout" />,
                  type: 'item',
                  url: '/apps/e-commerce/checkout'
                }
              ]
            }
          ]
        },
        {
          id: 'group-forms-tables',
          title: <FormattedMessage id="forms-tables" />,
          icon: icons.FileDoneOutlined,
          type: 'collapse',
          children: [
            {
              id: 'validation',
              title: <FormattedMessage id="forms-validation" />,
              type: 'item',
              url: '/forms/validation',
              icon: icons.FileDoneOutlined
            },
            {
              id: 'wizard',
              title: <FormattedMessage id="forms-wizard" />,
              type: 'item',
              url: '/forms/wizard',
              icon: icons.StepForwardOutlined
            },
            {
              id: 'forms-layout',
              title: <FormattedMessage id="layout" />,
              type: 'collapse',
              icon: icons.FormOutlined,
              children: [
                {
                  id: 'basic',
                  title: <FormattedMessage id="basic" />,
                  type: 'item',
                  url: '/forms/layouts/basic'
                },
                {
                  id: 'multi-column',
                  title: <FormattedMessage id="multi-column" />,
                  type: 'item',
                  url: '/forms/layouts/multi-column'
                },
                {
                  id: 'action-bar',
                  title: <FormattedMessage id="action-bar" />,
                  type: 'item',
                  url: '/forms/layouts/action-bar'
                },
                {
                  id: 'sticky-bar',
                  title: <FormattedMessage id="sticky-bar" />,
                  type: 'item',
                  url: '/forms/layouts/sticky-bar'
                }
              ]
            },
            {
              id: 'forms-plugins',
              title: <FormattedMessage id="plugins" />,
              type: 'collapse',
              icon: icons.CloudUploadOutlined,
              children: [
                {
                  id: 'mask',
                  title: <FormattedMessage id="mask" />,
                  type: 'item',
                  url: '/forms/plugins/mask'
                },
                {
                  id: 'clipboard',
                  title: <FormattedMessage id="clipboard" />,
                  type: 'item',
                  url: '/forms/plugins/clipboard'
                },
                {
                  id: 're-captcha',
                  title: <FormattedMessage id="re-captcha" />,
                  type: 'item',
                  url: '/forms/plugins/re-captcha'
                },
                {
                  id: 'editor',
                  title: <FormattedMessage id="editor" />,
                  type: 'item',
                  url: '/forms/plugins/editor'
                },
                {
                  id: 'dropzone',
                  title: <FormattedMessage id="dropzone" />,
                  type: 'item',
                  url: '/forms/plugins/dropzone'
                }
              ]
            },
            {
              id: 'react-tables',
              title: <FormattedMessage id="react-table" />,
              type: 'collapse',
              icon: icons.InsertRowAboveOutlined,
              children: [
                {
                  id: 'rt-table',
                  title: <FormattedMessage id="basic" />,
                  type: 'item',
                  url: '/tables/react-table/basic'
                },
                {
                  id: 'rt-sorting',
                  title: <FormattedMessage id="sorting" />,
                  type: 'item',
                  url: '/tables/react-table/sorting'
                },
                {
                  id: 'rt-filtering',
                  title: <FormattedMessage id="filtering" />,
                  type: 'item',
                  url: '/tables/react-table/filtering'
                },
                {
                  id: 'rt-grouping',
                  title: <FormattedMessage id="grouping" />,
                  type: 'item',
                  url: '/tables/react-table/grouping'
                },
                {
                  id: 'rt-pagination',
                  title: <FormattedMessage id="pagination" />,
                  type: 'item',
                  url: '/tables/react-table/pagination'
                },
                {
                  id: 'rt-row-selection',
                  title: <FormattedMessage id="row-selection" />,
                  type: 'item',
                  url: '/tables/react-table/row-selection'
                },
                {
                  id: 'rt-expanding',
                  title: <FormattedMessage id="expanding" />,
                  type: 'item',
                  url: '/tables/react-table/expanding'
                },
                {
                  id: 'rt-editable',
                  title: <FormattedMessage id="editable" />,
                  type: 'item',
                  url: '/tables/react-table/editable'
                },
                {
                  id: 'rt-drag-drop',
                  title: <FormattedMessage id="drag-drop" />,
                  type: 'item',
                  url: '/tables/react-table/drag-drop'
                },
                {
                  id: 'rt-column-hiding',
                  title: <FormattedMessage id="column-hiding" />,
                  type: 'item',
                  url: '/tables/react-table/column-hiding'
                },
                {
                  id: 'rt-column-resizing',
                  title: <FormattedMessage id="column-resizing" />,
                  type: 'item',
                  url: '/tables/react-table/column-resizing'
                },
                {
                  id: 'rt-sticky-table',
                  title: <FormattedMessage id="sticky" />,
                  type: 'item',
                  url: '/tables/react-table/sticky-table'
                },
                {
                  id: 'rt-umbrella',
                  title: <FormattedMessage id="umbrella" />,
                  type: 'item',
                  url: '/tables/react-table/umbrella'
                },
                {
                  id: 'rt-empty',
                  title: <FormattedMessage id="empty" />,
                  type: 'item',
                  url: '/tables/react-table/empty'
                },
                {
                  id: 'rt-virtualized',
                  title: <FormattedMessage id="virtualized" />,
                  type: 'item',
                  url: '/tables/react-table/virtualized'
                }
              ]
            },
            {
              id: 'mui-tables',
              title: <FormattedMessage id="mui-table" />,
              type: 'collapse',
              icon: icons.TableOutlined,
              children: [
                {
                  id: 'mui-table',
                  title: <FormattedMessage id="basic" />,
                  type: 'item',
                  url: '/tables/mui-table/basic'
                },
                {
                  id: 'mui-dense',
                  title: <FormattedMessage id="dense" />,
                  type: 'item',
                  url: '/tables/mui-table/dense'
                },
                {
                  id: 'mui-enhanced',
                  title: <FormattedMessage id="enhanced" />,
                  type: 'item',
                  url: '/tables/mui-table/enhanced'
                },
                {
                  id: 'mui-data-table',
                  title: <FormattedMessage id="datatable" />,
                  type: 'item',
                  url: '/tables/mui-table/datatable'
                },
                {
                  id: 'mui-custom',
                  title: <FormattedMessage id="custom" />,
                  type: 'item',
                  url: '/tables/mui-table/custom'
                },
                {
                  id: 'mui-fixed-header',
                  title: <FormattedMessage id="fixed-header" />,
                  type: 'item',
                  url: '/tables/mui-table/fixed-header'
                },
                {
                  id: 'mui-collapse',
                  title: <FormattedMessage id="collapse" />,
                  type: 'item',
                  url: '/tables/mui-table/collapse'
                }
              ]
            }
          ]
        },
        {
          id: 'group-charts-map',
          title: <FormattedMessage id="charts-map" />,
          icon: icons.PieChartOutlined,
          type: 'collapse',
          children: [
            {
              id: 'react-chart',
              title: <FormattedMessage id="charts" />,
              type: 'collapse',
              icon: icons.PieChartOutlined,
              children: [
                {
                  id: 'apexchart',
                  title: <FormattedMessage id="apexchart" />,
                  type: 'item',
                  url: '/charts/apexchart'
                },
                {
                  id: 'org-chart',
                  title: <FormattedMessage id="org-chart" />,
                  type: 'item',
                  url: '/charts/org-chart'
                }
              ]
            }
          ]
        },
        {
          id: 'group-pages',
          title: <FormattedMessage id="pages" />,
          type: 'collapse',
          children: [
            {
              id: 'authentication',
              title: <FormattedMessage id="authentication" />,
              type: 'collapse',
              icon: icons.LoginOutlined,
              children: [
                {
                  id: 'login',
                  title: <FormattedMessage id="login" />,
                  type: 'item',
                  url: '/auth/login',
                  target: true
                },
                {
                  id: 'register',
                  title: <FormattedMessage id="register" />,
                  type: 'item',
                  url: '/auth/register',
                  target: true
                },
                {
                  id: 'forgot-password',
                  title: <FormattedMessage id="forgot-password" />,
                  type: 'item',
                  url: '/auth/forgot-password',
                  target: true
                },
                {
                  id: 'reset-password',
                  title: <FormattedMessage id="reset-password" />,
                  type: 'item',
                  url: '/auth/reset-password',
                  target: true
                },
                {
                  id: 'check-mail',
                  title: <FormattedMessage id="check-mail" />,
                  type: 'item',
                  url: '/auth/check-mail',
                  target: true
                },
                {
                  id: 'code-verification',
                  title: <FormattedMessage id="code-verification" />,
                  type: 'item',
                  url: '/auth/code-verification',
                  target: true
                }
              ]
            },
            {
              id: 'maintenance',
              title: <FormattedMessage id="maintenance" />,
              type: 'collapse',
              icon: icons.RocketOutlined,
              children: [
                {
                  id: 'error-404',
                  title: <FormattedMessage id="error-404" />,
                  type: 'item',
                  url: '/maintenance/404',
                  target: true
                },
                {
                  id: 'error-500',
                  title: <FormattedMessage id="error-500" />,
                  type: 'item',
                  url: '/maintenance/500',
                  target: true
                },
                {
                  id: 'coming-soon',
                  title: <FormattedMessage id="coming-soon" />,
                  type: 'item',
                  url: '/maintenance/coming-soon',
                  target: true
                },
                {
                  id: 'under-construction',
                  title: <FormattedMessage id="under-construction" />,
                  type: 'item',
                  url: '/maintenance/under-construction',
                  target: true
                }
              ]
            },
            {
              id: 'contact-us',
              title: <FormattedMessage id="contact-us" />,
              type: 'item',
              url: '/contact-us',
              icon: icons.PhoneOutlined,
              target: true
            },
            {
              id: 'pricing',
              title: <FormattedMessage id="pricing" />,
              type: 'item',
              url: '/pricing',
              icon: icons.DollarOutlined
            }
          ]
        }
      ]
    }
  ]
};

export default other;
