// routes
import { PATH_DASHBOARD } from '../../../routes/paths';
// components
import Label from '../../../components/Label';
import Iconify from '../../../components/Iconify';
import SvgIconStyle from '../../../components/SvgIconStyle';
import LockIcon from '@mui/icons-material/Lock';

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
  lock: <LockIcon sx={{ fontSize: 24 }} />,
};

// Load user data from localStorage (client side only)
let user: any = null;
if (typeof window !== 'undefined') {
  const userData = localStorage.getItem('userData');
  if (userData) user = JSON.parse(userData);
}

const isPending =
  user?.verified_status === 'pending' || user?.verified_status === 'rejected';

/**
 * Safely build a nav item
 */
const getNavItem = (
  title: string,
  path: string,
  iconName?: keyof typeof ICONS,
  children?: { title: string; path: string }[],
) => {
  const restrictedPath = isPending ? '' : path;
  const restrictedChildren = children?.map((child) => ({
    ...child,
    path: isPending ? '' : child.path,
  }));

  return {
    title,
    path: restrictedPath,
    ...(iconName && { icon: isPending ? ICONS.lock : ICONS[iconName] }),
    ...(restrictedChildren && { children: restrictedChildren }),
  };
};

/**
 * Safe getActive function — never crashes if path is missing
 */
export function getActive(
  path: string | undefined,
  pathname: string,
  asPath: string,
) {
  if (!path) return false; // skip if path is undefined or empty
  const checkPath = path.startsWith('#!');
  return (
    (!checkPath && pathname.includes(path)) ||
    (!checkPath && asPath.includes(path))
  );
}

const navConfig = [
  {
    subheader: 'general',
    items: [
      getNavItem('Dashboard', PATH_DASHBOARD.general.app, 'dashboard'),
      getNavItem('Analytics', PATH_DASHBOARD.general.analytics, 'analytics'),
      getNavItem('Appointment', PATH_DASHBOARD.general.booking, 'booking'),
    ],
  },
  {
    subheader: 'management',
    items: [
      getNavItem('Patients', PATH_DASHBOARD.docPatient.root, 'user', [
        { title: 'My Patients', path: PATH_DASHBOARD.docPatient.cards },
        { title: 'Doctly Patients', path: PATH_DASHBOARD.docPatient.list },
      ]),
      getNavItem('Visits', PATH_DASHBOARD.visits.root, 'booking', [
        { title: 'New Visit', path: PATH_DASHBOARD.visits.new },
        { title: 'Visit List', path: PATH_DASHBOARD.visits.list },
        { title: 'Approve Visit', path: PATH_DASHBOARD.visits.approveVisit },
      ]),
      getNavItem('User', PATH_DASHBOARD.user.root, 'user', [
        { title: 'My Profile', path: PATH_DASHBOARD.user.profile },
        { title: 'Settings', path: PATH_DASHBOARD.user.account },
      ]),
      getNavItem('Blog', PATH_DASHBOARD.blog.root, 'blog', [
        { title: 'Posts', path: PATH_DASHBOARD.blog.posts },
      ]),
    ],
  },
];

// const navConfig = [
//   {
//     subheader: 'general',
//     items: [
//       {
//         title: 'Dashboard',
//         path:
//           user?.verified_status === 'pending' ? '' : PATH_DASHBOARD.general.app,
//         icon: ICONS.lock,
//       },
//       {
//         title: 'analytics',
//         path:
//           user?.verified_status === 'pending'
//             ? ''
//             : PATH_DASHBOARD.general.analytics,
//         icon: ICONS.lock,
//       },
//       {
//         title: 'Appointment',
//         path:
//           user?.verified_status === 'pending'
//             ? ''
//             : PATH_DASHBOARD.general.booking,
//         icon: ICONS.lock,
//       },
//     ],
//   },
//   {
//     subheader: 'management',
//     items: [
//       {
//         title: 'Patients',
//         path:
//           user?.verified_status === 'pending'
//             ? ''
//             : PATH_DASHBOARD.docPatient.root,
//         icon: ICONS.lock,
//         children: [
//           {
//             title: 'My Patients',
//             path: PATH_DASHBOARD.docPatient.list,
//           },
//           {
//             title: 'Doctly Patients',
//             path: PATH_DASHBOARD.docPatient.cards,
//           },
//         ],
//       },
//       {
//         title: 'Visits',
//         path:
//           user?.verified_status === 'pending' ? '' : PATH_DASHBOARD.visits.root,
//         icon: ICONS.lock,
//         children: [
//           {
//             title: 'New Visit',
//             path:
//               user?.verified_status === 'pending'
//                 ? ''
//                 : PATH_DASHBOARD.visits.new,
//           },
//           {
//             title: 'Visit List',
//             path:
//               user?.verified_status === 'pending'
//                 ? ''
//                 : PATH_DASHBOARD.visits.list,
//           },
//         ],
//       },
//       {
//         title: 'user',
//         path:
//           user?.verified_status === 'pending' ? '' : PATH_DASHBOARD.user.root,
//         icon: ICONS.lock,
//         children: [
//           {
//             title: 'My Profile',
//             path:
//               user?.verified_status === 'pending'
//                 ? ''
//                 : PATH_DASHBOARD.user.profile,
//           },
//           {
//             title: 'Settings',
//             path: PATH_DASHBOARD.user.account,
//           },
//         ],
//       },
//       {
//         title: 'Plans',
//         path: PATH_DASHBOARD.plans.root,
//         icon: ICONS.lock,
//         children: [
//           {
//             title: 'All Plans',
//             path: PATH_DASHBOARD.plans.allPlans,
//           },
//         ],
//       },
//       {
//         title: 'blog',
//         path:
//           user?.verified_status === 'pending' ? '' : PATH_DASHBOARD.blog.root,
//         icon: ICONS.lock,
//         children: [
//           {
//             title: 'posts',
//             path:
//               user?.verified_status === 'pending'
//                 ? ''
//                 : PATH_DASHBOARD.blog.posts,
//           },
//         ],
//       },
//     ],
//   },
//   {
//     subheader: 'Finance',
//     items: [
//       {
//         title: 'Payments',
//         path: PATH_DASHBOARD.payment.root,
//         icon: ICONS.lock,
//         children: [
//           {
//             title: 'My Subscriptions',
//             path: PATH_DASHBOARD.payment.subscriptions,
//           },
//           {
//             title: 'My Invoices',
//             path: PATH_DASHBOARD.payment.allInvoices,
//           },
//         ],
//       },
//     ],
//   },
// ];

export default navConfig;
