import { useEffect, useState } from 'react';
import { styled, useTheme } from '@mui/material/styles';
import {
  Box,
  Stack,
  Typography,
  Button,
  Grid,
  Container,
  CircularProgress,
} from '@mui/material';
import useResponsive from '../../hooks/useResponsive';
import Page from '../../components/Page';
import Logo from '../../components/Logo';
import Image from '../../components/Image';
import { useRouter } from 'next/router';
import axios from '../../utils/axios';
import { BACKEND_URL } from '../../config';
import axiosInstance from '../../utils/axios';
import { useRef } from 'react';

const RootStyle = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  background:
    theme.palette.mode === 'dark'
      ? `linear-gradient(#212b36, #212b36), url('https://images.unsplash.com/photo-1576091160399-1f5072b214a9?q=80&w=2070&auto=format&fit=crop')`
      : `linear-gradient(#ffffff, #ffffff), url('https://images.unsplash.com/photo-1576091160399-1f5072b214a9?q=80&w=2070&auto=format&fit=crop')`,
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  minHeight: '100vh',
  color: theme.palette.mode === 'dark' ? '#ffffff' : '#000000',
}));

const HeaderStyle = styled('header')(({ theme }) => ({
  top: 0,
  zIndex: 9,
  lineHeight: 0,
  width: '100%',
  display: 'flex',
  alignItems: 'center',
  position: 'absolute',
  padding: theme.spacing(3),
  justifyContent: 'space-between',
  [theme.breakpoints.up('md')]: {
    padding: theme.spacing(7, 5, 0, 7),
  },
}));

const ContentWrapper = styled('div')(({ theme }) => ({
  flexGrow: 1,
  width: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: theme.spacing(12, 4, 6),
}));

const FooterStyle = styled('footer')(({ theme }) => ({
  padding: theme.spacing(3),
  textAlign: 'center',
  backgroundColor: theme.palette.mode === 'dark' ? '#161c24' : '#f4f6f8',
  color: theme.palette.mode === 'dark' ? '#ffffff' : '#000000',
  borderTop: `1px solid ${
    theme.palette.mode === 'dark' ? '#2d3748' : '#e0e0e0'
  }`,
}));

const SocialIcons = styled('div')(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  gap: theme.spacing(2),
  marginTop: theme.spacing(2),
  '& img': {
    width: 24,
    height: 24,
    transition: 'transform 0.3s ease',
    '&:hover': {
      transform: 'scale(1.15)',
    },
  },
}));

