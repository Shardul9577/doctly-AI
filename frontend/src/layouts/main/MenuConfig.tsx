// routes
import { PATH_AUTH, PATH_DOCS, PATH_PAGE } from '../../routes/paths';
// components
import {
  PATH_AFTER_LOGIN,
  PATH_AFTER_PATIENT_LOGIN,
  PATH_AFTER_ADMIN_LOGIN,
} from '../../config';
// components
import Iconify from '../../components/Iconify';

// ----------------------------------------------------------------------

const ICON_SIZE = {
  width: 22,
  height: 22,
};

const menuConfig = [
  {
    title: 'About us',
    icon: <Iconify icon={'eva:info-fill'} {...ICON_SIZE} />,
    path: PATH_PAGE.about,
  },
  {
    title: 'AI consultation',
    icon: <Iconify icon={'eva:bot-fill'} {...ICON_SIZE} />,
    path: PATH_PAGE.aiConsultation,
  },
  {
    title: 'Pricing',
    icon: <Iconify icon={'eva:credit-card-fill'} {...ICON_SIZE} />,
    path: PATH_PAGE.pricing,
  },
  {
    title: 'Contact us',
    icon: <Iconify icon={'eva:message-circle-fill'} {...ICON_SIZE} />,
    path: PATH_PAGE.contact,
  },
  {
    title: 'FAQs',
    icon: <Iconify icon={'eva:question-mark-circle-fill'} {...ICON_SIZE} />,
    path: PATH_PAGE.faqs,
  },
  // {
  //   title: 'Pages',
  //   path: '/pages',
  //   icon: <Iconify icon={'eva:file-fill'} {...ICON_SIZE} />,
  //   children: [
  //     {
  //       subheader: 'Other',
  //       items: [
  //         { title: 'About us', path: PATH_PAGE.about },
  //         { title: 'Contact us', path: PATH_PAGE.contact },
  //         { title: 'FAQs', path: PATH_PAGE.faqs },
  //         { title: 'Pricing', path: PATH_PAGE.pricing },
  //         { title: 'Payment', path: PATH_PAGE.payment },
  //         { title: 'Maintenance', path: PATH_PAGE.maintenance },
  //         { title: 'Coming Soon', path: PATH_PAGE.comingSoon },
  //       ],
  //     },
  //     // {
  //     //   subheader: 'Authentication',
  //     //   items: [
  //     //     { title: 'Login further page', path: PATH_AUTH.loginUnprotected },
  //     //     { title: 'Doctor`s Documents', path: PATH_AUTH.registerUnprotected },
  //     //     { title: 'Reset password', path: PATH_AUTH.resetPassword },
  //     //     { title: 'Verify code', path: PATH_AUTH.verify },
  //     //   ],
  //     // },
  //     // {
  //     //   subheader: 'Error',
  //     //   items: [
  //     //     { title: 'Page 403', path: PATH_PAGE.page403 },
  //     //     { title: 'Page 404', path: PATH_PAGE.page404 },
  //     //     { title: 'Page 500', path: PATH_PAGE.page500 },
  //     //   ],
  //     // },
  //     // {
  //     //   subheader: 'Dashboard',
  //     //   items: [{ title: 'Dashboard', path: PATH_AFTER_LOGIN }],
  //     // },
  //     // {
  //     //   subheader: 'Patient Dashboard',
  //     //   items: [{ title: 'Dashboard', path: PATH_AFTER_PATIENT_LOGIN }],
  //     // },
  //     // {
  //     //   subheader: 'Admin Dashboard',
  //     //   items: [{ title: 'Dashboard', path: PATH_AFTER_ADMIN_LOGIN }],
  //     // },
  //   ],
  // },
  // {
  //   title: 'Documentation',
  //   icon: <Iconify icon={'eva:book-open-fill'} {...ICON_SIZE} />,
  //   path: PATH_DOCS,
  // },
];

export default menuConfig;
