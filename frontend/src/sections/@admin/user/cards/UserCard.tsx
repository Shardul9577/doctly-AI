

// @mui
import { styled } from '@mui/material/styles';
import {
  Box,
  Card,
  Avatar,
  Divider,
  Typography,
  Stack,
  Button,
  Chip,
  Grid,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';

// icons
import LogoutIcon from '@mui/icons-material/Logout';
import CloseIcon from '@mui/icons-material/Close';

// utils
import cssStyles from '../../../../utils/cssStyles';

// components
import Image from '../../../../components/Image';
import SocialsButton from '../../../../components/SocialsButton';
import SvgIconStyle from '../../../../components/SvgIconStyle';

// animation
import { m, AnimatePresence } from 'framer-motion';

import { useEffect, useState } from 'react';
import axiosInstance from 'src/utils/axios';
import { useSnackbar } from 'notistack';
import { useRouter } from 'next/router';
import VisibilityIcon from '@mui/icons-material/Visibility';

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

// ----------------------------------------------------------------------

type Props = {
  user: any;
  relationStatus: boolean;
};

export default function UserCard({ user, relationStatus }: Props) {
  const {
    cover,
    firstName,
    lastName,
    abha_id,
    email,
    phone,
    age,
    social_links,
    profile_picture,
    _id,
  } = user;

  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [openModal, setOpenModal] = useState(true);

  const [disconnectConfirmOpen, setDisconnectConfirmOpen] = useState(false);
  const [connectConfirmOpen, setConnectConfirmOpen] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const { push } = useRouter();
  const patientId = _id; // Replace with dynamic ID if needed

  

  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  const handleCardClick = (user: any) => {
    setSelectedUser(user);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const MotionDialogPaper = m.div;

  return (
    <Card sx={{ textAlign: 'center', position: 'relative' }}>
      {/* 🧍 Avatar and Cover */}
      <Box
        onClick={() => handleCardClick(user)}
        sx={{
          position: 'relative',
          width: '100%', // full width
          height: 160,
          borderTopLeftRadius: 12,
          borderTopRightRadius: 12,
          overflow: 'visible',
          boxShadow: 3,
          cursor: 'pointer',
        }}
      >
        {/* Background Image */}
        <Image
          src={cover}
          alt={cover}
          ratio='16/5'
          sx={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
          }}
        />

        {/* Optional Overlay */}
        <OverlayStyle />

        {/* Wave SVG under the image */}
        <SvgIconStyle
          src='https://minimal-assets-api-dev.vercel.app/assets/icons/shape-avatar.svg'
          sx={{
            width: 60,
            height: 24,
            zIndex: 10,
            left: 0,
            right: 0,
            bottom: -8,
            mx: 'auto',
            position: 'absolute',
            color: 'background.paper',
          }}
        />

        {/* Avatar (centered and overlapping) */}
        <Avatar
          alt={email}
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

      {/* 🙍 Name */}
      <Typography variant='subtitle1' sx={{ mt: 6 }}>
        {firstName} {lastName}
      </Typography>

      {/* 🌐 Socials */}
      <Stack alignItems='center'>
        <SocialsButton links={social_links} initialColor sx={{ my: 2.5 }} />
      </Stack>

      <Divider sx={{ borderStyle: 'dashed' }} />

      {/* 📊 ABHA, Phone, Age */}
      <Box
        sx={{ py: 3, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)' }}
      >
        <div>
          <Typography
            variant='caption'
            component='div'
            sx={{ mb: 0.75, color: 'text.disabled' }}
          >
            Abha Id
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
          <Typography variant='caption'>{phone}</Typography>
        </div>

        <div>
          <Typography
            variant='caption'
            component='div'
            sx={{ mb: 0.75, color: 'text.disabled' }}
          >
            Age
          </Typography>
          <Typography variant='caption'>{age}</Typography>
        </div>
      </Box>

      {relationStatus && (
        <>
          <Divider sx={{ borderStyle: 'dashed' }} />
          <Box sx={{ padding: 2 }}>
            <Grid container spacing={2} justifyContent='center'>
              <Grid item xs={6}>
                <Button
                  fullWidth
                  variant='contained'
                  size='small'
                  color='error'
                  startIcon={<LogoutIcon />}
                  onClick={() => setDisconnectConfirmOpen(true)}
                >
                  Disconnect
                </Button>
              </Grid>
              <Grid item xs={6}>
                <Button
                  fullWidth
                  variant='contained'
                  size='small'
                  color='primary'
                  startIcon={<VisibilityIcon />}
                  onClick={() =>
                    push(
                      `/dashboard/visits/createVisit?id=${_id}&name=${firstName}`
                    )
                  }
                >
                  Create Visit
                </Button>
              </Grid>
            </Grid>
          </Box>
        </>
      )}

      {/* 🪟 Modal */}
      <AnimatePresence>
        {openModal && selectedUser && (
          <Dialog
            open={openModal}
            onClose={handleCloseModal}
            fullWidth
            maxWidth='sm'
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
              },
            }}
          >
            <DialogTitle sx={{ m: 0, p: 2 }}>
              Doctor Details
              <IconButton
                aria-label='close'
                onClick={handleCloseModal}
                sx={{
                  position: 'absolute',
                  right: 8,
                  top: 8,
                  color: (theme) => theme.palette.grey[500],
                }}
              >
                <CloseIcon />
              </IconButton>
            </DialogTitle>

            <DialogContent dividers>
              {/* Personal Info */}
              <Box
                sx={{
                  borderRadius: 2,
                  p: 3,
                  mb: 3,
                  backgroundColor: (theme) =>
                    theme.palette.mode === 'dark' ? '#1c1f26' : '#f5f5f5',
                }}
              >
                <Typography variant='h6' sx={{ color: 'success.main', mb: 2 }}>
                  Personal Information
                </Typography>

                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Typography fontWeight={500}>Name</Typography>
                    <Typography>
                      {selectedUser.firstName} {selectedUser.lastName}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography fontWeight={500}>Abha Id</Typography>
                    <Typography>{selectedUser.abha_id || 'None'}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography fontWeight={500}>Blood Group</Typography>
                    <Typography>{selectedUser.blood_group || 'N/A'}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography fontWeight={500}>Gender</Typography>
                    <Typography>{selectedUser.gender || 'N/A'}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography fontWeight={500}>Marital Status</Typography>
                    <Typography>
                      {selectedUser.marital_status || 'N/A'}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography fontWeight={500}>Spouse Full Name</Typography>
                    <Typography>
                      {selectedUser.spouse_full_name || 'None'}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography fontWeight={500}>Con. Number</Typography>
                    <Typography>{selectedUser.phone}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography fontWeight={500}>Age</Typography>
                    <Typography>{selectedUser.age || 'N/A'}</Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography fontWeight={500}>
                      Residential Address
                    </Typography>
                    <Typography>
                      {selectedUser.personal_address || 'N/A'}
                    </Typography>
                  </Grid>
                </Grid>
              </Box>
            </DialogContent>
          </Dialog>
        )}
      </AnimatePresence>

      <Dialog
        open={disconnectConfirmOpen}
        onClose={() => setDisconnectConfirmOpen(false)}
        maxWidth='xs'
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 6,
            overflow: 'hidden',
            bgcolor: (theme) =>
              theme.palette.mode === 'dark' ? '#1c1f26' : 'background.paper',
          },
        }}
      ></Dialog>
    </Card>
  );
}
