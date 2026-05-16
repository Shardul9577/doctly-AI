// routes
import { PATH_DASHBOARD } from '../../../routes/paths';
// components
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

const getNavItem = (
  title: string,
  path: string,
  iconName?: keyof typeof ICONS,
  children?: { title: string; path: string }[]
) => ({
  title,
  path,
  ...(iconName && { icon: ICONS[iconName] }),
  ...(children && { children }),
});

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

export default navConfig;
