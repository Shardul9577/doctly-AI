// import { m } from 'framer-motion';
import NextLink from 'next/link';
// @mui
import { styled } from '@mui/material/styles';
import {
  Button,
  Box,
  Link,
  Container,
  Typography,
  Stack,
  StackProps,
} from '@mui/material';
// routes
import { PATH_DASHBOARD } from '../../routes/paths';
// components
import Image from '../../components/Image';
import Iconify from '../../components/Iconify';
import TextIconLabel from '../../components/TextIconLabel';
import { MotionContainer, varFade } from '../../components/animate';
import { LazyMotion, domAnimation, m } from 'framer-motion';

// ----------------------------------------------------------------------

const RootStyle = styled(m.div)(({ theme }) => ({
  position: 'relative',
  backgroundColor: theme.palette.grey[400],
  [theme.breakpoints.up('md')]: {
    top: 0,
    left: 0,
    width: '100%',
    height: '100vh',
    display: 'flex',
    position: 'fixed',
    alignItems: 'center',
  },
}));

const ContentStyle = styled((props: StackProps) => (
  <Stack spacing={5} {...props} />
))(({ theme }) => ({
  zIndex: 10,
  maxWidth: 520,
  margin: 'auto',
  textAlign: 'center',
  position: 'relative',
  paddingTop: theme.spacing(15),
  paddingBottom: theme.spacing(15),
  [theme.breakpoints.up('md')]: {
    margin: 'unset',
    textAlign: 'left',
  },
}));

const HeroOverlayStyle = styled(m.img)({
  zIndex: 9,
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  position: 'absolute',
});

const HeroImgStyle = styled(m.img)(({ theme }) => ({
  top: 0,
  right: 0,
  bottom: 0,
  zIndex: 8,
  width: '100%',
  margin: 'auto',
  position: 'absolute',
  [theme.breakpoints.up('lg')]: {
    right: '8%',
    width: 'auto',
    height: '60vh',
  },
}));

const LogoCardStyle = styled('div')(() => ({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '6px 14px',
  borderRadius: 10,
  fontWeight: 600,
  fontSize: '0.85rem',
  backgroundColor: '#e0e0e0', // medium grey
  color: '#1a1a1a',
  // whiteSpace: 'nowrap',
  cursor: 'default',
  userSelect: 'none',
  transition: 'transform 0.2s ease, box-shadow 0.2s ease',

  // Sharp elevation with crisp shadows (white highlight + dark drop)
  boxShadow: `
    2px 2px 0px #bbb,    /* bottom-right shadow */
    -2px -2px 0px #fff   /* top-left highlight */
  `,

  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: `
      3px 3px 0px #aaa,
      -3px -3px 0px #fff
    `,
  },
}));

const LogoRow = styled('div')(() => ({
  display: 'flex',
  flexWrap: 'wrap',
  gap: '10px',
  alignItems: 'center',
}));

// ----------------------------------------------------------------------

export default function HomeHero() {
  const resources = [
    '🏥 Doctors',
    '🏨 Clinics',
    '📄 Insurance Companies',
    '🏬 Leading Hospitals',
  ];

  return (
    <MotionContainer>
      <RootStyle>
        <HeroOverlayStyle
          alt="overlay"
          src="/assets/overlay.svg"
          variants={varFade().in}
        />

        <HeroImgStyle
          alt="hero"
          src="/Images/home.svg"
          variants={varFade().inUp}
        />

        <Container>
          <ContentStyle>
            <m.div variants={varFade().inRight}>
              <Typography variant="h1" sx={{ color: 'common.white' }}>
                Smarter Healthcare Journey <br /> with
                <Typography
                  component="span"
                  variant="h1"
                  sx={{ color: 'primary.main' }}
                >
                  &nbsp;Doctly
                </Typography>
              </Typography>
            </m.div>

            <m.div variants={varFade().inRight}>
              <Typography sx={{ color: 'common.white' }}>
                Your AI-powered assistant for faster, accurate, and effortless
                medical documentation. Doctly empowers doctors with real-time
                transcription, early disease prediction, and structured medical
                reports—saving time and improving patient care.
              </Typography>
            </m.div>

            {/* <Stack
              spacing={2.5}
              alignItems='center'
              direction={{ xs: 'column', md: 'row' }}
            >
              <m.div variants={varFade().inRight}>
                <TextIconLabel
                  icon={
                    <Image
                      alt='sketch icon'
                      src='https://minimal-assets-api-dev.vercel.app/assets/images/home/ic_sketch_small.svg'
                      sx={{ width: 20, height: 20, mr: 1 }}
                    />
                  }
                  value={
                    <Link
                      href='https://www.sketch.com/s/76388a4d-d6e5-4b7f-8770-e5446bfa1268'
                      target='_blank'
                      rel='noopener'
                      color='common.white'
                      sx={{ typography: 'body2' }}
                    >
                      Preview Sketch
                    </Link>
                  }
                />
              </m.div>

              <m.div variants={varFade().inRight}>
                <TextIconLabel
                  icon={
                    <Image
                      alt='sketch icon'
                      src='https://minimal-assets-api-dev.vercel.app/assets/images/home/ic_figma_small.svg'
                      sx={{ width: 20, height: 20, mr: 1 }}
                    />
                  }
                  value={
                    <Link
                      href='https://www.figma.com/file/sI9fbKHIqlikUtfYCPb9lj/%5BPreview%5D-Minimal-Web.03.07.22?node-id=0%3A10803'
                      target='_blank'
                      rel='noopener'
                      color='common.white'
                      sx={{ typography: 'body2' }}
                    >
                      Preview Figma
                    </Link>
                  }
                />
              </m.div>
            </Stack> */}

            {/* <m.div variants={varFade().inRight}>
              <NextLink href={PATH_DASHBOARD.root} passHref>
                <Button
                  size='large'
                  variant='contained'
                  startIcon={
                    <Iconify icon={'eva:flash-fill'} width={20} height={20} />
                  }
                >
                  Login
                </Button>
              </NextLink>
            </m.div> */}

            {/* <Stack spacing={2.5}>
              <m.div variants={varFade().inRight}>
                <Typography variant='overline' sx={{ color: 'primary.light' }}>
                  Available For
                </Typography>
              </m.div>

              <Stack
                direction='row'
                spacing={1.5}
                justifyContent={{ xs: 'center', md: 'flex-start' }}
              >
                <LogoRow>
                  {resources.map((resource) => (
                    <LogoCardStyle key={resource}>{resource}</LogoCardStyle>
                  ))}
                </LogoRow>
              </Stack>
            </Stack> */}
          </ContentStyle>
        </Container>
      </RootStyle>
      <Box sx={{ height: { md: '100vh' } }} />
    </MotionContainer>
  );
}
