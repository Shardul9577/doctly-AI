import { useState, useEffect } from 'react';
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TablePagination,
  TableRow,
  Typography,
  CircularProgress,
  Tab,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Chip,
} from '@mui/material';
import { TabContext, TabList, TabPanel } from '@mui/lab';
import { TableHeadCustom } from '../../../components/table';
import axiosInstance from '../../../utils/axios';
import { BACKEND_URL } from '../../../config';
import { Divider, IconButton } from '@mui/material';
import {
  Payment,
  ReceiptLong,
  AttachMoney,
  NoteAlt,
  Person,
  Email,
  Phone,
  Close,
  CheckCircle,
  Error,
  HourglassEmpty,
  Info,
  AccountCircle,
  CurrencyRupee,
} from '@mui/icons-material';
import { alpha } from '@mui/material/styles';
import { useTheme } from '@mui/material/styles';
import { useSnackbar } from 'notistack';
import { TextField } from '@mui/material';

const REFUND_TABLE_LABELS = [
  { id: 'paymentId', label: 'Payment ID' },
  { id: 'orderId', label: 'Order ID' },
  { id: 'refundAmount', label: 'Refund Amount' },
  { id: 'status', label: 'Status' },
  { id: 'reason', label: 'Reason' },
  { id: 'initiatedBy', label: 'Initiated By' },
  { id: 'date', label: 'Date' },
];

const STATUS_TABS = ['all', 'initiated', 'processing', 'completed', 'failed'];

