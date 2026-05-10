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

  return (
    <Box sx={{ mx: 'auto' }}>
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
              {profile?.personal_info?.fullName || 'Not provided'}
            </InfoValue>
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <InfoLabel>ABHA ID</InfoLabel>
            <InfoValue>{profile?.abha_id || 'Not provided'}</InfoValue>
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <InfoLabel>Gender</InfoLabel>
            <InfoValue>
              {profile?.personal_info?.gender || 'Not provided'}
            </InfoValue>
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <InfoLabel>Date of Birth</InfoLabel>
            <InfoValue>
              {profile?.personal_info?.date_of_birth || 'Not provided'}
            </InfoValue>
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <InfoLabel>Blood Group</InfoLabel>
            <InfoValue>
              {profile?.personal_info?.blood_group || 'Not provided'}
            </InfoValue>
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <InfoLabel>Marital Status</InfoLabel>
            <InfoValue>
              {profile?.personal_info?.marital_status || 'Not provided'}
            </InfoValue>
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <InfoLabel>Spouse Name</InfoLabel>
            <InfoValue>
              {profile?.personal_info?.spouse_full_name || 'Not provided'}
            </InfoValue>
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <InfoLabel>Email Address</InfoLabel>
            <InfoValue>
              {profile?.personal_info?.email || 'Not provided'}
            </InfoValue>
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <InfoLabel>Phone Number</InfoLabel>
            <InfoValue>
              {profile?.personal_info?.phone || 'Not provided'}
            </InfoValue>
          </Grid>

          <Grid item xs={12}>
            <InfoLabel>Residential Address</InfoLabel>
            <InfoValue>
              {profile?.personal_info?.personal_address || 'Not provided'}
            </InfoValue>
          </Grid>
        </Grid>
      </Card>
    </Box>
  );
}
