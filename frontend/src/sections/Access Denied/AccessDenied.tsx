import NextLink from 'next/link';
import { Button, Container, Typography, Box } from '@mui/material';
import { styled } from '@mui/material/styles';
import Logo from '../../components/Logo';

// Styled container for full-screen layout
const StyledRoot = styled('div')(({ theme }) => ({
  minHeight: '100vh',
  backgroundColor: theme.palette.background.default,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  position: 'relative',
}));

export default function AccessDeniedPage() {
  return (
    <StyledRoot>
      {/* Doctly logo in top-left */}
      <Box sx={{ position: 'absolute', top: 24, left: 24 }}>
        <Logo sx={{ mb: 1, mx: 'auto' }} />
      </Box>

      <Container sx={{ textAlign: 'center', maxWidth: 520, mx: 'auto' }}>
        <Typography variant='h3' paragraph color='white'>
          Access Denied!
        </Typography>

        <Typography sx={{ color: 'text.secondary', mb: 5 }}>
          Sorry, you don’t have permission to access this page.
        </Typography>

        <Box
          sx={{
            mb: 5,
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          <img
            src='https://cdn3d.iconscout.com/3d/premium/thumb/access-denied-3d-icon-download-in-png-blend-fbx-gltf-file-formats--security-wrong-password-ui-fail-states-pack-user-interface-icons-10156008.png?f=webp'
            alt='access denied'
            width={300}
            style={{ maxWidth: '100%', height: 'auto' }}
          />
        </Box>

        <NextLink href='/' passHref>
          <Button
            size='large'
            variant='contained'
            sx={{
              px: 5,
              boxShadow: '0px 8px 24px rgba(255, 163, 26, 0.24)',
              bgcolor: 'warning.main',
              '&:hover': {
                bgcolor: 'warning.dark',
              },
            }}
          >
            Go To Home
          </Button>
        </NextLink>
      </Container>
    </StyledRoot>
  );
}
