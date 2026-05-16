// @mui
import { useTheme } from '@mui/material/styles';
import {
  Grid,
  Container,
  Typography,
  Box,
  CircularProgress,
  Alert,
} from '@mui/material';
// hooks
import useSettings from '../../hooks/useSettings';
import useDoctorDashboard from '../../hooks/useDoctorDashboard';
// layouts
import Layout from '../../layouts';
// components
import Page from '../../components/Page';
// sections
import {
  AnalyticsCurrentVisits,
  AnalyticsWebsiteVisits,
  AnalyticsConversionRates,
  AnalyticsWidgetSummary,
  AnalyticsOrderTimeline,
} from '../../sections/@dashboard/general/analytics';

// ----------------------------------------------------------------------

GeneralAnalytics.getLayout = function getLayout(page: React.ReactElement) {
  return <Layout>{page}</Layout>;
};

// ----------------------------------------------------------------------

export default function GeneralAnalytics() {
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
      : [{ label: 'No visits', value: 1 }];

  const typeChart =
    stats.visitTypeBreakdown.length > 0
      ? stats.visitTypeBreakdown
      : [{ label: 'Consultation', value: stats.totalVisits || 0 }];

  const diagnosisChart =
    stats.topDiagnoses.length > 0
      ? stats.topDiagnoses
      : [{ label: 'No diagnoses recorded yet', value: 0 }];

  const chartColors = [
    theme.palette.primary.main,
    theme.palette.info.main,
    theme.palette.warning.main,
    theme.palette.success.main,
    theme.palette.error.main,
  ];

  if (loading) {
    return (
      <Page title="Analytics">
        <Container maxWidth={themeStretch ? false : 'xl'}>
          <Box sx={{ py: 12, display: 'flex', justifyContent: 'center' }}>
            <CircularProgress />
          </Box>
        </Container>
      </Page>
    );
  }

  return (
    <Page title="Analytics">
      <Container maxWidth={themeStretch ? false : 'xl'}>
        <Typography variant="h4" sx={{ mb: 1 }}>
          Practice analytics
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
          {doctorName
            ? `Insights for Dr. ${doctorName}'s practice`
            : 'Visit trends, diagnoses, and patient activity'}
        </Typography>

        {error && (
          <Alert severity="warning" sx={{ mb: 3 }}>
            {error}. Showing available data.
          </Alert>
        )}

        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={3}>
            <AnalyticsWidgetSummary
              title="Total patients"
              total={stats.totalPatients}
              icon="solar:users-group-rounded-bold"
            />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <AnalyticsWidgetSummary
              title="Total visits"
              total={stats.totalVisits}
              color="info"
              icon="solar:calendar-bold"
            />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <AnalyticsWidgetSummary
              title="Completed"
              total={stats.completedVisits}
              color="success"
              icon="solar:check-circle-bold"
            />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <AnalyticsWidgetSummary
              title="Pending"
              total={stats.pendingVisits}
              color="warning"
              icon="solar:clock-circle-bold"
            />
          </Grid>

          <Grid item xs={12} lg={8}>
            <AnalyticsWebsiteVisits
              title="Visit volume trend"
              subheader="Monthly consultations over the last 6 months"
              chartLabels={stats.monthlyVisits.labels}
              chartData={[
                {
                  name: 'Visits',
                  type: 'area',
                  fill: 'gradient',
                  data: stats.monthlyVisits.data,
                },
                {
                  name: "Today's load",
                  type: 'line',
                  fill: 'solid',
                  data: stats.monthlyVisits.data.map((_, i, arr) =>
                    i === arr.length - 1 ? stats.todayVisits : 0
                  ),
                },
              ]}
            />
          </Grid>

          <Grid item xs={12} md={6} lg={4}>
            <AnalyticsCurrentVisits
              title="Visit status"
              subheader="Breakdown by current status"
              chartData={statusChart}
              chartColors={chartColors}
            />
          </Grid>

          <Grid item xs={12} md={6} lg={4}>
            <AnalyticsCurrentVisits
              title="Visit types"
              subheader="In-person, telehealth, and more"
              chartData={typeChart}
              chartColors={[
                theme.palette.chart.blue[0],
                theme.palette.chart.violet[0],
                theme.palette.chart.yellow[0],
                theme.palette.primary.main,
              ]}
            />
          </Grid>

          <Grid item xs={12} md={6} lg={8}>
            <AnalyticsConversionRates
              title="Top diagnoses"
              subheader={
                stats.topDiagnoses.length
                  ? 'Most recorded diagnoses across visits'
                  : 'Diagnoses will appear as you document visits'
              }
              chartData={diagnosisChart}
            />
          </Grid>

          <Grid item xs={12} md={6} lg={4}>
            <AnalyticsOrderTimeline
              title="Recent activity"
              subheader="Latest visit updates"
              list={stats.activityTimeline}
            />
          </Grid>
        </Grid>
      </Container>
    </Page>
  );
}
