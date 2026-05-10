import { m } from 'framer-motion';
// @mui
import { styled } from '@mui/material/styles';
import { Box, Container, Stack, InputAdornment } from '@mui/material';
// components
import Iconify from '../../components/Iconify';
import InputStyle from '../../components/InputStyle';
import {
  MotionContainer,
  TextAnimate,
  varFade,
} from '../../components/animate';

// ----------------------------------------------------------------------

const ContentStyle = styled(Stack)(({ theme }) => ({
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
  backgroundImage: 'url(/Images/faq.svg)',
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

export default function FaqsHero() {
  return (
    <RootStyle>
      <Container
        component={MotionContainer}
        sx={{ position: 'relative', height: '100%' }}
      >
        <ContentStyle spacing={5}>
          <div>
            <TextAnimate
              text="How"
              sx={{ color: 'primary.main' }}
              variants={varFade().inRight}
            />
            <br />
            <Box sx={{ display: 'inline-flex' }}>
              <TextAnimate text="can" sx={{ mr: 2 }} />
              <TextAnimate text="we" sx={{ mr: 2 }} />
              <TextAnimate text="help" sx={{ mr: 2 }} />
              <TextAnimate text="you?" />
            </Box>
          </div>
        </ContentStyle>
      </Container>
    </RootStyle>
  );
}
