import { capitalCase } from 'change-case';
// @mui
import { Container, Tab, Box, Tabs } from '@mui/material';
// routes
import { PATH_DASHBOARD } from '../../../routes/paths';
// hooks
import useTabs from '../../../hooks/useTabs';
import useSettings from '../../../hooks/useSettings';
// _mock_
import {
  _userPayment,
  _userAddressBook,
  _userInvoices,
  _userAbout,
} from '../../../_mock';
// layouts
import Layout from '../../../layouts';
// components
import Page from '../../../components/Page';
import Iconify from '../../../components/Iconify';
import HeaderBreadcrumbs from '../../../components/HeaderBreadcrumbs';
// sections
import {
  AccountGeneral,
  AccountSocialLinks,
  AccountChangePassword,
  AccountDocuments,
  AccountClinic,
} from '../../../sections/@dashboard/user/account';
import axiosInstance from '../../../utils/axios';
import { useEffect, useState } from 'react';
import { Profile } from '../../../@types/user';

// ----------------------------------------------------------------------

UserAccount.getLayout = function getLayout(page: React.ReactElement) {
  return <Layout>{page}</Layout>;
};

// ----------------------------------------------------------------------

export default function UserAccount() {
  const { themeStretch } = useSettings();

  const { currentTab, onChangeTab } = useTabs('general');

  const [userAbout, setUserAbout] = useState<Profile | null>(null);

  const fetchDoctorAbout = async () => {
    try {
      const response = await axiosInstance.get('/api/doctors/profile/about');
      setUserAbout(response?.data?.aboutDetails);
    } catch (error) {
      console.error('Failed to fetch doctor about info:', error);
    }
  };

  useEffect(() => {
    fetchDoctorAbout();
  }, []);

  const ACCOUNT_TABS = [
    {
      value: 'general',
      icon: <Iconify icon={'ic:round-account-box'} width={20} height={20} />,
      component: <AccountGeneral />,
    },
    {
      value: 'Add Documents',
      icon: <Iconify icon='mdi:file-document-outline' width={20} height={20} />,
      component: <AccountDocuments />,
    },
    {
      value: 'Add Clinic or Hospital',
      icon: <Iconify icon='mdi:office-building' width={20} height={20} />,
      component: <AccountClinic />,
    },
    // {
    //   value: 'billing',
    //   icon: <Iconify icon={'ic:round-receipt'} width={20} height={20} />,
    //   component: (
    //     <AccountBilling
    //       cards={_userPayment}
    //       addressBook={_userAddressBook}
    //       invoices={_userInvoices}
    //     />
    //   ),
    // },
    // {
    //   value: 'notifications',
    //   icon: <Iconify icon={'eva:bell-fill'} width={20} height={20} />,
    //   component: <AccountNotifications />,
    // },
    {
      value: 'social_links',
      icon: <Iconify icon={'eva:share-fill'} width={20} height={20} />,
      component: userAbout ? (
        <AccountSocialLinks myProfile={userAbout} />
      ) : null,
    },
    {
      value: 'change_password',
      icon: <Iconify icon={'ic:round-vpn-key'} width={20} height={20} />,
      component: <AccountChangePassword />,
    },
  ];

  return (
    <Page title='User: Account Settings'>
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading='Account'
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'User', href: PATH_DASHBOARD.user.root },
            { name: 'Account Settings' },
          ]}
        />

        <Tabs
          allowScrollButtonsMobile
          variant='scrollable'
          scrollButtons='auto'
          value={currentTab}
          onChange={onChangeTab}
        >
          {ACCOUNT_TABS.map((tab) => (
            <Tab
              disableRipple
              key={tab.value}
              label={capitalCase(tab.value)}
              icon={tab.icon}
              value={tab.value}
            />
          ))}
        </Tabs>

        <Box sx={{ mb: 5 }} />

        {ACCOUNT_TABS.map((tab) => {
          const isMatched = tab.value === currentTab;
          return isMatched && <Box key={tab.value}>{tab.component}</Box>;
        })}
      </Container>
    </Page>
  );
}
