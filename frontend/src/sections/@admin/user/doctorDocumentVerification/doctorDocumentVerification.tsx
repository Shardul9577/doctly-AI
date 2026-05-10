import { useState, useEffect, useCallback, SyntheticEvent } from 'react';
import { format } from 'date-fns';
import { sentenceCase } from 'change-case';
import { useTheme } from '@mui/material/styles';
import { useSnackbar } from 'notistack';
import {
  Box,
  Card,
  Table,
  Avatar,
  Button,
  Divider,
  MenuItem,
  TableRow,
  TableBody,
  TableCell,
  CardHeader,
  TablePagination,
  Typography,
  TableContainer,
  Modal,
  IconButton,
  Stack,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  CircularProgress,
  Alert,
  TextField,
  InputAdornment,
  Tab,
  Grid,
} from '@mui/material';
import { TabContext, TabList, TabPanel } from '@mui/lab';

import Label from '../../../../components/Label';
import Iconify from '../../../../components/Iconify';
import Scrollbar from '../../../../components/Scrollbar';
import { TableHeadCustom } from '../../../../components/table';
import EmployeeProfile from '../../../@dashboard/user/profile/ProfilePersonalCard';
import {
  Profile,
  ApiDoctorData,
  DoctorVerificationRowProps,
  DoctorDocumentVerificationProps,
  DoctorDetailsModalContentProps,
  DocumentContentProps,
  DoctorVerificationRowPropsWithRow,
} from '../../../../@types/admin';
import axiosInstance from '../../../../utils/axios';

import useDebounce from '../../../../hooks/useDebounce';

const DOCTOR_VERIFICATION_TABLE_LABELS = [
  { id: 'doctorDetails', label: 'Doctor Details' },
  { id: 'date', label: 'Registered Date' },
  { id: 'status', label: 'Status' },
  { id: 'viewDocument', label: 'Documents' },
  { id: 'actions', label: '' },
];
import { BACKEND_URL } from '../../../../config';

