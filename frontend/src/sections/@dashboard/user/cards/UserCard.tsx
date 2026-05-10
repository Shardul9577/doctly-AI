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
import CloseIcon from '@mui/icons-material/Close';

// utils
import cssStyles from '../../../../utils/cssStyles';

// animation
import { m, AnimatePresence } from 'framer-motion';

import { useState } from 'react';
import axiosInstance from 'src/utils/axios';
import { useSnackbar } from 'notistack';
import { useRouter } from 'next/router';
import { PATH_DASHBOARD } from 'src/routes/paths';

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
};

export default function UserCard({ user }: Props) {
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
  const [openModal, setOpenModal] = useState(false);

  const [connectConfirmOpen, setConnectConfirmOpen] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const { push } = useRouter();

  const patientId = _id; // Replace with dynamic ID if needed

  const confirmConnect = async () => {
    try {
      const response = await axiosInstance.post(
        `/api/doctors/patient/connect/${patientId}`
      );
      enqueueSnackbar('Patient connected successfully', { variant: 'success' });
      push(PATH_DASHBOARD.docPatient.cards);
      // Optionally trigger a refresh
    } catch (error) {
      console.error('Error connecting patient:', error);
      enqueueSnackbar('Failed to connect patient', { variant: 'error' });
    } finally {
      setConnectConfirmOpen(false);
    }
  };

  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  const handleCardClick = (user: any) => {
    setSelectedUser(user);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  return (
    <Card
      sx={{
        textAlign: 'center',
        position: 'relative',
        borderRadius: 4,
        background: (theme) =>
          `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.light} 100%)`,
        color: 'white',
        overflow: 'hidden',
      }}
    >
      {/* 🎨 Gradient Overlay */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 1,
        }}
      />

      {/* 🧍 Avatar Section */}
      <Box
        onClick={() => handleCardClick(user)}
        sx={{
          position: 'relative',
          width: '100%',
          height: 140,
          cursor: 'pointer',
          zIndex: 2,
        }}
      >
        {/* Background Pattern */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            opacity: 0.3,
          }}
        />

        {/* Avatar with Glow Effect */}
        <Avatar
          alt={email}
          src={
            profile_picture ||
            'https://cdn-icons-png.flaticon.com/512/1430/1430453.png'
          }
          className='patient-avatar'
          sx={{
            width: 60,
            height: 60,
            position: 'absolute',
            left: '50%',
            top: '50%',
            transform: 'translate(-50%, -50%)',
            border: (theme) =>
              `4px solid ${
                theme.palette.mode === 'dark'
                  ? 'rgba(76, 76, 76, 0)'
                  : 'rgba(0,0,0,0.1)'
              }`,
            backgroundColor: 'white',
            boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
            transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: -2,
              left: -2,
              right: -2,
              bottom: -2,
              background: (theme) =>
                theme.palette.mode === 'dark'
                  ? 'linear-gradient(45deg, #333, #555, #777, #999)'
                  : 'linear-gradient(45deg, #e0e0e0, #f5f5f5, #ffffff, #fafafa)',
              borderRadius: '50%',
              zIndex: -1,
              opacity: 0,
              transition: 'opacity 0.3s ease',
            },
            '&:hover::before': {
              opacity: 1,
            },
          }}
        />

        {/* Status Indicator */}
        <Box
          sx={{
            position: 'absolute',
            top: 16,
            right: 16,
            width: 12,
            height: 12,
            borderRadius: '50%',
            backgroundColor: '#4caf50',
            border: '2px solid white',
          }}
        />
      </Box>

      {/* 📋 Patient Info Section */}
      <Box
        className='patient-info'
        sx={{
          position: 'relative',
          zIndex: 2,
          p: 3,
          background: (theme) =>
            theme.palette.mode === 'dark'
              ? 'rgb(42 48 57)'
              : 'rgb(244 246 248)',
          backdropFilter: 'blur(10px)',
          transition: 'all 0.3s ease',
        }}
      >
        {/* Name with Gradient Text */}
        <Typography
          variant='h6'
          sx={{
            mb: 1,
            fontWeight: 700,
            color: (theme) =>
              theme.palette.mode === 'dark' ? 'white' : 'black',
            textShadow: '0 2px 4px rgba(0,0,0,0.1)',
          }}
        >
          {firstName} {lastName}
        </Typography>

        {/* Quick Stats */}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: 1,
            mb: 2,
          }}
        >
          <Box sx={{ textAlign: 'center' }}>
            <Typography
              variant='caption'
              sx={{
                color: (theme) =>
                  theme.palette.mode === 'dark'
                    ? 'rgba(255,255,255,0.7)'
                    : 'rgba(0,0,0,0.7)',
                display: 'block',
                mb: 0.5,
              }}
            >
              Age
            </Typography>
            <Typography
              variant='body2'
              sx={{
                fontWeight: 600,
                color: (theme) =>
                  theme.palette.mode === 'dark' ? 'white' : 'black',
              }}
            >
              {age || 'N/A'}
            </Typography>
          </Box>
          <Box sx={{ textAlign: 'center' }}>
            <Typography
              variant='caption'
              sx={{
                color: (theme) =>
                  theme.palette.mode === 'dark'
                    ? 'rgba(255,255,255,0.7)'
                    : 'rgba(0,0,0,0.7)',
                display: 'block',
                mb: 0.5,
              }}
            >
              ABHA
            </Typography>
            <Typography
              variant='body2'
              sx={{
                fontWeight: 600,
                color: (theme) =>
                  theme.palette.mode === 'dark' ? 'white' : 'black',
                fontSize: '0.75rem',
              }}
            >
              {abha_id ? abha_id : 'None'}
            </Typography>
          </Box>
          <Box sx={{ textAlign: 'center' }}>
            <Typography
              variant='caption'
              sx={{
                color: (theme) =>
                  theme.palette.mode === 'dark'
                    ? 'rgba(255,255,255,0.7)'
                    : 'rgba(0,0,0,0.7)',
                display: 'block',
                mb: 0.5,
              }}
            >
              Phone
            </Typography>
            <Typography
              variant='body2'
              sx={{
                fontWeight: 600,
                color: (theme) =>
                  theme.palette.mode === 'dark' ? 'white' : 'black',
                fontSize: '0.75rem',
              }}
            >
              {phone ? phone.slice(-4) : 'N/A'}
            </Typography>
          </Box>
        </Box>

        {/* Action Buttons */}
        <Box sx={{ mt: 2 }}>
          <Grid container spacing={1}>
            <Grid item xs={12}>
              <Button
                fullWidth
                variant='contained'
                size='small'
                sx={{
                  backgroundColor: '#41b67a',
                  color: 'white',
                  borderRadius: 2,
                  textTransform: 'none',
                  fontWeight: 600,
                  boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                  '&:hover': {
                    backgroundColor: '#2d8f5a',
                    transform: 'translateY(-1px)',
                    boxShadow: '0 6px 16px rgba(0,0,0,0.2)',
                  },
                }}
                onClick={() => setConnectConfirmOpen(true)}
              >
                Connect Patient
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Box>

      {/* 🪟 Modal */}
      <AnimatePresence>
        {openModal && selectedUser && (
          <Dialog
            open={openModal}
            onClose={handleCloseModal}
            fullWidth
            maxWidth='sm'
            PaperProps={{
              sx: {
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
            <m.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.4, ease: 'easeInOut' }}
            >
              <DialogTitle sx={{ m: 0, p: 2 }}>
                Patient Details
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
                  <Typography
                    variant='h6'
                    sx={{ color: 'success.main', mb: 2 }}
                  >
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
                      <Typography>
                        {selectedUser.bloodGroup || 'N/A'}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography fontWeight={500}>Gender</Typography>
                      <Typography>{selectedUser.gender || 'N/A'}</Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography fontWeight={500}>Marital Status</Typography>
                      <Typography>
                        {selectedUser.maritalStatus || 'N/A'}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography fontWeight={500}>Spouse Full Name</Typography>
                      <Typography>
                        {selectedUser.spouseName || 'None'}
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
                      <Typography>{selectedUser.address || 'N/A'}</Typography>
                    </Grid>
                  </Grid>
                </Box>
              </DialogContent>
            </m.div>
          </Dialog>
        )}
      </AnimatePresence>

      {/* 🟢 Connect Confirmation Modal */}
      <Dialog
        open={connectConfirmOpen}
        onClose={() => setConnectConfirmOpen(false)}
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
      >
        <Box
          sx={{
            bgcolor: (theme) =>
              theme.palette.mode === 'dark' ? '#333' : '#f5f5f5',
            px: 3,
            py: 1.5,
          }}
        >
          <Typography
            variant='subtitle1'
            sx={{
              color: (theme) =>
                theme.palette.mode === 'dark' ? 'white' : 'black',
              fontWeight: 600,
            }}
          >
            Confirm Connect
          </Typography>
        </Box>

        <DialogContent sx={{ px: 3, pt: 4, pb: 2 }}>
          <Typography
            variant='body1'
            sx={{
              fontSize: '1.05rem',
              mb: 3,
              color: (theme) =>
                theme.palette.mode === 'dark' ? 'white' : 'black',
            }}
          >
            Do you want to connect this patient to your list?
          </Typography>

          <Divider sx={{ borderStyle: 'dotted', mb: 3 }} />

          <Stack direction='row' justifyContent='flex-end' spacing={2}>
            <Button
              variant='outlined'
              onClick={() => setConnectConfirmOpen(false)}
              sx={{
                borderColor: (theme) =>
                  theme.palette.mode === 'dark' ? 'white' : 'black',
                color: (theme) =>
                  theme.palette.mode === 'dark' ? 'white' : 'black',
                '&:hover': {
                  borderColor: (theme) =>
                    theme.palette.mode === 'dark' ? 'white' : 'black',
                  backgroundColor: (theme) =>
                    theme.palette.mode === 'dark'
                      ? 'rgba(255,255,255,0.1)'
                      : 'rgba(0,0,0,0.1)',
                },
              }}
            >
              Cancel
            </Button>
            <Button
              variant='contained'
              sx={{
                backgroundColor: '#41b67a',
                color: 'white',
                '&:hover': {
                  backgroundColor: '#2d8f5a',
                },
              }}
              onClick={() => confirmConnect()}
            >
              Connect
            </Button>
          </Stack>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
