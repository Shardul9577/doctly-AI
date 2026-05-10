// next
import NextLink from 'next/link';
// @mui
import { styled } from '@mui/material/styles';
import { Box, Link, Typography } from '@mui/material';
// hooks
import useAuth from '../../../hooks/useAuth';
// routes
import { PATH_ADMIN_DASHBOARD } from '../../../routes/paths';
// components
import MyAvatar from '../../../components/MyAvatar';
import Iconify from '../../../components/Iconify';
import axiosInstance from 'src/utils/axios';
import { useEffect, useState } from 'react';

// ----------------------------------------------------------------------

const RootStyle = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(3, 3.5),
  borderRadius: 16,
  background: `linear-gradient(135deg, ${theme.palette.background.paper} 0%, ${theme.palette.background.neutral} 100%)`,
  border: `1px solid ${theme.palette.divider}`,
  position: 'relative',
  overflow: 'hidden',
  transition: theme.transitions.create(['all', 'transform'], {
    duration: theme.transitions.duration.standard,
  }),
  cursor: 'pointer',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '2px',
    background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
    transform: 'scaleX(0)',
    transition: 'transform 0.3s ease',
  },
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: theme.shadows[12],
    borderColor: theme.palette.primary.main,
    '&::before': {
      transform: 'scaleX(1)',
    },
  },
  '&:active': {
    transform: 'translateY(-1px)',
  },
}));

// ----------------------------------------------------------------------

type Props = {
  isCollapse: boolean | undefined;
};

export default function NavbarAccount({ isCollapse }: Props) {
  const userStringData = localStorage.getItem('userData');
  const user = userStringData ? JSON.parse(userStringData) : null;

  const formatName = (name?: string) => {
    if (!name) return 'Guest';
    return name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
  };

  return (
    <NextLink href={PATH_ADMIN_DASHBOARD.user.account} passHref>
      <Link underline='none' color='inherit'>
        <RootStyle
          sx={{
            ...(isCollapse && {
              bgcolor: 'transparent',
            }),
          }}
        >
          <Box
            sx={{
              position: 'relative',
              '& .MuiAvatar-root': {
                width: 48,
                height: 48,
                border: '3px solid',
                borderColor: 'background.paper',
                boxShadow: (theme) => theme.shadows[4],
                transition: 'all 0.3s ease',
              },
              '&:hover .MuiAvatar-root': {
                transform: 'scale(1.05)',
                boxShadow: (theme) => theme.shadows[8],
              },
            }}
          >
            <MyAvatar photo={user?.profile_picture} />
            <Box
              sx={{
                position: 'absolute',
                bottom: 0,
                right: 0,
                width: 16,
                height: 16,
                borderRadius: '50%',
                bgcolor: 'success.main',
                border: '2px solid',
                borderColor: 'background.paper',
                boxShadow: (theme) => theme.shadows[2],
              }}
            />
          </Box>

          <Box
            sx={{
              ml: 2,
              flex: 1,
              minWidth: 0,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              pr: 2,
              transition: (theme) =>
                theme.transitions.create(['width', 'margin', 'opacity'], {
                  duration: theme.transitions.duration.standard,
                }),
              ...(isCollapse && {
                ml: 0,
                width: 0,
                opacity: 0,
              }),
            }}
          >
            <Typography
              variant='h6'
              noWrap
              sx={{
                fontWeight: 700,
                color: 'text.primary',
                mb: 1,
                fontSize: '1.1rem',
                letterSpacing: '0.5px',
                lineHeight: 1.2,
              }}
            >
              {formatName(user?.firstName)}
            </Typography>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
              }}
            ></Box>
          </Box>
        </RootStyle>
      </Link>
    </NextLink>
  );
}
