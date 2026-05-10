// next
import { useRouter } from 'next/router';
// @mui
import { Container } from '@mui/material';
// routes
import { PATH_ADMIN_DASHBOARD } from '../../../../routes/paths';
// hooks
import useSettings from '../../../../hooks/useSettings';
// layouts
import Layout from '../../../../layouts';
// _mock_
import { _invoices } from '../../../../_mock';
// components
import Page from '../../../../components/Page';
import HeaderBreadcrumbs from '../../../../components/HeaderBreadcrumbs';
// sections
import InvoiceNewEditForm from '../../../../sections/@admin/invoice/new-edit-form';

// ----------------------------------------------------------------------

InvoiceEdit.getLayout = function getLayout(page: React.ReactElement) {
  return <Layout>{page}</Layout>;
};

// ----------------------------------------------------------------------

export default function InvoiceEdit() {
  const { themeStretch } = useSettings();

  const { query } = useRouter();

  const { id } = query;

  const currentInvoice = _invoices.find((invoice) => invoice.id === id) as any;

  return (
    <Page title="Invoice: Edit">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading="Edit invoice"
          links={[
            { name: 'Dashboard', href: PATH_ADMIN_DASHBOARD.root },
            { name: 'Invoices', href: PATH_ADMIN_DASHBOARD.invoice.list },
            { name: `INV-${currentInvoice?.invoiceNumber}` || '' },
          ]}
        />

        <InvoiceNewEditForm isEdit currentInvoice={currentInvoice} />
      </Container>
    </Page>
  );
}
