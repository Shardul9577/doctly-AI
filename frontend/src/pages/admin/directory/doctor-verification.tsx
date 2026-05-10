import {
  Container,
  Box,
  TextField,
  Button,
  CircularProgress,
  Typography,
} from '@mui/material';
import _ from 'lodash';

import DoctorDocumentVerification from '../../../sections/@admin/user/doctorDocumentVerification/doctorDocumentVerification';
import { PATH_ADMIN_DASHBOARD } from '../../../routes/paths';

import useSettings from '../../../hooks/useSettings';
import React from 'react';
import { _userCards } from '../../../_mock';


import Layout from '../../../layouts';

import Page from '../../../components/Page';
import HeaderBreadcrumbs from '../../../components/HeaderBreadcrumbs';



UserCards.getLayout = function getLayout(page: React.ReactElement) {
  return <Layout>{page}</Layout>;
};

// ----------------------------------------------------------------------

export default function UserCards() {
  const { themeStretch } = useSettings();
  return (
    <Page title='User: Doctors-Verification'>
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading='Document Verification'
          links={[
            { name: 'Dashboard', href: PATH_ADMIN_DASHBOARD.root },
            { name: 'User', href: PATH_ADMIN_DASHBOARD.user.root },
            { name: 'Document Verification' },
          ]}
        />

        <DoctorDocumentVerification
          title='Doctor Verification Logs'
          subheader='All pending, approved, and rejected doctor verifications'
        />
      </Container>
    </Page>
  );
}
