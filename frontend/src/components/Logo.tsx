import { forwardRef } from 'react';
import NextLink from 'next/link';
// @mui
import { useTheme } from '@mui/material/styles';
import { Box, BoxProps } from '@mui/material';
import Image from 'next/image';

// ----------------------------------------------------------------------

interface Props extends BoxProps {
  disabledLink?: boolean;
  size?: number; // 👈 new prop
}

const Logo = forwardRef<any, Props>(
  ({ disabledLink = false, size = 40, sx, ...other }, ref) => {
    const theme = useTheme();

    const PRIMARY_COLOR = '#FFC107';

    const logo = (
      <Box
        ref={ref}
        sx={{
          width: size,
          height: size,
          cursor: 'pointer',
          ...sx,
        }}
        {...other}
      >
        <Image
          src='/Images/logo_single.png'
          alt='Logo'
          width={size}
          height={size}
        />
      </Box>
    );

    if (disabledLink) {
      return <>{logo}</>;
    }

    return <NextLink href='/'>{logo}</NextLink>;
  }
);

export default Logo;
