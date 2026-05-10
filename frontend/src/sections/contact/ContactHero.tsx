import { m } from 'framer-motion';
// @mui
import { styled } from '@mui/material/styles';
import { Box, Container, Typography, Grid } from '@mui/material';
//
import {
  TextAnimate,
  MotionContainer,
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
  backgroundImage: 'url(/Images/contact.svg)',
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

export default function ContactHero() {
  return (
    <RootStyle>
      <Container
        component={MotionContainer}
        sx={{ position: 'relative', height: '100%' }}
      >
        <ContentStyle>
          <TextAnimate
            text="Where"
            sx={{ color: 'primary.main' }}
            variants={varFade().inRight}
          />
          <br />
          <Box sx={{ display: 'inline-flex' }}>
            <TextAnimate text="to" sx={{ mr: 2 }} />
            <TextAnimate text="find" sx={{ mr: 2 }} />
            <TextAnimate text="us?" />
          </Box>

          <m.div variants={varFade().inRight}>
            <Typography
              variant="h5"
              sx={{
                mt: 5,
                fontWeight: 'fontWeightMedium',
              }}
            >
              We’d love to hear from you! Just complete the form below,
              <br /> and we’ll reach out soon.
            </Typography>
          </m.div>
        </ContentStyle>
      </Container>
    </RootStyle>
  );
}
