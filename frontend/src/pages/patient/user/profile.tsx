import { capitalCase } from 'change-case';
import { useState, useEffect } from 'react';
// @mui
import { styled } from '@mui/material/styles';
import { Tab, Box, Card, Tabs, Container } from '@mui/material';
// routes
import { PATH_PATIENT_DASHBOARD } from '../../../routes/paths';
// hooks
import useTabs from '../../../hooks/useTabs';
import useSettings from '../../../hooks/useSettings';
// _mock_
import { _userFeeds, _userGallery } from '../../../_mock';
// layouts
import Layout from '../../../layouts';
// components
import Page from '../../../components/Page';
import Iconify from '../../../components/Iconify';
import HeaderBreadcrumbs from '../../../components/HeaderBreadcrumbs';
// sections
import {
  Profile,
  ProfileCover,
  ProfileGallery,
} from '../../../sections/@patient/user/profile';
import axiosInstance from '../../../utils/axios';

// ----------------------------------------------------------------------

const TabsWrapperStyle = styled('div')(({ theme }) => ({
  zIndex: 9,
  bottom: 0,
  width: '100%',
  display: 'flex',
  position: 'absolute',
  backgroundColor: theme.palette.background.paper,
  [theme.breakpoints.up('sm')]: {
    justifyContent: 'center',
  },
  [theme.breakpoints.up('md')]: {
    justifyContent: 'flex-end',
    paddingRight: theme.spacing(3),
  },
}));

// ----------------------------------------------------------------------

UserProfile.getLayout = function getLayout(page: React.ReactElement) {
  return <Layout>{page}</Layout>;
};

// ----------------------------------------------------------------------

export default function UserProfile() {
  const { themeStretch } = useSettings();

  const userStringData = localStorage.getItem('userData');
  const user = userStringData ? JSON.parse(userStringData) : null;

  const { currentTab, onChangeTab } = useTabs('profile');

  const [patientProfile, setPatientProfile] = useState();

  const fetchPatientProfile = async () => {
    try {
      const response = await axiosInstance.get('/api/patients/profile');
      setPatientProfile(response?.data?.user);
    } catch (error) {
      console.error('Failed to fetch patient profile info:', error);
    }
  };

  useEffect(() => {
    fetchPatientProfile();
  }, []);

  const PROFILE_TABS = [
    {
      value: 'profile',
      icon: <Iconify icon={'ic:round-account-box'} width={20} height={20} />,
      component: <Profile myProfile={patientProfile} posts={_userFeeds} />,
    },
    {
      value: 'My Reports',
      icon: <Iconify icon={'ic:round-perm-media'} width={20} height={20} />,
      component: <ProfileGallery />,
    },
  ];

  return (
    <Page title='User: Profile'>
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading='Profile'
          links={[
            { name: 'Dashboard', href: PATH_PATIENT_DASHBOARD.root },
            { name: 'User', href: PATH_PATIENT_DASHBOARD.user.root },
            { name: user?.displayName || '' },
          ]}
        />
        <Card
          sx={{
            mb: 3,
            height: 280,
            position: 'relative',
          }}
        >
          <ProfileCover myProfile={patientProfile} />

          <TabsWrapperStyle>
            <Tabs
              allowScrollButtonsMobile
              variant='scrollable'
              scrollButtons='auto'
              value={currentTab}
              onChange={onChangeTab}
            >
              {PROFILE_TABS.map((tab) => (
                <Tab
                  disableRipple
                  key={tab.value}
                  value={tab.value}
                  icon={tab.icon}
                  label={capitalCase(tab.value)}
                />
              ))}
            </Tabs>
          </TabsWrapperStyle>
        </Card>

        {PROFILE_TABS.map((tab) => {
          const isMatched = tab.value === currentTab;
          return isMatched && <Box key={tab.value}>{tab.component}</Box>;
        })}
      </Container>
    </Page>
  );
}
