// @mui
import { useTheme } from '@mui/material/styles';
import {
  Container,
  Grid,
  Box,
  Button,
  CircularProgress,
  Alert,
} from '@mui/material';
import NextLink from 'next/link';
// hooks
import useSettings from '../../hooks/useSettings';
import usePatientDashboard from '../../hooks/usePatientDashboard';
// layouts
import Layout from '../../layouts';
// components
import Page from '../../components/Page';
// sections
import {
  AppWelcome,
  AppWidgetSummary,
  AppCurrentDownload,
} from '../../sections/@patient/general/app';
import {
  AnalyticsWebsiteVisits,
  AnalyticsNewsUpdate,
} from '../../sections/@patient/general/analytics';
import {
  PatientRecentVisitsTable,
  PatientQuickActions,
} from '../../sections/@patient/dashboard';
import { PATH_PATIENT_DASHBOARD } from '../../routes/paths';
// assets
import { BookingIllustration } from '../../assets';

// ----------------------------------------------------------------------

GeneralApp.getLayout = function getLayout(page: React.ReactElement) {
  return <Layout>{page}</Layout>;
};

// ----------------------------------------------------------------------

export default function GeneralApp() {
  const theme = useTheme();
  const { themeStretch } = useSettings();
  const { loading, error, stats } = usePatientDashboard();

  const userStringData =
    typeof window !== 'undefined' ? localStorage.getItem('userData') : null;
  const user = userStringData ? JSON.parse(userStringData) : null;

  const formatName = (name?: string) => {
    if (!name) return '';
    return name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
  };

  const patientName =
    user?.displayName ||
    [formatName(user?.firstName), formatName(user?.lastName)].filter(Boolean).join(' ') ||
    'there';

  const statusChart =
    stats.statusBreakdown.length > 0
      ? stats.statusBreakdown
      : [{ label: 'No visits yet', value: 1 }];

  const statusColors = [
    theme.palette.primary.main,
    theme.palette.info.main,
    theme.palette.warning.main,
    theme.palette.success.main,
    theme.palette.error.main,
  ];

  if (loading) {
    return (
      <Page title="Dashboard">
        <Container maxWidth={themeStretch ? false : 'xl'}>
          <Box sx={{ py: 12, display: 'flex', justifyContent: 'center' }}>
            <CircularProgress />
          </Box>
        </Container>
      </Page>
    );
  }

  return (
    <Page title="Dashboard">
      <Container maxWidth={themeStretch ? false : 'xl'}>
        {error && (
          <Alert severity="warning" sx={{ mb: 3 }}>
            {error}. Showing available data.
          </Alert>
        )}

        <Grid container spacing={3}>
          <Grid item xs={12}>
            <AppWelcome
              title={`Welcome back,\n${patientName}`}
              description="Track your visits, connect with doctors, and stay on top of your health records."
              img={
                <BookingIllustration
                  sx={{
                    p: 3,
                    width: 320,
                    margin: { xs: 'auto', md: 'inherit' },
                  }}
                />
              }
              action={
                <NextLink href={PATH_PATIENT_DASHBOARD.visits.doctorList} passHref>
                  <Button variant="contained" component="a">
                    Find a doctor
                  </Button>
                </NextLink>
              }
            />
          </Grid>

          <Grid item xs={12}>
            <PatientQuickActions />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <AppWidgetSummary
              title="Total visits"
              percent={stats.visitTrendPercent}
              total={stats.totalVisits}
              chartColor={theme.palette.primary.main}
              chartData={stats.visitSparkline}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <AppWidgetSummary
              title="My doctors"
              percent={0}
              total={stats.totalDoctors}
              chartColor={theme.palette.info.main}
              chartData={stats.visitSparkline}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <AppWidgetSummary
              title="Health reports"
              percent={0}
              total={stats.totalReports}
              chartColor={theme.palette.success.main}
              chartData={stats.visitSparkline}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <AppWidgetSummary
              title="Upcoming visits"
              percent={0}
              total={stats.upcomingVisits}
              chartColor={theme.palette.warning.main}
              chartData={stats.visitSparkline}
            />
          </Grid>

          <Grid item xs={12} md={5} lg={4}>
            <AppCurrentDownload
              title="Visits by status"
              subheader="Your appointment breakdown"
              chartColors={statusColors}
              chartData={statusChart}
            />
          </Grid>

          <Grid item xs={12} md={7} lg={8}>
            <AnalyticsWebsiteVisits
              title="Visit history"
              subheader="Monthly visits over the last 6 months"
              chartLabels={stats.monthlyVisits.labels}
              chartData={[
                {
                  name: 'Visits',
                  type: 'area',
                  fill: 'gradient',
                  data: stats.monthlyVisits.data,
                },
              ]}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <AnalyticsNewsUpdate
              title="Health updates"
              subheader="Recent visit summaries"
              list={stats.healthUpdates}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <PatientRecentVisitsTable
              title="Recent visits"
              subheader="Tap a row to view details"
              visits={stats.recentVisits}
            />
          </Grid>
        </Grid>
      </Container>
    </Page>
  );
}
