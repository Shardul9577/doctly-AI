import NextLink from 'next/link';
import { Card, CardHeader, Grid, Button, CardProps } from '@mui/material';
import Iconify from '../../../components/Iconify';
import { PATH_PATIENT_DASHBOARD } from '../../../routes/paths';

const ACTIONS = [
  {
    label: 'Find doctors',
    icon: 'eva:search-fill',
    path: PATH_PATIENT_DASHBOARD.visits.doctorList,
    color: 'primary' as const,
  },
  {
    label: 'My visits',
    icon: 'eva:calendar-fill',
    path: PATH_PATIENT_DASHBOARD.visits.list,
    color: 'info' as const,
  },
  {
    label: 'My doctors',
    icon: 'solar:stethoscope-bold',
    path: PATH_PATIENT_DASHBOARD.user.myDoctors,
    color: 'success' as const,
  },
  {
    label: 'Health profile',
    icon: 'eva:person-fill',
    path: PATH_PATIENT_DASHBOARD.user.profile,
    color: 'warning' as const,
  },
];

export default function PatientQuickActions({ ...other }: CardProps) {
  return (
    <Card {...other}>
      <CardHeader title="Quick actions" subheader="Manage your care" />
      <Grid container spacing={2} sx={{ p: 2.5, pt: 0 }}>
        {ACTIONS.map((action) => (
          <Grid item xs={6} sm={3} key={action.label}>
            <NextLink href={action.path} passHref>
              <Button
                fullWidth
                variant="outlined"
                color={action.color}
                component="a"
                startIcon={<Iconify icon={action.icon} />}
                sx={{ py: 1.5, flexDirection: { xs: 'column', sm: 'row' }, gap: 0.5 }}
              >
                {action.label}
              </Button>
            </NextLink>
          </Grid>
        ))}
      </Grid>
    </Card>
  );
}
