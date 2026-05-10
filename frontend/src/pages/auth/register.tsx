import { capitalCase } from 'change-case';
// next
import NextLink from 'next/link';
// @mui
import { styled } from '@mui/material/styles';
import { Box, Card, Link, Container, Typography, Tooltip } from '@mui/material';
// hooks
import useAuth from '../../hooks/useAuth';
import useResponsive from '../../hooks/useResponsive';
// routes
import { PATH_AUTH, PATH_DASHBOARD } from '../../routes/paths';

// components
import Page from '../../components/Page';
import Image from '../../components/Image';
// sections
import { RegisterForm } from '../../sections/auth/register';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import AuthGuard from 'src/guards/AuthGuard';
import { tokenManager } from '../../utils/tokenManager';
// guard

// ----------------------------------------------------------------------

const RootStyle = styled('div')(({ theme }) => ({
  minHeight: '100vh',
  overflow: 'hidden',
  width: '100%',
  maxWidth: '100vw',
  [theme.breakpoints.up('md')]: {
    display: 'flex',
    minHeight: '100vh',
    width: '100%',
    maxWidth: '100vw',
  },
}));

const HeaderStyle = styled('header')(({ theme }) => ({
  top: 0,
  zIndex: 9,
  lineHeight: 0,
  width: '100%',
  display: 'flex',
  alignItems: 'center',
  position: 'relative',
  padding: theme.spacing(3),
  justifyContent: 'flex-end',
  [theme.breakpoints.up('md')]: {
    alignItems: 'flex-start',
    padding: theme.spacing(7, 5, 0, 7),
  },
}));

const SectionStyle = styled(Card)(({ theme }) => ({
  width: '100%',
  maxWidth: 464,
  minHeight: '100vh',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'flex-start',
  paddingTop: '50px',
  margin: 0,
  flexShrink: 0,
  overflow: 'hidden',
  [theme.breakpoints.up('md')]: {
    minHeight: '100vh',
    flexShrink: 0,
    width: '50%',
  },
}));

const ContentStyle = styled('div')(({ theme }) => ({
  maxWidth: 600,
  margin: 'auto',
  minHeight: '100vh',
  display: 'flex',
  justifyContent: 'center',
  flexDirection: 'column',
  padding: theme.spacing(3),
  flex: 1,
  overflow: 'hidden',
  [theme.breakpoints.up('md')]: {
    minHeight: '100vh',
    padding: theme.spacing(5),
    flex: 1,
    width: '70%',
  },
}));

export default function Register() {
  const { method } = useAuth();
  const smUp = useResponsive('up', 'sm');
  const mdUp = useResponsive('up', 'md');
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const userStringData = localStorage?.getItem('userData');
      const accessToken = localStorage?.getItem('accessToken');

      if (userStringData && accessToken) {
        try {
          const user = JSON.parse(userStringData);
          const role = user?.role;

          switch (role) {
            case 'admin':
              router.replace('/admin/app');
              break;
            case 'doctor':
              router.replace('/dashboard/app');
              break;
            case 'receptionist':
              router.replace('/patient/app');
              break;
          }
        } catch (error) {
          console.error('Error parsing user data:', error);
        }
      }
    }
  }, [router]);

  useEffect(() => {
    // Allow vertical scroll, prevent horizontal scroll
    document.body.style.overflowX = 'hidden';
    document.body.style.overflowY = 'auto';
    document.body.style.width = '100%';
    document.body.style.maxWidth = '100vw';

    return () => {
      document.body.style.overflowX = '';
      document.body.style.overflowY = '';
      document.body.style.width = '';
      document.body.style.maxWidth = '';
    };
  }, []);

  return (
    <Page title="Register">
      <RootStyle>
        {mdUp && (
          <SectionStyle sx={{ textAlign: 'center' }}>
            <Typography variant="h4" sx={{ mb: 5 }}>
              Your Smartest Assistant in Every Consultation
            </Typography>
            <Image
              visibleByDefault
              disabledEffect
              alt="register"
              src="/Images/signup.svg"
            />
          </SectionStyle>
        )}

        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          <HeaderStyle>
            {smUp && (
              <Typography
                variant="body2"
                sx={{ mt: { md: -2 }, textAlign: 'right' }}
              >
                Already have an account?{' '}
                <NextLink href={PATH_AUTH.login} passHref>
                  <Link variant="subtitle2">Login</Link>
                </NextLink>
              </Typography>
            )}
          </HeaderStyle>
          <ContentStyle>
            <Box sx={{ mb: 5, display: 'flex', alignItems: 'center' }}>
              <Box sx={{ flexGrow: 1 }}>
                <Typography variant="h4" gutterBottom>
                  Get started absolutely free.
                </Typography>
              </Box>
              <Tooltip title={capitalCase(method)}>
                <NextLink href={'/'} passHref>
                  <Image
                    disabledEffect
                    alt={method}
                    src="/Images/logo_single.png"
                    sx={{ width: 124, height: 124, cursor: 'pointer' }}
                  />
                </NextLink>
              </Tooltip>
            </Box>

            <RegisterForm />

            <Typography
              variant="body2"
              align="center"
              sx={{ color: 'text.secondary', mt: 3 }}
            >
              By registering, I agree to Doctly{' '}
              <Link variant="subtitle2">Terms of Service</Link> and{' '}
              <Link variant="subtitle2">Privacy Policy</Link>.
            </Typography>

            {!smUp && (
              <Typography variant="body2" sx={{ mt: 3, textAlign: 'center' }}>
                Already have an account?{' '}
                <NextLink href={PATH_AUTH.login} passHref>
                  <Link variant="subtitle2">Login</Link>
                </NextLink>
              </Typography>
            )}
          </ContentStyle>
        </Box>
      </RootStyle>
    </Page>
  );
}
