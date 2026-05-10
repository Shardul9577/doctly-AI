import { capitalCase } from 'change-case';
// next
import NextLink from 'next/link';
// @mui
import { styled } from '@mui/material/styles';
import {
  Box,
  Card,
  Stack,
  Link,
  Alert,
  Tooltip,
  Container,
  Typography,
} from '@mui/material';
// routes
import { PATH_AUTH } from '../../routes/paths';
// hooks
import useAuth from '../../hooks/useAuth';
import useResponsive from '../../hooks/useResponsive';
// components
import Page from '../../components/Page';
import Logo from '../../components/Logo';
import Image from '../../components/Image';
// sections
import { LoginForm } from '../../sections/auth/login';
import { useEffect, useState } from 'react';
// guards
import AuthGuard from 'src/guards/AuthGuard';
import { useRouter } from 'next/router';

// ----------------------------------------------------------------------

const RootStyle = styled('div')(({ theme }) => ({
  height: '100vh',
  overflow: 'hidden',
  [theme.breakpoints.up('md')]: {
    display: 'flex',
    height: '100vh',
  },
}));

const HeaderStyle = styled('header')(({ theme }) => ({
  top: 0,
  zIndex: 9,
  lineHeight: 0,
  width: '100%',
  display: 'flex',
  alignItems: 'flex-end',
  padding: theme.spacing(3),
  justifyContent: 'flex-end',
  paddingRight: '35px !important',
  [theme.breakpoints.up('md')]: {
    alignItems: 'flex-end',
    padding: theme.spacing(7, 0, 0, 10),
  },
}));

const SectionStyle = styled(Card)(({ theme }) => ({
  width: '100%',
  maxWidth: 464,
  height: '100vh',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  margin: 0,
  flexShrink: 0,
  [theme.breakpoints.up('md')]: {
    height: '100vh',
    flexShrink: 0,
    width: '50%',
  },
}));

const ContentStyle = styled('div')(({ theme }) => ({
  maxWidth: 600,
  margin: 'auto',
  height: '100vh',
  display: 'flex',
  justifyContent: 'center',
  flexDirection: 'column',
  padding: theme.spacing(3),
  flex: 1,
  [theme.breakpoints.up('md')]: {
    height: '100vh',
    padding: theme.spacing(5),
    flex: 1,
    width: '70%',
  },
}));

// ----------------------------------------------------------------------

export default function Login() {
  const { method } = useAuth();

  const smUp = useResponsive('up', 'sm');

  const mdUp = useResponsive('up', 'md');
  const router = useRouter();

  useEffect(() => {
    // Check if we're in the browser environment
    if (typeof window !== 'undefined') {
      const userStringData = localStorage?.getItem('userData');
      const accessToken = localStorage?.getItem('accessToken');

      if (userStringData && accessToken) {
        try {
          const user = JSON.parse(userStringData);
          const role = user?.role;

          // Redirect based on role
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

  return (
    <Page title="Login">
      <RootStyle>
        {mdUp && (
          <SectionStyle>
            <Typography
              variant="h3"
              sx={{ px: 5, mt: 10, mb: 5, textAlign: 'center' }}
            >
              Hi, Welcome Back
            </Typography>
            <Image
              visibleByDefault
              disabledEffect
              src="/Images/login.svg"
              alt="login"
            />
          </SectionStyle>
        )}

        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          <HeaderStyle>
            {smUp && (
              <Typography variant="body2">
                Don't have an account?
                <NextLink href={PATH_AUTH.register} passHref>
                  <Link variant="subtitle2"> Get started</Link>
                </NextLink>
              </Typography>
            )}
          </HeaderStyle>
          <ContentStyle>
            <Stack direction="row" alignItems="center" sx={{ mb: 5 }}>
              <Box sx={{ flexGrow: 1 }}>
                <Typography variant="h4" gutterBottom>
                  Sign in to Doctly
                </Typography>
                <Typography sx={{ color: 'text.secondary' }}>
                  Enter your details below.
                </Typography>
              </Box>

              <Tooltip title={capitalCase(method)} placement="right">
                <NextLink href={'/'} passHref>
                  <Image
                    disabledEffect
                    alt={method}
                    src={`/Images/logo_single.png`}
                    sx={{ width: 124, height: 124, cursor: 'pointer' }}
                  />
                </NextLink>
              </Tooltip>
            </Stack>

            <LoginForm />

            {!smUp && (
              <Typography variant="body2" align="center" sx={{ mt: 3 }}>
                Don't have an account?{' '}
                <NextLink href={PATH_AUTH.register} passHref>
                  <Link variant="subtitle2">Get started</Link>
                </NextLink>
              </Typography>
            )}
          </ContentStyle>
        </Box>
      </RootStyle>
    </Page>
  );
}
