import { useEffect, useState } from 'react';
// next
import { useRouter } from 'next/router';
// @mui
import { Card, Container } from '@mui/material';
// redux
import { useDispatch } from '../../../redux/store';
import { getConversations, getContacts } from '../../../redux/slices/chat';
// routes
import { PATH_DASHBOARD } from '../../../routes/paths';
// hooks
import useSettings from '../../../hooks/useSettings';
import { useSnackbar } from 'notistack';
// layouts
import Layout from '../../../layouts';
// components
import Page from '../../../components/Page';
import HeaderBreadcrumbs from '../../../components/HeaderBreadcrumbs';
// sections
import { ChatWindow } from '../../../sections/@dashboard/chat';
// utils
import axiosInstance from '../../../utils/axios';
// types
import { VisitCardProps } from '../../../@types/user';

// ----------------------------------------------------------------------

Chat.getLayout = function getLayout(page: React.ReactElement) {
  return <Layout>{page}</Layout>;
};

// ----------------------------------------------------------------------

export default function Chat() {
  const { themeStretch } = useSettings();
  const dispatch = useDispatch();
  const router = useRouter();
  const { id } = router.query;
  const { enqueueSnackbar } = useSnackbar();

  const [visitData, setVisitData] = useState<VisitCardProps | null>(null);
  const [loading, setLoading] = useState(false);

  /**
   * Fetches a visit by ID from the URL
   * @returns Promise<VisitCardProps | null>
   */
  async function fetchVisitById(): Promise<VisitCardProps | null> {
    if (!id || typeof id !== 'string') {
      console.error('Invalid visit ID');
      return null;
    }

    try {
      setLoading(true);
      const res = await axiosInstance.get(`/api/doctors/visit/${id}`);

      if (res.data.success && res.data.visit) {
        setVisitData(res.data.visit);
        return res.data.visit;
      } else {
        enqueueSnackbar(res.data.message || 'Failed to fetch visit', {
          variant: 'error',
        });
        return null;
      }
    } catch (error: any) {
      console.error('Failed to fetch visit data:', error);
      enqueueSnackbar(
        error?.response?.data?.message || 'Failed to fetch visit',
        {
          variant: 'error',
        }
      );
      setVisitData(null);
      return null;
    } finally {
      setLoading(false);
    }
  }

  // Fetch visit when ID is available
  useEffect(() => {
    if (id) {
      fetchVisitById();
    }
  }, [id]);

  return (
    <Page title='Chat'>
      <Container maxWidth={themeStretch ? false : 'xl'}>
        <HeaderBreadcrumbs
          heading='Chat'
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'Chat' },
            { name: 'Chat Details' },
          ]}
        />
        <Card sx={{ height: '72vh', display: 'flex' }}>
          {/* <ChatSidebar /> */}
          <ChatWindow visit={visitData} />
        </Card>
      </Container>
    </Page>
  );
}
