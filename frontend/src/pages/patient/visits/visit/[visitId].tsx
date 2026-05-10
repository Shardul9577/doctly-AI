import { sentenceCase } from 'change-case';
import { useEffect, useState } from 'react';
// next
import { useRouter } from 'next/router';
// @mui
import {
  Box,
  alpha,
  styled,
  Grid,
  Container,
  Typography,
  CircularProgress,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
// redux
import { useDispatch } from 'src/redux/store';
// routes
import { PATH_PATIENT_DASHBOARD } from '../../../../routes/paths';
// hooks
import useSettings from '../../../../hooks/useSettings';
// layouts
import Layout from '../../../../layouts';
// components
import Page from '../../../../components/Page';
import HeaderBreadcrumbs from '../../../../components/HeaderBreadcrumbs';
// sections
import VisitViewPage from '../../../../sections/@patient/general/Inspect/VisitViewPage';

import axiosInstance from 'src/utils/axios';
import { VisitCardProps } from '../../../../@types/user';

// ----------------------------------------------------------------------

VisitDetails.getLayout = function getLayout(page: React.ReactElement) {
  return <Layout>{page}</Layout>;
};

// ----------------------------------------------------------------------

export default function VisitDetails() {
  const { themeStretch } = useSettings();
  const dispatch = useDispatch();
  const theme = useTheme();
  const { query } = useRouter();

  const { visitId } = query;

  const [visitData, setVisitData] = useState<VisitCardProps | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  async function fetchData() {
    try {
      setLoading(true);
      const res = await axiosInstance.get(`/api/patients/visit/${visitId}`);
      setVisitData(res.data.visit);
      setError(false);
    } catch (err) {
      console.error('Failed to fetch visit data:', err);
      setVisitData(null);
      setError(true);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (visitId) {
      fetchData();
    }
  }, [visitId]);

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

  if (error) {
    return (
      <Page title='Visit : Failed to Load'>
        <Container maxWidth={themeStretch ? false : 'lg'}>
          <Typography variant='h4' sx={{ mt: 5 }}>
            Failed to load visit details. Please try again.
          </Typography>
        </Container>
      </Page>
    );
  }

  if (!visitData) {
    return (
      <Page title='Visit : Visit Not Found'>
        <Container maxWidth={themeStretch ? false : 'lg'}>
          <Typography variant='h4' sx={{ mt: 5 }}>
            Visit not found.
          </Typography>
        </Container>
      </Page>
    );
  }

  const patientFirstName =
    visitData?.doctor_patient_relations_id?.patient_id?.firstName || 'Visit';

  return (
    <Page title='Visit : Visit Details'>
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading='Visit Details'
          links={[
            { name: 'Dashboard', href: PATH_PATIENT_DASHBOARD.root },
            {
              name: 'Visits',
              href: PATH_PATIENT_DASHBOARD.visits.root,
            },
            { name: sentenceCase(patientFirstName) },
          ]}
        />
        <Grid container spacing={3}>
          <Grid item xs={12} md={12}>
            <VisitViewPage visit={visitData} />
          </Grid>
        </Grid>
      </Container>
    </Page>
  );
}