export default function DoctorDocumentVerification({
  title,
  subheader,
  ...other
}: DoctorDocumentVerificationProps) {
  const [doctorsForVerification, setDoctorsForVerification] = useState<
    DoctorVerificationRowProps[]
  >([]);
 
  const [isFetchingData, setIsFetchingData] = useState(true);

  const [hasFetchedOnce, setHasFetchedOnce] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { enqueueSnackbar } = useSnackbar();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalDocs, setTotalDocs] = useState(0);

  const [searchQuery, setSearchQuery] = useState('');
  const debouncedSearchQuery = useDebounce(searchQuery, 500);

  const [sortOrder, setSortOrder] = useState<'asc' | 'desc' | 'none'>('none');

  const [currentDoctorInModal, setCurrentDoctorInModal] =
    useState<ApiDoctorData | null>(null);
  const [openDocumentModal, setOpenDocumentModal] = useState(false);

  const API_ENDPOINT = `${BACKEND_URL}/api/admin/doctors/document-verification`;

  const fetchDoctors = useCallback(async () => {
    setIsFetchingData(true);
    setError(null);
    try {
      const url = new URL(API_ENDPOINT);
      url.searchParams.append('page', (page + 1).toString());
      url.searchParams.append('limit', rowsPerPage.toString());
      if (debouncedSearchQuery) {
        url.searchParams.append('search', debouncedSearchQuery);
      }
      if (sortOrder && sortOrder !== 'none') {
        url.searchParams.append('sortBy', 'firstName');
        url.searchParams.append('sortOrder', sortOrder);
      } else {
        url.searchParams.append('sortBy', 'createdAt');
        url.searchParams.append('sortOrder', 'desc');
      }

      const response = await axiosInstance.get(url.toString());
      const result = response?.data;

      if (result.status && Array.isArray(result.data)) {
        const transformedData: DoctorVerificationRowProps[] = result.data.map(
          (doc: ApiDoctorData) => ({
            id: doc._id,
            specialization: doc?.personal_details?.specialization,
            doctorName: `${doc?.firstName} ${doc?.lastName}`,
            avatar: doc?.profile_picture || null,
            date: new Date(doc?.createdAt).getTime(),
            status: doc?.personal_details?.verified_status,
            degreeUrl: doc?.personal_details?.degree_url,
            aadhaarCardUrl: doc?.personal_details?.aadhaar_card_url,
            panCardUrl: doc?.personal_details?.pan_card_url,
            email: doc?.email,
            phone: doc?.phone,
            licenseNumber: doc?.personal_details?.license_number,
            qualification: doc?.personal_details?.qualification,
            fullApiData: doc,
          })
        );
        setDoctorsForVerification(transformedData);
        setTotalDocs(result?.pagination?.totalDocs);
      } else {
        enqueueSnackbar(
          result.message || 'Failed to fetch doctors for verification.',
          { variant: 'error' }
        );
        
        if (doctorsForVerification.length === 0) {
          setError(
            result.message || 'Failed to fetch doctors. Please try again.'
          );
        }
      }
    } catch (err) {
      console.error('Error fetching doctors:', err);
      enqueueSnackbar(
        (err as Error).message ||
          'Failed to load doctor data. Please try again.',
        { variant: 'error' }
      );
      
      if (doctorsForVerification.length === 0) {
        setError(
          (err as Error).message ||
            'Failed to load doctor data. Please try again.'
        );
      }
    } finally {
      setIsFetchingData(false);
      setHasFetchedOnce(true); 
    }
  }, [
    page,
    rowsPerPage,
    debouncedSearchQuery,
    sortOrder,
    enqueueSnackbar,
    API_ENDPOINT,
    doctorsForVerification.length, 
  ]);

  useEffect(() => {
    fetchDoctors(); 
  }, [fetchDoctors]);

  const onChangePage = (
    event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number
  ) => {
    setPage(newPage);
  };

  const onChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setRowsPerPage(parseInt(event?.target?.value, 10));
    setPage(0);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event?.target?.value);
    setPage(0);
  };

  const handleSortToggle = () => {
    setSortOrder((prevSortOrder) => {
      if (prevSortOrder === 'asc') return 'desc';
      if (prevSortOrder === 'desc') return 'none';
      return 'asc';
    });
    setPage(0);
  };

  const handleOpenDoctorModal = (doctorData: ApiDoctorData) => {
    setCurrentDoctorInModal(doctorData);
    setOpenDocumentModal(true);
  };

  const handleCloseDoctorModal = () => {
    setOpenDocumentModal(false);
    setCurrentDoctorInModal(null);
  };

  
  const showNoDataMessage =
    hasFetchedOnce &&
    !isFetchingData &&
    doctorsForVerification.length === 0 &&
    !error;

  const showInitialSimpleLoader =
    !hasFetchedOnce && isFetchingData && doctorsForVerification.length === 0;

  return (
    <Box sx={{ p: { xs: 2, sm: 3 } }}>
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        spacing={2}
        sx={{ mb: 3 }}
        alignItems='center'
        justifyContent='space-between'
      >
        <TextField
          fullWidth
          value={searchQuery}
          onChange={handleSearchChange}
          placeholder='Search Doctor by Name'
          InputProps={{
            startAdornment: (
              <InputAdornment position='start'>
                <Iconify
                  icon={'eva:search-fill'}
                  sx={{ color: 'text.disabled' }}
                />
              </InputAdornment>
            ),
          }}
          sx={{ maxWidth: { sm: 360 } }}
        />
        <Button
          variant='contained'
          onClick={handleSortToggle}
          endIcon={
            sortOrder === 'asc' ? (
              <Iconify icon={'eva:arrow-up-fill'} />
            ) : sortOrder === 'desc' ? (
              <Iconify icon={'eva:arrow-down-fill'} />
            ) : (
              <Iconify icon={'eva:swap-vertical-fill'} />
            )
          }
        >
          Sort By Name
        </Button>
      </Stack>

      <Card {...other}>
        <CardHeader
          title='Doctor Verification Logs'
          subheader='All pending, approved, and rejected doctor verifications'
          sx={{ mb: 3 }}
        />

        {/* Display simple loading indicator only if no data has been fetched yet and a fetch is in progress */}
        {showInitialSimpleLoader && (
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              minHeight: 200,
            }}
          >
            <CircularProgress />
            <Typography variant='h6' sx={{ ml: 2 }}>
              Fetching doctors...
            </Typography>
          </Box>
        )}

        {/* Display error message if there's an error and no data is currently displayed */}
        {error && doctorsForVerification.length === 0 && (
          <Alert severity='error' sx={{ mx: 3, my: 2 }}>
            {error}
          </Alert>
        )}

        {/* Display "No doctors found" message if fetch completed, no data, and no error */}
        {showNoDataMessage && (
          <Typography
            variant='subtitle1'
            sx={{ p: 3, textAlign: 'center', color: 'text.secondary' }}
          >
            No doctors found matching your criteria.
          </Typography>
        )}

        {/* Always render table structure if there are doctors or if we've fetched before and might have data */}
        {(doctorsForVerification.length > 0 ||
          (hasFetchedOnce &&
            !showNoDataMessage &&
            !showInitialSimpleLoader)) && (
          <>
            <Scrollbar>
              <TableContainer sx={{ minWidth: 720, position: 'relative' }}>
                {/* This spinner overlays on top of the table content when fetching new data */}
                {isFetchingData && doctorsForVerification.length > 0 && (
                  <Box
                    sx={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      bgcolor: 'rgba(255, 255, 255, 0.4)', 
                      zIndex: 1,
                    }}
                  >
                    <CircularProgress size={30} />
                  </Box>
                )}
                <Table>
                  <TableHeadCustom
                    headLabel={DOCTOR_VERIFICATION_TABLE_LABELS}
                  />
                  <TableBody>
                    {doctorsForVerification.map((row) => (
                      <DoctorVerificationRow
                        key={row.id}
                        row={row}
                        fullDoctorData={row.fullApiData}
                        refreshData={fetchDoctors}
                        onViewDetails={handleOpenDoctorModal}
                      />
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Scrollbar>

            <Divider />

            <Box sx={{ position: 'relative' }}>
              <TablePagination
                rowsPerPageOptions={[1, 10, 25]}
                component='div'
                count={totalDocs}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={onChangePage}
                onRowsPerPageChange={onChangeRowsPerPage}
              />
            </Box>
          </>
        )}
      </Card>

      <Modal
        open={openDocumentModal}
        onClose={handleCloseDoctorModal}
        aria-labelledby='document-viewer-modal-title'
        aria-describedby='document-viewer-modal-description'
      >
        <>
          {' '}
          {currentDoctorInModal ? (
            <DoctorDetailsModalContent
              doctorData={currentDoctorInModal}
              onClose={handleCloseDoctorModal}
              refreshData={fetchDoctors}
            />
          ) : (
            <Box
              sx={{
                position: 'absolute' as 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                p: 4,
                bgcolor: 'background.paper',
                borderRadius: 1,
              }}
            >
              <CircularProgress />
              <Typography variant='subtitle1' sx={{ mt: 2 }}>
                Loading doctor details...
              </Typography>
            </Box>
          )}
        </>
      </Modal>
    </Box>
  );
}

