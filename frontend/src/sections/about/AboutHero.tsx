import { m } from 'framer-motion';
// @mui
import { styled } from '@mui/material/styles';
import { Box, Container, Typography } from '@mui/material';
// components
import {
  MotionContainer,
  TextAnimate,
  varFade,
} from '../../components/animate';

// ----------------------------------------------------------------------

const ContentStyle = styled('div')(({ theme }) => ({
  textAlign: 'center',
  [theme.breakpoints.up('md')]: {
    textAlign: 'left',
    position: 'absolute',
    bottom: theme.spacing(10),
  },
}));
const RootStyle = styled('div')(({ theme }) => ({
  marginRight: '100px',
  backgroundSize: 'contain',
  backgroundPosition: 'right center',
  backgroundRepeat: 'no-repeat',
  backgroundImage: 'url(/Images/about.svg)',
  padding: theme.spacing(10, 0),
  minHeight: 400,
  position: 'relative',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  [theme.breakpoints.up('md')]: {
    height: 500,
    padding: 0,
  },
}));

// ----------------------------------------------------------------------

export default function AboutHero() {
  return (
    <RootStyle>
      <Container
        component={MotionContainer}
        sx={{ position: 'relative', height: '100%' }}
      >
        <ContentStyle>
          <TextAnimate
            text="Who"
            sx={{ color: 'primary.main' }}
            variants={varFade().inRight}
          />
          <br />
          <Box sx={{ display: 'inline-flex' }}>
            <TextAnimate text="we" sx={{ mr: 2 }} />
            <TextAnimate text="are?" />
          </Box>

          <m.div variants={varFade().inRight}>
            <Typography
              variant="h4"
              sx={{
                mt: 5,
                fontWeight: 'fontWeightMedium',
              }}
            >
              Let's work together and
              <br /> make healthcare simple and sorted !
            </Typography>
          </m.div>
        </ContentStyle>
      </Container>
    </RootStyle>
  );
}
