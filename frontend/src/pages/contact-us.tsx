// @mui
import { styled } from '@mui/material/styles';
import { Grid, Container, Box } from '@mui/material';
// layouts
import Layout from '../layouts';
// _mock
import { _mapContact } from '../_mock';
// components
import Page from '../components/Page';
// sections
import { ContactHero, ContactForm } from '../sections/contact';

// ----------------------------------------------------------------------

const RootStyle = styled('div')(({ theme }) => ({
  paddingTop: theme.spacing(8),
  [theme.breakpoints.up('md')]: {
    paddingTop: theme.spacing(11),
  },
}));

// ----------------------------------------------------------------------

Contact.getLayout = function getLayout(page: React.ReactElement) {
  return <Layout variant="main">{page}</Layout>;
};

// ----------------------------------------------------------------------

export default function Contact() {
  return (
    <Page title="Contact us">
      <RootStyle>
        <ContactHero />

        <Container sx={{ my: 10 }}>
          {/* Contact Form - Full Width */}
          <ContactForm />
        </Container>
      </RootStyle>
    </Page>
  );
}
