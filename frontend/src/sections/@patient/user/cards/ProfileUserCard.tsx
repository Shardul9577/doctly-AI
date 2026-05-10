import { styled } from '@mui/material/styles';
import {
  Card,
  Typography,
  Button,
  Stack,
  useTheme,
  Chip,
  Box,
  Tooltip,
} from '@mui/material';
import Iconify from '../../../../components/Iconify';
import { ButtonProps } from '@mui/material';
// @types
import { Profile } from '../../../../@types/user';

// ----------------------------------------------------------------------

const ProfileButton = styled(Button)(({ theme }) => ({
  backgroundColor: theme.palette.background.neutral,
  color: theme.palette.text.primary,
  border: `1px solid ${theme.palette.divider}`,
  textTransform: 'none',
  padding: theme.spacing(0.8, 1.5),
  borderRadius: 12,
  fontSize: '0.8rem',
  fontWeight: 600,
  minHeight: 36,
  transition: 'all 0.2s ease',
  '&:hover': {
    backgroundColor: theme.palette.primary.lighter,
    borderColor: theme.palette.primary.main,
    transform: 'translateY(-2px)',
    boxShadow: `0 4px 12px ${theme.palette.primary.main}20`,
    color: 'black',
    '& .MuiSvgIcon-root, & .MuiTypography-root, & .MuiButton-startIcon': {
      color: 'black',
    },
  },
  '& .MuiButton-startIcon': {
    marginRight: 8,
  },
}));

const ProfileButton2 = styled(Button)(({ theme }) => ({
  backgroundColor: theme.palette.background.neutral,
  color: theme.palette.text.primary,
  border: `1px solid ${theme.palette.divider}`,
  textTransform: 'none',
  padding: theme.spacing(0.8, 1.5),
  borderRadius: 12,
  fontSize: '0.8rem',
  fontWeight: 600,
  minHeight: 36,
  transition: 'all 0.2s ease',
  '&:hover': {
    backgroundColor: theme.palette.primary.lighter,
    borderColor: theme.palette.primary.main,
    transform: 'translateY(-2px)',
    boxShadow: `0 4px 12px ${theme.palette.primary.main}20`,
  },
  '& .MuiButton-startIcon': {
    marginRight: 8,
  },
}));

// 👇 Extend ButtonProps with colorCode
interface SocialButtonProps extends ButtonProps {
  colorCode: string;
}

const SocialButton = styled(Button)<{ colorCode: string }>(
  ({ theme, colorCode }) => ({
    minWidth: 28,
    minHeight: 28,
    borderRadius: 6,
    backgroundColor: colorCode,
    color: '#fff',
    boxShadow: theme.shadows[1],
    '&:hover': {
      backgroundColor: colorCode,
      opacity: 0.9,
      transform: 'translateY(-1px)',
      boxShadow: theme.shadows[2],
    },
    '&.Mui-disabled': {
      backgroundColor: theme.palette.action.disabledBackground,
      color: theme.palette.action.disabled,
      transform: 'none',
      boxShadow: 'none',
    },
  })
);

// --- Icon Style Fix ---
const IconStyle = styled(Iconify)({
  width: 20,
  height: 20,
  display: 'block',
});

const SocialIconStyle = styled(Iconify)({
  width: 16,
  height: 16,
  display: 'block',
});

type Props = {
  profile: Profile;
};

// ----------------------------------------------------------------------

