// ----------------------------------------------------------------------

function path(root: string, sublink: string) {
  return `${root}${sublink}`;
}

const ROOTS_AUTH = '/auth';
const ROOTS_DASHBOARD = '/dashboard';
const ROOTS_PATIENT_DASHBOARD = '/patient';
const ROOTS_ADMIN_DASHBOARD = '/admin';

// ----------------------------------------------------------------------

export const PATH_AUTH = {
  root: ROOTS_AUTH,
  login: path(ROOTS_AUTH, '/login'),
  register: path(ROOTS_AUTH, '/register'),
  verify: path(ROOTS_AUTH, '/verify'),
  resetPassword: path(ROOTS_AUTH, '/reset-password'),
  newPassword: path(ROOTS_AUTH, '/new-password'),
};

export const PATH_PAGE = {
  aiConsultation: '/ai-consultation',
  comingSoon: '/coming-soon',
  maintenance: '/maintenance',
  pricing: '/pricing',
  payment: '/payment',
  about: '/about-us',
  contact: '/contact-us',
  faqs: '/faqs',
  page403: '/403',
  page404: '/404',
  page500: '/500',
  components: '/components',
};

export const PATH_DASHBOARD = {
  root: ROOTS_DASHBOARD,
  general: {
    app: path(ROOTS_DASHBOARD, '/app'),
    analytics: path(ROOTS_DASHBOARD, '/analytics'),
    booking: path(ROOTS_DASHBOARD, '/booking'),
  },
  docPatient: {
    root: path(ROOTS_DASHBOARD, '/docPatient'),
    list: path(ROOTS_DASHBOARD, '/docPatient/user/my-patients'),
    cards: path(ROOTS_DASHBOARD, '/docPatient/user/all-patients'),
  },
  visits: {
    root: path(ROOTS_DASHBOARD, '/visits'),
    new: path(ROOTS_DASHBOARD, '/visits/createVisit'),
    list: path(ROOTS_DASHBOARD, '/visits/list'),
    approveVisit: path(ROOTS_DASHBOARD, '/visits/approveVisitByPatient'),
    detailed: path(ROOTS_DASHBOARD, '/visits/visit-detail/[name]'),
  },
  user: {
    root: path(ROOTS_DASHBOARD, '/user'),
    profile: path(ROOTS_DASHBOARD, '/user/profile'),
    account: path(ROOTS_DASHBOARD, '/user/account'),
  },
  blog: {
    root: path(ROOTS_DASHBOARD, '/blog'),
    posts: path(ROOTS_DASHBOARD, '/blog/posts'),
    detailed: path(ROOTS_DASHBOARD, '/blog/post/[id]'),
  },
  invoice: {
    root: path(ROOTS_DASHBOARD, '/invoice'),
    detailed: path(ROOTS_DASHBOARD, '/invoice/[id]'),
  },
  payment: {
    root: path(ROOTS_DASHBOARD, '/payment'),
    subscriptions: path(ROOTS_DASHBOARD, '/payment/subscriptions'),
    allPlans: path(ROOTS_DASHBOARD, '/payment/allPlans'),
    allInvoices: path(ROOTS_DASHBOARD, '/payment/allInvoices'),
    purchasePlan: path(ROOTS_DASHBOARD, '/payment/purchasePlan'),
  },
  chat: {
    root: path(ROOTS_DASHBOARD, '/chat'),
  },
};

