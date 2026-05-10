import { sentenceCase } from 'change-case';
import { useEffect, useState } from 'react';
// next
import { useRouter } from 'next/router';
// @mui
import { alpha, styled } from '@mui/material/styles';
import { Box, Grid, Container, Typography } from '@mui/material';
// redux
import { useDispatch } from '../../../../redux/store';
// routes
import { PATH_DASHBOARD } from '../../../../routes/paths';
// hooks
import useSettings from '../../../../hooks/useSettings';
// layouts
import Layout from '../../../../layouts';
// components
import Page from '../../../../components/Page';
import HeaderBreadcrumbs from '../../../../components/HeaderBreadcrumbs';
import { useTheme } from '@mui/material/styles';
import { AnalyticsNewsUpdate } from '../../../../sections/@dashboard/general/analytics';
import { _analyticPost } from '../../../../_mock';
import VisitEditPage from '../../../../sections/@dashboard/Inspect/VisitEditPage';
import axiosInstance from 'src/utils/axios';
import { CircularProgress } from '@mui/material';
import { VisitCardProps } from '../../../../@types/user';

// ----------------------------------------------------------------------

const LabelStyle = styled(Typography)(({ theme }) => ({
  ...theme.typography.subtitle2,
  color: theme.palette.text.secondary,
  marginBottom: theme.spacing(1),
}));

const IconWrapperStyle = styled('div')(({ theme }) => ({
  margin: 'auto',
  display: 'flex',
  borderRadius: '50%',
  alignItems: 'center',
  width: theme.spacing(8),
  justifyContent: 'center',
  height: theme.spacing(8),
  marginBottom: theme.spacing(3),
  color: theme.palette.primary.main,
  backgroundColor: `${alpha(theme.palette.primary.main, 0.08)}`,
}));

// ----------------------------------------------------------------------

EcommerceProductDetails.getLayout = function getLayout(
  page: React.ReactElement
) {
  return <Layout>{page}</Layout>;
};

// ----------------------------------------------------------------------

export default function EcommerceProductDetails() {
  const { themeStretch } = useSettings();

  const dispatch = useDispatch();
  const theme = useTheme();

  const [value, setValue] = useState('1');

  const { query } = useRouter();

  const { name } = query;
  const [visitData, setVisitData] = useState<VisitCardProps | null>(null);
  const [loading, setLoading] = useState(true);

  async function fetchData() {
    try {
      setLoading(true);
      const res = await axiosInstance.get(`/api/doctors/visit/${name}`);
      setVisitData(res.data.visit);
    } catch (err) {
      console.error('Failed to fetch visit data:', err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchData();
  }, [name]);

  if (loading) {
    return (
      <Box
        display='flex'
        justifyContent='center'
        alignItems='center'
        height='200px'
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Page title='Visit : Visit Details'>
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading='Visit Details'
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            {
              name: 'Visits',
              href: PATH_DASHBOARD.visits.root,
            },
            {
              name: 'Visit',
              href: PATH_DASHBOARD.visits.detailed,
            },
            { name: sentenceCase(name as string) },
          ]}
        />

        <Grid container spacing={3}>
          {visitData && (
            <Grid item xs={12} md={12}>
              <AnalyticsNewsUpdate
                title='Current Health Update'
                list={_analyticPost}
                visit={visitData}
              />
            </Grid>
          )}

          <Grid item xs={12} md={12}>
            <VisitEditPage visit={visitData || undefined} />
          </Grid>
        </Grid>
      </Container>
    </Page>
  );
}
