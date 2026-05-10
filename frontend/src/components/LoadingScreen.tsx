import { m } from 'framer-motion';
import { alpha, styled } from '@mui/material/styles';
import { Box } from '@mui/material';
import Logo from './Logo';

// ----------------------------------------------------------------------

const RootStyle = styled('div')(({ theme }) => ({
  position: 'fixed',
  zIndex: 99999,
  width: '100%',
  height: '100%',
  top: 0,
  left: 0,
  backgroundColor: theme.palette.background.default,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

export default function LoadingScreen() {
  return (
    <RootStyle>
      {/* Centered animation container */}
      <Box
        sx={{
          position: 'relative',
          width: 260,
          height: 260,
        }}
      >
        {/* Rotating outer border */}
        <Box
          component={m.div}
          animate={{
            scale: [1.2, 1, 1, 1.2, 1.2],
            rotate: [0, 270, 270, 0, 0],
            opacity: [1, 0.3, 0.3, 1, 1],
          }}
          transition={{
            ease: 'linear',
            duration: 3.2,
            repeat: Infinity,
          }}
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            borderRadius: '25%',
            border: (theme) =>
              `solid 8px ${alpha(theme.palette.primary.dark, 0.24)}`,
          }}
        />

        {/* Rotating inner border */}
        <Box
          component={m.div}
          animate={{
            scale: [1, 1.1, 1.1, 1, 1],
            rotate: [270, 0, 0, 270, 270],
            opacity: [0.25, 1, 1, 1, 0.25],
            borderRadius: ['25%', '25%', '50%', '50%', '25%'],
          }}
          transition={{
            ease: 'linear',
            duration: 3.2,
            repeat: Infinity,
          }}
          sx={{
            position: 'absolute',
            top: 20,
            left: 20,
            width: 220,
            height: 220,
            borderRadius: '25%',
            border: (theme) =>
              `solid 4px ${alpha(theme.palette.primary.dark, 0.24)}`,
          }}
        />

        {/* Flickering Logo in exact center */}
        <Box
          component={m.div}
          animate={{
            scale: [1, 0.9, 0.9, 1, 1],
            opacity: [1, 0.48, 0.48, 1, 1],
          }}
          transition={{
            duration: 2,
            ease: 'easeInOut',
            repeatDelay: 1,
            repeat: Infinity,
          }}
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
          }}
        >
          <Box
            sx={{
              marginLeft: '-50%',
              marginTop: '-50%',
            }}
          >
            <Logo disabledLink size={128} />
          </Box>
        </Box>
      </Box>
    </RootStyle>
  );
}
