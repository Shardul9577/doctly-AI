// src/sections/@patient/user/cards/UserCard.tsx

import { styled, useTheme } from '@mui/material/styles';
import {
  Box,
  Card,
  Avatar,
  Divider,
  Typography,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  DialogActions,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { m, AnimatePresence } from 'framer-motion';
import cssStyles from '../../../../utils/cssStyles';
import { DoctorData } from '../../../../@types/admin';
import Image from '../../../../components/Image';
import SvgIconStyle from '../../../../components/SvgIconStyle';
import { useState } from 'react';
import { capitalCase } from 'change-case';

// Import your existing components
import ProfileUserCard from './ProfileUserCard';
import ProfilePersonalCard from './ProfilePersonalCard';

// ----------------------------------------------------------------------

const OverlayStyle = styled('div')(({ theme }) => ({
  ...cssStyles().bgBlur({ blur: 2, color: theme.palette.primary.darker }),
  top: 0,
  zIndex: 8,
  content: "''",
  width: '100%',
  height: '100%',
  position: 'absolute',
}));

const MotionDialogPaper = styled(m.div)(({ theme }) => ({
  borderRadius: 16,
  padding: 16,
  background:
    theme.palette.mode === 'dark'
      ? 'rgba(15, 17, 23, 0.9)'
      : 'rgba(255, 255, 255, 0.9)',
  backdropFilter: 'blur(12px)',
  border: '1px solid rgba(255, 255, 255, 0.18)',
  boxShadow: '0 8px 24px rgba(0, 0, 0, 0.2)',
}));

// ----------------------------------------------------------------------

type Props = {
  user: DoctorData;
};

export default function UserCard({ user }: Props) {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  const [openModal, setOpenModal] = useState(false);

  // Destructure with default values to prevent undefined errors
  const {
    firstName = '',
    lastName = '', 
    abha_id,
    email,
    phone,
    age,
    profile_picture,
    role,
  } = user;


  const fullName = `${capitalCase(firstName || '')} ${capitalCase(
    lastName || ''
  )}`;
  const position = role ? capitalCase(role) : 'Doctor';
  const cover = '/assets/images/covers/cover_1.jpg';

  const handleCardClick = () => {
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  return (
    <>
      <Card
        sx={{
          textAlign: 'center',
          position: 'relative',
          cursor: 'pointer',
        }}
        onClick={handleCardClick}
      >
        <Box
          sx={{
            position: 'relative',
            width: '100%',
            height: 160,
            borderTopLeftRadius: 12,
            borderTopRightRadius: 12,
            overflow: 'visible',
            boxShadow: 3,
            cursor: 'pointer',
            '&::-webkit-scrollbar': {
              width: '0px', 
              display: 'none', 
            },
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
          }}
        >
          <Image
            src={cover}
            alt='cover'
            ratio='16/5'
            sx={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
            }}
          />
          <OverlayStyle />
          <SvgIconStyle
            src='https://minimal-assets-api-dev.vercel.app/assets/icons/shape-avatar.svg'
            sx={{
              width: 60,
              height: 24,
              zIndex: 10,
              left: '50%',
              transform: 'translateX(-50%)',
              bottom: -8,
              position: 'absolute',
              color: 'background.paper',
              '&::-webkit-scrollbar': {
                width: '0px', 
                display: 'none', 
              },
              scrollbarWidth: 'none', 
              msOverflowStyle: 'none',
            }}
          />
          <Avatar
            alt={fullName}
            src={
              profile_picture ||
              'https://cdn-icons-png.flaticon.com/512/1430/1430453.png'
            }
            sx={{
              width: 48,
              height: 48,
              zIndex: 11,
              position: 'absolute',
              left: '50%',
              transform: 'translateX(-50%)',
              bottom: -24,
              border: '2px solid white',
              backgroundColor: 'white',
            }}
          />
        </Box>

        <Typography variant='subtitle1' sx={{ mt: 6 }}>
          {fullName}
        </Typography>

        <Typography variant='body2' sx={{ color: 'text.secondary' }}>
          {position}
        </Typography>

        <Divider sx={{ borderStyle: 'dashed' }} />

        <Box
          sx={{ py: 3, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)' }}
        >
          <div>
            <Typography
              variant='caption'
              component='div'
              sx={{ mb: 0.75, color: 'text.disabled' }}
            >
              Abha ID
            </Typography>
            <Typography variant='caption'>{abha_id || 'None'}</Typography>
          </div>
          <div>
            <Typography
              variant='caption'
              component='div'
              sx={{ mb: 0.75, color: 'text.disabled' }}
            >
              Phone
            </Typography>
            <Typography variant='caption'>{phone || 'N/A'}</Typography>
          </div>
          <div>
            <Typography
              variant='caption'
              component='div'
              sx={{ mb: 0.75, color: 'text.disabled' }}
            >
              Age
            </Typography>
            <Typography variant='caption'>{age || 'N/A'}</Typography>
          </div>
        </Box>
      </Card>

      <AnimatePresence>
        {openModal && (
          <Dialog
            open={openModal}
            onClose={handleCloseModal}
            fullWidth
            maxWidth='md'
            PaperComponent={MotionDialogPaper}
            PaperProps={{
              variants: {
                hidden: { opacity: 0, scale: 0.8 },
                visible: { opacity: 0.9, scale: 1 },
                exit: { opacity: 0, scale: 0.8 },
              },
              initial: 'hidden',
              animate: 'visible',
              exit: 'exit',
              transition: { duration: 0.4, ease: 'easeInOut' },
              style: {
                borderRadius: 16,
                padding: 16,
                background: isDark
                  ? 'rgba(15, 17, 23, 0.9)'
                  : 'rgba(255, 255, 255, 0.9)',
                backdropFilter: 'blur(12px)',
                border: '1px solid rgba(255, 255, 255, 0.18)',
                boxShadow: '0 8px 24px rgba(0, 0, 0, 0.2)',
                '&::-webkit-scrollbar': {
                  width: '0px', 
                  display: 'none',
                },
                scrollbarWidth: 'none',
                msOverflowStyle: 'none',
              },
            }}
          >
            <DialogTitle
              sx={{
                m: 0,
                p: 2,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                '&::-webkit-scrollbar': {
                  width: '0px',
                  display: 'none',
                },
                scrollbarWidth: 'none',
                msOverflowStyle: 'none',
              }}
            >
              <Typography variant='h6'>Doctor Details</Typography>
              <IconButton
                aria-label='close'
                onClick={handleCloseModal}
                sx={{
                  color: (theme) => theme.palette.grey[500],
                }}
              >
                <CloseIcon />
              </IconButton>
            </DialogTitle>

            <DialogContent
              dividers
              sx={{
                paddingX: 3,
                paddingY: 4,
                overflowY: 'auto',

               
                '&::-webkit-scrollbar': {
                  width: '0px', 
                  display: 'none',
                },
                scrollbarWidth: 'none', 
                msOverflowStyle: 'none', 
              }}
            >
              {/* Added a Box with marginBottom for spacing */}
              <Box
                sx={{
                  mb: 4,
                  '&::-webkit-scrollbar': {
                    width: '0px', 
                    display: 'none',
                  },
                  scrollbarWidth: 'none', 
                  msOverflowStyle: 'none',
                }}
              >
                <ProfileUserCard profile={user} />
              </Box>
              <ProfilePersonalCard profile={user} />
            </DialogContent>

            {/* <DialogActions>
              <IconButton onClick={handleCloseModal}>
                <CloseIcon />
              </IconButton>
            </DialogActions> */}
          </Dialog>
        )}
      </AnimatePresence>
    </>
  );
}
