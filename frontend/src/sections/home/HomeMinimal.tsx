import { m } from 'framer-motion';
// @mui
import { alpha, useTheme, styled } from '@mui/material/styles';
import { Box, Card, Container, Typography } from '@mui/material';
// components
import Image from '../../components/Image';
import { MotionViewport, varFade } from '../../components/animate';

// ----------------------------------------------------------------------

const CARDS = [
  {
    icon: 'https://static.vecteezy.com/system/resources/previews/016/774/422/non_2x/realistic-medical-stethoscope-on-transparent-background-free-png.png',
    title: 'Real-Time Medical Documentation',
    description:
      'Doctly listens to doctor-patient conversations in real-time and automatically converts them into structured EMR notes. This reduces the doctor’s time spent on paperwork by over 70%, minimizes errors, and allows them to focus more on patient care.',
  },
  {
    icon: 'https://static.vecteezy.com/system/resources/previews/036/083/525/non_2x/ai-generated-three-dimensional-brain-isolated-on-transparent-background-free-png.png',
    title: 'AI-Powered Early Disease Detection',
    description:
      'Using AI and NLP, Doctly analyzes live patient conversations to identify early symptoms of diseases like diabetes and hypertension. It flags risk patterns and recommends further diagnosis, helping detect diseases before they become serious—especially useful in under-resourced areas.',
  },
  {
    icon: 'https://static.vecteezy.com/system/resources/thumbnails/027/736/682/small_2x/user-interface-icon-web-development-and-optimization-icons-3d-render-illustration-png.png',
    title: 'Unified Health Interface',
    description:
      'Doctly integrates with hospital and insurance systems to provide standardized, shareable health records through a UHI-compatible API. This speeds up insurance claims and ensures smooth data flow between healthcare providers, improving patient outcomes and operational efficiency.',
  },
];

const shadowIcon = (color: string) =>
  `drop-shadow(2px 2px 2px ${alpha(color, 0.48)})`;

const RootStyle = styled('div')(({ theme }) => ({
  paddingTop: theme.spacing(15),
  [theme.breakpoints.up('md')]: {
    paddingBottom: theme.spacing(15),
  },
}));

const CardStyle = styled(Card)(({ theme }) => {
  const shadowCard = (opacity: number) =>
    theme.palette.mode === 'light'
      ? alpha(theme.palette.grey[500], opacity)
      : alpha(theme.palette.common.black, opacity);

  return {
    position: 'relative',
    border: 0,
    maxWidth: 380,
    minHeight: 460,
    margin: 'auto',
    textAlign: 'center',
    padding: theme.spacing(8, 4, 4), // reduced top padding to prevent image cut-off
    boxShadow: theme.customShadows.z12,
    overflow: 'visible', // Important: allows overlapping image

    [theme.breakpoints.up('md')]: {
      boxShadow: 'none',
      backgroundColor:
        theme.palette.grey[theme.palette.mode === 'light' ? 200 : 800],
    },

    '&.cardLeft': {
      [theme.breakpoints.up('md')]: { marginTop: -40 },
    },

    '&.cardCenter': {
      [theme.breakpoints.up('md')]: {
        marginTop: -80,
        backgroundColor: theme.palette.background.paper,
        boxShadow: `-40px 40px 80px 0 ${shadowCard(0.4)}`,
        '&:before': {
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: -1,
          content: "''",
          margin: 'auto',
          position: 'absolute',
          width: 'calc(100% - 40px)',
          height: 'calc(100% - 40px)',
          borderRadius: Number(theme.shape.borderRadius) * 2,
          backgroundColor: theme.palette.background.paper,
          boxShadow: `-20px 20px 40px 0 ${shadowCard(0.12)}`,
        },
      },
    },
  };
});

// ----------------------------------------------------------------------

export default function HomeMinimal() {
  const theme = useTheme();

  const isLight = theme.palette.mode === 'light';

  return (
    <RootStyle>
      <Container component={MotionViewport}>
        <Box
          sx={{
            textAlign: 'center',
            mb: { xs: 10, md: 25 },
          }}
        >
          <m.div variants={varFade().inUp}>
            <Typography
              component='div'
              variant='overline'
              sx={{ mb: 2, color: 'text.disabled' }}
            >
              DOCTLY
            </Typography>
          </m.div>
          <m.div variants={varFade().inDown}>
            <Typography variant='h2'>What doctly helps you?</Typography>
          </m.div>
        </Box>

        <Box
          sx={{
            display: 'grid',
            gap: { xs: 5, lg: 10 },
            gridTemplateColumns: { xs: 'repeat(1, 1fr)', md: 'repeat(3, 1fr)' },
          }}
        >
          {CARDS.map((card, index) => (
            <m.div variants={varFade().inUp} key={card.title}>
              <CardStyle
                className={
                  (index === 0 && 'cardLeft') ||
                  (index === 1 && 'cardCenter') ||
                  ''
                }
              >
                <Image
                  src={card.icon}
                  alt={card.title}
                  sx={{
                    display: 'block',
                    mx: 'auto',
                    mb: 4,
                    width: 100,
                    height: 100,
                    objectFit: 'contain', // ensures full image is visible inside fixed size
                    objectPosition: 'center',
                    filter: (theme) => {
                      if (index === 0)
                        return shadowIcon(theme.palette.info.main);
                      if (index === 1)
                        return shadowIcon(theme.palette.error.main);
                      return shadowIcon(theme.palette.primary.main);
                    },
                  }}
                />

                <Typography variant='h5' paragraph>
                  {card.title}
                </Typography>
                <Typography
                  sx={{ color: isLight ? 'text.secondary' : 'common.white' }}
                >
                  {card.description}
                </Typography>
              </CardStyle>
            </m.div>
          ))}
        </Box>
      </Container>
    </RootStyle>
  );
}
