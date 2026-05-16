// @mui
import { useTheme } from '@mui/material/styles';
import {
  Container,
  Grid,
  Box,
  CircularProgress,
  Alert,
  Button,
} from '@mui/material';
import NextLink from 'next/link';
// hooks
import useSettings from '../../hooks/useSettings';
import useDoctorDashboard from '../../hooks/useDoctorDashboard';
// layouts
import Layout from '../../layouts';
// components
import Page from '../../components/Page';
// sections
import {
  AppWelcome,
  AppWidgetSummary,
  AppCurrentDownload,
} from '../../sections/@dashboard/general/app';
import { AnalyticsWebsiteVisits } from '../../sections/@dashboard/general/analytics';
import {
  DoctorRecentVisitsTable,
  DoctorQuickActions,
} from '../../sections/@dashboard/doctor';
import { PATH_DASHBOARD } from '../../routes/paths';
// assets
import { DocIllustration } from '../../assets';

// ----------------------------------------------------------------------

GeneralApp.getLayout = function getLayout(page: React.ReactElement) {
  return <Layout>{page}</Layout>;
};

// ----------------------------------------------------------------------

export default function GeneralApp() {
  const theme = useTheme();
  const { themeStretch } = useSettings();
  const { loading, error, stats } = useDoctorDashboard();

  const userStringData =
    typeof window !== 'undefined' ? localStorage.getItem('userData') : null;
  const user = userStringData ? JSON.parse(userStringData) : null;

  const formatName = (name?: string) => {
    if (!name) return '';
    return name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
  };

  const doctorName = [formatName(user?.firstName), formatName(user?.lastName)]
    .filter(Boolean)
    .join(' ');

  const statusChart =
    stats.statusBreakdown.length > 0
      ? stats.statusBreakdown
      : [{ label: 'No data', value: 1 }];

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
              title={`Welcome back${doctorName ? `,\nDr. ${doctorName}` : ''}`}
              description="Your practice at a glance — patients, visits, and care delivery in one place."
              img={
                <DocIllustration
                  sx={{
                    p: 3,
                    width: 320,
                    margin: { xs: 'auto', md: 'inherit' },
                  }}
                />
              }
              action={
                <NextLink href={PATH_DASHBOARD.visits.new} passHref>
                  <Button variant="contained" component="a">
                    Schedule visit
                  </Button>
                </NextLink>
              }
            />
          </Grid>

          <Grid item xs={12}>
            <DoctorQuickActions />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <AppWidgetSummary
              title="Total patients"
              percent={stats.patientTrendPercent}
              total={stats.totalPatients}
              chartColor={theme.palette.primary.main}
              chartData={stats.patientSparkline}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <AppWidgetSummary
              title="Total visits"
              percent={stats.visitTrendPercent}
              total={stats.totalVisits}
              chartColor={theme.palette.info.main}
              chartData={stats.visitSparkline}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <AppWidgetSummary
              title="Today's visits"
              percent={0}
              total={stats.todayVisits}
              chartColor={theme.palette.success.main}
              chartData={stats.visitSparkline}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <AppWidgetSummary
              title="Pending visits"
              percent={0}
              total={stats.pendingVisits}
              chartColor={theme.palette.warning.main}
              chartData={stats.visitSparkline}
            />
          </Grid>

          <Grid item xs={12} md={5} lg={4}>
            <AppCurrentDownload
              title="Visits by status"
              subheader="Current distribution"
              chartColors={statusColors}
              chartData={statusChart}
            />
          </Grid>

          <Grid item xs={12} md={7} lg={8}>
            <AnalyticsWebsiteVisits
              title="Monthly visits"
              subheader="Last 6 months"
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

          <Grid item xs={12}>
            <DoctorRecentVisitsTable
              title="Recent visits"
              subheader="Latest patient appointments"
              visits={stats.recentVisits}
            />
          </Grid>
        </Grid>
      </Container>
    </Page>
  );
}
