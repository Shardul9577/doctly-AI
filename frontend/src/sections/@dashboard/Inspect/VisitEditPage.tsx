import React, { useEffect, useState } from 'react';
import {
  Box,
  Paper,
  Grid,
  TextField,
  Button,
  IconButton,
  Modal,
  Typography,
  Stack,
  Link,
  Card,
  Divider,
  CardHeader,
  CardProps,
  FormHelperText,
} from '@mui/material';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import DeleteIcon from '@mui/icons-material/Delete';
import { styled } from '@mui/material/styles';
import { VisitCardProps } from 'src/@types/user';
import dayjs from 'dayjs';
import Chip from '@mui/material/Chip';
import axiosInstance from 'src/utils/axios';
import { useSnackbar } from 'notistack';
import { LoadingButton } from '@mui/lab';
import { useRouter } from 'next/router';
import AssignmentIcon from '@mui/icons-material/Assignment';
import PersonIcon from '@mui/icons-material/Person';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import MedicationIcon from '@mui/icons-material/Medication';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Tooltip from '@mui/material/Tooltip';
import { useTheme } from '@mui/material/styles';
import Slide from '@mui/material/Slide';

const PageContainer = styled(Box)(({ theme }) => ({
  minHeight: '100vh',
  width: '100%',
  background:
    theme.palette.mode === 'dark'
      ? `linear-gradient(135deg, ${theme.palette.background.default} 0%, ${theme.palette.background.paper} 100%)`
      : 'linear-gradient(135deg, #e0e7ff 0%, #f0fdfa 100%)',
  padding: theme.spacing(4, 0),
  display: 'block',
}));

const GlassCard = styled('div')(({ theme }) => ({
  padding: theme.spacing(3),
  marginBottom: theme.spacing(3),
  background:
    theme.palette.mode === 'dark'
      ? 'rgba(30, 32, 36, 0.85)'
      : 'rgba(255, 255, 255, 0.7)',
  borderRadius: theme.spacing(3),
  boxShadow: theme.shadows[8],
  backdropFilter: 'blur(8px)',
  border: `1px solid ${theme.palette.divider}`,
  transition: 'box-shadow 0.3s',
  width: '100%',
  [theme.breakpoints.down('md')]: {
    padding: theme.spacing(2),
    borderRadius: theme.spacing(2),
  },
}));

const SectionTitle = styled(Typography)<{ colorKey?: string }>(
  ({ theme, colorKey }) => ({
    fontWeight: 800,
    fontSize: '1.5rem',
    display: 'flex',
    alignItems: 'center',
    marginBottom: theme.spacing(2),
    letterSpacing: 1,
    position: 'relative',
    color: theme.palette.text.primary,
    '&:before': {
      content: '""',
      display: 'block',
      width: 6,
      height: 32,
      borderRadius: 6,
      background:
        colorKey === 'summary'
          ? theme.palette.primary.main
          : colorKey === 'patient'
          ? theme.palette.info.main
          : colorKey === 'doctor'
          ? theme.palette.success.main
          : theme.palette.secondary.main,
      marginRight: theme.spacing(2),
      marginLeft: -theme.spacing(3),
    },
  })
);

const PillChip = styled(Chip)(({ theme }) => ({
  borderRadius: 16,
  fontWeight: 600,
  background:
    theme.palette.mode === 'dark'
      ? theme.palette.primary.dark
      : theme.palette.secondary.light,
  color:
    theme.palette.mode === 'dark'
      ? theme.palette.primary.contrastText
      : theme.palette.secondary.dark,
  marginRight: theme.spacing(1),
  marginBottom: theme.spacing(0.5),
  boxShadow: theme.shadows[1],
}));

const TextInput = styled(TextField)(({ theme }) => ({
  marginTop: theme.spacing(1),
  borderRadius: theme.spacing(2),
  backgroundColor: theme.palette.background.paper,
  boxShadow: theme.shadows[1],
  '& .MuiOutlinedInput-root': {
    backgroundColor: theme.palette.background.paper,
    borderRadius: theme.spacing(2),
    '& fieldset': {
      borderColor: theme.palette.divider,
      transition: 'border-color 0.3s',
    },
    '&:hover fieldset': {
      borderColor: theme.palette.primary.light,
    },
    '&.Mui-focused fieldset': {
      borderColor: theme.palette.primary.main,
      boxShadow: `0 0 0 2px ${theme.palette.primary.light}`,
    },
  },
  '& input, & textarea': {
    color: theme.palette.text.primary,
  },
}));