export default function ProfileAbout({ profile }: Props) {
  const theme = useTheme();
console.log('ProfileAbout', profile);
  return (
    <Card
      sx={{
        bgcolor: theme.palette.background.paper,
        color: theme.palette.text.primary,
        borderRadius: 3,
        p: 2.5,
        width: '100%',
        boxShadow: theme.shadows[4],
        border: `1px solid ${theme.palette.divider}`,
      }}
    >
      {/* Header Row */}
      <Stack
        direction='row'
        alignItems='center'
        justifyContent='space-between'
        sx={{ mb: 2, flexWrap: 'wrap', rowGap: 1 }}
      >
        <Box sx={{ flex: 1 }} />
        <Stack direction='row' spacing={0.5} flexWrap='wrap' rowGap={0.5}>
          <SocialButton
            colorCode='#0077B5'
            onClick={() =>
              window.open(profile?.social_links?.linkedin, '_blank')
            }
            disabled={
              !profile?.social_links?.linkedin ||
              profile?.social_links?.linkedin.trim() === ''
            }
          >
            <SocialIconStyle icon='mdi:linkedin' />
          </SocialButton>

          <SocialButton
            colorCode='#1DA1F2'
            onClick={() =>
              window.open(profile?.social_links?.twitter, '_blank')
            }
            disabled={
              !profile?.social_links?.twitter ||
              profile?.social_links?.twitter.trim() === ''
            }
          >
            <SocialIconStyle icon='mdi:twitter' />
          </SocialButton>

          <SocialButton
            colorCode='#E1306C'
            onClick={() =>
              window.open(profile?.social_links?.instagram, '_blank')
            }
            disabled={
              !profile?.social_links?.instagram ||
              profile?.social_links?.instagram.trim() === ''
            }
          >
            <SocialIconStyle icon='mdi:instagram' />
          </SocialButton>

          <SocialButton
            colorCode='#1877F2'
            onClick={() =>
              window.open(profile?.social_links?.facebook, '_blank')
            }
            disabled={
              !profile?.social_links?.facebook ||
              profile?.social_links?.facebook.trim() === ''
            }
          >
            <SocialIconStyle icon='mdi:facebook' />
          </SocialButton>
        </Stack>
      </Stack>

      {/* About Section */}
      <Box
        sx={{
          mb: 2,
          p: 1.5,
          bgcolor: theme.palette.background.neutral,
          borderRadius: 2,
        }}
      >
        <Typography
          variant='body2'
          color={theme.palette.text.secondary}
          sx={{ lineHeight: 1.6, fontSize: '0.875rem' }}
        >
          {profile?.about || `About is not yet added !`}
        </Typography>
      </Box>

      {/* Info Buttons */}
      <Box
        sx={{
          display: 'flex',
          overflowX: 'auto',
          pb: 1,
          '&::-webkit-scrollbar': { display: 'none' }, // hide scrollbar
        }}
      >
        <Stack
          direction='row'
          alignItems='center'
          spacing={1.5}
          flexWrap='nowrap' 
        >
          <Tooltip title='Age' arrow>
            <ProfileButton
              size='small'
              startIcon={<IconStyle icon='eva:person-fill' />}
              sx={{ flex: '0 0 auto', minWidth: 110 }}
            >
              {profile?.age || 'N/A'} years
            </ProfileButton>
          </Tooltip>

          <Tooltip title='License Number' arrow>
            <ProfileButton
              size='small'
              startIcon={<IconStyle icon='eva:shield-fill' />}
              sx={{ flex: '0 0 auto', minWidth: 130 }}
            >
              {profile?.license_number || 'N/A'}
            </ProfileButton>
          </Tooltip>

          <Tooltip title='Email Address' arrow>
            <ProfileButton
              size='small'
              startIcon={<IconStyle icon='eva:email-fill' />}
              sx={{ flex: '0 0 auto', minWidth: 180 }}
            >
              {profile?.email || 'N/A'}
            </ProfileButton>
          </Tooltip>

          <Tooltip title='Phone Number' arrow>
            <ProfileButton
              size='small'
              startIcon={<IconStyle icon='eva:phone-fill' />}
              sx={{ flex: '0 0 auto', minWidth: 150 }}
            >
              {profile?.phone || 'N/A'}
            </ProfileButton>
          </Tooltip>

          <Tooltip title='Medical School' arrow>
            <ProfileButton
              size='small'
              onClick={() => alert('View Office Map')}
              startIcon={<IconStyle icon='eva:home-fill' />}
              sx={{ flex: '0 0 auto', minWidth: 150 }}
            >
              {profile?.medical_school || 'N/A'}
            </ProfileButton>
          </Tooltip>
        </Stack>
      </Box>

      {/* Languages */}
      {/* <Stack
        direction='row'
        alignItems='center'
        spacing={1}
        flexWrap='wrap'
        rowGap={1}
        sx={{ mb: 2 }}
      >
        <Typography
          variant='subtitle2'
          color={theme.palette.text.primary}
          sx={{ fontSize: '0.875rem', fontWeight: 600 }}
        >
          Languages:
        </Typography>
        {profile?.languages ? (
          profile?.qualification_info?.languages?.map((skill) => (
            <Chip
              key={skill}
              label={skill}
              size='small'
              sx={{
                bgcolor: theme.palette.primary.lighter,
                color: theme.palette.primary.main,
                fontWeight: 600,
                fontSize: '0.75rem',
                height: 24,
              }}
            />
          ))
        ) : (
          <Typography variant='body2' color={theme.palette.text.secondary}>
            None
          </Typography>
        )}
      </Stack> */}

      {/* Qualification */}
      {/* <Stack direction='row' alignItems='center' spacing={1}>
        <Typography
          variant='subtitle2'
          color={theme.palette.text.primary}
          sx={{ fontSize: '0.875rem', fontWeight: 600 }}
        >
          Qualification:
        </Typography>
        <Chip
          label={profile?.qualification || 'None'}
          size='small'
          sx={{
            bgcolor: theme.palette.success.lighter,
            color: theme.palette.success.main,
            fontWeight: 600,
            fontSize: '0.75rem',
            height: 24,
          }}
        />
      </Stack> */}
    </Card>
  );
}
