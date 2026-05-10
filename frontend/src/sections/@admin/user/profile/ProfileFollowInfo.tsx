// @mui
import { Card, Stack, Typography, Divider } from '@mui/material';
// utils
import { fNumber } from '../../../../utils/formatNumber';
// @types
import { Profile } from '../../../../@types/user';

// ----------------------------------------------------------------------

type Props = {
  profile: Profile;
};

export default function ProfileFollowInfo({ profile }: Props) {
  
  return (
    <Card sx={{ py: 3 }}>
      <Stack
        direction='row'
        divider={<Divider orientation='vertical' flexItem />}
      >
        <Stack width={1} textAlign='center'>
          <Typography variant='h4'>{fNumber(profile?.totalDoctors)}</Typography>
          <Typography variant='body2' sx={{ color: 'text.secondary' }}>
            Total Patients
          </Typography>
        </Stack>

        <Stack width={1} textAlign='center'>
          <Typography variant='h4'>{fNumber(profile?.totalPatients)}</Typography>
          <Typography variant='body2' sx={{ color: 'text.secondary' }}>
            Total Doctors
          </Typography>
        </Stack>
      </Stack>
    </Card>
  );
}
