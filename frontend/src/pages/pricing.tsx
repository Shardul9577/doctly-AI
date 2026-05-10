// @mui
import { styled } from '@mui/material/styles';
import {
  Box,
  Grid,
  Container,
  Typography,
  CircularProgress,
  Alert,
  Paper,
  Divider,
  Button,
} from '@mui/material';
import { useEffect, useState } from 'react';
import Link from 'next/link';
// layouts
import Layout from '../layouts';
// components
import Page from '../components/Page';
// sections
import { PricingPlanCard } from '../sections/pricing';
// services
import { plansService, Plan } from '../services/plans';
import Iconify from '../components/Iconify';
import { PATH_AUTH } from 'src/routes/paths';

// ----------------------------------------------------------------------

const RootStyle = styled('div')(({ theme }) => ({
  paddingTop: theme.spacing(8),
  paddingBottom: theme.spacing(8),
  backgroundColor: theme.palette.background.neutral,
  [theme.breakpoints.up('md')]: {
    paddingTop: theme.spacing(11),
  },
}));

const HeroSection = styled(Box)(({ theme }) => ({
  textAlign: 'center',
  marginBottom: theme.spacing(8),
  padding: theme.spacing(4, 0),
}));

const FeaturesSection = styled(Box)(({ theme }) => ({
  marginTop: theme.spacing(8),
  padding: theme.spacing(4, 0),
  backgroundColor: theme.palette.background.paper,
}));

// ----------------------------------------------------------------------

Pricing.getLayout = function getLayout(page: React.ReactElement) {
  return <Layout variant="main">{page}</Layout>;
};

// ----------------------------------------------------------------------

export default function Pricing() {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        setLoading(true);
        const response = await plansService.getAllPlans();
        if (response.status) {
          // Filter only active plans and sort by price
          const activePlans = response?.data?.plans || [];
          setPlans(activePlans);
        } else {
          setError(response.message || 'Failed to fetch plans');
        }
      } catch (err) {
        console.error('❌ Error fetching plans:', err);
        setError('Failed to load pricing plans. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchPlans();
  }, []);

  if (loading) {
    return (
      <Page title="Pricing">
        <RootStyle>
          <Container>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: '400px',
              }}
            >
              <CircularProgress />
            </Box>
          </Container>
        </RootStyle>
      </Page>
    );
  }

  if (error) {
    return (
      <Page title="Pricing">
        <RootStyle>
          <Container>
            <HeroSection>
              <Typography variant="h2" sx={{ mb: 2, color: 'text.primary' }}>
                Choose Your Plan
              </Typography>
              <Typography variant="h4" sx={{ color: 'text.secondary', mb: 3 }}>
                Simple Plans. Powerful Features. Better Care.
              </Typography>
            </HeroSection>
            <Alert severity="error" sx={{ mb: 4 }}>
              {error}
            </Alert>
          </Container>
        </RootStyle>
      </Page>
    );
  }

  return (
    <Page title="Pricing">
      <RootStyle>
        <Container>
          <HeroSection>
            <Typography
              variant="h2"
              sx={{
                mb: 2,
                color: 'text.primary',
                fontWeight: 'bold',
                fontSize: { xs: '2rem', md: '3rem' },
              }}
            >
              Choose Your Medical Practice Plan
            </Typography>
            <Typography
              variant="h5"
              sx={{
                color: 'text.secondary',
                mb: 3,
                maxWidth: 800,
                mx: 'auto',
                lineHeight: 1.6,
              }}
            >
              AI-powered features designed specifically for healthcare
              professionals. Streamline your practice and enhance patient care
              with our comprehensive solutions.
            </Typography>
            <Typography
              variant="body1"
              sx={{
                color: 'text.secondary',
                maxWidth: 600,
                mx: 'auto',
                opacity: 0.8,
              }}
            >
              Trusted by medical professionals across India
            </Typography>
          </HeroSection>

          <Box sx={{ mb: 6 }}>
            <Grid container spacing={3} justifyContent="center">
              {plans.map((plan, index) => (
                <Grid item xs={12} md={4} key={plan._id}>
                  <PricingPlanCard plan={plan} index={index} />
                </Grid>
              ))}
            </Grid>
          </Box>

          <FeaturesSection>
            <Container>
              <Box sx={{ textAlign: 'center', mb: 6 }}>
                <Typography
                  variant="h3"
                  sx={{
                    mb: 3,
                    fontWeight: 'bold',
                    color: 'text.primary',
                  }}
                >
                  Why Choose Our Platform?
                </Typography>
                <Typography
                  variant="h6"
                  sx={{
                    color: 'text.secondary',
                    maxWidth: 600,
                    mx: 'auto',
                  }}
                >
                  Built specifically for healthcare professionals with security,
                  compliance, and efficiency in mind
                </Typography>
              </Box>

              <Grid container spacing={4}>
                <Grid item xs={12} md={4}>
                  <Paper sx={{ p: 3, textAlign: 'center', height: '100%' }}>
                    <Box sx={{ mb: 2 }}>
                      <Iconify
                        icon="eva:shield-fill"
                        width={48}
                        height={48}
                        color="#2196F3"
                      />
                    </Box>
                    <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
                      HIPAA Compliant
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{ color: 'text.secondary' }}
                    >
                      Your patient data is protected with enterprise-grade
                      security and HIPAA compliance standards.
                    </Typography>
                  </Paper>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Paper sx={{ p: 3, textAlign: 'center', height: '100%' }}>
                    <Box sx={{ mb: 2 }}>
                      <Iconify
                        icon="eva:smartphone-fill"
                        width={48}
                        height={48}
                        color="#4CAF50"
                      />
                    </Box>
                    <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
                      Mobile First
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{ color: 'text.secondary' }}
                    >
                      Access your practice data anywhere, anytime with our
                      mobile-optimized platform.
                    </Typography>
                  </Paper>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Paper sx={{ p: 3, textAlign: 'center', height: '100%' }}>
                    <Box sx={{ mb: 2 }}>
                      <Iconify
                        icon="eva:headphones-fill"
                        width={48}
                        height={48}
                        color="#FF9800"
                      />
                    </Box>
                    <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
                      24/7 Support
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{ color: 'text.secondary' }}
                    >
                      Get help whenever you need it with our dedicated medical
                      practice support team.
                    </Typography>
                  </Paper>
                </Grid>
              </Grid>
            </Container>
          </FeaturesSection>

          <Box sx={{ mt: 8, textAlign: 'center' }}>
            <Typography variant="h5" sx={{ mb: 2, fontWeight: 'bold' }}>
              Ready to Transform Your Practice?
            </Typography>
            <Typography variant="body1" sx={{ color: 'text.secondary', mb: 3 }}>
              Join thousands of healthcare professionals who trust our platform
            </Typography>
            <Link href={PATH_AUTH.register} passHref>
              <Button
                variant="contained"
                size="large"
                sx={{
                  px: 4,
                  py: 1.5,
                  fontSize: '1.1rem',
                  fontWeight: 'bold',
                  borderRadius: 2,
                  textTransform: 'none',
                }}
              >
                Start Free Trial
              </Button>
            </Link>
          </Box>
        </Container>
      </RootStyle>
    </Page>
  );
}
