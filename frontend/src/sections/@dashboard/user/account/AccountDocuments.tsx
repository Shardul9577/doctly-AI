import { useState, useEffect } from 'react';
import { styled, Theme } from '@mui/material/styles';
import {
  Box,
  Container,
  Typography,
  Chip,
  TextField,
  Button,
  Divider,
  Grid,
  IconButton,
  Modal,
  MenuItem,
  Select,
  InputLabel,
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DeleteIcon from '@mui/icons-material/Delete';
import Page from '../../../../components/Page';
import axiosInstance from 'src/utils/axios';
import { useSnackbar } from 'notistack';
import { LoadingButton } from '@mui/lab';

const UploadCardWrapper = styled(Box)(({ theme }: { theme: Theme }) => ({
  position: 'relative',
  backgroundColor: theme.palette.background.paper,
  borderRadius: theme.spacing(2),
  padding: theme.spacing(3),
  border: `2px dashed ${theme.palette.divider}`,
  textAlign: 'center',
  color: theme.palette.text.primary,
  minHeight: 280,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  transition: '0.3s ease',
  overflow: 'hidden',
  '&:hover': {
    backgroundColor: theme.palette.action.hover,
    borderColor: theme.palette.primary.main,
  },
  [theme.breakpoints.up('md')]: {
    minWidth: 300,
  },
}));

const UploadedImage = styled('img')({
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  borderRadius: '16px',
  zIndex: 1,
  cursor: 'pointer',
});

type DocumentUploadCardProps = {
  label: string;
  file: File | null;
  fileUrl?: string;
  setFile: React.Dispatch<React.SetStateAction<File | null>>;
  error?: boolean;
  onDelete?: () => void;
};

function DocumentUploadCard({
  label,
  file,
  fileUrl,
  setFile,
  error,
  onDelete,
}: DocumentUploadCardProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const preview = file ? URL.createObjectURL(file) : fileUrl || '';

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = event.target.files?.[0];
    if (uploadedFile) {
      setFile(uploadedFile);
    }
  };

  return (
    <Box sx={{ position: 'relative' }}>
      <Typography
        variant='subtitle1'
        sx={{ fontWeight: 600, mb: 2, textAlign: 'center' }}
      >
        {label}
      </Typography>
      <UploadCardWrapper sx={{ borderColor: error ? 'red' : undefined }}>
        {preview && (
          <>
            <UploadedImage src={preview} onClick={() => setModalOpen(true)} />
            <IconButton
              onClick={() => {
                setFile(null);
                onDelete?.();
              }}
              sx={{
                position: 'absolute',
                top: 8,
                right: 8,
                zIndex: 2,
                backgroundColor: 'rgba(255,255,255,0.9)',
                '&:hover': { backgroundColor: '#fecaca' },
              }}
            >
              <DeleteIcon sx={{ color: 'red' }} />
            </IconButton>
          </>
        )}

        <input
          type='file'
          accept='image/*'
          style={{ display: 'none' }}
          id={`upload-${label}`}
          onChange={handleFileChange}
        />
        <label htmlFor={`upload-${label}`} style={{ cursor: 'pointer' }}>
          <CloudUploadIcon sx={{ fontSize: 48, mb: 1 }} />
          <Typography variant='subtitle1' fontWeight={700}>
            Drop or Select file
          </Typography>
          <Typography variant='body2'>Click to browse your machine</Typography>
        </label>

        {!preview && (
          <Typography
            variant='body2'
            sx={{ mt: 2, color: error ? 'red' : 'text.secondary' }}
          >
            {error ? 'Please upload an image' : 'No image uploaded yet'}
          </Typography>
        )}
      </UploadCardWrapper>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            bgcolor: 'background.paper',
            boxShadow: 24,
            borderRadius: 2,
            outline: 'none',
            p: 1,
            maxWidth: '90vw',
          }}
        >
          <img
            src={preview}
            alt={label}
            style={{ maxWidth: '100%', maxHeight: '80vh', borderRadius: 8 }}
          />
        </Box>
      </Modal>
    </Box>
  );
}

const inputStyle = (theme: Theme) => ({
  backgroundColor: theme.palette.mode === 'light' ? '#f9fafb' : '#1e293b',
  borderRadius: 2,
  input: { color: theme.palette.text.primary },
  '& .MuiOutlinedInput-root': {
    '& fieldset': { borderColor: theme.palette.divider },
    '&:hover fieldset': { borderColor: theme.palette.text.secondary },
    '&.Mui-focused fieldset': { borderColor: theme.palette.primary.main },
    '&.Mui-error fieldset': { borderColor: theme.palette.error.main },
  },
});

