// routes
import { PATH_ADMIN_DASHBOARD } from '../../../routes/paths';
// components
import Label from '../../../components/Label';
import Iconify from '../../../components/Iconify';
import SvgIconStyle from '../../../components/SvgIconStyle';

// ----------------------------------------------------------------------

const getIcon = (name: string) => (
  <SvgIconStyle
    src={`/assets/icons/navbar/${name}.svg`}
    sx={{ width: 1, height: 1 }}
  />
);

const ICONS = {
  blog: getIcon('ic_blog'),
  cart: getIcon('ic_cart'),
  chat: getIcon('ic_chat'),
  mail: getIcon('ic_mail'),
  user: getIcon('ic_user'),
  kanban: getIcon('ic_kanban'),
  banking: getIcon('ic_banking'),
  booking: getIcon('ic_booking'),
  invoice: getIcon('ic_invoice'),
  calendar: getIcon('ic_calendar'),
  ecommerce: getIcon('ic_ecommerce'),
  analytics: getIcon('ic_analytics'),
  dashboard: getIcon('ic_dashboard'),
  menuItem: getIcon('ic_menu_item'),
};

const navConfig = [
  // GENERAL
  // ----------------------------------------------------------------------
  {
    subheader: 'general',
    items: [
      {
        title: 'Dashboard',
        path: PATH_ADMIN_DASHBOARD.general.app,
        icon: ICONS.dashboard,
      },
      // {
      //   title: 'Doctly Overview',
      //   path: PATH_ADMIN_DASHBOARD.general.ecommerce,
      //   icon: ICONS.ecommerce,
      // },
      // {
      //   title: 'Health analytics',
      //   path: PATH_ADMIN_DASHBOARD.general.analytics,
      //   icon: ICONS.analytics,
      // },
      // {
      //   title: 'Financial Statistics',
      //   path: PATH_ADMIN_DASHBOARD.general.banking,
      //   icon: ICONS.banking,
      // },
      // { title: 'booking', path: PATH_ADMIN_DASHBOARD.general.booking, icon: ICONS.booking },
    ],
  },

  // MANAGEMENT
  {
    subheader: 'management',
    items: [
      {
        title: 'directory',
        path: PATH_ADMIN_DASHBOARD.directory.root,
        icon: ICONS.user,
        children: [
          { title: 'Doctors', path: PATH_ADMIN_DASHBOARD.directory.cards },
          {
            title: 'Patients',
            path: PATH_ADMIN_DASHBOARD.directory.list,
          },
          // { title: 'create', path: PATH_ADMIN_DASHBOARD.user.new },
          // { title: 'edit', path: PATH_ADMIN_DASHBOARD.user.demoEdit },
          {
            title: 'Verify Doctors',
            path: PATH_ADMIN_DASHBOARD.directory.verification,
          },
        ],
      },
      {
        title: 'user',
        path: PATH_ADMIN_DASHBOARD.user.root,
        icon: ICONS.user,
        children: [
          { title: 'My Profile', path: PATH_ADMIN_DASHBOARD.user.profile },
          // { title: 'create', path: PATH_ADMIN_DASHBOARD.user.new },
          // { title: 'edit', path: PATH_ADMIN_DASHBOARD.user.demoEdit },
          { title: 'settings', path: PATH_ADMIN_DASHBOARD.user.account },
        ],
      },

      // BLOG
      {
        title: 'blog',
        path: PATH_ADMIN_DASHBOARD.blog.root,
        icon: ICONS.blog,
        children: [
          { title: 'New Blog', path: PATH_ADMIN_DASHBOARD.blog.new },
          { title: 'Blog list', path: PATH_ADMIN_DASHBOARD.blog.posts },
          // { title: 'post', path: PATH_ADMIN_DASHBOARD.blog.demoView },
        ],
      },
    ],
  },

  // FINANCES
  {
    subheader: 'finances',
    items: [
      {
        title: 'payment',
        path: PATH_ADMIN_DASHBOARD.payment.root,
        icon: ICONS.user,
        children: [
          {
            title: 'Verify Refund',
            path: PATH_ADMIN_DASHBOARD.payment.verification,
          },
        ],
      },
    ],
  },
];

export default navConfig;