export default function EmailVerified() {
  const theme = useTheme();
  const smUp = useResponsive('up', 'sm');
  const { push, query, isReady } = useRouter();

  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState<'success' | 'error' | null>(null);
  const [message, setMessage] = useState('');

  // useEffect(() => {
  //   if (isReady && query.token) {
  //     verifyEmail();
  //   }
  // }, [isReady]);

  const verifyEmail = async () => {
    let rawToken = query.token as string;
    if (!rawToken) return;

    // Clean token if it contains 'token=' prefix or trailing slash
    if (rawToken.startsWith('token=')) {
      rawToken = rawToken.replace('token=', '');
    }
    if (rawToken.endsWith('/')) {
      rawToken = rawToken.slice(0, -1);
    }

    try {
      const res = await axiosInstance.get(`/api/auth/verify-email`, {
        params: { token: rawToken },
      });

      // 🟢 Use backend-provided status strictly
      if (res.data.status === true) {
        setStatus('success');
      } else {
        setStatus('error');
      }

      setMessage(res.data.message);
    } catch (err: any) {
      console.error('❌ Verification failed:', err.response?.data);
      setStatus('error');
      setMessage(err.response?.data?.message || 'Verification failed.');
    } finally {
      setLoading(false);
    }
  };

  // const resendToken = async () => {
  //   const token = query.token as string;
  //   if (!token) {
  //     alert('Missing token in the URL.');
  //     return;
  //   }

  //   try {
  //     const res = await axios.post(`${BACKEND_URL}/api/auth/refresh-token`, {
  //       token,
  //     });
  //     alert(res.data.message || 'A new verification token has been sent!');
  //   } catch (err: any) {
  //     alert(
  //       err.response?.data?.message || 'Failed to resend verification token.'
  //     );
  //   }
  // };

  const hasCalledRef = useRef(false);

  useEffect(() => {
    if (isReady && query.token && !hasCalledRef.current) {
      hasCalledRef.current = true;
      verifyEmail();
    }
  }, [isReady, query.token]);

  return (
    <Page title="Email Verified">
      <RootStyle>
        <HeaderStyle>
          <Logo />
        </HeaderStyle>

        <ContentWrapper>
          <Container maxWidth="md">
            <Stack spacing={5} alignItems="center">
              {loading ? (
                <>
                  <CircularProgress color="secondary" />
                  <Typography variant="h6">Verifying your email...</Typography>
                </>
              ) : status === 'success' ? (
                <>
                  <Image
                    disabledEffect
                    alt="celebration-icon"
                    src="https://cdn-icons-png.flaticon.com/512/1057/1057050.png"
                    sx={{ width: 80, height: 80 }}
                  />
                  <Typography
                    variant="h4"
                    sx={{ fontWeight: 'bold', textAlign: 'center' }}
                  >
                    🎉 {message || 'Your Email is Verified!'}
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{
                      textAlign: 'center',
                      maxWidth: 600,
                      color: theme.palette.mode === 'dark' ? '#e2d4ff' : '#444',
                    }}
                  >
                    You're all set to start using Doctly’s AI-powered healthcare
                    platform. Access medical reports, track health, and connect
                    with doctors securely.
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      textAlign: 'center',
                      maxWidth: 600,
                      color: theme.palette.mode === 'dark' ? '#d1c4e9' : '#666',
                      fontStyle: 'italic',
                    }}
                  >
                    Doctly leverages advanced AI models to simplify health data
                    management and empower users with early disease detection,
                    automated reports, and a seamless experience across devices.
                  </Typography>

                  <Grid container spacing={3} justifyContent="center">
                    {[
                      {
                        src: 'https://png.pngtree.com/png-vector/20221016/ourmid/pngtree-medical-report-in-hand-png-image_6336163.png',
                        label: 'Medical Reports',
                      },
                      {
                        src: 'https://cdn-icons-png.flaticon.com/512/11457/11457878.png',
                        label: 'Health Tracking',
                      },
                      {
                        src: 'https://cdn0.iconfinder.com/data/icons/popicon-medical-vol-2/256/58-512.png',
                        label: 'Doctor Connect',
                      },
                    ].map((item, i) => (
                      <Grid item xs={12} sm={4} key={i}>
                        <Stack spacing={1} alignItems="center">
                          <Box
                            sx={{
                              width: 120,
                              height: 120,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              backgroundColor: '#ffffff',
                              borderRadius: 2,
                              p: 1,
                            }}
                          >
                            <Image
                              disabledEffect
                              alt={item.label}
                              src={item.src}
                              sx={{
                                maxWidth: '100%',
                                maxHeight: '100%',
                                objectFit: 'contain',
                              }}
                            />
                          </Box>
                          <Typography
                            variant="subtitle2"
                            sx={{
                              color:
                                theme.palette.mode === 'dark'
                                  ? '#ffffff'
                                  : '#000000',
                              textAlign: 'center',
                            }}
                          >
                            {item.label}
                          </Typography>
                        </Stack>
                      </Grid>
                    ))}
                  </Grid>

                  <Button
                    variant="contained"
                    onClick={() => push('/auth/login')}
                    sx={{
                      backgroundColor:
                        theme.palette.mode === 'dark' ? '#ffffff' : '#000c63',
                      color:
                        theme.palette.mode === 'dark' ? '#000c63' : '#ffffff',
                      fontWeight: 'bold',
                      padding: '12px 24px',
                      fontSize: '1rem',
                      borderRadius: '8px',
                      '&:hover': {
                        backgroundColor:
                          theme.palette.mode === 'dark' ? '#e2d4ff' : '#1824a3',
                      },
                    }}
                  >
                    Get Started
                  </Button>
                </>
              ) : (
                <>
                  <Typography
                    variant="h4"
                    color="error"
                    sx={{ fontWeight: 'bold' }}
                  >
                    ❌ Verification Failed
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{ textAlign: 'center', color: '#ff8a80' }}
                  >
                    {message}
                  </Typography>

                  <Button
                    variant="outlined"
                    color="secondary"
                    // onClick={resendToken}
                    sx={{
                      mt: 3,
                      fontWeight: 'bold',
                      borderRadius: '8px',
                      textTransform: 'none',
                      px: 4,
                      py: 1.5,
                    }}
                  >
                    Resend Verification Email
                  </Button>
                </>
              )}
            </Stack>
          </Container>
        </ContentWrapper>

        <FooterStyle>
          <Typography variant="body2">Corporation</Typography>
          <Typography variant="body2">
            You are receiving this confirmation because you opted in via our
            website.
          </Typography>

          <SocialIcons>
            {[
              {
                alt: 'Twitter',
                src: 'https://cdn-icons-png.flaticon.com/512/733/733579.png',
              },
              {
                alt: 'Instagram',
                src: 'https://cdn-icons-png.flaticon.com/512/733/733558.png',
              },
              {
                alt: 'YouTube',
                src: 'https://static.vecteezy.com/system/resources/previews/042/127/234/non_2x/white-square-bordered-youtube-logo-on-transparent-background-free-png.png',
              },
              {
                alt: 'Website',
                src: 'https://cdn4.iconfinder.com/data/icons/social-media-logos-6/512/112-gmail_email_mail-512.png',
              },
              {
                alt: 'LinkedIn',
                src: 'https://cdn-icons-png.flaticon.com/512/733/733561.png',
              },
            ].map((icon, i) => (
              <img key={i} src={icon.src} alt={icon.alt} />
            ))}
          </SocialIcons>

          <Typography variant="h6" sx={{ mt: 2 }}>
            DOCTLY
          </Typography>
        </FooterStyle>
      </RootStyle>
    </Page>
  );
}
