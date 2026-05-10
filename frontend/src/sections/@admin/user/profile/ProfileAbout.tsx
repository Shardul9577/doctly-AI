// @mui
import { styled } from '@mui/material/styles';
import { Link, Card, Typography, CardHeader, Stack } from '@mui/material';
// @types
import { Profile } from '../../../../@types/user';
// components
import Iconify from '../../../../components/Iconify';

// ----------------------------------------------------------------------

const IconStyle = styled(Iconify)(({ theme }) => ({
  width: 20,
  height: 20,
  marginTop: 1,
  flexShrink: 0,
  marginRight: theme.spacing(2),
}));

// ----------------------------------------------------------------------

type Props = {
  profile: Profile;
};

export default function ProfileAbout({ profile }: Props) {
  // const { quote, country, email, role, company, school } = profile;

  return (
    <Card>
      <CardHeader title="About" />

      <Stack spacing={2} sx={{ p: 3 }}>
        <Typography variant="body2">{"2"}</Typography>

        <Stack direction="row">
          <IconStyle icon={'eva:pin-fill'} />
          <Typography variant="body2">
            Live at &nbsp;
            <Link component="span" variant="subtitle2" color="text.primary">
              {"2"}
            </Link>
          </Typography>
        </Stack>

        <Stack direction="row">
          <IconStyle icon={'eva:email-fill'} />
          <Typography variant="body2">{"2"}</Typography>
        </Stack>

        <Stack direction="row">
          <IconStyle icon={'ic:round-business-center'} />
          <Typography variant="body2">
            License Number is &nbsp;
            <Link component="span" variant="subtitle2" color="text.primary">
              DMC/12345/2025
            </Link>
          </Typography>
        </Stack>

        <Stack direction="row">
          <IconStyle icon={'ic:round-business-center'} />
          <Typography variant="body2">
            Specialization are &nbsp;
            <Link component="span" variant="subtitle2" color="text.primary">
              {"school"}
            </Link>
          </Typography>
        </Stack>

        <Stack direction="row">
          <IconStyle icon={'ic:round-business-center'} />
          <Typography variant="body2">
            Studied at &nbsp;
            <Link component="span" variant="subtitle2" color="text.primary">
              Medical School
            </Link>
          </Typography>
        </Stack>

        <Stack direction="row">
          <IconStyle icon={'ic:round-business-center'} />
          <Typography variant="body2">
            Languages I know &nbsp;
            <Link component="span" variant="subtitle2" color="text.primary">
              Hindi , English.
            </Link>
          </Typography>
        </Stack>

        <Stack direction="row">
          <IconStyle icon={'ic:round-business-center'} />
          <Typography variant="body2">
            My Degree - &nbsp;
            <Link component="span" variant="subtitle2" color="text.primary">
              https://www.google.com/
            </Link>
          </Typography>
        </Stack>

      </Stack>
    </Card>
  );
}
