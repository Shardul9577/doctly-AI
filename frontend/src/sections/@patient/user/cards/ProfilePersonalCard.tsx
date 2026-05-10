import {
  Box,
  Tabs,
  Tab,
  Typography,
  Grid,
  Paper,
  Stack,
  Button,
  Backdrop,
  IconButton,
  Card,
  Chip,
  Divider,
} from '@mui/material';
import { useState } from 'react';
import DownloadIcon from '@mui/icons-material/Download';
import CloseIcon from '@mui/icons-material/Close';
import { useTheme } from '@mui/material/styles';
// @types
import { Profile } from '../../../../@types/user';
import { styled } from '@mui/material/styles';
import Iconify from '../../../../components/Iconify';

const InfoLabel = styled(Typography)(({ theme }) => ({
  fontSize: '0.75rem',
  fontWeight: 600,
  color: theme.palette.text.secondary,
  textTransform: 'uppercase',
  letterSpacing: '0.5px',
  marginBottom: theme.spacing(0.5),
}));

const InfoValue = styled(Typography)(({ theme }) => ({
  fontSize: '0.95rem',
  fontWeight: 500,
  color: theme.palette.text.primary,
  lineHeight: 1.4,
}));

const DocumentButton = styled(Button)(({ theme }) => ({
  borderRadius: 12,
  padding: theme.spacing(1.5, 3),
  fontWeight: 600,
  fontSize: '0.9rem',
  textTransform: 'none',
  borderWidth: 2,
  height: 44,
  minWidth: 120,
  borderColor: theme.palette.grey[400],
  color: theme.palette.text.primary,
  backgroundColor: theme.palette.background.paper,
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  position: 'relative',
  overflow: 'hidden',
  '&:hover': {
    transform: 'translateY(-2px)',
    borderColor: theme.palette.primary.main,
    backgroundColor: theme.palette.primary.lighter,
    color: theme.palette.primary.main,
    boxShadow: `0 6px 20px ${theme.palette.primary.main}25`,
    '& .MuiButton-startIcon': {
      transform: 'scale(1.1)',
    },
  },
  '& .MuiButton-startIcon': {
    transition: 'transform 0.3s ease',
    marginRight: theme.spacing(1),
  },
  '&.Mui-disabled': {
    backgroundColor: theme.palette.action.disabledBackground,
    color: theme.palette.action.disabled,
    borderColor: theme.palette.action.disabled,
    transform: 'none',
    boxShadow: 'none',
  },
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: '-100%',
    width: '100%',
    height: '100%',
    background: `linear-gradient(90deg, transparent, ${theme.palette.primary.main}10, transparent)`,
    transition: 'left 0.6s',
  },
  '&:hover::before': {
    left: '100%',
  },
}));

type Props = {
  profile: Profile;
};

