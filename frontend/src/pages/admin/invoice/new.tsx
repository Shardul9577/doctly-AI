// @mui
import { Container } from '@mui/material';
// routes
import { PATH_ADMIN_DASHBOARD } from '../../../routes/paths';
// hooks
import useSettings from '../../../hooks/useSettings';
// layouts
import Layout from '../../../layouts';
// components
import Page from '../../../components/Page';
import HeaderBreadcrumbs from '../../../components/HeaderBreadcrumbs';
// sections
import InvoiceNewEditForm from '../../../sections/@admin/invoice/new-edit-form';

// ----------------------------------------------------------------------

InvoiceCreate.getLayout = function getLayout(page: React.ReactElement) {
  return <Layout>{page}</Layout>;
};

// ----------------------------------------------------------------------

export default function InvoiceCreate() {
  const { themeStretch } = useSettings();

  return (
    <Page title="Invoices: Create a new invoice">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading="Create a new invoice"
          links={[
            { name: 'Dashboard', href: PATH_ADMIN_DASHBOARD.root },
            { name: 'Invoices', href: PATH_ADMIN_DASHBOARD.invoice.list },
            { name: 'New invoice' },
          ]}
        />

        <InvoiceNewEditForm />
      </Container>
    </Page>
  );
}
