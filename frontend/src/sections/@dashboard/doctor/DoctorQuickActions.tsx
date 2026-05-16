import NextLink from 'next/link';
import { Card, CardHeader, Grid, Button, CardProps } from '@mui/material';
import Iconify from '../../../components/Iconify';
import { PATH_DASHBOARD } from '../../../routes/paths';

const ACTIONS = [
  {
    label: 'New visit',
    icon: 'eva:plus-fill',
    path: PATH_DASHBOARD.visits.new,
    color: 'primary' as const,
  },
  {
    label: 'My patients',
    icon: 'eva:people-fill',
    path: PATH_DASHBOARD.docPatient.list,
    color: 'info' as const,
  },
  {
    label: 'All visits',
    icon: 'eva:calendar-fill',
    path: PATH_DASHBOARD.visits.list,
    color: 'success' as const,
  },
  {
    label: 'Appointments',
    icon: 'eva:clock-fill',
    path: PATH_DASHBOARD.general.booking,
    color: 'warning' as const,
  },
];

export default function DoctorQuickActions({ ...other }: CardProps) {
  return (
    <Card {...other}>
      <CardHeader title="Quick actions" subheader="Common tasks" />
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
