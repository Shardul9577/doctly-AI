// next
import NextLink from 'next/link';
// @mui
import { styled } from '@mui/material/styles';
import {
  Grid,
  Link,
  Divider,
  Container,
  Typography,
  Stack,
} from '@mui/material';
// routes
import { PATH_PAGE, PATH_AUTH } from '../../routes/paths';
// components
import Logo from '../../components/Logo';
import SocialsButton from '../../components/SocialsButton';

// ----------------------------------------------------------------------

// Footer Links Configuration
const FOOTER_LINKS = [
  {
    headline: 'Doctly',
    children: [
      { name: 'About us', href: PATH_PAGE.about },
      { name: 'Contact us', href: PATH_PAGE.contact },
      { name: 'FAQs', href: PATH_PAGE.faqs },
    ],
  },
  {
    headline: 'Legal',
    children: [
      { name: 'Terms and Condition', href: '#' },
      { name: 'Privacy Policy', href: '#' },
    ],
  },
  {
    headline: 'Contact',
    children: [
      { name: 'doctly9577@gmail.com', href: 'mailto:doctly9577@gmail.com' },
      {
        name: '34 anmol - 2 , sahara township , Radhanpur road , Mehesana - 384002',
        href: '#',
      },
    ],
  },
];

// Styled Components
const RootStyle = styled('div')(({ theme }) => ({
  position: 'relative',
  backgroundColor: theme.palette.background.default,
}));

// ----------------------------------------------------------------------

export default function MainFooter() {
  return (
    <RootStyle>
      <Divider />

      <Container sx={{ pt: 10 }}>
        {/* Main Footer Content */}
        <Grid
          container
          justifyContent={{ xs: 'center', md: 'space-between' }}
          sx={{ textAlign: { xs: 'center', md: 'left' } }}
        >
          {/* Logo Section */}
          <Grid item xs={12} sx={{ mb: 3 }}>
            <Logo sx={{ mx: { xs: 'auto', md: 'inherit' } }} />
          </Grid>

          {/* Company Description & Social Links */}
          <Grid item xs={8} md={3}>
            <Typography variant="body2" sx={{ pr: { md: 5 } }}>
              Your gateway to smarter healthcare with{' '}
              <Link
                variant="subtitle2"
                sx={{
                  color: 'primary.main',
                  textDecoration: 'none',
                  fontWeight: 'bold',
                }}
              >
                Doctly
              </Link>{' '}
              — built using the latest Material-UI, fully customizable to match
              your vision and workflow.
            </Typography>

            <Stack
              direction="row"
              justifyContent={{ xs: 'center', md: 'flex-start' }}
              sx={{ mt: 5, mb: { xs: 5, md: 0 } }}
            >
              <SocialsButton sx={{ mx: 0.5 }} />
            </Stack>

            <Typography
              variant="body2"
              sx={{ mt: 3, textAlign: { xs: 'center', md: 'left' } }}
            >
              Ready to get started?{' '}
              <NextLink href={PATH_AUTH.register} passHref>
                <Link
                  variant="subtitle2"
                  sx={{
                    color: 'primary.main',
                    textDecoration: 'none',
                    fontWeight: 'bold',
                  }}
                >
                  Get started
                </Link>
              </NextLink>
            </Typography>
          </Grid>

          {/* Footer Links */}
          <Grid item xs={12} md={8}>
            <Stack
              spacing={5}
              direction={{ xs: 'column', md: 'row' }}
              justifyContent="space-between"
            >
              {FOOTER_LINKS.map((list) => (
                <Stack key={list.headline} spacing={2}>
                  <Typography
                    component="p"
                    variant="subtitle2"
                    sx={{
                      color: 'primary.main',
                      textDecoration: 'none',
                      fontWeight: 'bold',
                      fontSize: 18,
                    }}
                  >
                    {list.headline}
                  </Typography>

                  {list.children.map((link) => (
                    <NextLink key={link.name} href={link.href} passHref>
                      <Link
                        color="inherit"
                        variant="body2"
                        sx={{ display: 'block' }}
                      >
                        {link.name}
                      </Link>
                    </NextLink>
                  ))}
                </Stack>
              ))}
            </Stack>
          </Grid>
        </Grid>

        {/* Copyright Section */}
        <Typography
          component="p"
          variant="body2"
          sx={{
            mt: 10,
            pb: 5,
            fontSize: 13,
            textAlign: { xs: 'center', md: 'left' },
          }}
        >
          © 2025. All rights reserved
        </Typography>
      </Container>
    </RootStyle>
  );
}