export default function AccountDocuments() {
  const { enqueueSnackbar } = useSnackbar();
  const [degreeFile, setDegreeFile] = useState<File | null>(null);
  const [aadharFile, setAadharFile] = useState<File | null>(null);
  const [panFile, setPanFile] = useState<File | null>(null);
  const [degreeFileUrl, setDegreeFileUrl] = useState('');
  const [aadharFileUrl, setAadharFileUrl] = useState('');
  const [panFileUrl, setPanFileUrl] = useState('');
  const [licenseNumber, setLicenseNumber] = useState('');
  const [medicalSchool, setMedicalSchool] = useState('');
  const [specialization, setSpecialization] = useState('');
  const [specializationList, setSpecializationList] = useState<string[]>([]);
  const [qualification, setQualification] = useState('');
  const [qualificationList, setQualificationList] = useState<string[]>([]);
  const [languageList, setLanguageList] = useState<string[]>([]);
  const [errors, setErrors] = useState<Record<string, boolean>>({});
  const [initialData, setInitialData] = useState<any>(null);
  const [isChanged, setIsChanged] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const userData =
    typeof window !== 'undefined'
      ? JSON.parse(localStorage.getItem('userData') || 'null')
      : null;

  const handleAdd = (
    value: string,
    setValue: any,
    list: string[],
    setList: any
  ) => {
    if (value.trim()) {
      setList([...list, value.trim()]);
      setValue('');
    }
  };

  const handleDelete = (index: number, list: string[], setList: any) => {
    const newList = [...list];
    newList.splice(index, 1);
    setList(newList);
  };

  const checkIfChanged = () => {
    if (!initialData) return false;

    return (
      licenseNumber !== initialData.license_number ||
      medicalSchool !== initialData.medical_school ||
      specializationList.join(',') !== initialData.specialization ||
      qualificationList.join(',') !== initialData.qualification ||
      JSON.stringify(languageList) !==
        JSON.stringify(initialData.languages || []) ||
      degreeFile !== null ||
      panFile !== null ||
      aadharFile !== null ||
      (!degreeFile && degreeFileUrl === '' && initialData.degree_url) ||
      (!panFile && panFileUrl === '' && initialData.pan_card_url) ||
      (!aadharFile && aadharFileUrl === '' && initialData.aadhaar_card_url)
    );
  };

  useEffect(() => {
    setIsChanged(checkIfChanged());
  }, [
    licenseNumber,
    medicalSchool,
    specializationList,
    qualificationList,
    languageList,
    degreeFile,
    panFile,
    aadharFile,
    degreeFileUrl,
    panFileUrl,
    aadharFileUrl,
    initialData,
  ]);

  const handleSubmit = async () => {
    if (!initialData) {
      enqueueSnackbar('Data not loaded yet', { variant: 'error' });
      return;
    }

    const newErrors = {
      licenseNumber: licenseNumber.trim() === '',
      medicalSchool: medicalSchool.trim() === '',
      specializationList: specializationList.length === 0,
      qualificationList: qualificationList.length === 0,
      languageList: languageList.length === 0,
      degreeFile: !degreeFile && !degreeFileUrl,
      panFile: !panFile && !panFileUrl,
      aadharFile: !aadharFile && !aadharFileUrl,
    };

    setErrors(newErrors);

    if (Object.values(newErrors).some(Boolean)) {
      enqueueSnackbar('Please fill in all required fields', {
        variant: 'error',
      });
      return;
    }

    const formData = new FormData();
    formData.append('license_number', licenseNumber);
    formData.append('medical_school', medicalSchool);
    formData.append('specialization', specializationList.join(','));
    formData.append('qualification', qualificationList.join(','));
    languageList.forEach((lang) => formData.append('languages[]', lang));
    if (degreeFile) formData.append('degree_file', degreeFile);
    if (panFile) formData.append('pan_card_file', panFile);
    if (aadharFile) formData.append('aadhaar_card_file', aadharFile);

    try {
      setSubmitting(true);
      const res = await axiosInstance.post(
        '/api/doctors/profile/personal-info',
        formData,
        {
          headers: { 'Content-Type': 'multipart/form-data' },
        }
      );
      enqueueSnackbar(res?.data?.message || 'Profile updated successfully!', {
        variant: 'success',
      });
      setIsChanged(false);
    } catch (err: any) {
      enqueueSnackbar(err?.message || 'Failed to update profile', {
        variant: 'error',
      });
    } finally {
      setSubmitting(false);
    }
  };

  const fetchData = async () => {
    try {
      const res = await axiosInstance.get('/api/doctors/profile/about');
      const data = res.data?.aboutDetails?.qualification_info;
      const imageData = res.data?.aboutDetails?.download_images;
      setInitialData(data);
      setLicenseNumber(data?.license_number || '');
      setMedicalSchool(data?.medical_school || '');
      setSpecializationList(data?.specialization?.split(',') || []);
      setQualificationList(data?.qualification?.split(',') || []);
      setLanguageList(data?.languages || []);
      setDegreeFileUrl(imageData?.degree_url || '');
      setAadharFileUrl(imageData?.aadhaar_card_url || '');
      setPanFileUrl(imageData?.pan_card_url || '');
    } catch (error) {
      enqueueSnackbar('Failed to load data', { variant: 'error' });
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <Page title='Account - Documents'>
      <Container maxWidth='xl'>
        {/* <Typography variant='h4' sx={{ mb: 3 }}>
          Upload Documents
        </Typography>
        <Divider sx={{ borderColor: '#475569', mb: 4 }} /> */}

        <Grid container spacing={6} sx={{ mb: 5 }}>
          <Grid item xs={12} md={4}>
            <DocumentUploadCard
              label='Degree Certificate'
              file={degreeFile}
              fileUrl={degreeFileUrl}
              setFile={setDegreeFile}
              error={errors.degreeFile}
              onDelete={() => setDegreeFileUrl('')}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <DocumentUploadCard
              label='Aadhar Card'
              file={aadharFile}
              fileUrl={aadharFileUrl}
              setFile={setAadharFile}
              error={errors.aadharFile}
              onDelete={() => setAadharFileUrl('')}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <DocumentUploadCard
              label='PAN Card'
              file={panFile}
              fileUrl={panFileUrl}
              setFile={setPanFile}
              error={errors.panFile}
              onDelete={() => setPanFileUrl('')}
            />
          </Grid>
        </Grid>

        <Box mb={2}>
          <TextField
            label='License Number'
            fullWidth
            value={licenseNumber}
            onChange={(e) => setLicenseNumber(e.target.value)}
            error={errors.licenseNumber}
            helperText={
              errors.licenseNumber ? 'License Number is required' : ''
            }
            sx={inputStyle}
          />
        </Box>

        <Box mb={2}>
          <TextField
            label='Medical School'
            fullWidth
            value={medicalSchool}
            onChange={(e) => setMedicalSchool(e.target.value)}
            error={errors.medicalSchool}
            helperText={
              errors.medicalSchool ? 'Medical School is required' : ''
            }
            sx={inputStyle}
          />
        </Box>

        <Box mb={2}>
          <TextField
            label='Enter specialization'
            fullWidth
            value={specialization}
            onChange={(e) => setSpecialization(e.target.value)}
            onKeyDown={(e) =>
              e.key === 'Enter' &&
              handleAdd(
                specialization,
                setSpecialization,
                specializationList,
                setSpecializationList
              )
            }
            error={errors.specializationList}
            helperText={
              errors.specializationList
                ? 'At least one specialization is required'
                : ''
            }
            sx={inputStyle}
          />
        </Box>

        <Box mb={2} sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
          {specializationList.map((item, i) => (
            <Chip
              key={i}
              label={item}
              onDelete={() =>
                handleDelete(i, specializationList, setSpecializationList)
              }
            />
          ))}
        </Box>

        <Box mb={2}>
          <TextField
            label='Qualification'
            fullWidth
            value={qualification}
            onChange={(e) => setQualification(e.target.value)}
            onKeyDown={(e) =>
              e.key === 'Enter' &&
              handleAdd(
                qualification,
                setQualification,
                qualificationList,
                setQualificationList
              )
            }
            error={errors.qualificationList}
            helperText={
              errors.qualificationList
                ? 'At least one qualification is required'
                : ''
            }
            sx={inputStyle}
          />
        </Box>

        <Box mb={2} sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
          {qualificationList.map((item, i) => (
            <Chip
              key={i}
              label={item}
              onDelete={() =>
                handleDelete(i, qualificationList, setQualificationList)
              }
            />
          ))}
        </Box>

        <Box mb={1}>
          <InputLabel
            id='language-select-label'
            sx={{ color: (theme) => theme.palette.text.primary, mb: 1 }}
          >
            Languages Spoken
          </InputLabel>
          <Select
            labelId='language-select-label'
            multiple
            fullWidth
            value={languageList}
            onChange={(e) => setLanguageList(e.target.value as string[])}
            error={errors.languageList}
            sx={inputStyle}
            renderValue={(selected) => selected.join(', ')}
          >
            {[
              'English',
              'Hindi',
              'Gujarati',
              'Marathi',
              'Bengali',
              'Tamil',
              'Telugu',
            ].map((lang) => (
              <MenuItem key={lang} value={lang}>
                {lang}
              </MenuItem>
            ))}
          </Select>
        </Box>

        {errors.languageList && (
          <Typography variant='body2' color='error' sx={{ mb: 2 }}>
            At least one language is required
          </Typography>
        )}

        {/* <Button
          variant='contained'
          sx={{ mt: 4, width: 200 }}
          onClick={handleSubmit}
          disabled={!isChanged || submitting}
        >
          Save & Continue
        </Button> */}

        {/* <LoadingButton
          type='submit'
          sx={{ mt: 4, width: 200 }}
          variant='contained'
          loading={submitting}
          onClick={handleSubmit}
          disabled={!isChanged || submitting}
        >
          Save Changes
        </LoadingButton> */}
        {userData?.verified_status !== 'verified' && (
          <LoadingButton
            type='submit'
            variant='contained'
            loading={submitting}
            onClick={handleSubmit}
            disabled={!isChanged || submitting} // 🔒 prevent resubmit until change
            sx={{ width: 200, alignSelf: 'flex-end', mt: 4 }}
          >
            Save Changes
          </LoadingButton>
        )}
      </Container>
    </Page>
  );
}