export const PATH_PATIENT_DASHBOARD = {
  root: ROOTS_PATIENT_DASHBOARD,
  general: {
    app: path(ROOTS_PATIENT_DASHBOARD, '/app'),
  },
  permissionDenied: path(ROOTS_PATIENT_DASHBOARD, '/permission-denied'),
  user: {
    root: path(ROOTS_PATIENT_DASHBOARD, '/user'),
    profile: path(ROOTS_PATIENT_DASHBOARD, '/user/profile'),
    account: path(ROOTS_PATIENT_DASHBOARD, '/user/account'),
    myDoctors: path(ROOTS_PATIENT_DASHBOARD, '/user/myDoctors'),
  },
  visits: {
    root: path(ROOTS_PATIENT_DASHBOARD, '/visits'),
    list: path(ROOTS_PATIENT_DASHBOARD, '/visits/list'),
    detailed: path(ROOTS_PATIENT_DASHBOARD, '/visits/visit/[id]'),
    bookAppointment: path(ROOTS_PATIENT_DASHBOARD, '/visits/doctors/[id]'),
    doctorList: path(ROOTS_PATIENT_DASHBOARD, '/visits/mylistDoctors'),
  },
  blog: {
    root: path(ROOTS_PATIENT_DASHBOARD, '/blog'),
    posts: path(ROOTS_PATIENT_DASHBOARD, '/blog/posts'),
    detailed: path(ROOTS_PATIENT_DASHBOARD, '/blog/post/[id]'),
  },
};

export const PATH_ADMIN_DASHBOARD = {
  root: ROOTS_ADMIN_DASHBOARD,
  general: {
    app: path(ROOTS_ADMIN_DASHBOARD, '/app'),
  },
  permissionDenied: path(ROOTS_ADMIN_DASHBOARD, '/permission-denied'),
  user: {
    root: path(ROOTS_ADMIN_DASHBOARD, '/user'),
    new: path(ROOTS_ADMIN_DASHBOARD, '/user/new'),
    list: path(ROOTS_ADMIN_DASHBOARD, '/user/list'),
    profile: path(ROOTS_ADMIN_DASHBOARD, '/user/profile'),
    account: path(ROOTS_ADMIN_DASHBOARD, '/user/account'),
    edit: (name: string) => path(ROOTS_ADMIN_DASHBOARD, `/user/${name}/edit`),
  },
  mail: {
    root: path(ROOTS_ADMIN_DASHBOARD, '/mail'),
    all: path(ROOTS_ADMIN_DASHBOARD, '/mail/all'),
  },
  directory: {
    root: path(ROOTS_ADMIN_DASHBOARD, '/directory'),
    verification: path(ROOTS_ADMIN_DASHBOARD, '/directory/doctor-verification'),
    list: path(ROOTS_ADMIN_DASHBOARD, '/directory/list'),
    cards: path(ROOTS_ADMIN_DASHBOARD, '/directory/cards'),
  },
  payment: {
    root: path(ROOTS_ADMIN_DASHBOARD, '/payment'),
    verification: path(ROOTS_ADMIN_DASHBOARD, '/payment/allRefund'),
  },
  invoice: {
    root: path(ROOTS_ADMIN_DASHBOARD, '/invoice'),
    list: path(ROOTS_ADMIN_DASHBOARD, '/invoice/list'),
    new: path(ROOTS_ADMIN_DASHBOARD, '/invoice/new'),
    view: (id: string) => path(ROOTS_ADMIN_DASHBOARD, `/invoice/${id}`),
    edit: (id: string) => path(ROOTS_ADMIN_DASHBOARD, `/invoice/${id}/edit`),
  },
  blog: {
    root: path(ROOTS_ADMIN_DASHBOARD, '/blog'),
    posts: path(ROOTS_ADMIN_DASHBOARD, '/blog/posts'),
    new: path(ROOTS_ADMIN_DASHBOARD, '/blog/new'),
    view: (title: string) => path(ROOTS_ADMIN_DASHBOARD, `/blog/post/${title}`),
  },
  eCommerce: {
    root: path(ROOTS_ADMIN_DASHBOARD, '/e-commerce'),
    shop: path(ROOTS_ADMIN_DASHBOARD, '/e-commerce/shop'),
    list: path(ROOTS_ADMIN_DASHBOARD, '/e-commerce/list'),
    checkout: path(ROOTS_ADMIN_DASHBOARD, '/e-commerce/checkout'),
    new: path(ROOTS_ADMIN_DASHBOARD, '/e-commerce/product/new'),
    demo: path(ROOTS_ADMIN_DASHBOARD, '/e-commerce/product/[name]'),
    edit: (name: string) =>
      path(ROOTS_ADMIN_DASHBOARD, `/e-commerce/product/${name}/edit`),
  },
};

export const PATH_DOCS = 'https://docs-minimals.vercel.app/introduction';
