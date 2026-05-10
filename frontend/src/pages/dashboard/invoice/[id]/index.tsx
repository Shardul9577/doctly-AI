// next
import { useRouter } from 'next/router';
// @mui
import { Container } from '@mui/material';
// routes
import { PATH_DASHBOARD } from '../../../../routes/paths';
// _mock_
import { _invoices } from '../../../../_mock';
// hooks
import useSettings from '../../../../hooks/useSettings';
// layouts
import Layout from '../../../../layouts';
// components
import Page from '../../../../components/Page';
import HeaderBreadcrumbs from '../../../../components/HeaderBreadcrumbs';
// sections
import Invoice from '../../../../sections/@admin/invoice/details';
import axiosInstance from 'src/utils/axios';
import { useEffect, useState } from 'react';
import { CircularProgress, Box } from '@mui/material';

// ----------------------------------------------------------------------

InvoiceDetails.getLayout = function getLayout(page: React.ReactElement) {
  return <Layout>{page}</Layout>;
};

// ----------------------------------------------------------------------

export default function InvoiceDetails() {
  const { themeStretch } = useSettings();

  const { query } = useRouter();

  const { id } = query;

  let [data, setData] = useState(null);

  async function fetchInvoice() {
    try {
      let res = await axiosInstance(`/api/payments/invoice/${id}`);

      setData(res?.data?.data);
    } catch (error) {
      console.error(error.message);
    }
  }

  useEffect(() => {
    fetchInvoice();
  }, []);

  return (
    <Page title="Invoice: View">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading="Invoice Details"
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            {
              name: 'Invoices',
            },
            { name: `${id}` || '' },
          ]}
        />

        {data ? (
          <Invoice invoice={data} />
        ) : (
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            minHeight="300px"
          >
            <CircularProgress />
          </Box>
        )}
      </Container>
    </Page>
  );
}