const UploadBox = styled(Box)(({ theme }) => ({
  textAlign: 'center',
  padding: theme.spacing(3),
  border: `2px solid ${theme.palette.divider}`,
  borderRadius: theme.spacing(2),
  backgroundColor: theme.palette.background.paper,
  transition: 'border-color 0.3s ease',
  '&:hover': {
    borderColor: theme.palette.text.secondary,
  },
  '&:focus-within': {
    borderColor: theme.palette.primary.main,
  },
}));

const FilePreviewWrapper = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(2),
  flexWrap: 'wrap',
  marginTop: theme.spacing(2),
}));

const FilePreview = styled(Box)(({ theme }) => ({
  position: 'relative',
  width: 120,
  height: 80,
  borderRadius: theme.spacing(1),
  overflow: 'hidden',
  cursor: 'pointer',
}));

const FileImg = styled('img')({
  width: '100%',
  height: '100%',
  objectFit: 'cover',
});

const DeleteBtn = styled(IconButton)(({ theme }) => ({
  position: 'absolute',
  top: 4,
  right: 4,
  backgroundColor: 'rgba(0,0,0,0.5)',
  color: theme.palette.common.white,
}));

const ModalPreview = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  backgroundColor: theme.palette.background.paper,
  boxShadow: theme.shadows[24],
  padding: theme.spacing(2),
}));

const ModalImage = styled('img')({
  maxWidth: '100%',
  maxHeight: '80vh',
});

const BrowseButton = styled(Button, {
  shouldForwardProp: (prop) => prop !== 'component',
})(({ theme }) => ({
  marginTop: theme.spacing(2),
  backgroundColor: theme.palette.success.main,
  color: theme.palette.common.white,
  '&:hover': {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
  },
}));

const FancyTableContainer = styled(TableContainer)(({ theme }) => ({
  borderRadius: theme.spacing(2),
  boxShadow: theme.shadows[2],
  background: theme.palette.background.paper,
  marginBottom: theme.spacing(2),
}));

const FancyTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
  '&:hover': {
    backgroundColor: theme.palette.action.selected,
  },
}));

const FrostedStickyActions = styled(Box)(({ theme }) => ({
  position: 'sticky',
  bottom: 0,
  background:
    theme.palette.mode === 'dark'
      ? 'rgba(30, 32, 36, 0.85)'
      : 'rgba(255,255,255,0.85)',
  backdropFilter: 'blur(8px)',
  boxShadow: theme.shadows[8],
  zIndex: 10,
  padding: theme.spacing(2, 0),
  borderTop: `1px solid ${theme.palette.divider}`,
  display: 'flex',
  justifyContent: 'flex-end',
  gap: theme.spacing(2),
}));

interface Props {
  visit?: VisitCardProps;
}

