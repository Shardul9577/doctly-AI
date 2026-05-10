import { useState, useEffect } from 'react';
import {
  Box,
  Card,
  Stack,
  MenuItem,
  FormControlLabel,
  Switch,
  Typography,
  TextField,
  Select,
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { styled } from '@mui/material/styles';
import { useSnackbar } from 'notistack';
import axiosInstance from 'src/utils/axios';

const StyledSelect = styled(Select)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    backgroundColor: theme.palette.background.default,
    '& fieldset': {
      borderColor: theme.palette.divider,
    },
    '&:hover fieldset': {
      borderColor: theme.palette.primary.main,
    },
    '&.Mui-focused fieldset': {
      borderColor: theme.palette.primary.main,
    },
  },
  '& .MuiSelect-select': {
    color: theme.palette.text.primary,
  },
}));

export default function ClinicProfile() {
  const { enqueueSnackbar } = useSnackbar();

  const [name, setName] = useState('');
  const [type, setType] = useState('clinic');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [isIndividual, setIsIndividual] = useState(true);

  const [errors, setErrors] = useState<Record<string, boolean>>({});
  const [initialData, setInitialData] = useState<any>(null);
  const [isChanged, setIsChanged] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formLocked, setFormLocked] = useState(false);

  // Watch for changes to enable Save button
  useEffect(() => {
    if (!initialData) return;

    const hasChanges =
      name !== initialData?.organization_name ||
      type !== initialData?.organization_type ||
      phone !== initialData?.organization_phone ||
      email !== initialData?.organization_email ||
      address !== (initialData?.organization_address || '') ||
      isIndividual !== initialData?.is_individual;

    setIsChanged(hasChanges);

    if (hasChanges) {
      setFormLocked(false); // allow submission after user edit
    }
  }, [name, type, phone, email, address, isIndividual, initialData]);

  const fetchData = async () => {
    try {
      const res = await axiosInstance.get('/api/doctors/profile/about');
      const data = res.data?.aboutDetails?.organization_info || {};
      setInitialData(data);
      setName(data?.organization_name || '');
      setType(data?.organization_type || 'clinic');
      setPhone(data?.organization_phone || '');
      setEmail(data?.organization_email || '');
      setAddress(data?.organization_address || '');
      setIsIndividual(data?.is_individual ?? true);
    } catch (error) {
      enqueueSnackbar('Failed to fetch organization data', {
        variant: 'error',
      });
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const validateFields = () => {
    const newErrors = {
      name: name.trim() === '',
      type: type.trim() === '',
      phone: phone.trim() === '',
      email: email.trim() === '',
      address: address.trim() === '',
    };
    setErrors(newErrors);
    return !Object.values(newErrors).some(Boolean);
  };

  const handleSubmit = async () => {
    if (!validateFields()) {
      enqueueSnackbar('Please fill all required fields.', { variant: 'error' });
      return;
    }

    setSubmitting(true);
    setFormLocked(true); // prevent button from enabling after submit

    try {
      const payload = {
        name,
        type,
        phone,
        email,
        address,
        is_individual: isIndividual,
      };

      const res = await axiosInstance.post(
        '/api/doctors/profile/organization',
        payload
      );

      enqueueSnackbar(res?.data?.message || 'Clinic profile saved!', {
        variant: 'success',
      });

      const data = res.data?.aboutDetails?.organization_info || {};
      setInitialData(data);
      setIsChanged(false);
    } catch (error: any) {
      const errMsg = error?.message || 'Failed to save profile';
      enqueueSnackbar(errMsg, { variant: 'error' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Card sx={{ p: 3 }}>
      <Stack spacing={3}>
        <TextField
          fullWidth
          label='Name'
          value={name}
          onChange={(e) => setName(e.target.value)}
          error={errors.name}
          helperText={errors.name ? 'Name is required' : ''}
        />

        <StyledSelect
          fullWidth
          value={type}
          onChange={(e) => setType(e.target.value)}
          displayEmpty
          error={errors.type}
        >
          <MenuItem value=''>Select Type</MenuItem>
          <MenuItem value='clinic'>Clinic</MenuItem>
          <MenuItem value='hospital'>Hospital</MenuItem>
        </StyledSelect>
        {errors.type && (
          <Typography variant='body2' color='error' sx={{ ml: 1 }}>
            Type is required
          </Typography>
        )}

        <TextField
          fullWidth
          label='Phone'
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          error={errors.phone}
          helperText={errors.phone ? 'Phone is required' : ''}
        />

        <TextField
          fullWidth
          label='Clinic Email'
          type='email'
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={errors.email}
          helperText={errors.email ? 'Email is required' : ''}
        />

        <TextField
          fullWidth
          label='Clinic Address'
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          error={errors.address}
          helperText={errors.address ? 'Address is required' : ''}
        />

        <FormControlLabel
          control={
            <Switch
              checked={isIndividual}
              onChange={(e) => setIsIndividual(e.target.checked)}
            />
          }
          label='Is Individual Practitioner'
        />

        <LoadingButton
          type='submit'
          variant='contained'
          loading={submitting}
          onClick={handleSubmit}
          disabled={!isChanged || formLocked} // 🔒 prevent resubmit until change
          sx={{ width: 200, alignSelf: 'flex-end' }}
        >
          Save Changes
        </LoadingButton>
      </Stack>
    </Card>
  );
}
