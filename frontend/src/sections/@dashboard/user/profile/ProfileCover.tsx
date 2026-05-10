// @mui
import { styled } from '@mui/material/styles';
import { Box, Typography, Chip, Tooltip } from '@mui/material';
// @types
import { Profile } from '../../../../@types/user';
// utils
import cssStyles from '../../../../utils/cssStyles';
// hooks
import useAuth from '../../../../hooks/useAuth';
// components
import MyAvatar from '../../../../components/MyAvatar';
import Image from '../../../../components/Image';
import Iconify from '../../../../components/Iconify';

// ----------------------------------------------------------------------

const RootStyle = styled('div')(({ theme }) => ({
  '&:before': {
    ...cssStyles().bgBlur({ blur: 2, color: theme.palette.primary.darker }),
    top: 0,
    zIndex: 9,
    content: "''",
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
}));

const InfoStyle = styled('div')(({ theme }) => ({
  left: 0,
  right: 0,
  zIndex: 99,
  position: 'absolute',
  marginTop: theme.spacing(5),
  [theme.breakpoints.up('md')]: {
    right: 'auto',
    display: 'flex',
    alignItems: 'center',
    left: theme.spacing(3),
    bottom: theme.spacing(3),
  },
}));

const VerificationChip = styled(Chip)(({ theme }) => ({
  height: 28,
  fontSize: '0.8rem',
  fontWeight: 600,
  '& .MuiChip-icon': {
    fontSize: '1rem',
  },
}));

// ----------------------------------------------------------------------

type Props = {
  myProfile: Profile;
};

export default function ProfileCover({ myProfile }: Props) {
  // Function to capitalize first letter of each word
  const capitalizeName = (name: string) => {
    return name
      .split(' ')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  };

  // Get verification status and styling
  const getVerificationStatus = () => {
    const status = myProfile?.qualification_info?.verified_status;

    switch (status) {
      case 'verified':
        return {
          label: 'Verified',
          icon: 'eva:checkmark-circle-2-fill',
          color: 'success' as const,
          bgcolor: 'success.lighter',
          textColor: 'success.darker',
        };
      case 'rejected':
        return {
          label: 'Rejected',
          icon: 'eva:close-circle-fill',
          color: 'error' as const,
          bgcolor: 'error.lighter',
          textColor: 'error.darker',
        };
      case 'pending':
        return {
          label: 'Pending',
          icon: 'eva:clock-fill',
          color: 'warning' as const,
          bgcolor: 'warning.lighter',
          textColor: 'warning.darker',
        };
      default:
        return {
          label: 'Not Verified',
          icon: 'eva:alert-circle-fill',
          color: 'default' as const,
          bgcolor: 'grey.100',
          textColor: 'grey.600',
        };
    }
  };

  const verificationStatus = getVerificationStatus();
  const rejectionReason = myProfile?.qualification_info?.rejection_reason;

  return (
    <RootStyle>
      <Box
        sx={{
          position: 'absolute',
          top: 16,
          right: 16,
          zIndex: 100,
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          gap: 1,
          maxWidth: 'calc(100% - 32px)',
        }}
      >
        {verificationStatus.label === 'Rejected' && rejectionReason && (
          <Typography
            sx={{
              color: '#ff6b6b',
              fontSize: '0.75rem',
              fontWeight: 500,
              display: 'flex',
              alignItems: 'center',
              gap: 0.5,
              backgroundColor: 'rgba(255, 107, 107, 0.1)',
              padding: '4px 8px',
              borderRadius: 1,
              border: '1px solid rgba(255, 107, 107, 0.3)',
              maxWidth: 180,
              wordWrap: 'break-word',
            }}
          >
            <Iconify
              icon="eva:alert-triangle-fill"
              sx={{ fontSize: '0.875rem' }}
            />
            {rejectionReason}
          </Typography>
        )}
        <Tooltip title={verificationStatus.label} placement="left" arrow>
          <VerificationChip
            icon={<Iconify icon={verificationStatus.icon} />}
            label={verificationStatus.label}
            size="small"
            sx={{
              bgcolor: verificationStatus.bgcolor,
              color: verificationStatus.textColor,
              border: `1px solid ${verificationStatus.color}.main`,
              '&:hover': {
                bgcolor: verificationStatus.bgcolor,
              },
            }}
          />
        </Tooltip>
      </Box>

      <InfoStyle>
        <MyAvatar
          src={
            myProfile?.profile_picture ||
            'https://static.vecteezy.com/system/resources/previews/024/585/306/non_2x/3d-happy-cartoon-doctor-cartoon-doctor-on-transparent-background-generative-ai-png.png'
          }
          sx={{
            mx: 'auto',
            borderWidth: 2,
            borderStyle: 'solid',
            borderColor: 'common.white',
            width: { xs: 80, md: 128 },
            height: { xs: 80, md: 128 },
          }}
        />
        <Box
          sx={{
            ml: { md: 3 },
            mt: { xs: 1, md: 0 },
            color: 'common.white',
            textAlign: { xs: 'center', md: 'left' },
          }}
        >
          <Typography
            variant="h4"
            sx={{
              fontSize: { xs: '1.5rem', md: '1.5rem' },
              fontWeight: 600,
            }}
          >
            {capitalizeName(myProfile?.personal_info?.fullName || 'No name !')}
          </Typography>
          <Typography sx={{ opacity: 0.72 }}>
            {myProfile?.qualification_info?.specialization ||
              'No Specialization !'}
          </Typography>
        </Box>
      </InfoStyle>
      <Image
        alt="profile cover"
        // src={cover}
        sx={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
      />
    </RootStyle>
  );
}