export default function VisitEditPage({ visit, ...other }: Props) {
  //////////////////////////////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////////////////////////
  const [symptoms, setSymptoms] = useState<string[]>([]);
  const [diagnosis, setDiagnosis] = useState<string[]>([]);
  const [notes, setNotes] = useState('');
  const [attachments, setAttachments] = useState<File[]>([]);
  const [deletedAttachments, setDeletedAttachments] = useState<string[]>([]);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [prescriptions, setPrescriptions] = useState([
    { medicine_name: '', dosage: '', duration: '', instructions: '' },
  ]);
  const [hasChanges, setHasChanges] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [diagnosisInput, setDiagnosisInput] = useState('');
  const { enqueueSnackbar } = useSnackbar();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Validation states
  const [errors, setErrors] = useState({
    symptoms: false,
    notes: false,
    diagnosis: false,
    prescriptions: false,
  });
  //////////////////////////////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////////////////////////

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0 && attachments.length < 5) {
      setAttachments([...attachments, files[0]]);
    }
  };

  const handleDelete = (index: number) => {
    const attachmentToDelete = attachments[index];

    // If it's an existing attachment (has type 'url'), add to deletedAttachments
    if (attachmentToDelete.type === 'url') {
      setDeletedAttachments([...deletedAttachments, attachmentToDelete.name]);
    }

    const updatedAttachments = attachments.filter((_, i) => i !== index);
    setAttachments(updatedAttachments);

    console.log('Deleted attachment:', attachmentToDelete.name);
    console.log('Updated deletedAttachments:', [
      ...deletedAttachments,
      attachmentToDelete.name,
    ]);
  };

  const handleImageClick = (file: File | string) => {
    if (typeof file === 'string') {
      setPreviewImage(file);
      setOpen(true);
      return;
    }

    if (file.type === 'url') {
      setPreviewImage(file.name); // file.name contains URL
      setOpen(true);
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setPreviewImage(reader.result as string);
      setOpen(true);
    };
    reader.readAsDataURL(file);
  };

  const InfoField = ({ label, value }: { label: string; value: string }) => (
    <Grid item xs={12} sm={6} md={4}>
      <Typography variant='body2' color='gray'>
        {label}
      </Typography>
      <Typography fontWeight={500}>{value}</Typography>
    </Grid>
  );

  let { push } = useRouter();

  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  //All fetch and post functionality of this page//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  async function handleSubmit() {
    // Validate form before submission
    const newErrors = {
      symptoms: symptoms.length === 0,
      notes: notes.trim() === '',
      diagnosis: diagnosis.length === 0,
      prescriptions:
        prescriptions.length > 0 &&
        prescriptions.some(
          (p) =>
            p.medicine_name.trim() === '' ||
            p.dosage.trim() === '' ||
            p.duration.trim() === '' ||
            p.instructions.trim() === ''
        ),
    };

    setErrors(newErrors);

    // Check if there are any validation errors
    if (
      newErrors.symptoms ||
      newErrors.notes ||
      newErrors.diagnosis ||
      newErrors.prescriptions
    ) {
      enqueueSnackbar('Please fill in all required fields', {
        variant: 'error',
      });
      return;
    }

    setIsSubmitting(true);
    try {
      if (!visit?._id) return;

      const formData = new FormData();

      // Symptoms
      symptoms.forEach((symptom, index) => {
        formData.append(`symptoms[${index}]`, symptom);
      });

      // Diagnosis
      diagnosis.forEach((item, index) => {
        formData.append(`diagnosis[${index}]`, item);
      });

      // Notes
      formData.append('notes', notes);

      // append prescriptions as JSON
      formData.append('prescription', JSON.stringify(prescriptions));

      // append visit status
      formData.append('status', 'ongoing');

      console.log('attachments', attachments.length);
      console.log('deletedAttachments', deletedAttachments);

      // Get remaining existing attachments (not deleted ones)
      const remainingExistingAttachments = attachments
        .filter((file) => file.type === 'url')
        .map((file) => file.name); // file.name contains the URL for existing attachments

      const newAttachments = attachments.filter((file) => file.type !== 'url');

      // Send new files as attachments (backend will process these)
      if (newAttachments.length > 0) {
        newAttachments.forEach((file, index) => {
          formData.append(`attachments`, file);
        });
      }

      // Send remaining existing attachments as a separate field
      formData.append(
        'existingAttachments',
        JSON.stringify(remainingExistingAttachments)
      );

      const res = await axiosInstance.patch(
        `/api/doctors/visit/${visit._id}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      enqueueSnackbar(res?.data?.message || 'Visit updated successfully!', {
        variant: 'success',
      });
    } catch (error) {
      console.error('Error updating visit:', error);
      enqueueSnackbar(error.message || 'Failed to update visit', {
        variant: 'error',
      });
    } finally {
      setIsSubmitting(false);
      push('/dashboard/booking/');
    }
  }

  useEffect(() => {
    if (!visit) return;

    const isChanged =
      JSON.stringify(symptoms) !== JSON.stringify(visit.symptoms || []) ||
      JSON.stringify(diagnosis) !== JSON.stringify(visit.diagnosis || []) ||
      notes !== (visit.notes || '') ||
      JSON.stringify(prescriptions) !==
        JSON.stringify(visit.prescription || []) ||
      JSON.stringify(
        attachments.map((file) => (file.type === 'url' ? file.name : file.name))
      ) !== JSON.stringify(visit.attachments || []) ||
      deletedAttachments.length > 0;

    setHasChanges(isChanged);
  }, [
    symptoms,
    diagnosis,
    notes,
    prescriptions,
    attachments,
    deletedAttachments,
    visit,
  ]);

  useEffect(() => {
    if (visit) {
      setSymptoms(visit.symptoms || []);
      setDiagnosis(visit.diagnosis || []);
      setNotes(visit.notes || '');

      // Set prescriptions directly; leave empty if none
      setPrescriptions(visit.prescription || []);

      // Check if prescriptions are valid when loading
      if (visit.prescription && visit.prescription.length > 0) {
        const prescriptionsValid = visit.prescription.every(
          (p) =>
            p.medicine_name?.trim() !== '' &&
            p.dosage?.trim() !== '' &&
            p.duration?.trim() !== '' &&
            p.instructions?.trim() !== ''
        );
        setErrors((prev) => ({ ...prev, prescriptions: !prescriptionsValid }));
      } else {
        // No prescriptions, so no prescription errors
        setErrors((prev) => ({ ...prev, prescriptions: false }));
      }

      // Attachments as before
      if (visit.attachments && visit.attachments.length > 0) {
        setAttachments(
          visit.attachments.map(
            (url: string) => new File([], url, { type: 'url' })
          )
        );
      }

      // Reset deleted attachments
      setDeletedAttachments([]);
    }
  }, [visit]);

  const isFormValid = () => {
    return (
      symptoms.length > 0 &&
      notes.trim() !== '' &&
      diagnosis.length > 0 &&
      (prescriptions.length === 0 ||
        prescriptions.every(
          (p) =>
            p.medicine_name.trim() !== '' &&
            p.dosage.trim() !== '' &&
            p.duration.trim() !== '' &&
            p.instructions.trim() !== ''
        ))
    );
  };

  const parseDDMMYYYY = (dateString: any) => {
    const [day, month, year] = dateString.split('/').map(Number);
    return new Date(year, month - 1, day); // month is 0-based
  };

  return (
    <>
      <Slide direction='up' in mountOnEnter unmountOnExit>
        <GlassCard>
          <SectionTitle variant='h6' colorKey='summary'>
            <AssignmentIcon sx={{ mr: 1 }} />
            Visit Summary
          </SectionTitle>
          <Grid container spacing={2} mt={1}>
            <InfoField label='Visit ID' value={visit?._id || 'None'} />
            <InfoField
              label='Date'
              value={
                visit?.visit_date
                  ? (() => {
                      const [day, month, year] = visit.visit_date.split('/');
                      const dateObj = new Date(`${year}-${month}-${day}`);
                      return isNaN(dateObj.getTime())
                        ? 'Invalid Date'
                        : dateObj.toLocaleDateString('en-GB', {
                            day: '2-digit',
                            month: 'short',
                            year: 'numeric',
                          });
                    })()
                  : 'None'
              }
            />

            <InfoField
              label='Time'
              value={
                visit?.visit_time
                  ? (() => {
                      const [hour, minute] = visit.visit_time.split(':');
                      const dateObj = new Date();
                      dateObj.setHours(Number(hour), Number(minute));
                      return isNaN(dateObj.getTime())
                        ? 'Invalid Time'
                        : dateObj.toLocaleTimeString('en-US', {
                            hour: '2-digit',
                            minute: '2-digit',
                            hour12: true,
                          });
                    })()
                  : 'None'
              }
            />

            <InfoField
              label='Duration'
              value={`${visit?.duration ?? 'None'}`}
            />
            <InfoField label='Type' value={visit?.visit_type || 'None'} />
            <InfoField label='Status' value={visit?.status || 'None'} />
            <InfoField
              label='Case File Type'
              value={visit?.case_file_type || 'None'}
            />
          </Grid>
        </GlassCard>
      </Slide>

      <Slide direction='up' in mountOnEnter unmountOnExit>
        <GlassCard>
          <SectionTitle variant='h6' colorKey='patient'>
            <PersonIcon sx={{ mr: 1 }} />
            Patient Information
          </SectionTitle>
          <Grid container spacing={2} mt={1}>
            <InfoField
              label='Name'
              value={
                `${
                  visit?.doctor_patient_relations_id?.patient_id?.firstName ||
                  ''
                } ${
                  visit?.doctor_patient_relations_id?.patient_id?.lastName || ''
                }`.trim() || 'None'
              }
            />
            <InfoField
              label='Email'
              value={
                visit?.doctor_patient_relations_id?.patient_id?.email || 'None'
              }
            />
            <InfoField
              label='Phone'
              value={
                visit?.doctor_patient_relations_id?.patient_id?.phone || 'None'
              }
            />
          </Grid>
        </GlassCard>
      </Slide>

      <Slide direction='up' in mountOnEnter unmountOnExit>
        <GlassCard>
          <SectionTitle variant='h6' colorKey='doctor'>
            <LocalHospitalIcon sx={{ mr: 1 }} />
            Doctor Information
          </SectionTitle>
          <Grid container spacing={2} mt={1}>
            <InfoField
              label='Name'
              value={
                `${
                  visit?.doctor_patient_relations_id?.doctor_id?.firstName || ''
                } ${
                  visit?.doctor_patient_relations_id?.doctor_id?.lastName || ''
                }`.trim() || 'None'
              }
            />
            <InfoField
              label='Email'
              value={
                visit?.doctor_patient_relations_id?.doctor_id?.email || 'None'
              }
            />
            <InfoField
              label='Phone'
              value={
                visit?.doctor_patient_relations_id?.doctor_id?.phone || 'None'
              }
            />
          </Grid>
        </GlassCard>
      </Slide>

      <Slide direction='up' in mountOnEnter unmountOnExit>
        <GlassCard>
          <Box mb={3}>
            <SectionTitle variant='h6'>Symptoms</SectionTitle>
            <TextInput
              fullWidth
              variant='outlined'
              placeholder='Type a symptom and press Enter'
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && inputValue.trim() !== '') {
                  e.preventDefault();
                  setSymptoms([...symptoms, inputValue.trim()]);
                  setInputValue('');
                  // Clear error when symptoms are added
                  if (errors.symptoms) {
                    setErrors((prev) => ({ ...prev, symptoms: false }));
                  }
                }
              }}
              error={errors.symptoms}
              InputProps={{
                startAdornment: (
                  <>
                    {symptoms.map((symptom, index) => (
                      <PillChip
                        key={index}
                        label={symptom}
                        onDelete={() => {
                          setSymptoms(symptoms.filter((_, i) => i !== index));
                          // Check if this will make symptoms empty
                          if (symptoms.length === 1) {
                            setErrors((prev) => ({ ...prev, symptoms: true }));
                          }
                        }}
                      />
                    ))}
                  </>
                ),
              }}
            />
            {errors.symptoms && (
              <FormHelperText error>
                At least one symptom is required
              </FormHelperText>
            )}
          </Box>

          <Box mb={3}>
            <SectionTitle variant='h6'>Notes</SectionTitle>
            <TextInput
              fullWidth
              multiline
              rows={4}
              value={notes}
              onChange={(e) => {
                setNotes(e.target.value);
                // Clear error when notes are added
                if (errors.notes && e.target.value.trim() !== '') {
                  setErrors((prev) => ({ ...prev, notes: false }));
                }
              }}
              onBlur={() => {
                // Show error when user leaves the field and it's empty
                if (notes.trim() === '') {
                  setErrors((prev) => ({ ...prev, notes: true }));
                }
              }}
              variant='outlined'
              error={errors.notes}
              placeholder='Enter visit notes...'
            />
            {errors.notes && (
              <FormHelperText error>Notes are required</FormHelperText>
            )}
          </Box>

          <Box mb={3}>
            <SectionTitle variant='h6'>Diagnosis</SectionTitle>
            <TextInput
              fullWidth
              variant='outlined'
              placeholder='Type a diagnosis and press Enter'
              value={diagnosisInput}
              onChange={(e) => setDiagnosisInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && diagnosisInput.trim() !== '') {
                  e.preventDefault();
                  setDiagnosis([...diagnosis, diagnosisInput.trim()]);
                  setDiagnosisInput('');
                  // Clear error when diagnosis is added
                  if (errors.diagnosis) {
                    setErrors((prev) => ({ ...prev, diagnosis: false }));
                  }
                }
              }}
              error={errors.diagnosis}
              InputProps={{
                startAdornment: (
                  <>
                    {diagnosis.map((item, index) => (
                      <PillChip
                        key={index}
                        label={item}
                        onDelete={() => {
                          setDiagnosis(diagnosis.filter((_, i) => i !== index));
                          // Check if this will make diagnosis empty
                          if (diagnosis.length === 1) {
                            setErrors((prev) => ({ ...prev, diagnosis: true }));
                          }
                        }}
                      />
                    ))}
                  </>
                ),
              }}
            />
            {errors.diagnosis && (
              <FormHelperText error>
                At least one diagnosis is required
              </FormHelperText>
            )}
          </Box>

          <Box mb={3}>
            <SectionTitle variant='h6'>Prescription</SectionTitle>

            {prescriptions.length === 0 ? (
              <Box textAlign='center' mb={2}>
                <Typography variant='body2' color='text.secondary'>
                  No prescriptions added yet.
                </Typography>
                <Button
                  variant='outlined'
                  onClick={() => {
                    setPrescriptions([
                      {
                        medicine_name: '',
                        dosage: '',
                        duration: '',
                        instructions: '',
                      },
                    ]);
                    // Immediately show prescription errors since we now have an empty prescription
                    setErrors((prev) => ({ ...prev, prescriptions: true }));
                  }}
                  sx={{ mt: 1 }}
                >
                  + Add Prescription
                </Button>
              </Box>
            ) : (
              <>
                <FancyTableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell
                          align='center'
                          sx={{ fontWeight: 700, fontSize: '1rem' }}
                        >
                          <MedicationIcon sx={{ mr: 1 }} />
                          Medicine
                        </TableCell>
                        <TableCell
                          align='center'
                          sx={{ fontWeight: 700, fontSize: '1rem' }}
                        >
                          <AttachFileIcon sx={{ mr: 1 }} />
                          Dosage
                        </TableCell>
                        <TableCell
                          align='center'
                          sx={{ fontWeight: 700, fontSize: '1rem' }}
                        >
                          <AttachFileIcon sx={{ mr: 1 }} />
                          Duration
                        </TableCell>
                        <TableCell
                          align='center'
                          sx={{ fontWeight: 700, fontSize: '1rem' }}
                        >
                          <AttachFileIcon sx={{ mr: 1 }} />
                          Instructions
                        </TableCell>
                        <TableCell
                          align='center'
                          sx={{ fontWeight: 700, fontSize: '1rem' }}
                        ></TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {prescriptions.map((p, index) => (
                        <FancyTableRow key={index}>
                          <TableCell align='center'>
                            <TextInput
                              fullWidth
                              placeholder='Medicine Name'
                              value={p.medicine_name}
                              onChange={(e) => {
                                const updated = [...prescriptions];
                                updated[index].medicine_name = e.target.value;
                                setPrescriptions(updated);
                                // Clear prescription errors when user starts typing
                                if (
                                  errors.prescriptions &&
                                  e.target.value.trim() !== ''
                                ) {
                                  // Check if all prescription fields are now filled
                                  const allFilled = updated.every(
                                    (p) =>
                                      p.medicine_name.trim() !== '' &&
                                      p.dosage.trim() !== '' &&
                                      p.duration.trim() !== '' &&
                                      p.instructions.trim() !== ''
                                  );
                                  if (allFilled) {
                                    setErrors((prev) => ({
                                      ...prev,
                                      prescriptions: false,
                                    }));
                                  }
                                }
                              }}
                              error={
                                errors.prescriptions &&
                                p.medicine_name.trim() === ''
                              }
                            />
                            {errors.prescriptions &&
                              p.medicine_name.trim() === '' && (
                                <FormHelperText error>
                                  Medicine name is required
                                </FormHelperText>
                              )}
                          </TableCell>
                          <TableCell align='center'>
                            <TextInput
                              fullWidth
                              placeholder='Dosage'
                              value={p.dosage}
                              onChange={(e) => {
                                const updated = [...prescriptions];
                                updated[index].dosage = e.target.value;
                                setPrescriptions(updated);
                                // Clear prescription errors when user starts typing
                                if (
                                  errors.prescriptions &&
                                  e.target.value.trim() !== ''
                                ) {
                                  // Check if all prescription fields are now filled
                                  const allFilled = updated.every(
                                    (p) =>
                                      p.medicine_name.trim() !== '' &&
                                      p.dosage.trim() !== '' &&
                                      p.duration.trim() !== '' &&
                                      p.instructions.trim() !== ''
                                  );
                                  if (allFilled) {
                                    setErrors((prev) => ({
                                      ...prev,
                                      prescriptions: false,
                                    }));
                                  }
                                }
                              }}
                              error={
                                errors.prescriptions && p.dosage.trim() === ''
                              }
                            />
                            {errors.prescriptions && p.dosage.trim() === '' && (
                              <FormHelperText error>
                                Dosage is required
                              </FormHelperText>
                            )}
                          </TableCell>
                          <TableCell align='center'>
                            <TextInput
                              fullWidth
                              placeholder='Duration'
                              value={p.duration}
                              onChange={(e) => {
                                const updated = [...prescriptions];
                                updated[index].duration = e.target.value;
                                setPrescriptions(updated);
                                // Clear prescription errors when user starts typing
                                if (
                                  errors.prescriptions &&
                                  e.target.value.trim() !== ''
                                ) {
                                  // Check if all prescription fields are now filled
                                  const allFilled = updated.every(
                                    (p) =>
                                      p.medicine_name.trim() !== '' &&
                                      p.dosage.trim() !== '' &&
                                      p.duration.trim() !== '' &&
                                      p.instructions.trim() !== ''
                                  );
                                  if (allFilled) {
                                    setErrors((prev) => ({
                                      ...prev,
                                      prescriptions: false,
                                    }));
                                  }
                                }
                              }}
                              error={
                                errors.prescriptions && p.duration.trim() === ''
                              }
                            />
                            {errors.prescriptions &&
                              p.duration.trim() === '' && (
                                <FormHelperText error>
                                  Duration is required
                                </FormHelperText>
                              )}
                          </TableCell>
                          <TableCell align='center'>
                            <TextInput
                              fullWidth
                              placeholder='Instructions'
                              value={p.instructions}
                              onChange={(e) => {
                                const updated = [...prescriptions];
                                updated[index].instructions = e.target.value;
                                setPrescriptions(updated);
                                // Clear prescription errors when user starts typing
                                if (
                                  errors.prescriptions &&
                                  e.target.value.trim() !== ''
                                ) {
                                  // Check if all prescription fields are now filled
                                  const allFilled = updated.every(
                                    (p) =>
                                      p.medicine_name.trim() !== '' &&
                                      p.dosage.trim() !== '' &&
                                      p.duration.trim() !== '' &&
                                      p.instructions.trim() !== ''
                                  );
                                  if (allFilled) {
                                    setErrors((prev) => ({
                                      ...prev,
                                      prescriptions: false,
                                    }));
                                  }
                                }
                              }}
                              error={
                                errors.prescriptions &&
                                p.instructions.trim() === ''
                              }
                            />
                            {errors.prescriptions &&
                              p.instructions.trim() === '' && (
                                <FormHelperText error>
                                  Instructions are required
                                </FormHelperText>
                              )}
                          </TableCell>
                          <TableCell align='center'>
                            <IconButton
                              color='error'
                              onClick={() => {
                                const updatedPrescriptions =
                                  prescriptions.filter((_, i) => i !== index);
                                setPrescriptions(updatedPrescriptions);

                                // If no prescriptions left, no errors since prescriptions are optional
                                if (updatedPrescriptions.length === 0) {
                                  setErrors((prev) => ({
                                    ...prev,
                                    prescriptions: false,
                                  }));
                                } else {
                                  // Check if remaining prescriptions are valid
                                  const allFilled = updatedPrescriptions.every(
                                    (p) =>
                                      p.medicine_name.trim() !== '' &&
                                      p.dosage.trim() !== '' &&
                                      p.duration.trim() !== '' &&
                                      p.instructions.trim() !== ''
                                  );
                                  setErrors((prev) => ({
                                    ...prev,
                                    prescriptions: !allFilled,
                                  }));
                                }
                              }}
                            >
                              <DeleteIcon />
                            </IconButton>
                          </TableCell>
                        </FancyTableRow>
                      ))}
                    </TableBody>
                  </Table>
                </FancyTableContainer>

                {errors.prescriptions && (
                  <FormHelperText error sx={{ mt: 1 }}>
                    All prescription fields must be filled to save the visit
                  </FormHelperText>
                )}

                <Button
                  variant='outlined'
                  onClick={() => {
                    const newPrescription = {
                      medicine_name: '',
                      dosage: '',
                      duration: '',
                      instructions: '',
                    };
                    setPrescriptions([...prescriptions, newPrescription]);

                    // Immediately show prescription errors since we now have an empty prescription
                    setErrors((prev) => ({ ...prev, prescriptions: true }));
                  }}
                >
                  + Add Prescription
                </Button>
              </>
            )}
          </Box>

          <Box mb={3}>
            <SectionTitle variant='h6'>Report Attachments</SectionTitle>
            <UploadBox>
              <UploadFileIcon fontSize='large' />
              <Typography variant='subtitle1'>Drop or Select file</Typography>
              <Typography variant='body2' color='gray'>
                Drop files here or click browse through your machine
              </Typography>
              <Button
                component='label'
                variant='contained'
                disabled={attachments.length >= 5}
                sx={{
                  mt: 2,
                  backgroundColor: 'green',
                  color: 'white',
                  '&:hover': { backgroundColor: 'darkgreen' },
                }}
              >
                Browse Files
                <input
                  hidden
                  accept='image/*'
                  type='file'
                  onChange={handleFileChange}
                />
              </Button>

              <FilePreviewWrapper>
                {attachments.map((file, index) => (
                  <FilePreview
                    key={index}
                    onClick={() =>
                      handleImageClick(file.type === 'url' ? file.name : file)
                    }
                  >
                    <FileImg
                      src={
                        file.type === 'url'
                          ? file.name
                          : URL.createObjectURL(file)
                      }
                      alt={`attachment-${index}`}
                    />
                    <DeleteBtn
                      size='small'
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(index);
                      }}
                    >
                      <DeleteIcon fontSize='small' />
                    </DeleteBtn>
                  </FilePreview>
                ))}
              </FilePreviewWrapper>
            </UploadBox>
          </Box>

          {visit?.visit_date &&
            (() => {
              const today = new Date();
              today.setHours(0, 0, 0, 0);

              const visitDate = parseDDMMYYYY(visit.visit_date);
              visitDate.setHours(0, 0, 0, 0);

              return today.getTime() === visitDate.getTime();
            })() && (
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'flex-end', // Align buttons to the right
                  gap: 2, // Adds spacing between buttons (theme.spacing(2))
                  mt: 2, // Optional: adds some top margin for better spacing
                }}
              >
                <Button
                  variant='outlined'
                  color='error'
                  disabled={visit?.status === 'completed'}
                  onClick={() => push(`/dashboard/chat/${visit?._id}`)}
                >
                  Start Chat
                </Button>

                <LoadingButton
                  variant='contained'
                  sx={{ backgroundColor: 'green' }}
                  disabled={
                    visit?.status === 'completed' ||
                    !hasChanges ||
                    errors.symptoms ||
                    errors.notes ||
                    errors.diagnosis ||
                    errors.prescriptions
                  }
                  loading={isSubmitting}
                  onClick={handleSubmit}
                >
                  Save Visit
                </LoadingButton>
              </Box>
            )}
        </GlassCard>
      </Slide>

      <Modal open={open} onClose={() => setOpen(false)}>
        <ModalPreview>
          {previewImage && <ModalImage src={previewImage} alt='preview' />}
        </ModalPreview>
      </Modal>
    </>
  );
}
