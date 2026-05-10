// Updated Visit Form Page with validation and phone search support
import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/router';
import { useDispatch } from '../../../redux/store';
import { PATH_DASHBOARD } from '../../../routes/paths';
import useSettings from '../../../hooks/useSettings';
import Layout from '../../../layouts';
import Page from '../../../components/Page';
import HeaderBreadcrumbs from '../../../components/HeaderBreadcrumbs';
import axiosInstance from 'src/utils/axios';
import { useSnackbar } from 'notistack';
import * as yup from 'yup';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Avatar,
  TablePagination,
  Box,
  Grid,
  MenuItem,
  Container,
  Typography,
  Stepper,
  Step,
  StepLabel,
  TextField,
  Button,
  InputAdornment,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import Autocomplete from '@mui/material/Autocomplete';
import Chip from '@mui/material/Chip';
import dayjs from 'dayjs';
import { m, AnimatePresence } from 'framer-motion';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import Iconify from '../../../components/Iconify';

// ----------------------------------------------------------------------

type PatientItem = {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  abha_id?: string;
  profile_picture?: string;
  [key: string]: any;
};

EcommerceProductDetails.getLayout = function getLayout(page: any) {
  return <Layout>{page}</Layout>;
};

export default function EcommerceProductDetails() {
  /////////////////////////////////
  // General Section
  /////////////////////////////////

  const { themeStretch } = useSettings();
  const theme = useTheme();
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const iconColor = theme.palette.mode === 'dark' ? '#fff' : '#000';
  const dateInputRef = useRef<HTMLInputElement>(null);
  const timePickerRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const { id, name } = router.query;

  const [step, setStep] = useState(0);
  const [selectedPatientId, setSelectedPatientId] = useState('');
  const [selectedPatient, setSelectedPatient] = useState<PatientItem | null>(
    null,
  );
  const [patientsList, setPatientsList] = useState<PatientItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(0);
  const rowsPerPage = 10;
  const timeInputRef = useRef<HTMLInputElement>(null);
  const [newPatient, setNewPatient] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    age: '',
  });
  const [errorsState, setErrorsState] = useState({});
  const [inputErrors, setInputErrors] = useState({
    visitDate: '',
    visitTime: '',
    duration: '',
    visitType: '',
    caseFileType: '',
    symptoms: '',
    notes: '',
  });

  const schema = yup.object().shape({
    firstName: yup.string().required('First name is required'),
    lastName: yup.string().required('Last name is required'),
    email: yup.string().email('Invalid email').required('Email is required'),
    phone: yup.string().required('Phone is required'),
    address: yup.string().required('Address is required'),
    age: yup
      .number()
      .typeError('Age must be a number')
      .positive('Age must be greater than zero')
      .required('Age is required'),
  });
  let { push } = useRouter();

  const [formData, setFormData] = useState({
    patient_id: '',
    visitDate: '',
    visitTime: '',
    duration: '',
    visitType: '',
    caseFileType: '',
    symptoms: [], // ✅ should be an array for Autocomplete multiple
    notes: '',
  });

  /////////////////////////////////
  // Create New Patient
  /////////////////////////////////

  const fetchPatients = async () => {
    try {
      const response = await axiosInstance.get(
        `/api/doctors/patient/list?page=${page}&relation_status=true`,
      );
      setPatientsList(response?.data?.patients || []);
    } catch (error) {
      enqueueSnackbar('Failed to fetch patients', { variant: 'error' });
    }
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  const filteredPatients = patientsList.filter((p) =>
    `${p.firstName} ${p.lastName} ${p.phone || ''}`
      .toLowerCase()
      .includes(searchQuery.toLowerCase()),
  );

  const [open, setOpen] = useState(false);

  const [formsData, setFormsData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    age: '',
  });

  const [errors, setErrors] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    age: '',
  });

  const handleOpen = () => setOpen(true);

  const handleClose = () => {
    setFormsData({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      address: '',
      age: '',
    });
    setErrors({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      address: '',
      age: '',
    });
    setOpen(false);
  };

  const validateField = (field: string, value: string): string => {
    if (!value.trim()) return 'This field is required';

    if (field === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      return 'Invalid email address';
    }

    if (field === 'phone' && !/^\d{10}$/.test(value)) {
      return 'Phone must be 10 digits';
    }

    if (field === 'age' && (!/^\d+$/.test(value) || parseInt(value) <= 0)) {
      return 'Age must be a valid number';
    }

    return '';
  };

  const handleChange =
    (field: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
      const value = event.target.value;

      setFormsData((prev) => ({
        ...prev,
        [field]: value,
      }));

      setErrors((prev) => ({
        ...prev,
        [field]: validateField(field, value),
      }));
    };

  const isFormValid =
    Object.values(formsData).every((v) => v.trim() !== '') &&
    Object.values(errors).every((e) => e === '');

  const handleSubmit = async () => {
    const newErrors: any = {};
    let valid = true;

    Object.entries(formsData).forEach(([field, value]) => {
      const error = validateField(field, value);
      newErrors[field] = error;
      if (error) valid = false;
    });

    setErrors(newErrors);

    if (!valid) return;

    try {
      const response = await axiosInstance.post('/api/doctors/patient', {
        ...formsData, // pass as object
      });

      enqueueSnackbar(
        response.data.message || 'Patient created successfully!',
        { variant: 'success' },
      );
      fetchPatients();
      handleClose();
    } catch (error) {
      enqueueSnackbar(error.message, { variant: 'error' });
    }
  };

  /////////////////////////////////
  //  Create Visit Section
  /////////////////////////////////

  const isFormIncomplete = () => {
    return (
      !formData.patient_id ||
      !formData.visitDate ||
      !formData.visitTime ||
      !formData.visitType ||
      !formData.caseFileType ||
      !formData.duration ||
      formData.symptoms.length === 0
      // add more checks as needed
    );
  };

  function validateForm() {
    const errors: any = {};

    if (!formData.visitDate) errors.visitDate = 'Visit Date is required';
    if (!formData.visitTime) errors.visitTime = 'Visit Time is required';
    if (!formData.duration) errors.duration = 'Duration is required';
    if (!formData.visitType) errors.visitType = 'Visit Type is required';
    if (!formData.caseFileType)
      errors.caseFileType = 'Case File Type is required';
    if (!formData.symptoms || formData.symptoms.length === 0)
      errors.symptoms = 'At least one symptom is required';
    if (!formData.notes) errors.notes = 'Notes are required';

    setInputErrors(errors);

    return Object.keys(errors).length === 0;
  }

  async function finalSubmit() {
    const isValid = validateForm();

    if (!isValid) {
      enqueueSnackbar('Please fill all required fields.', { variant: 'error' });
      return;
    }

    try {
      const payload = {
        patient_id: formData.patient_id,
        visit_date: dayjs(formData.visitDate).format('DD/MM/YYYY'),
        visit_time: formData.visitTime,
        duration: formData.duration,
        visit_type: formData.visitType,
        case_file_type: formData.caseFileType,
        symptoms: formData.symptoms,
        notes: formData.notes,
      };

      const response = await axiosInstance.post('/api/doctors/visit', payload);

      enqueueSnackbar(
        response?.data?.message || 'Visit created successfully!',
        {
          variant: 'success',
        },
      );

      setFormData({
        patient_id: '',
        visitDate: '',
        visitTime: '',
        duration: '',
        visitType: '',
        caseFileType: '',
        symptoms: [],
        notes: '',
      });

      push('/dashboard/booking/');

      // Optional: reset form or redirect
      // resetForm();
      // router.push('/somewhere');
    } catch (error: any) {
      enqueueSnackbar(error?.message || 'Submission failed', {
        variant: 'error',
      });
    }
  }

  const handleVisitChange = (key: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  /////////////////////////////////
  //  Animation section
  /////////////////////////////////

  const [direction, setDirection] = useState<'forward' | 'backward'>('forward');

  const goToStep = (newStep: number) => {
    setDirection(newStep > step ? 'forward' : 'backward');
    setStep(newStep);
  };

  const slideVariants = {
    forward: {
      initial: { x: '100%', opacity: 0 },
      animate: { x: 0, opacity: 1 },
      exit: { x: '-100%', opacity: 0 },
    },
    backward: {
      initial: { x: '-100%', opacity: 0 },
      animate: { x: 0, opacity: 1 },
      exit: { x: '100%', opacity: 0 },
    },
  };

  useEffect(() => {
    if (id && name) {
      const patientId = Array.isArray(id) ? id[0] : id;
      setSelectedPatientId(patientId || '');
      // setSelectedPatient(patient);
      setFormData((prev) => ({
        ...prev,
        patient_id: patientId || '',
      }));
      setStep(1); // jump to step 1 if patient info exists
    }
  }, [id, name]);

  return (
    <Page title='Visit : Visit Details'>
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading='Visit Details'
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'Visits', href: PATH_DASHBOARD.visits.root },
            { name: 'Create Visit' },
          ]}
        />

        <Stepper activeStep={step} alternativeLabel sx={{ mb: 4 }}>
          {['Patient Details', 'Visit Details'].map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        <AnimatePresence>
          {step === 0 && (
            <m.div
              key='step-0'
              initial={slideVariants[direction].initial}
              animate={slideVariants[direction].animate}
              exit={slideVariants[direction].exit}
              transition={{ duration: 0.6, ease: [0.25, 0.8, 0.25, 1] }}
            >
              <Box>
                <Box sx={{ mb: 4 }}>
                  <Box
                    sx={{
                      display: 'flex',
                      flexDirection: { xs: 'column', sm: 'row' },
                      justifyContent: 'space-between',
                      alignItems: { xs: 'flex-start', sm: 'center' },
                      gap: 3,
                      p: 3,
                      borderRadius: 2,
                      bgcolor: 'background.neutral',
                      border: '1px solid',
                      borderColor: 'divider',
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Box
                        sx={{
                          width: 8,
                          height: 8,
                          borderRadius: '50%',
                          bgcolor: 'primary.main',
                          flexShrink: 0,
                        }}
                      />
                      <Typography
                        variant='h6'
                        sx={{
                          mb: 0,
                          flexShrink: 0,
                          fontWeight: 600,
                          color: 'text.primary',
                        }}
                      >
                        Select Patient
                      </Typography>
                    </Box>

                    <Box
                      sx={{
                        display: 'flex',
                        flexDirection: { xs: 'column', sm: 'row' },
                        alignItems: { xs: 'stretch', sm: 'center' },
                        gap: 2,
                        flex: { sm: 1 },
                        justifyContent: { sm: 'flex-end' },
                      }}
                    >
                      <TextField
                        label='Search Patient'
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        size='small'
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position='start'>
                              <Iconify
                                icon='eva:search-fill'
                                sx={{ color: 'text.disabled' }}
                              />
                            </InputAdornment>
                          ),
                        }}
                        sx={{
                          minWidth: { xs: '100%', sm: 280 },
                          maxWidth: { sm: 320 },
                          '& .MuiOutlinedInput-root': {
                            borderRadius: 2,
                            bgcolor: 'background.paper',
                            '&:hover': {
                              '& .MuiOutlinedInput-notchedOutline': {
                                borderColor: 'primary.main',
                              },
                            },
                          },
                        }}
                      />

                      <Button
                        variant='contained'
                        startIcon={<Iconify icon='eva:plus-fill' />}
                        onClick={handleOpen}
                        sx={{
                          minWidth: { xs: '100%', sm: 'auto' },
                          whiteSpace: 'nowrap',
                          borderRadius: 2,
                          px: 3,
                          py: 1,
                          fontWeight: 600,
                          textTransform: 'none',
                          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                          '&:hover': {
                            boxShadow: '0 6px 20px rgba(0,0,0,0.2)',
                            transform: 'translateY(-1px)',
                          },
                          transition: 'all 0.2s ease-in-out',
                        }}
                      >
                        Create New Patient
                      </Button>
                    </Box>
                  </Box>
                </Box>

                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TableContainer
                      component={Paper}
                      sx={{
                        borderRadius: 2,
                        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                        overflowX: 'auto', // horizontal scroll
                        border: '1px solid',
                        borderColor: 'divider',
                      }}
                    >
                      <Table stickyHeader sx={{ minWidth: 800 }}>
                        <TableHead>
                          <TableRow sx={{ bgcolor: 'background.neutral' }}>
                            <TableCell
                              sx={{ fontWeight: 600, color: 'text.primary' }}
                            >
                              Photo
                            </TableCell>
                            <TableCell
                              sx={{ fontWeight: 600, color: 'text.primary' }}
                            >
                              Full Name
                            </TableCell>
                            <TableCell
                              sx={{ fontWeight: 600, color: 'text.primary' }}
                            >
                              Abha ID
                            </TableCell>
                            <TableCell
                              sx={{ fontWeight: 600, color: 'text.primary' }}
                            >
                              Phone
                            </TableCell>
                            <TableCell
                              align='right'
                              sx={{ fontWeight: 600, color: 'text.primary' }}
                            >
                              Action
                            </TableCell>
                          </TableRow>
                        </TableHead>

                        <TableBody>
                          {filteredPatients.length === 0 ? (
                            <TableRow>
                              <TableCell
                                colSpan={5}
                                align='center'
                                sx={{ py: 8 }}
                              >
                                <Box
                                  sx={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    gap: 2,
                                  }}
                                >
                                  <Iconify
                                    icon='eva:people-outline'
                                    sx={{
                                      fontSize: 64,
                                      color: 'text.disabled',
                                      opacity: 0.5,
                                    }}
                                  />
                                  <Typography
                                    variant='h6'
                                    color='text.secondary'
                                    gutterBottom
                                  >
                                    No Patients Found
                                  </Typography>
                                  <Typography
                                    variant='body2'
                                    color='text.disabled'
                                    textAlign='center'
                                  >
                                    {searchQuery
                                      ? `No patients match your search "${searchQuery}". Try a different search term.`
                                      : 'No patients are available. Create a new patient to get started.'}
                                  </Typography>
                                  {!searchQuery && (
                                    <Button
                                      variant='contained'
                                      startIcon={
                                        <Iconify icon='eva:plus-fill' />
                                      }
                                      onClick={handleOpen}
                                      sx={{
                                        mt: 2,
                                        borderRadius: 2,
                                        px: 3,
                                        py: 1,
                                        fontWeight: 600,
                                        textTransform: 'none',
                                      }}
                                    >
                                      Create New Patient
                                    </Button>
                                  )}
                                </Box>
                              </TableCell>
                            </TableRow>
                          ) : (
                            filteredPatients
                              .slice(
                                page * rowsPerPage,
                                page * rowsPerPage + rowsPerPage,
                              )
                              .map((patient) => (
                                <TableRow
                                  key={patient._id}
                                  hover
                                  sx={{
                                    '&:hover': { bgcolor: 'action.hover' },
                                    '&:last-child td': { border: 0 },
                                  }}
                                >
                                  <TableCell>
                                    <Avatar
                                      src={patient.profile_picture || ''}
                                      sx={{
                                        width: 40,
                                        height: 40,
                                        border: '2px solid',
                                        borderColor: 'divider',
                                      }}
                                    />
                                  </TableCell>
                                  <TableCell>
                                    <Box>
                                      <Typography
                                        variant='subtitle2'
                                        sx={{ fontWeight: 600 }}
                                      >
                                        {patient.firstName} {patient.lastName}
                                      </Typography>
                                      <Typography
                                        variant='caption'
                                        color='text.secondary'
                                      >
                                        Patient ID: {patient._id?.slice(-8)}
                                      </Typography>
                                    </Box>
                                  </TableCell>
                                  <TableCell>
                                    <Chip
                                      label={patient.abha_id || 'Not Available'}
                                      size='small'
                                      variant={
                                        patient.abha_id ? 'filled' : 'outlined'
                                      }
                                      color={
                                        patient.abha_id ? 'primary' : 'default'
                                      }
                                      sx={{
                                        borderRadius: 1,
                                        fontSize: '0.75rem',
                                      }}
                                    />
                                  </TableCell>
                                  <TableCell>
                                    <Typography
                                      variant='body2'
                                      sx={{ fontFamily: 'monospace' }}
                                    >
                                      {patient.phone || 'Not Available'}
                                    </Typography>
                                  </TableCell>
                                  <TableCell align='right'>
                                    {selectedPatientId === patient._id ? (
                                      <Button
                                        variant='contained'
                                        color='error'
                                        size='small'
                                        onClick={() => {
                                          setSelectedPatientId('');
                                          setSelectedPatient(null);
                                          setFormData((prev) => ({
                                            ...prev,
                                            patient_id: '',
                                          }));
                                        }}
                                        sx={{
                                          borderRadius: 2,
                                          px: 2,
                                          py: 0.5,
                                          fontWeight: 600,
                                          textTransform: 'none',
                                          minWidth: 100,
                                        }}
                                      >
                                        Deselect
                                      </Button>
                                    ) : (
                                      <Button
                                        variant='outlined'
                                        size='small'
                                        disabled={!!selectedPatientId}
                                        onClick={() => {
                                          setSelectedPatientId(
                                            patient._id || '',
                                          );
                                          setFormData((prev) => ({
                                            ...prev,
                                            patient_id: patient._id || '',
                                          }));
                                        }}
                                        sx={{
                                          borderRadius: 2,
                                          px: 2,
                                          py: 0.5,
                                          fontWeight: 600,
                                          textTransform: 'none',
                                          minWidth: 100,
                                          borderColor: 'primary.main',
                                          color: 'primary.main',
                                          '&:hover': {
                                            borderColor: 'primary.dark',
                                            bgcolor: 'primary.lighter',
                                          },
                                        }}
                                      >
                                        Select
                                      </Button>
                                    )}
                                  </TableCell>
                                </TableRow>
                              ))
                          )}
                        </TableBody>
                      </Table>
                    </TableContainer>

                    {filteredPatients.length > 0 && (
                      <TablePagination
                        rowsPerPageOptions={[10]}
                        component='div'
                        count={filteredPatients.length}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onPageChange={(_, newPage) => setPage(newPage)}
                        sx={{
                          borderTop: '1px solid',
                          borderColor: 'divider',
                          bgcolor: 'background.neutral',
                        }}
                      />
                    )}
                  </Grid>

                  {/* {selectedPatient && (
                    <Grid item xs={12}>
                      <TextField
                        label='Selected Patient'
                        fullWidth
                        value={`${selectedPatient.firstName} ${selectedPatient.lastName}`}
                        InputProps={{ readOnly: true }}
                      />
                    </Grid>
                  )} */}

                  <Grid item xs={12}>
                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        mt: 4,
                        p: 3,
                        borderRadius: 2,
                        bgcolor: 'background.neutral',
                        border: '1px solid',
                        borderColor: 'divider',
                      }}
                    >
                      <Box
                        sx={{ display: 'flex', alignItems: 'center', gap: 2 }}
                      >
                        <Box
                          sx={{
                            width: 8,
                            height: 8,
                            borderRadius: '50%',
                            bgcolor: selectedPatientId
                              ? 'success.main'
                              : 'text.disabled',
                          }}
                        />
                        <Typography variant='body2' color='text.secondary'>
                          {selectedPatientId
                            ? 'Patient selected successfully'
                            : 'Please select a patient to continue'}
                        </Typography>
                      </Box>

                      <Button
                        variant='contained'
                        onClick={() => setStep(1)}
                        disabled={!selectedPatientId}
                        endIcon={<Iconify icon='eva:arrow-forward-fill' />}
                        sx={{
                          borderRadius: 2,
                          px: 3,
                          py: 1.5,
                          fontWeight: 600,
                          textTransform: 'none',
                          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                          '&:hover': {
                            boxShadow: '0 6px 20px rgba(0,0,0,0.2)',
                            transform: 'translateY(-1px)',
                          },
                          transition: 'all 0.2s ease-in-out',
                          '&:disabled': {
                            boxShadow: 'none',
                            transform: 'none',
                          },
                        }}
                      >
                        Continue to Visit Details
                      </Button>
                    </Box>
                  </Grid>

                  {/* <Grid item xs={12}>
                    <Divider sx={{ borderBottomWidth: 2, my: 2 }} />
                  </Grid>

                  <Typography variant='h6' marginTop={3} gutterBottom>
                    Create Patient
                  </Typography> */}

                  {/* <Grid container spacing={2} marginTop={1}>
                    {[
                      { name: 'firstName', label: 'First Name' },
                      { name: 'lastName', label: 'Last Name' },
                      { name: 'email', label: 'Email' },
                      { name: 'phone', label: 'Phone' },
                      { name: 'address', label: 'Personal Address' },
                      { name: 'age', label: 'Age' },
                    ].map(({ name, label }) => (
                      <Grid item xs={12} sm={6} key={name}>
                        <TextField
                          fullWidth
                          label={label}
                          name={name}
                          value={newPatient[name]}
                          onChange={handleNewPatientChange}
                          error={Boolean(errorsState[name])}
                          helperText={errorsState[name] || ''}
                        />
                      </Grid>
                    ))}

                    <Grid item xs={12}>
                      <Box display='flex' justifyContent='flex-end'>
                        <Button
                          variant='contained'
                          color='primary'
                          disabled={isCreateDisabled}
                          onClick={createPatient}
                        >
                          Create Patient
                        </Button>
                      </Box>
                    </Grid>
                  </Grid> */}
                </Grid>
              </Box>
            </m.div>
          )}

          {step === 1 && (
            <m.div
              key='step-1'
              initial={slideVariants[direction].initial}
              animate={slideVariants[direction].animate}
              exit={slideVariants[direction].exit}
              transition={{ duration: 0.6, ease: [0.25, 0.8, 0.25, 1] }}
            >
              <Box>
                <Box sx={{ mb: 4 }}>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 2,
                      mb: 3,
                      p: 3,
                      borderRadius: 2,
                      bgcolor: 'background.neutral',
                      border: '1px solid',
                      borderColor: 'divider',
                    }}
                  >
                    <Box
                      sx={{
                        width: 40,
                        height: 40,
                        borderRadius: '50%',
                        bgcolor: 'primary.main',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                      }}
                    >
                      <Iconify icon='eva:calendar-fill' />
                    </Box>
                    <Box>
                      <Typography
                        variant='h6'
                        sx={{ fontWeight: 600, mb: 0.5 }}
                      >
                        Enter Visit Details
                      </Typography>
                      <Typography variant='body2' color='text.secondary'>
                        Fill in the appointment information for the selected
                        patient
                      </Typography>
                    </Box>
                  </Box>
                </Box>

                <Grid container spacing={3}>
                  {/* Visit Date */}
                  <Grid item xs={6}>
                    <TextField
                      label='Visit Date'
                      type='date'
                      inputRef={dateInputRef}
                      fullWidth
                      value={formData.visitDate}
                      onChange={(e) =>
                        handleVisitChange('visitDate', e.target.value)
                      }
                      onClick={() => {
                        if (
                          dateInputRef.current &&
                          'showPicker' in dateInputRef.current
                        ) {
                          (dateInputRef.current as any).showPicker();
                        }
                      }}
                      InputLabelProps={{ shrink: true }}
                      sx={{
                        '& input': {
                          height: '20px',
                          padding: '18.5px 14px',
                          color:
                            theme.palette.mode === 'dark' ? '#fff' : '#000',
                          borderRadius: 1,
                        },
                      }}
                      error={!!inputErrors.visitDate}
                      helperText={inputErrors.visitDate}
                    />
                  </Grid>
                  {/* Visit Time */}
                  <Grid item xs={6}>
                    <TextField
                      label='Visit Time'
                      type='time'
                      inputRef={timeInputRef}
                      fullWidth
                      value={formData.visitTime}
                      onChange={(e) =>
                        handleVisitChange('visitTime', e.target.value)
                      }
                      onClick={() => {
                        if (
                          timeInputRef.current &&
                          'showPicker' in timeInputRef.current
                        ) {
                          (timeInputRef.current as any).showPicker();
                        }
                      }}
                      InputLabelProps={{ shrink: true }}
                      sx={{
                        '& input': {
                          height: '20px',
                          padding: '18.5px 14px',
                          color:
                            theme.palette.mode === 'dark' ? '#fff' : '#000',
                          borderRadius: 1,
                        },
                      }}
                      error={!!inputErrors.visitTime}
                      helperText={inputErrors.visitTime}
                    />
                  </Grid>
                  {/* Duration */}
                  <Grid item xs={6}>
                    <TextField
                      label='Duration'
                      fullWidth
                      value={formData.duration || ''}
                      onChange={(e) =>
                        handleVisitChange('duration', e.target.value)
                      }
                      error={!!inputErrors.duration}
                      helperText={inputErrors.duration}
                      InputLabelProps={{ shrink: true }}
                    />
                  </Grid>
                  {/* Visit Type */}
                  <Grid item xs={6}>
                    <TextField
                      label='Visit Type'
                      fullWidth
                      select
                      value={formData.visitType || ''}
                      onChange={(e) =>
                        handleVisitChange('visitType', e.target.value)
                      }
                      error={!!inputErrors.visitType}
                      helperText={inputErrors.visitType}
                      InputLabelProps={{ shrink: true }}
                    >
                      <MenuItem value=''>-- Select --</MenuItem>
                      <MenuItem value='Check Up'>Check Up</MenuItem>
                      <MenuItem value='Emergency'>Emergency</MenuItem>
                    </TextField>
                  </Grid>
                  {/* Case File Type */}
                  <Grid item xs={6}>
                    <TextField
                      label='Case File Type'
                      fullWidth
                      select
                      value={formData.caseFileType || ''}
                      onChange={(e) =>
                        handleVisitChange('caseFileType', e.target.value)
                      }
                      error={!!inputErrors.caseFileType}
                      helperText={inputErrors.caseFileType}
                      InputLabelProps={{ shrink: true }}
                    >
                      <MenuItem value=''>-- Select --</MenuItem>
                      <MenuItem value='new'>New Case</MenuItem>
                      <MenuItem value='old'>Existing Case</MenuItem>
                    </TextField>
                  </Grid>
                  {/* Symptoms */}
                  <Grid item xs={6}>
                    <Autocomplete
                      multiple
                      freeSolo
                      options={[]}
                      value={formData.symptoms || []}
                      onChange={(event, newValue) => {
                        const unique = Array.from(new Set(newValue));
                        if (unique.length <= 5) {
                          handleVisitChange('symptoms', unique);
                          setInputErrors((prev) => ({ ...prev, symptoms: '' }));
                        } else {
                          setInputErrors((prev) => ({
                            ...prev,
                            symptoms: 'Maximum 5 symptoms allowed',
                          }));
                        }
                      }}
                      renderTags={(value, getTagProps) =>
                        value.map((option, index) => {
                          const { key, ...tagProps } = getTagProps({ index });
                          return (
                            <Chip
                              key={`${option}-${index}`}
                              label={option}
                              {...tagProps}
                              sx={{
                                backgroundColor:
                                  theme.palette.mode === 'dark'
                                    ? '#333'
                                    : '#eee',
                                color: theme.palette.text.primary,
                              }}
                            />
                          );
                        })
                      }
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label='Symptoms'
                          placeholder='Enter symptoms'
                          fullWidth
                          error={!!inputErrors.symptoms}
                          helperText={inputErrors.symptoms}
                          InputLabelProps={{ shrink: true }}
                        />
                      )}
                    />
                  </Grid>
                  {/* Notes */}
                  <Grid item xs={12}>
                    <TextField
                      label='Notes'
                      fullWidth
                      multiline
                      rows={3}
                      value={formData.notes || ''}
                      onChange={(e) =>
                        handleVisitChange('notes', e.target.value)
                      }
                      error={!!inputErrors.notes}
                      helperText={inputErrors.notes}
                      InputLabelProps={{ shrink: true }}
                    />
                  </Grid>
                </Grid>

                <Box mt={3} display='flex' justifyContent='space-between'>
                  <Button
                    variant='outlined'
                    onClick={() => goToStep(step - 1)}
                    startIcon={<Iconify icon='eva:arrow-back-fill' />}
                    sx={{
                      px: 3,
                      py: 1.5,
                      fontWeight: 600,
                      textTransform: 'none',
                      borderColor: 'primary.main',
                      color: 'primary.main',
                      '&:hover': {
                        borderColor: 'primary.dark',
                        bgcolor: 'primary.lighter',
                      },
                    }}
                  >
                    Back to Patient Selection
                  </Button>
                  <Button
                    variant='contained'
                    onClick={() => finalSubmit()}
                    disabled={isFormIncomplete()}
                    endIcon={<Iconify icon='eva:checkmark-circle-fill' />}
                    sx={{
                      px: 4,
                      py: 1.5,
                      fontWeight: 600,
                      textTransform: 'none',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                      '&:hover': {
                        boxShadow: '0 6px 20px rgba(0,0,0,0.2)',
                        transform: 'translateY(-1px)',
                      },
                      '&:disabled': {
                        boxShadow: 'none',
                        transform: 'none',
                      },
                      transition: 'all 0.2s ease-in-out',
                    }}
                  >
                    Create Visit
                  </Button>
                </Box>
              </Box>
            </m.div>
          )}
        </AnimatePresence>

        {/* Modal Dialog */}
        <Dialog open={open} onClose={handleClose} fullWidth maxWidth='sm'>
          <DialogTitle>Create Patient</DialogTitle>
          <DialogContent>
            <Box component='form' noValidate sx={{ mt: 2 }}>
              <Grid container spacing={2}>
                {[
                  { label: 'First Name', field: 'firstName' },
                  { label: 'Last Name', field: 'lastName' },
                  { label: 'Email', field: 'email' },
                  { label: 'Phone', field: 'phone' },
                  { label: 'Personal Address', field: 'address' },
                  { label: 'Age', field: 'age' },
                ].map(({ label, field }) => (
                  <Grid item xs={12} sm={6} key={field}>
                    <TextField
                      fullWidth
                      label={label}
                      value={formsData[field as keyof typeof formsData]}
                      onChange={handleChange(field)}
                      error={!!errors[field as keyof typeof errors]}
                      helperText={errors[field as keyof typeof errors]}
                      required
                    />
                  </Grid>
                ))}
              </Grid>
            </Box>
          </DialogContent>

          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button
              variant='contained'
              onClick={handleSubmit}
              disabled={!isFormValid}
            >
              Create Patient
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Page>
  );
}
