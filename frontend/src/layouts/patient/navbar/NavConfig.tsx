// routes
import { PATH_PATIENT_DASHBOARD } from '../../../routes/paths';
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
        title: 'app',
        path: PATH_PATIENT_DASHBOARD.general.app,
        icon: ICONS.dashboard,
      },
    ],
  },

  // MANAGEMENT
  // ----------------------------------------------------------------------
  {
    subheader: 'management',
    items: [
      // USER
      {
        title: 'user',
        path: PATH_PATIENT_DASHBOARD.user.root,
        icon: ICONS.user,
        children: [
          { title: 'My Profile', path: PATH_PATIENT_DASHBOARD.user.profile },
          { title: 'Account', path: PATH_PATIENT_DASHBOARD.user.account },
          { title: 'My Doctors', path: PATH_PATIENT_DASHBOARD.user.myDoctors },
        ],
      },

      // VISITS
      {
        title: 'visits',
        path: PATH_PATIENT_DASHBOARD.visits.root,
        icon: ICONS.booking,
        children: [
          { title: 'My Visits', path: PATH_PATIENT_DASHBOARD.visits.list },
          {
            title: 'Doctor List',
            path: PATH_PATIENT_DASHBOARD.visits.doctorList,
          },
        ],
      },

      // BLOG
      {
        title: 'blog',
        path: PATH_PATIENT_DASHBOARD.blog.root,
        icon: ICONS.blog,
        children: [{ title: 'posts', path: PATH_PATIENT_DASHBOARD.blog.posts }],
      },
    ],
  },
];

export default navConfig;