export default function RefundDocumentVerification() {
  const [tabValue, setTabValue] = useState('all');
  const [refundList, setRefundList] = useState([]);
  const [loading, setLoading] = useState(false);

  // pagination states from backend
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [total, setTotal] = useState(0);

  // modal state
  const [selectedRefund, setSelectedRefund] = useState<any | null>(null);
  const [rejectionReason, setRejectionReason] = useState<string>('');

  const theme = useTheme();
  let { enqueueSnackbar } = useSnackbar();

  // Fetch refunds based on status + pagination
  const fetchRefunds = async (
    refundStatus = '',
    currentPage = 1,
    limit = 10
  ) => {
    try {
      setLoading(true);
      const res = await axiosInstance.post(
        `${BACKEND_URL}/api/payments/refund-list`,
        { refundStatus, page: currentPage, limit }
      );

      setRefundList(res.data.data || []);
      setTotal(res.data.meta?.total || 0);
    } catch (error) {
      console.error('Error fetching refunds', error);
      setRefundList([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  };

  // On mount load "all" refunds
  useEffect(() => {
    fetchRefunds('', page + 1, rowsPerPage);
  }, []);

  // When tab changes → fetch new data
  const handleTabChange = (_: any, newValue: string) => {
    setTabValue(newValue);
    setPage(0);
    fetchRefunds(newValue === 'all' ? '' : newValue, 1, rowsPerPage);
  };

  // When page changes
  const handlePageChange = (_: any, newPage: number) => {
    setPage(newPage);
    fetchRefunds(tabValue === 'all' ? '' : tabValue, newPage + 1, rowsPerPage);
  };

  // When rowsPerPage changes
  const handleRowsPerPageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newLimit = parseInt(e.target.value, 10);
    setRowsPerPage(newLimit);
    setPage(0);
    fetchRefunds(tabValue === 'all' ? '' : tabValue, 1, newLimit);
  };

  // --- inside RefundDocumentVerification component ---
  const [rejectConfirmOpen, setRejectConfirmOpen] = useState(false);

  const handleReject = () => {
    setRejectConfirmOpen(true);
  };

  // --- inside RefundDocumentVerification component ---
  const [confirmOpen, setConfirmOpen] = useState(false);

  // Replace handleAccept to open confirm dialog
  const handleRefundAccept = () => {
    setConfirmOpen(true);
  };

  // Confirm refund handler
  const confirmRefund = async () => {
    if (!selectedRefund) return;
    await makeRefund(selectedRefund._id);
    setConfirmOpen(false);
    setSelectedRefund(null); // close main details modal
  };

  async function makeRefund(refundId: string) {
    try {
      const res = await axiosInstance.post('/api/payments/compelete-refund', {
        refund_id: refundId, // send refundId or other required data
      });

      if (res.data.success) {
        enqueueSnackbar(
          res.data.message || 'Refund completed successfully ✅',
          {
            variant: 'success',
          }
        );
        fetchRefunds();
      } else {
        enqueueSnackbar(res.data.message || 'Failed to complete refund ❌', {
          variant: 'error',
        });
      }

      return res.data;
    } catch (error: any) {
      console.error('Refund error:', error);
      enqueueSnackbar(error.message || 'Something went wrong ❌', {
        variant: 'error',
      });
      throw error;
    } finally {
      setConfirmOpen(false);
      setSelectedRefund(null);
    }
  }

  async function rejectRefund(refundId: string) {
    try {
      const res = await axiosInstance.post('/api/payments/reject-refund', {
        refund_id: refundId, // backend expects refund_id
        refundReason: rejectionReason,
      });

      const { success, message } = res.data;

      enqueueSnackbar(message || 'Refund rejected successfully ✅', {
        variant: 'success',
      });
      fetchRefunds(); // refresh refund list

      return res.data;
    } catch (error: any) {
      console.error('Refund error:', error);

      const errorMsg =
        error.response?.data?.message ||
        error.message ||
        'Something went wrong ❌';

      enqueueSnackbar(errorMsg, { variant: 'error' });

      throw error; // rethrow if needed
    } finally {
      setRejectConfirmOpen(false);
      setSelectedRefund(null);
    }
  }

  return (
    <Box sx={{ p: 2 }}>
      <TabContext value={tabValue}>
        <TabList
          onChange={handleTabChange}
          variant='scrollable'
          scrollButtons='auto'
          allowScrollButtonsMobile
        >
          {STATUS_TABS.map((status) => (
            <Tab
              key={status}
              label={
                status === 'all'
                  ? 'All'
                  : status.charAt(0).toUpperCase() + status.slice(1)
              }
              value={status}
            />
          ))}
        </TabList>

        <TabPanel value={tabValue}>
          {loading ? (
            <Box sx={{ textAlign: 'center', p: 3 }}>
              <CircularProgress />
            </Box>
          ) : refundList.length === 0 ? (
            <Typography
              variant='body2'
              sx={{ p: 2, textAlign: 'center', color: 'text.secondary' }}
            >
              There are no applications for refund
            </Typography>
          ) : (
            <TableContainer>
              <Table>
                <TableHeadCustom headLabel={REFUND_TABLE_LABELS} />
                <TableBody>
                  {refundList.map((row: any, index: number) => (
                    <TableRow
                      key={index}
                      sx={{
                        cursor: 'pointer',
                        borderRadius: 2,
                        backgroundColor: theme.palette.background.paper,
                        color: theme.palette.text.primary,
                        boxShadow: theme.palette.mode === 'dark' ? 2 : 1,
                        // No hover background color
                      }}
                      onClick={() => setSelectedRefund(row)}
                    >
                      <TableCell
                        sx={{
                          fontWeight: 500,
                          color: theme.palette.text.primary,
                        }}
                      >
                        {row.payment_id}
                      </TableCell>
                      <TableCell sx={{ color: theme.palette.text.primary }}>
                        {row.order_id}
                      </TableCell>
                      <TableCell
                        sx={{
                          color: theme.palette.success.main,
                          fontWeight: 600,
                        }}
                      >
                        ₹{(row.refund_amount / 100).toLocaleString('en-IN')}
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={
                            row.refund_status.charAt(0).toUpperCase() +
                            row.refund_status.slice(1)
                          }
                          color={
                            row.refund_status === 'completed'
                              ? 'success'
                              : row.refund_status === 'failed'
                              ? 'error'
                              : row.refund_status === 'processing'
                              ? 'warning'
                              : 'info'
                          }
                          variant='filled'
                          size='small'
                          sx={{ fontWeight: 600, letterSpacing: 0.5 }}
                        />
                      </TableCell>
                      <TableCell
                        sx={{
                          maxWidth: 180,
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          color: theme.palette.text.primary,
                        }}
                      >
                        {row.refund_reason}
                      </TableCell>
                      <TableCell>
                        <Box display='flex' alignItems='center' gap={1}>
                          <span
                            style={{
                              fontWeight: 500,
                              color: theme.palette.text.primary,
                            }}
                          >
                            {row.user?.firstName} {row.user?.lastName}
                          </span>
                        </Box>
                      </TableCell>
                      <TableCell sx={{ color: theme.palette.text.primary }}>
                        {new Date(row.createdAt).toLocaleDateString('en-IN', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <TablePagination
                component='div'
                count={total}
                page={page}
                onPageChange={handlePageChange}
                rowsPerPage={rowsPerPage}
                onRowsPerPageChange={handleRowsPerPageChange}
              />
            </TableContainer>
          )}
        </TabPanel>
      </TabContext>

      {/* Refund Details Modal */}
      <Dialog
        open={!!selectedRefund}
        onClose={() => setSelectedRefund(null)}
        fullWidth
        maxWidth='sm'
        PaperProps={{
          sx: {
            borderRadius: 4,
            boxShadow: 12,
            background: theme.palette.background.default,
            p: 0,
            overflow: 'visible',
          },
        }}
      >
        {/* Accent bar */}
        <Box
          sx={{
            height: 8,
            borderTopLeftRadius: 16,
            borderTopRightRadius: 16,
            background:
              selectedRefund?.refund_status === 'completed'
                ? `linear-gradient(90deg, ${
                    theme.palette.success.main
                  } 60%, ${alpha(theme.palette.success.light, 0.5)} 100%)`
                : selectedRefund?.refund_status === 'failed'
                ? `linear-gradient(90deg, ${
                    theme.palette.error.main
                  } 60%, ${alpha(theme.palette.error.light, 0.5)} 100%)`
                : selectedRefund?.refund_status === 'processing'
                ? `linear-gradient(90deg, ${
                    theme.palette.warning.main
                  } 60%, ${alpha(theme.palette.warning.light, 0.5)} 100%)`
                : `linear-gradient(90deg, ${
                    theme.palette.info.main
                  } 60%, ${alpha(theme.palette.info.light, 0.5)} 100%)`,
          }}
        />
        <DialogTitle
          sx={{
            fontWeight: 900,
            fontSize: 28,
            pb: 0,
            pt: 3,
            px: 4,
            letterSpacing: 1,
            textAlign: 'center',
            color: theme.palette.text.primary,
          }}
        >
          Refund Details
        </DialogTitle>
        <DialogContent
          dividers={false}
          sx={{
            background: 'transparent',
            minWidth: 420,
            borderRadius: 3,
            p: 0,
          }}
        >
          {selectedRefund && (
            <Box
              sx={{
                p: 0,
                mt: -4,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}
            >
              {/* Status Icon */}
              <Box
                sx={{
                  mt: -5,
                  mb: 2,
                  width: 72,
                  height: 72,
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: 3,
                  background:
                    selectedRefund.refund_status === 'completed'
                      ? alpha(theme.palette.success.main, 0.1)
                      : selectedRefund.refund_status === 'failed'
                      ? alpha(theme.palette.error.main, 0.1)
                      : selectedRefund.refund_status === 'processing'
                      ? alpha(theme.palette.warning.main, 0.1)
                      : alpha(theme.palette.info.main, 0.1),
                }}
              >
                {selectedRefund.refund_status === 'completed' && (
                  <CheckCircle color='success' sx={{ fontSize: 48 }} />
                )}
                {selectedRefund.refund_status === 'failed' && (
                  <Error color='error' sx={{ fontSize: 48 }} />
                )}
                {selectedRefund.refund_status === 'processing' && (
                  <HourglassEmpty color='warning' sx={{ fontSize: 48 }} />
                )}
                {selectedRefund.refund_status === 'initiated' && (
                  <Info color='info' sx={{ fontSize: 48 }} />
                )}
              </Box>
              {/* Status Chip */}
              <Chip
                label={
                  selectedRefund.refund_status.charAt(0).toUpperCase() +
                  selectedRefund.refund_status.slice(1)
                }
                color={
                  selectedRefund.refund_status === 'completed'
                    ? 'success'
                    : selectedRefund.refund_status === 'failed'
                    ? 'error'
                    : selectedRefund.refund_status === 'processing'
                    ? 'warning'
                    : 'info'
                }
                variant='filled'
                size='medium'
                sx={{
                  fontWeight: 700,
                  fontSize: 18,
                  px: 2,
                  py: 1,
                  borderRadius: 2,
                  letterSpacing: 1,
                  mb: 2,
                }}
              />
              {/* Amount */}
              <Box
                display='flex'
                alignItems='center'
                gap={1}
                mb={3}
                sx={{
                  background: alpha(theme.palette.success.main, 0.08),
                  borderRadius: 2,
                  px: 3,
                  py: 1,
                  width: 'fit-content',
                  boxShadow: 1,
                }}
              >
                <CurrencyRupee sx={{ color: 'success.main', fontSize: 32 }} />
                <Typography variant='h3' color='success.main' fontWeight={900}>
                  {(selectedRefund.refund_amount / 100).toLocaleString('en-IN')}
                </Typography>
              </Box>
              {/* Date */}
              <Typography variant='subtitle2' color='text.secondary' mb={2}>
                {new Date(selectedRefund.createdAt).toLocaleString('en-IN')}
              </Typography>
              {/* Main Card */}
              <Box
                sx={{
                  background: theme.palette.background.paper,
                  borderRadius: 3,
                  boxShadow: 2,
                  p: 3,
                  width: '100%',
                  maxWidth: 420,
                  mb: 2,
                }}
              >
                {/* Refund Info */}
                <Typography
                  variant='subtitle1'
                  fontWeight={700}
                  mb={1}
                  color='primary.dark'
                >
                  Refund Information
                </Typography>
                <Box
                  component='dl'
                  sx={{
                    display: 'grid',
                    gridTemplateColumns: 'max-content 1fr',
                    rowGap: 2,
                    columnGap: 3,
                    mb: 3,
                  }}
                >
                  <Typography
                    component='dt'
                    fontWeight={600}
                    color={theme.palette.text.primary}
                  >
                    Payment ID:
                  </Typography>
                  <Typography component='dd' color={theme.palette.text.primary}>
                    {selectedRefund.payment_id}
                  </Typography>
                  <Typography
                    component='dt'
                    fontWeight={600}
                    color={theme.palette.text.primary}
                  >
                    Order ID:
                  </Typography>
                  <Typography component='dd' color={theme.palette.text.primary}>
                    {selectedRefund.order_id}
                  </Typography>
                  <Typography
                    component='dt'
                    fontWeight={600}
                    color={theme.palette.text.primary}
                  >
                    Reason:
                  </Typography>
                  <Typography component='dd' color={theme.palette.text.primary}>
                    {selectedRefund.refund_reason}
                  </Typography>
                </Box>
                <Divider sx={{ my: 2 }} />
                {/* User Info */}
                <Typography
                  variant='subtitle1'
                  fontWeight={700}
                  mb={1}
                  color='primary.dark'
                >
                  <AccountCircle
                    sx={{
                      verticalAlign: 'middle',
                      mr: 1,
                      color: 'primary.main',
                    }}
                  />
                  User Information
                </Typography>
                <Box
                  component='dl'
                  sx={{
                    display: 'grid',
                    gridTemplateColumns: 'max-content 1fr',
                    rowGap: 2,
                    columnGap: 3,
                  }}
                >
                  <Typography
                    component='dt'
                    fontWeight={600}
                    color={theme.palette.text.primary}
                  >
                    Name:
                  </Typography>
                  <Typography component='dd' color={theme.palette.text.primary}>
                    {selectedRefund.user?.firstName}{' '}
                    {selectedRefund.user?.lastName}
                  </Typography>
                  <Typography
                    component='dt'
                    fontWeight={600}
                    color={theme.palette.text.primary}
                  >
                    Email:
                  </Typography>
                  <Typography component='dd' color={theme.palette.text.primary}>
                    {selectedRefund.user?.email}
                  </Typography>
                  <Typography
                    component='dt'
                    fontWeight={600}
                    color={theme.palette.text.primary}
                  >
                    Phone:
                  </Typography>
                  <Typography component='dd' color={theme.palette.text.primary}>
                    {selectedRefund.user?.phone}
                  </Typography>
                </Box>
              </Box>
            </Box>
          )}
        </DialogContent>
        {selectedRefund?.refund_status === 'initiated' && (
          <DialogActions sx={{ px: 4, pb: 3, pt: 2 }}>
            <Button
              onClick={handleReject}
              color='error'
              variant='outlined'
              sx={{
                minWidth: 120,
                fontWeight: 700,
                borderRadius: 2,
                boxShadow: 1,
                transition: 'transform 0.1s',
                '&:hover': { transform: 'scale(1.04)' },
              }}
            >
              Reject
            </Button>
            <Button
              onClick={handleRefundAccept}
              color='success'
              variant='contained'
              sx={{
                minWidth: 120,
                fontWeight: 700,
                borderRadius: 2,
                boxShadow: 2,
                transition: 'transform 0.1s',
                '&:hover': { transform: 'scale(1.04)' },
              }}
            >
              Accept
            </Button>
          </DialogActions>
        )}
      </Dialog>

      {/* Confirmation Modal */}
      <Dialog
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        maxWidth='xs'
        fullWidth
        PaperProps={{
          sx: { borderRadius: 3, boxShadow: 10, p: 2 },
        }}
      >
        <DialogTitle sx={{ fontWeight: 700, textAlign: 'center' }}>
          Confirm Refund
        </DialogTitle>
        <DialogContent sx={{ textAlign: 'center', py: 2 }}>
          <Typography variant='body1' color='text.secondary'>
            Are you sure you want to refund this payment?
          </Typography>
          <Typography variant='h6' fontWeight={700} color='success.main' mt={1}>
            ₹{(selectedRefund?.refund_amount / 100).toLocaleString('en-IN')}
          </Typography>
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'center', pb: 2 }}>
          <Button
            onClick={() => setConfirmOpen(false)}
            variant='outlined'
            color='inherit'
            sx={{ minWidth: 100 }}
          >
            Cancel
          </Button>
          <Button
            onClick={confirmRefund}
            variant='contained'
            color='success'
            sx={{ minWidth: 100 }}
          >
            Yes, Refund
          </Button>
        </DialogActions>
      </Dialog>

      {/* Rejection Confirmation Modal */}
      <Dialog
        open={rejectConfirmOpen}
        onClose={() => setRejectConfirmOpen(false)}
        maxWidth='xs'
        fullWidth
        PaperProps={{
          sx: { borderRadius: 3, boxShadow: 10, p: 2 },
        }}
      >
        <DialogTitle sx={{ fontWeight: 700, textAlign: 'center' }}>
          Reject Refund
        </DialogTitle>

        <DialogContent sx={{ textAlign: 'center', py: 2 }}>
          <Typography variant='body1' color='text.secondary' mb={2}>
            Please provide a reason for rejecting this refund:
          </Typography>

          <TextField
            fullWidth
            multiline
            rows={3}
            placeholder='Enter rejection reason...'
            value={rejectionReason}
            onChange={(e) => setRejectionReason(e.target.value)}
            error={!rejectionReason.trim()}
            helperText={
              !rejectionReason.trim() ? 'Rejection reason is required' : ''
            }
          />

          <Typography variant='h6' fontWeight={700} color='error.main' mt={2}>
            ₹{(selectedRefund?.refund_amount / 100).toLocaleString('en-IN')}
          </Typography>
        </DialogContent>

        <DialogActions sx={{ justifyContent: 'center', pb: 2 }}>
          <Button
            onClick={() => setConfirmOpen(false)}
            variant='outlined'
            color='inherit'
            sx={{ minWidth: 100 }}
          >
            Cancel
          </Button>
          <Button
            onClick={() => {
              if (rejectionReason.trim()) {
                rejectRefund(selectedRefund._id); // call your reject function
              }
            }}
            variant='contained'
            color='error'
            sx={{ minWidth: 100 }}
            disabled={!rejectionReason.trim()}
          >
            Reject
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
