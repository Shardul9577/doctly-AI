import { capitalCase } from 'change-case';
import {
  useState,
  useEffect,
  useMemo,
  useCallback,
  Suspense,
  lazy,
} from 'react';
// @mui
import { styled } from '@mui/material/styles';
import {
  Tab,
  Box,
  Card,
  Tabs,
  Container,
  Skeleton,
  Typography,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
// routes
import { PATH_DASHBOARD } from '../../../routes/paths';
// hooks
import useTabs from '../../../hooks/useTabs';
import useSettings from '../../../hooks/useSettings';
// _mock_
import { _userFeeds } from '../../../_mock';
// layouts
import Layout from '../../../layouts';
// components
import Page from '../../../components/Page';
import Iconify from '../../../components/Iconify';
import HeaderBreadcrumbs from '../../../components/HeaderBreadcrumbs';
// sections
import { ProfileCover } from '../../../sections/@dashboard/user/profile';
import axiosInstance from '../../../utils/axios';

// Lazy load heavy components
const Profile = lazy(() =>
  import('../../../sections/@dashboard/user/profile').then((module) => ({
    default: module.Profile,
  }))
);

// ----------------------------------------------------------------------

const TabsWrapperStyle = styled('div')(({ theme }) => ({
  zIndex: 9,
  bottom: 0,
  width: '100%',
  display: 'flex',
  position: 'absolute',
  backgroundColor: theme.palette.background.paper,
  borderTop: `1px solid ${theme.palette.divider}`,
  boxShadow: theme.shadows[4],
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
  const theme = useTheme();
  const { themeStretch } = useSettings();

  // const { user } = useAuth();

  const userStringData = localStorage.getItem('userData');
  const user = userStringData ? JSON.parse(userStringData) : null;

  const { currentTab, onChangeTab } = useTabs('profile');

  const [userAbout, setUserAbout] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hasFetched, setHasFetched] = useState(false);

  // Memoize user data to prevent unnecessary re-renders
  const memoizedUser = useMemo(() => user, [userStringData]);

  // Simplified data fetching without problematic dependencies
  const fetchDoctorAbout = useCallback(async () => {
    if (hasFetched) return; // Prevent duplicate calls

    try {
      setIsLoading(true);
      setError(null);
      const response = await axiosInstance.get('/api/doctors/profile/about');
      setUserAbout(response?.data?.aboutDetails);
      setHasFetched(true);
    } catch (error) {
      console.error('Failed to fetch doctor about info:', error);
      setError(error);
    } finally {
      setIsLoading(false);
    }
  }, [hasFetched]);

  useEffect(() => {
    fetchDoctorAbout();
  }, [fetchDoctorAbout]);

  // Memoize tabs configuration to prevent unnecessary re-renders
  const PROFILE_TABS = useMemo(
    () => [
      {
        value: 'profile',
        icon: <Iconify icon={'ic:round-account-box'} width={20} height={20} />,
        component: userAbout ? (
          <Suspense
            fallback={
              <Box sx={{ p: 3 }}>
                <Skeleton variant='rectangular' height={200} sx={{ mb: 2 }} />
                <Skeleton
                  variant='text'
                  width='60%'
                  height={32}
                  sx={{ mb: 1 }}
                />
                <Skeleton variant='text' width='40%' height={24} />
              </Box>
            }
          >
            <Profile myProfile={userAbout} posts={_userFeeds} />
          </Suspense>
        ) : null,
      },
    ],
    [userAbout]
  );

  return (
    <Page title='User: Profile'>
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading='Profile'
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'User', href: PATH_DASHBOARD.user.root },
            { name: memoizedUser?.firstName || 'Profile' },
          ]}
        />
        <Card
          sx={{
            mb: 3,
            height: 280,
            position: 'relative',
            borderRadius: 3,
            overflow: 'hidden',
            boxShadow: (theme) => theme.shadows[8],
            border: `1px solid ${theme.palette.divider}`,
          }}
        >
          {isLoading ? (
            <Box
              sx={{
                height: 280,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: `linear-gradient(135deg, ${theme.palette.primary.light}22 0%, ${theme.palette.secondary.light}22 100%)`,
              }}
            >
              <Box sx={{ textAlign: 'center' }}>
                <Skeleton
                  variant='circular'
                  width={80}
                  height={80}
                  sx={{ mb: 2, mx: 'auto' }}
                />
                <Skeleton
                  variant='text'
                  width={200}
                  height={32}
                  sx={{ mb: 1 }}
                />
                <Skeleton variant='text' width={150} height={24} />
              </Box>
            </Box>
          ) : error ? (
            <Box
              sx={{
                height: 280,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: `linear-gradient(135deg, ${theme.palette.error.light}22 0%, ${theme.palette.warning.light}22 100%)`,
              }}
            >
              <Box sx={{ textAlign: 'center', color: 'error.main' }}>
                <Typography variant='h6' sx={{ mb: 1 }}>
                  Failed to load profile
                </Typography>
                <Typography variant='body2' sx={{ opacity: 0.7 }}>
                  Please try refreshing the page
                </Typography>
              </Box>
            </Box>
          ) : userAbout ? (
            <ProfileCover myProfile={userAbout} />
          ) : null}

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
