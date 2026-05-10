// Updated Visit Form Page with validation and phone search support
import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from '../../../../redux/store';
import { PATH_DASHBOARD } from '../../../../routes/paths';
import useSettings from '../../../../hooks/useSettings';
import Layout from '../../../../layouts';
import Page from '../../../../components/Page';
import HeaderBreadcrumbs from '../../../../components/HeaderBreadcrumbs';
import axiosInstance from 'src/utils/axios';
import { useSnackbar } from 'notistack';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useForm } from 'react-hook-form';
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
  Divider,
  InputAdornment,
  IconButton,
} from '@mui/material';
import { CalendarToday, AccessTime } from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
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
import Iconify from '../../../../components/Iconify';

EcommerceProductDetails.getLayout = function getLayout(page: any) {
  return <Layout>{page}</Layout>;
};

export default function EcommerceProductDetails() {
  /////////////////////////////////
  // General Section
  /////////////////////////////////

  const { themeStretch } = useSettings();
  const theme = useTheme();
  const { enqueueSnackbar } = useSnackbar();
  const dateInputRef = useRef<HTMLInputElement | null>(null);
  const router = useRouter();
  const { id, name } = router.query;

  const [step, setStep] = useState(0);
  const timeInputRef = useRef<HTMLInputElement | null>(null);

  const [inputErrors, setInputErrors] = useState({
    visitDate: '',
    visitTime: '',
    duration: '',
    visitType: '',
    caseFileType: '',
    symptoms: '',
    notes: '',
  });

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
  //  Create Visit Section
  /////////////////////////////////

  const isFormIncomplete = () => {
    return (
      !formData.visitDate ||
      !formData.visitTime ||
      !formData.visitType ||
      !formData.caseFileType ||
      !formData.duration ||
      (Array.isArray(formData.symptoms) ? formData.symptoms.length === 0 : true)
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
        doctor_id: id,
        visit_date: dayjs(formData.visitDate).format('DD/MM/YYYY'),
        visit_time: formData.visitTime,
        duration: formData.duration,
        visit_type: formData.visitType,
        case_file_type: formData.caseFileType,
        symptoms: formData.symptoms,
        notes: formData.notes,
      };

      const response = await axiosInstance.post(
        '/api/patients/visit/book-visit',
        payload
      );

      enqueueSnackbar(
        response?.data?.message || 'Visit created successfully!',
        {
          variant: 'success',
        }
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

      router.push('/patient/e-commerce/list');

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
                <Typography variant='h6' sx={{ fontWeight: 600, mb: 0.5 }}>
                  Book Visit
                </Typography>
                <Typography variant='body2' color='text.secondary'>
                  Fill in the appointment information for the selected doctor
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
                onChange={(e) => handleVisitChange('visitDate', e.target.value)}
                onClick={() => (dateInputRef.current as any)?.showPicker?.()}
                InputLabelProps={{ shrink: true }}
                sx={{
                  '& input': {
                    height: '20px',
                    padding: '18.5px 14px',
                    color: theme.palette.mode === 'dark' ? '#fff' : '#000',
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
                onChange={(e) => handleVisitChange('visitTime', e.target.value)}
                onClick={() => (timeInputRef.current as any)?.showPicker?.()}
                InputLabelProps={{ shrink: true }}
                sx={{
                  '& input': {
                    height: '20px',
                    padding: '18.5px 14px',
                    color: theme.palette.mode === 'dark' ? '#fff' : '#000',
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
                onChange={(e) => handleVisitChange('duration', e.target.value)}
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
                onChange={(e) => handleVisitChange('visitType', e.target.value)}
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
                  value.map((option, index) => (
                    <Chip
                      label={option}
                      {...getTagProps({ index })}
                      sx={{
                        backgroundColor:
                          theme.palette.mode === 'dark' ? '#333' : '#eee',
                        color: theme.palette.text.primary,
                      }}
                    />
                  ))
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
                onChange={(e) => handleVisitChange('notes', e.target.value)}
                error={!!inputErrors.notes}
                helperText={inputErrors.notes}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
          </Grid>

          <Box mt={3} display='flex' justifyContent='space-between'>
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
      </Container>
    </Page>
  );
}
