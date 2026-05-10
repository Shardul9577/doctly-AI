import { useEffect, useState } from 'react';
import dayjs from 'dayjs';
// @mui
import {
  Table,
  Stack,
  Paper,
  TableRow,
  TableBody,
  TableCell,
  TableHead,
  Typography,
  TableContainer,
  Container,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Box,
  Chip,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

// hooks
import useSettings from 'src/hooks/useSettings';
// layouts
import Layout from 'src/layouts';
// components
import Page from 'src/components/Page';
import HeaderBreadcrumbs from 'src/components/HeaderBreadcrumbs';
import Label from 'src/components/Label';
import { sentenceCase } from 'change-case';
import axiosInstance from 'src/utils/axios';
import { useSnackbar } from 'notistack';

ApproveVisitByPatientPage.getLayout = function getLayout(
  page: React.ReactElement
) {
  return <Layout>{page}</Layout>;
};

type VisitItem = {
  _id: string;
  visit_date: string | Date;
  visit_time: string;
  duration?: string;
  status: string;
  doctor_patient_relations_id?: {
    _id: string;
    patient_id?: {
      firstName?: string;
      lastName?: string;
      phone?: string;
      abha_id?: string;
    };
  };
};

export default function ApproveVisitByPatientPage() {
  const { themeStretch } = useSettings();
  const theme = useTheme();
  const downSm = useMediaQuery(theme.breakpoints.down('sm'));
  const { enqueueSnackbar } = useSnackbar();

  const [visits, setVisits] = useState<VisitItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [confirm, setConfirm] = useState<{
    open: boolean;
    action: 'approve' | 'reject' | null;
    visitId: string | null;
  }>({ open: false, action: null, visitId: null });

  const fetchVisits = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get(
        '/api/doctors/visit/list/patient-visit-approval-today'
      );
      setVisits(res?.data?.visits || []);
    } catch (err) {
      console.error('Failed to fetch approvals:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenConfirm = (visitId: string, action: 'approve' | 'reject') => {
    setConfirm({ open: true, action, visitId });
  };

  const handleCloseConfirm = () =>
    setConfirm({ open: false, action: null, visitId: null });

  const handleConfirm = async () => {
    if (!confirm.visitId || !confirm.action) return;
    try {
      const endpoint =
        confirm.action === 'approve'
          ? `/api/doctors/visit/patient-visit-approval-today/${confirm.visitId}`
          : `/api/doctors/visit/patient-visit-rejection-today/${confirm.visitId}`;
      await axiosInstance.patch(endpoint);

      if (confirm.action === 'approve') {
        enqueueSnackbar('Visit approved successfully', {
          variant: 'success',
        });
      } else {
        enqueueSnackbar('Visit rejected successfully', {
          variant: 'error',
        });
      }

      handleCloseConfirm();
      fetchVisits();
    } catch (err) {
      console.error('Action failed:', err);
    }
  };

  useEffect(() => {
    fetchVisits();
  }, []);

  const isLight = theme.palette.mode === 'light';

  const formatTimeTo12Hour = (value?: string | Date | null) => {
    if (!value) return 'N/A';
    // If Date provided
    if (value instanceof Date) {
      return dayjs(value).format('hh:mm A');
    }
    const str = String(value);
    // Already contains AM/PM
    if (/am|pm/i.test(str)) {
      const parsed = dayjs(str, ['hh:mm A', 'h:mm A']);
      return parsed.isValid() ? parsed.format('hh:mm A') : str;
    }
    // Try common 24h patterns
    if (/^\d{1,2}:\d{2}(:\d{2})?$/.test(str)) {
      const [h, m] = str.split(':');
      const hour = parseInt(h, 10);
      const minutes = parseInt(m, 10);
      if (!isNaN(hour) && !isNaN(minutes)) {
        const period = hour >= 12 ? 'PM' : 'AM';
        const hour12 = ((hour + 11) % 12) + 1;
        const mm = String(minutes).padStart(2, '0');
        return `${String(hour12).padStart(2, '0')}:${mm} ${period}`;
      }
    }
    // ISO or other parseable
    const parsed = dayjs(str);
    return parsed.isValid() ? parsed.format('hh:mm A') : str;
  };

  return (
    <Page title='Visits: Approvals Today'>
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading='Patient Visit Approvals (Today)'
          links={[{ name: 'Visits' }, { name: 'Approvals' }]}
        />

        <TableContainer
          component={Paper}
          sx={{
            mt: 3,
            backgroundColor: theme.palette.background.paper,
            borderRadius: 3,
            boxShadow: theme.shadows[8],
            overflowX: 'auto',
            overflowY: 'hidden',
            border: `1px solid ${theme.palette.divider}`,
          }}
        >
          <Table stickyHeader sx={{ minWidth: 720 }}>
            <TableHead>
              <TableRow
                sx={{ backgroundColor: theme.palette.background.neutral }}
              >
                <TableCell sx={{ fontWeight: 700, fontSize: '0.875rem' }}>
                  Patient
                </TableCell>
                <TableCell sx={{ fontWeight: 700, fontSize: '0.875rem' }}>
                  Date
                </TableCell>
                <TableCell sx={{ fontWeight: 700, fontSize: '0.875rem' }}>
                  Time
                </TableCell>
                <TableCell sx={{ fontWeight: 700, fontSize: '0.875rem' }}>
                  Status
                </TableCell>
                <TableCell sx={{ fontWeight: 700, fontSize: '0.875rem' }}>
                  Phone
                </TableCell>
                <TableCell sx={{ fontWeight: 700, fontSize: '0.875rem' }}>
                  Duration
                </TableCell>
                <TableCell sx={{ fontWeight: 700, fontSize: '0.875rem' }}>
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {visits.length > 0 ? (
                visits.map((row) => (
                  <TableRow key={row._id}>
                    <TableCell sx={{ py: 2 }}>
                      <Stack direction='row' alignItems='center' spacing={2}>
                        <Box>
                          <Typography
                            variant='subtitle1'
                            sx={{ fontWeight: 600 }}
                          >
                            {row.doctor_patient_relations_id?.patient_id
                              ?.firstName &&
                            row.doctor_patient_relations_id?.patient_id
                              ?.lastName
                              ? `${row.doctor_patient_relations_id.patient_id.firstName} ${row.doctor_patient_relations_id.patient_id.lastName}`
                              : 'Unknown'}
                          </Typography>
                          <Typography
                            variant='caption'
                            sx={{ color: theme.palette.text.secondary }}
                          >
                            Abha ID:{' '}
                            {row.doctor_patient_relations_id?.patient_id
                              ?.abha_id || 'N/A'}
                          </Typography>
                        </Box>
                      </Stack>
                    </TableCell>

                    <TableCell sx={{ py: 2 }}>
                      <Box sx={{ textAlign: 'center' }}>
                        <Typography variant='body2' sx={{ fontWeight: 600 }}>
                          {row?.visit_date ? String(row.visit_date) : 'N/A'}
                        </Typography>
                      </Box>
                    </TableCell>

                    <TableCell sx={{ py: 2 }}>
                      <Box sx={{ textAlign: 'center' }}>
                        <Typography variant='body2' sx={{ fontWeight: 600 }}>
                          {formatTimeTo12Hour(row?.visit_time)}
                        </Typography>
                      </Box>
                    </TableCell>

                    <TableCell sx={{ py: 2 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                        <Label
                          variant={isLight ? 'ghost' : 'filled'}
                          color={
                            row.status === 'pending' ? 'warning' : 'success'
                          }
                          sx={{
                            px: 2,
                            py: 0.5,
                            borderRadius: 2,
                            fontWeight: 600,
                          }}
                        >
                          {sentenceCase(row.status) || 'None'}
                        </Label>
                      </Box>
                    </TableCell>

                    <TableCell sx={{ py: 2 }}>
                      <Box sx={{ textAlign: 'center' }}>
                        <Typography variant='body2'>
                          {row.doctor_patient_relations_id?.patient_id?.phone ||
                            'N/A'}
                        </Typography>
                      </Box>
                    </TableCell>

                    <TableCell sx={{ py: 2 }}>
                      <Box sx={{ textAlign: 'center' }}>
                        <Chip label={row.duration || 'N/A'} size='small' />
                      </Box>
                    </TableCell>

                    <TableCell sx={{ py: 2 }}>
                      <Stack direction='row' spacing={1}>
                        <Button
                          variant='contained'
                          color='success'
                          size={downSm ? 'small' : 'medium'}
                          onClick={() => handleOpenConfirm(row._id, 'approve')}
                        >
                          Approve
                        </Button>
                        <Button
                          variant='outlined'
                          color='error'
                          size={downSm ? 'small' : 'medium'}
                          onClick={() => handleOpenConfirm(row._id, 'reject')}
                        >
                          Reject
                        </Button>
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} align='center' sx={{ py: 8 }}>
                    <Typography
                      variant='h6'
                      sx={{ color: theme.palette.text.secondary }}
                    >
                      {loading ? 'Loading...' : 'No approvals for today'}
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        <Dialog
          open={confirm.open}
          onClose={handleCloseConfirm}
          fullWidth
          maxWidth='xs'
        >
          <DialogTitle>
            {confirm.action === 'approve' ? 'Approve Visit' : 'Reject Visit'}
          </DialogTitle>
          <DialogContent>
            <DialogContentText>
              {confirm.action === 'approve'
                ? 'Are you sure you want to approve this visit?'
                : 'Are you sure you want to reject this visit?'}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseConfirm}>Cancel</Button>
            <Button
              onClick={handleConfirm}
              variant='contained'
              color={confirm.action === 'approve' ? 'success' : 'error'}
            >
              {confirm.action === 'approve' ? 'Approve' : 'Reject'}
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Page>
  );
}
