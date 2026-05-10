import { useRouter } from 'next/router';
// layouts
import Layout from '../../../../layouts';
// components
import Page from '../../../../components/Page';
import HeaderBreadcrumbs from '../../../../components/HeaderBreadcrumbs';
// sections
import { ReportDetail } from '../../../../sections/@patient/user/profile';
// routes
import { PATH_PATIENT_DASHBOARD } from '../../../../routes/paths';

// ----------------------------------------------------------------------

ReportDetailPage.getLayout = function getLayout(page: React.ReactElement) {
  return <Layout>{page}</Layout>;
};

// ----------------------------------------------------------------------

export default function ReportDetailPage() {
  const router = useRouter();
  const { id } = router.query;

  return (
    <Page title='Report Details'>
      <HeaderBreadcrumbs
        heading='Report Details'
        links={[
          { name: 'Dashboard', href: PATH_PATIENT_DASHBOARD.root },
          { name: 'Profile', href: PATH_PATIENT_DASHBOARD.user.profile },
          { name: 'Report Details' },
        ]}
      />
      {id && typeof id === 'string' && <ReportDetail reportId={id} />}
    </Page>
  );
}