export default function EmployeeProfile({ profile }: Props) {
  const theme = useTheme();
  const [previewUrl, setPreviewUrl] = useState('');
  const [openPreview, setOpenPreview] = useState(false);

  const handlePreview = (url: string) => {
    setPreviewUrl(url);
    setOpenPreview(true);
  };

  const handleClosePreview = () => {
    setOpenPreview(false);
    setPreviewUrl('');
  };

  const handleDownload = async (url: string, fileName: any) => {
    const response = await fetch(url);
    const blob = await response.blob();
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.download = fileName;
    link.click();
  };

  const documents = [
    {
      label: 'Degree',
      url: profile?.download_images?.degree_url,
      icon: 'eva:book-fill',
    },
    {
      label: 'Aadhar Card',
      url: profile?.download_images?.aadhaar_card_url,
      icon: 'eva:person-fill',
    },
    {
      label: 'PAN Card',
      url: profile?.download_images?.pan_card_url,
      icon: 'eva:credit-card-fill',
    },
  ];

  return (
    <Box sx={{ mx: 'auto' }} row={12}>
      {/* Personal Information */}
      <Card
        elevation={3}
        sx={{
          p: 4,
          mb: 4,
          borderRadius: 3,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
          <Typography
            variant='h5'
            sx={{
              fontWeight: 700,
              color: theme.palette.primary.main,
              borderBottom: `3px solid ${theme.palette.primary.main}`,
              pb: 1,
            }}
          >
            Personal Information
          </Typography>
        </Box>

        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={4}>
            <InfoLabel>Full Name</InfoLabel>
            <InfoValue>
              {profile?.firstName || 'Not provided'}
              {' ' + profile?.lastName}
            </InfoValue>
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <InfoLabel>ABHA ID</InfoLabel>
            <InfoValue>{profile?.abha_id || 'Not provided'}</InfoValue>
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <InfoLabel>Gender</InfoLabel>
            <InfoValue>{profile?.gender || 'Not provided'}</InfoValue>
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <InfoLabel>Date of Birth</InfoLabel>
            <InfoValue>{profile?.birth_date || 'Not provided'}</InfoValue>
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <InfoLabel>Blood Group</InfoLabel>
            <InfoValue>{profile?.blood_group || 'Not provided'}</InfoValue>
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <InfoLabel>Marital Status</InfoLabel>
            <InfoValue>{profile?.marital_status || 'Not provided'}</InfoValue>
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <InfoLabel>Email Address</InfoLabel>
            <InfoValue>{profile?.email || 'Not provided'}</InfoValue>
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <InfoLabel>Phone Number</InfoLabel>
            <InfoValue>{profile?.phone || 'Not provided'}</InfoValue>
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <InfoLabel>Residential Address</InfoLabel>
            <InfoValue>{profile?.personal_address || 'Not provided'}</InfoValue>
          </Grid>
        </Grid>
      </Card>

      {/* Clinic Information */}
      {/* <Card
        elevation={3}
        sx={{
          p: 4,
          mb: 4,
          borderRadius: 3,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
          <Typography
            variant='h5'
            sx={{
              fontWeight: 700,
              color: theme.palette.primary.main,
              borderBottom: `3px solid ${theme.palette.primary.main}`,
              pb: 1,
            }}
          >
            Clinic Information
          </Typography>
        </Box>

        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={4}>
            <InfoLabel>Clinic/Hospital Name</InfoLabel>
            <InfoValue>
              {profile?.organization_name || 'Not provided'}
            </InfoValue>
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <InfoLabel>Organization ID</InfoLabel>
            <InfoValue>
              {profile?.organization_id || 'Not provided'}
            </InfoValue>
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <InfoLabel>Email Address</InfoLabel>
            <InfoValue>
              {profile?.organization_email || 'Not provided'}
            </InfoValue>
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <InfoLabel>Number of Doctors</InfoLabel>
            <InfoValue>
              {profile?.organization_people?.length ||
                'Not provided'}
            </InfoValue>
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <InfoLabel>Profile Type</InfoLabel>
            <InfoValue>
              {profile?.organization_type || 'Not provided'}
            </InfoValue>
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <InfoLabel>Phone Number</InfoLabel>
            <InfoValue>
              {profile?.organization_info?.organization_phone || 'Not provided'}
            </InfoValue>
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <InfoLabel>Status</InfoLabel>
            <Chip
              label={
                profile?.organization_info?.is_active ? 'Active' : 'Inactive'
              }
              color={
                profile?.organization_info?.is_active ? 'success' : 'error'
              }
              size='small'
              sx={{ fontWeight: 600 }}
            />
          </Grid>

          <Grid item xs={12}>
            <InfoLabel>Clinic Address</InfoLabel>
            <InfoValue>
              {profile?.organization_info?.organization_address ||
                'Not provided'}
            </InfoValue>
          </Grid>
        </Grid>
      </Card> */}

      {/* Document Preview Section */}
      {/* <Card
        elevation={3}
        sx={{
          p: 4,
          borderRadius: 3,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
          <Typography
            variant='h5'
            sx={{
              fontWeight: 700,
              color: theme.palette.primary.main,
              borderBottom: `3px solid ${theme.palette.primary.main}`,
              pb: 1,
            }}
          >
            Documents
          </Typography>
        </Box>

        <Box
          sx={{
            display: 'flex',
            overflowX: 'auto',
            pb: 1, // some padding for scroll
            '&::-webkit-scrollbar': { display: 'none' }, // hide scrollbar
          }}
        >
          <Stack
            direction='row'
            spacing={2}
            flexWrap='nowrap' // disable wrapping
          >
            {documents.map((doc) => (
              <DocumentButton
                key={doc.label}
                variant='outlined'
                startIcon={
                  <Iconify icon={doc.icon} sx={{ fontSize: '1.2rem' }} />
                }
                onClick={() => handlePreview(doc.url)}
                disabled={!doc.url?.trim()}
                sx={{
                  flex: '0 0 auto', // make buttons not shrink
                  minWidth: 120,
                }}
              >
                {doc.label}
              </DocumentButton>
            ))}
          </Stack>
        </Box>
      </Card> */}

      {/* Backdrop for Image Preview */}
      {/* <Backdrop
        open={openPreview}
        onClick={handleClosePreview}
        sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
      >
        <Box
          sx={{
            position: 'relative',
            width: '95vw',
            height: '95vh',
            maxWidth: '1400px',
            maxHeight: '95vh',
            bgcolor: 'background.paper',
            borderRadius: 3,
            boxShadow: 12,
            overflow: 'hidden',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            p: 1,
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <IconButton
            component='a'
            href={previewUrl}
            onClick={() => handleDownload(previewUrl, 'document.jpg')}
            rel='noopener noreferrer'
            sx={{
              position: 'absolute',
              top: 10,
              right: 10,
              color: 'white',
              zIndex: 2,
              backgroundColor: 'rgba(0,0,0,0.4)',
              '&:hover': {
                backgroundColor: 'rgba(0,0,0,0.6)',
              },
            }}
          >
            <DownloadIcon />
          </IconButton>

          <Box
            component='img'
            src={previewUrl}
            alt='Document Preview'
            sx={{
              width: '100%',
              height: '100%',
              objectFit: 'contain',
              borderRadius: 2,
            }}
          />
        </Box>
      </Backdrop> */}
    </Box>
  );
}
