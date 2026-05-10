import {
  Container,
  Box,
  TextField,
  Button,
  CircularProgress,
  Typography,
} from '@mui/material';
import _ from 'lodash';
import { PATH_ADMIN_DASHBOARD } from '../../../routes/paths';

import useSettings from '../../../hooks/useSettings';
import React from 'react';
import { _userCards } from '../../../_mock';

import Layout from '../../../layouts';

import Page from '../../../components/Page';
import HeaderBreadcrumbs from '../../../components/HeaderBreadcrumbs';
import RefundDocumentVerification from '../../../sections/@admin/payment/refundVerificationList';

UserCards.getLayout = function getLayout(page: React.ReactElement) {
  return <Layout>{page}</Layout>;
};

// ----------------------------------------------------------------------

export default function UserCards() {
  const { themeStretch } = useSettings();
  return (
    <Page title='Admin: Refund List'>
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading='Refund List'
          links={[
            { name: 'Dashboard', href: PATH_ADMIN_DASHBOARD.root },
            { name: 'Payment', href: '' },
            { name: 'Refund Verification' },
          ]}
        />

        <RefundDocumentVerification />
      </Container>
    </Page>
  );
}