function DoctorDetailsModalContent({
  doctorData,
  onClose,
  refreshData,
}: DoctorDetailsModalContentProps) {
  const theme = useTheme();
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [actionType, setActionType] = useState<'approve' | 'reject' | null>(
    null
  );
  const [rejectionReason, setRejectionReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentTab, setCurrentTab] = useState('1');

  const isImageUrl = (url: string): boolean => {
    if (!url) return false;
    return /\.(jpeg|jpg|gif|png|webp|avif|tiff|bmp)$/i.test(url.split('?')[0]);
  };

  const isPdfUrl = (url: string): boolean => {
    if (!url) return false;
    return /\.pdf$/i.test(url.split('?')[0]);
  };

  const DocumentContent = ({ url, label }: DocumentContentProps) => {
    if (!url) {
      return (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100%',
            py: 4,
            textAlign: 'center',
            bgcolor: 'grey.50',
            borderRadius: '8px',
            border: '2px dashed',
            borderColor: 'grey.400',
            color: 'text.disabled',
            opacity: 0.8,
          }}
        >
          <Iconify
            icon={'eva:alert-circle-outline'}
            width={48}
            height={48}
            sx={{ mb: 2, color: 'warning.dark' }}
          />
          <Typography variant='subtitle1' sx={{ fontWeight: 'bold' }}>
            {label} - Not Available
          </Typography>
          <Typography variant='body2' sx={{ mt: 0.5 }}>
            This document has not been provided by the doctor.
          </Typography>
        </Box>
      );
    }

    return (
      <Box sx={{ display: 'flex', flexDirection: 'column' }}>
        <Box
          sx={{
            flexGrow: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'auto',
            bgcolor: 'grey.100',
            borderRadius: '8px',
            p: 3,
            border: '1px solid',
            borderColor: 'divider',
          }}
        >
          {isPdfUrl(url) ? (
            <iframe
              src={url}
              title={label}
              width='100%'
              height='100%'
              style={{ border: 'none', minHeight: 'inherit' }}
              onError={(e) =>
                console.error(`Error loading PDF for ${label}:`, e)
              }
            />
          ) : isImageUrl(url) ? (
            <img
              src={url}
              alt={label}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'contain',
                display: 'block',
              }}
              onError={(e) =>
                console.error(`Error loading image for ${label}:`, e)
              }
            />
          ) : (
            <Box sx={{ textAlign: 'center', p: 3 }}>
              <Iconify
                icon={'eva:alert-triangle-outline'}
                width={48}
                height={48}
                sx={{ color: 'warning.main', mb: 2 }}
              />
              <Typography variant='subtitle1'>Unsupported File Type</Typography>
              <Typography variant='body2' color='text.secondary'>
                This document type cannot be previewed. Please use the download
                option.
              </Typography>
            </Box>
          )}
        </Box>
        <Button
          variant='contained'
          color='primary'
          startIcon={<Iconify icon={'eva:download-fill'} />}
          href={url}
          target='_blank'
          rel='noopener noreferrer'
          download
          sx={{ mt: 2, alignSelf: 'center', width: 'fit-content' }}
        >
          Download {label}
        </Button>
      </Box>
    );
  };
  const handleOpenConfirmDialog = (type: 'approve' | 'reject') => {
    setActionType(type);
    setOpenConfirmDialog(true);
  };
  const handleCloseConfirmDialog = () => {
    setOpenConfirmDialog(false);
    setActionType(null);
    setRejectionReason('');
  };
  const handleConfirmAction = async () => {
    if (!actionType) return;

    setIsSubmitting(true);
    try {
      const response = await axiosInstance.patch(
        `/api/admin/doctors/${doctorData._id}/verify`,
        {
          action: actionType,
          rejectionReason: actionType === 'reject' ? rejectionReason : null,
        }
      );
      handleCloseConfirmDialog();
      onClose();
      refreshData();
    } catch (error) {
      console.error(`Error ${actionType}ing doctor:`, error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderActionButtons = () => {
    if (
      doctorData.personal_details.verified_status === 'pending' ||
      doctorData.personal_details.verified_status === 'rejected'
    ) {
      return (
        <Stack
          direction='row'
          spacing={2}
          justifyContent='flex-end'
          sx={{ mt: 3, pt: 2, borderTop: '1px solid', borderColor: 'divider' }}
        >
          <Button
            variant='contained'
            color='success'
            startIcon={<Iconify icon={'eva:checkmark-circle-2-fill'} />}
            onClick={() => handleOpenConfirmDialog('approve')}
            disabled={isSubmitting}
          >
            Approve
          </Button>
          <Button
            variant='contained'
            color='error'
            startIcon={<Iconify icon={'eva:close-circle-fill'} />}
            onClick={() => handleOpenConfirmDialog('reject')}
            disabled={isSubmitting}
          >
            Reject
          </Button>
        </Stack>
      );
    }
    return (
      <Typography
        variant='body2'
        sx={{
          color: 'text.secondary',
          textAlign: 'right',
          mt: 3,
          pt: 2,
          borderTop: '1px solid',
          borderColor: 'divider',
        }}
      >
        Status: {sentenceCase(doctorData.personal_details.verified_status)}
        <Box component='span' sx={{ display: 'block', mt: 0.5 }}>
          Reason: {doctorData.personal_details.rejection_reason}
        </Box>
      </Typography>
    );
  };

  const handleTabChange = (event: SyntheticEvent, newValue: string) => {
    setCurrentTab(newValue);
  };

  const employeeProfileData: Profile = {
    abha_id: doctorData?.abha_id || 'N/A',
    about: doctorData?.about || 'N/A',
    profile_picture: doctorData?.profile_picture || '',
    social_links: doctorData?.social_links || {
      facebook: '',
      instagram: '',
      linkedin: '',
      twitter: '',
    },
    download_images: {
      degree_url: doctorData?.personal_details?.degree_url || '',
      aadhaar_card_url: doctorData?.personal_details?.aadhaar_card_url || '',
      pan_card_url: doctorData?.personal_details?.pan_card_url || '',
    },
    organization_info: doctorData?.organizations?.[0]
      ? {
          organization_name: doctorData?.organizations[0]?.name || 'N/A',
          organization_id:
            doctorData.organizations[0]?._id?.toString() || 'N/A',
          organization_email: doctorData?.organizations[0]?.email || 'N/A',
          organization_type: doctorData?.organizations[0]?.type || 'N/A',
          organization_phone: doctorData?.organizations[0]?.phone || 'N/A',
          is_active: doctorData?.organizations[0]?.is_active ?? false,
          is_individual: doctorData?.organizations[0]?.is_individual ?? false,
          organization_address:
            doctorData?.organizations[0]?.organization_address || 'N/A',
          organization_people: [],
        }
      : {
          organization_name: 'N/A',
          organization_id: 'N/A',
          organization_email: 'N/A',
          organization_people: [],
          organization_type: 'N/A',
          organization_phone: 'N/A',
          is_active: false,
          is_individual: false,
          organization_address: 'N/A',
        },
    personal_info: {
      fullName: `${doctorData?.firstName || ''} ${doctorData?.lastName || ''}`,
      email: doctorData?.email || 'N/A',
      phone: doctorData?.phone || 'N/A',
      age: doctorData?.personal_details?.age || 0,
      gender: doctorData?.gender || 'N/A',
      birth_date: doctorData?.birth_date || 'N/A',
      blood_group: doctorData?.blood_group || 'N/A',
      marital_status: doctorData?.marital_status || 'N/A',
      spouse_full_name: doctorData?.spouse_full_name || 'N/A',
      personal_address: doctorData?.personal_address || 'N/A',
    },
    qualification_info: doctorData?.qualification_info || {
      languages: [],
      license_number: doctorData?.personal_details?.license_number,
      medical_school: '',
      specialization: doctorData?.personal_details?.specialization,
      qualification: doctorData?.personal_details?.qualification,
    },
  };

  return (
    <Box
      sx={{
        position: 'absolute' as 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: { xs: '95%', sm: 800, md: 900 },
        maxHeight: '90vh',
        display: 'flex',
        flexDirection: 'column',
        bgcolor: 'background.paper',
        borderRadius: '8px',
        boxShadow: theme.customShadows.z20,
        outline: 'none',
      }}
    >
      <Stack
        direction='row'
        alignItems='center'
        justifyContent='space-between'
        sx={{
          p: 3,
          borderBottom: '1px solid',
          borderColor: 'divider',
          flexShrink: 0,
        }}
      >
        <Typography
          id='document-viewer-modal-title'
          variant='h5'
          component='h2'
          color='primary.main'
        >
          Details for {doctorData.firstName} {doctorData.lastName}
        </Typography>
        <IconButton onClick={onClose} sx={{ color: 'text.secondary' }}>
          <Iconify icon={'eva:close-fill'} width={24} height={24} />
        </IconButton>
      </Stack>

      <TabContext value={currentTab}>
        <Box
          sx={{
            borderBottom: 1,
            borderColor: 'divider',
            px: 3,
            bgcolor: 'background.paper',
          }}
        >
          <TabList
            onChange={handleTabChange}
            aria-label='document and profile tabs'
            variant='fullWidth'
          >
            <Tab label='Degree Certificate' value='1' />
            <Tab label='Aadhaar Card' value='2' />
            <Tab label='PAN Card' value='3' />
            <Tab label='Full Profile' value='4' />
          </TabList>
        </Box>
        <Box
          sx={{
            flexGrow: 1,
            p: { xs: 2, sm: 3 },
            overflowY: 'auto',
            msOverflowStyle: 'none',
            scrollbarWidth: 'none',
            '&::-webkit-scrollbar': {
              display: 'none',
            },
          }}
        >
          <TabPanel value='1' sx={{ p: 0 }}>
            <DocumentContent
              url={doctorData.personal_details.degree_url}
              label='Degree Certificate'
            />
          </TabPanel>
          <TabPanel value='2' sx={{ p: 0 }}>
            <DocumentContent
              url={doctorData.personal_details.aadhaar_card_url}
              label='Aadhaar Card'
            />
          </TabPanel>
          <TabPanel value='3' sx={{ p: 0 }}>
            <DocumentContent
              url={doctorData.personal_details.pan_card_url}
              label='PAN Card'
            />
          </TabPanel>

          <TabPanel value='4' sx={{ p: 0 }}>
            <EmployeeProfile profile={employeeProfileData} />

            <Typography variant='h6' sx={{ mt: 3, mb: 2 }}>
              Verification Specifics
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Typography variant='body2' sx={{ color: 'text.secondary' }}>
                  License Number:
                </Typography>
                <Typography variant='subtitle2'>
                  {doctorData.personal_details.license_number || 'N/A'}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant='body2' sx={{ color: 'text.secondary' }}>
                  Specialization:
                </Typography>
                <Typography variant='subtitle2'>
                  {doctorData.personal_details.specialization || 'N/A'}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant='body2' sx={{ color: 'text.secondary' }}>
                  Qualification:
                </Typography>
                <Typography variant='subtitle2'>
                  {doctorData.personal_details.qualification || 'N/A'}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant='body2' sx={{ color: 'text.secondary' }}>
                  Registered On:
                </Typography>
                <Typography variant='subtitle2'>
                  {format(new Date(doctorData.createdAt), 'dd MMM yyyy, p')}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant='body2' sx={{ color: 'text.secondary' }}>
                  Verification Status:
                </Typography>
                <Label
                  variant={theme.palette.mode === 'light' ? 'ghost' : 'filled'}
                  color={
                    (doctorData.personal_details.verified_status ===
                      'verified' &&
                      'success') ||
                    (doctorData.personal_details.verified_status ===
                      'pending' &&
                      'warning') ||
                    'error'
                  }
                >
                  {sentenceCase(doctorData.personal_details.verified_status)}
                </Label>
              </Grid>
              {doctorData.personal_details.verified_status === 'rejected' &&
                doctorData.personal_details.rejection_reason && (
                  <Grid item xs={12} sm={6}>
                    <Typography variant='body2' sx={{ color: 'error.main' }}>
                      Rejection Reason:
                    </Typography>
                    <Typography
                      variant='subtitle2'
                      sx={{ color: 'error.main' }}
                    >
                      {doctorData?.personal_details?.rejection_reason}
                    </Typography>
                  </Grid>
                )}
            </Grid>
          </TabPanel>
        </Box>
      </TabContext>

      <Box
        sx={{
          p: 3,
          borderTop: '1px solid',
          borderColor: 'divider',
          flexShrink: 0,
          bgcolor: 'background.paper',
        }}
      >
        {renderActionButtons()}
      </Box>
      <Dialog
        open={openConfirmDialog}
        onClose={handleCloseConfirmDialog}
        aria-labelledby='confirm-dialog-title'
        aria-describedby='confirm-dialog-description'
      >
        <DialogTitle id='confirm-dialog-title'>
          {actionType === 'approve' ? 'Confirm Approval' : 'Confirm Rejection'}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id='confirm-dialog-description'>
            Are you sure you want to {actionType} the verification for{' '}
            <strong>
              {doctorData.firstName} {doctorData.lastName}
            </strong>
            ? This action cannot be undone.
          </DialogContentText>
          {actionType === 'reject' && (
            <Box sx={{ mt: 2 }}>
              <Typography variant='subtitle2' gutterBottom>
                Reason for Rejection (Optional):
              </Typography>
              <TextField
                multiline
                rows={3}
                fullWidth
                variant='outlined'
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder='Enter reason for rejection...'
              />
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleCloseConfirmDialog}
            color='inherit'
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            onClick={handleConfirmAction}
            color={actionType === 'approve' ? 'success' : 'error'}
            variant='contained'
            autoFocus
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <CircularProgress size={24} />
            ) : actionType === 'approve' ? (
              'Approve'
            ) : (
              'Reject'
            )}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

function DoctorVerificationRow({
  row,
  fullDoctorData,
  refreshData,
  onViewDetails,
}: DoctorVerificationRowPropsWithRow) {
  const theme = useTheme();
  const isLight = theme.palette.mode === 'light';

  const [openMenu, setOpenMenuActions] = useState<HTMLElement | null>(null);

  const handleOpenMenu = (event: React.MouseEvent<HTMLElement>) => {
    setOpenMenuActions(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setOpenMenuActions(null);
  };

  const handleViewDocument = () => {
    onViewDetails(fullDoctorData);
    handleCloseMenu();
  };

  const renderTableMoreMenuActions = () => {
    if (row.status === 'pending' || row.status === 'rejected') {
      return (
        <>
          <MenuItem
            onClick={() => {
              handleViewDocument();
            }}
            sx={{ color: 'text.secondary' }}
          >
            <Iconify icon={'eva:checkmark-circle-2-outline'} />
            Approve (View Docs)
          </MenuItem>

          <MenuItem
            onClick={() => {
              handleViewDocument();
            }}
            sx={{ color: 'error.main' }}
          >
            <Iconify icon={'eva:close-circle-outline'} />
            Reject (View Docs)
          </MenuItem>
          <Divider sx={{ borderStyle: 'dashed' }} />
        </>
      );
    }
    return null;
  };

  return (
    <TableRow hover>
      <TableCell>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Box sx={{ position: 'relative' }}>
            <Avatar
              alt={row.doctorName}
              src={row.avatar || undefined}
              sx={{
                width: 48,
                height: 48,
                boxShadow: (theme) => theme.customShadows.z8,
              }}
            />
          </Box>
          <Box sx={{ ml: 2 }}>
            <Typography variant='subtitle2'>{row.doctorName}</Typography>
            <Typography variant='body2' sx={{ color: 'text.secondary' }}>
              {row.specialization} ({row.qualification})
            </Typography>
            <Typography variant='caption' sx={{ color: 'text.disabled' }}>
              {row.email} | {row.phone}
            </Typography>
          </Box>
        </Box>
      </TableCell>

      <TableCell>
        <Typography variant='subtitle2'>
          {format(new Date(row.date), 'dd MMM yyyy')}
        </Typography>
        <Typography variant='body2' sx={{ color: 'text.secondary' }}>
          {format(new Date(row.date), 'p')}
        </Typography>
      </TableCell>

      <TableCell>
        <Label
          variant={isLight ? 'ghost' : 'filled'}
          color={
            (row.status === 'verified' && 'success') ||
            (row.status === 'pending' && 'warning') ||
            'error'
          }
        >
          {sentenceCase(row.status)}
        </Label>
      </TableCell>

      <TableCell>
        <Button variant='outlined' size='small' onClick={handleViewDocument}>
          View Documents
        </Button>
      </TableCell>
    </TableRow>
  );
}
