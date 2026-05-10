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
} from '@mui/material';
import { useState } from 'react';
import DownloadIcon from '@mui/icons-material/Download';
import CloseIcon from '@mui/icons-material/Close';
// @types
import { Profile } from '../../../../@types/user';
import { styled } from '@mui/material/styles';

function InfoRow({ label, value }: any) {
  return (
    <Grid item xs={12} sm={6} md={4}>
      <Typography variant='caption' color='text.secondary'>
        {label}
      </Typography>
      <Typography variant='body2'>{value || '-'}</Typography>
    </Grid>
  );
}

type Props = {
  profile: Profile;
};

const StyledButton = styled(Button)(({ theme }) => ({
  '&.Mui-disabled': {
    backgroundColor: theme.palette.action.disabledBackground,
    color: theme.palette.action.disabled,
    borderColor: theme.palette.action.disabled,
  },
}));

export default function EmployeeProfile({ profile }: Props) {

  return (
    <Box>
      {/* Personal Information */}
      <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
        <Typography
          variant='h6'
          color='primary'
          sx={{ fontWeight: 600, mb: 2 }}
        >
          Personal Information
        </Typography>
        <Grid container spacing={2}>
          <InfoRow
            label='Name'
            value={profile?.personal_info?.fullName || 'None'}
          />
          <InfoRow label='Abha Id' value={profile?.abha_id || 'None'} />
          <InfoRow
            label='Gender'
            value={profile?.personal_info?.gender || 'None'}
          />
          <InfoRow
            label='Birth Date'
            value={profile?.personal_info?.date_of_birth || 'None'}
          />
          <InfoRow
            label='Blood Group'
            value={profile?.personal_info?.blood_group || 'None'}
          />
          <InfoRow
            label='Marital Status'
            value={profile?.personal_info?.marital_status || 'None'}
          />
          <InfoRow
            label='Spouse Full Name'
            value={profile?.personal_info?.spouse_full_name || 'None'}
          />
          <InfoRow
            label='Personal Email ID'
            value={profile?.personal_info?.email || 'None'}
          />
          <InfoRow
            label='Con. Number'
            value={profile?.personal_info?.phone || 'None'}
          />
          <Grid item xs={12}>
            <Typography variant='caption' color='text.secondary'>
              Residential Address
            </Typography>
            <Typography variant='body2'>
              {profile?.personal_info?.personal_address || 'None'}
            </Typography>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
}
