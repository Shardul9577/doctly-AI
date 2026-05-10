import * as Yup from 'yup';
import { useSnackbar } from 'notistack';
import { useCallback, useEffect, useState, useMemo } from 'react';
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import {
  Box,
  Grid,
  Card,
  Stack,
  Typography,
  IconButton,
  MenuItem,
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import DeleteIcon from '@mui/icons-material/Delete';
// utils
import { fData } from '../../../../utils/formatNumber';
// components
import { CustomFile } from '../../../../components/upload';
import {
  FormProvider,
  RHFTextField,
  RHFSelect,
  RHFUploadAvatar,
  RHFDateInput,
} from '../../../../components/hook-form';
import axiosInstance from 'src/utils/axios';
import dayjs from 'dayjs';

// ----------------------------------------------------------------------

type FormValuesProps = {
  firstName: string;
  lastName: string;
  email: string;
  profile_picture: CustomFile | string | null;
  phone: string | null;
  address: string | null;
  about: string | null;
  age: string;
  gender: string;
  maritalStatus: string;
  date_of_birth: string;
  bloodGroup: string;
  spouse_full_name: string;
};

// Memoized validation schema
const UpdateUserSchema = Yup.object().shape({
  firstName: Yup.string().required('First name is required'),
  lastName: Yup.string().required('Last name is required'),
  email: Yup.string().email('Invalid email').required('Email is required'),
  phone: Yup.string().required('Phone number is required'),
  age: Yup.string().required('Age is required'),
  gender: Yup.string().required('Gender is required'),
  maritalStatus: Yup.string().required('Marital status is required'),
  date_of_birth: Yup.mixed()
    .required('Date of birth is required')
    .test('is-date', 'Invalid date', (value) => dayjs(value).isValid()),
  bloodGroup: Yup.string().required('Blood group is required'),
  spouse_full_name: Yup.string().nullable(),
  address: Yup.string().nullable(),
  about: Yup.string().nullable(),
  profile_picture: Yup.mixed().test(
    'required-image',
    'Profile picture is required',
    function (value) {
      const file = value as CustomFile | string | null;
      // Get isImageDeleted from context or pass it differently
      return file !== null;
    }
  ),
});

// Memoized default values
const defaultValues: FormValuesProps = {
  firstName: '',
  lastName: '',
  email: '',
  profile_picture: '',
  phone: '',
  address: '',
  about: '',
  age: '',
  gender: '',
  maritalStatus: '',
  date_of_birth: '',
  bloodGroup: '',
  spouse_full_name: '',
};

// Memoized gender options
const genderOptions = [
  { value: '', label: 'Select Gender' },
  { value: 'male', label: 'Male' },
  { value: 'female', label: 'Female' },
  { value: 'other', label: 'Other' },
];

// Memoized marital status options
const maritalStatusOptions = [
  { value: '', label: 'Select Marital Status' },
  { value: 'single', label: 'Single' },
  { value: 'married', label: 'Married' },
];

// Memoized blood group options
const bloodGroupOptions = [
  { value: '', label: 'Select Blood Group' },
  { value: 'A+', label: 'A+' },
  { value: 'A-', label: 'A-' },
  { value: 'B+', label: 'B+' },
  { value: 'B-', label: 'B-' },
  { value: 'O+', label: 'O+' },
  { value: 'O-', label: 'O-' },
  { value: 'AB+', label: 'AB+' },
  { value: 'AB-', label: 'AB-' },
];

export default function AccountGeneral() {
  const { enqueueSnackbar } = useSnackbar();
  const [user, setUser] = useState<FormValuesProps | null>(null);
  const [isImageDeleted, setIsImageDeleted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const methods = useForm<FormValuesProps>({
    resolver: yupResolver(UpdateUserSchema),
    defaultValues,
    mode: 'onChange',
  });

  const {
    setValue,
    handleSubmit,
    watch,
    formState: { isSubmitting, isDirty, errors },
    reset,
  } = methods;

  // Memoized data transformation function
  const transformUserData = useCallback((userData: any): FormValuesProps => {
    const fullName = userData?.personal_info?.fullName || '';
    const [firstName = '', lastName = ''] = fullName.split(' ');
    const rawDob = userData?.personal_info?.date_of_birth || '';

    return {
      firstName,
      lastName,
      email: userData?.personal_info?.email || '',
      phone: userData?.personal_info?.phone || '',
      profile_picture: userData?.profile_picture || '',
      address: userData?.personal_info?.personal_address || '',
      about: userData?.about || '',
      age: userData?.personal_info?.age?.toString() || '',
      gender: userData?.personal_info?.gender || '',
      maritalStatus: userData?.personal_info?.marital_status || '',
      date_of_birth:
        rawDob && dayjs(rawDob).isValid()
          ? dayjs(rawDob).format('YYYY-MM-DD')
          : '',
      bloodGroup: userData?.personal_info?.blood_group || '',
      spouse_full_name: userData?.personal_info?.spouse_full_name || '',
    };
  }, []);

  // Optimized data fetching
  const fetchCurrData = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await axiosInstance('/api/doctors/profile/about');
      const userData = response?.data?.aboutDetails;

      if (!userData) {
        throw new Error('No user data received');
      }

      const transformedData = transformUserData(userData);
      setUser(transformedData);
      reset(transformedData);

      // Set profile picture preview if available
      if (
        transformedData.profile_picture &&
        typeof transformedData.profile_picture === 'string'
      ) {
        setValue('profile_picture', {
          preview: transformedData.profile_picture,
        } as any);
      }
    } catch (error) {
      console.error('Error fetching doctor profile:', error);
      enqueueSnackbar('Failed to load profile data', { variant: 'error' });
    } finally {
      setIsLoading(false);
    }
  }, [transformUserData, reset, setValue, enqueueSnackbar]);

  useEffect(() => {
    fetchCurrData();
  }, [fetchCurrData]);

  // Optimized form submission
  const onSubmit = useCallback(
    async (data: FormValuesProps) => {
      try {
        const formData = new FormData();
        const formattedDate = data.date_of_birth.split('-').reverse().join('/');

        // Handle profile picture
        if (data.profile_picture instanceof File) {
          formData.append('profile_picture', data.profile_picture);
        } else if (
          typeof data.profile_picture === 'string' &&
          !isImageDeleted
        ) {
          formData.append('profile_picture', data.profile_picture);
        } else {
          formData.append('profile_picture', '');
        }

        // Append form data
        const formFields = {
          firstName: data.firstName,
          lastName: data.lastName,
          phone: data.phone || '',
          personal_address: data.address || '',
          about: data.about || '',
          age: data.age,
          gender: data.gender,
          marital_status: data.maritalStatus,
          birth_date: formattedDate,
          blood_group: data.bloodGroup,
          spouse_full_name: data.spouse_full_name,
        };

        Object.entries(formFields).forEach(([key, value]) => {
          formData.append(key, value);
        });

        const response = await axiosInstance.put(
          '/api/doctors/profile',
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          }
        );

        enqueueSnackbar(
          response?.data?.message || 'Profile updated successfully!',
          {
            variant: 'success',
          }
        );
        reset(data);
        setIsImageDeleted(false);
      } catch (error: any) {
        console.error('Update error:', error);
        enqueueSnackbar(error?.message || 'Failed to update profile', {
          variant: 'error',
        });
      }
    },
    [isImageDeleted, reset, enqueueSnackbar]
  );

  // Optimized file drop handler
  const handleDrop = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];

      if (file) {
        const newFile = Object.assign(file, {
          preview: URL.createObjectURL(file),
        });

        setValue('profile_picture', newFile, {
          shouldValidate: true,
          shouldDirty: true,
        });

        setIsImageDeleted(false);
      }
    },
    [setValue]
  );

  // Memoized profile picture watcher
  const profilePicture = watch('profile_picture');

  // Memoized delete handler
  const handleDeleteImage = useCallback(() => {
    setValue('profile_picture', null, {
      shouldValidate: true,
      shouldDirty: true,
    });
    setIsImageDeleted(true);
  }, [setValue]);

  // Loading state
  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
        <Typography>Loading profile...</Typography>
      </Box>
    );
  }

  if (!user) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
        <Typography color="error">Failed to load profile data</Typography>
      </Box>
    );
  }

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Card
            sx={{ py: 10, px: 3, textAlign: 'center', position: 'relative' }}
          >
            <RHFUploadAvatar
              name="profile_picture"
              maxSize={3145728}
              onDrop={handleDrop}
              error={Boolean(errors.profile_picture)}
              helperText={
                errors.profile_picture ? (
                  <Typography
                    variant="caption"
                    color="error"
                    sx={{ mt: 2, display: 'block' }}
                  >
                    {errors.profile_picture.message}
                  </Typography>
                ) : (
                  <Typography
                    variant="caption"
                    sx={{
                      mt: 2,
                      mx: 'auto',
                      display: 'block',
                      textAlign: 'center',
                      color: 'text.secondary',
                    }}
                  >
                    Allowed *.jpeg, *.jpg, *.png, *.gif
                    <br /> max size of {fData(3145728)}
                  </Typography>
                )
              }
            />

            {profilePicture && !isImageDeleted && (
              <IconButton
                onClick={handleDeleteImage}
                sx={{
                  position: 'absolute',
                  top: 8,
                  right: 8,
                  backgroundColor: 'rgba(255,255,255,0.8)',
                  zIndex: 2,
                }}
              >
                <DeleteIcon color="error" />
              </IconButton>
            )}
          </Card>
        </Grid>

        <Grid item xs={12} md={8}>
          <Card sx={{ p: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <RHFTextField name="firstName" label="First Name" />
              </Grid>

              <Grid item xs={12} sm={6}>
                <RHFTextField name="lastName" label="Last Name" />
              </Grid>

              <Grid item xs={12} sm={6}>
                <RHFTextField name="email" label="Email Address" />
              </Grid>

              <Grid item xs={12} sm={6}>
                <RHFTextField name="phone" label="Phone Number" />
              </Grid>

              <Grid item xs={12} sm={6}>
                <RHFTextField name="age" label="Age" />
              </Grid>

              <Grid item xs={12} sm={6}>
                <RHFSelect name="gender" label="Gender">
                  {genderOptions.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.value ? option.label : <em>{option.label}</em>}
                    </MenuItem>
                  ))}
                </RHFSelect>
              </Grid>

              <Grid item xs={12} sm={6}>
                <RHFSelect name="maritalStatus" label="Marital Status">
                  {maritalStatusOptions.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.value ? option.label : <em>{option.label}</em>}
                    </MenuItem>
                  ))}
                </RHFSelect>
              </Grid>

              <Grid item xs={12} sm={6}>
                <RHFDateInput name="date_of_birth" label="Date Of Birth" />
              </Grid>

              <Grid item xs={12} sm={6}>
                <RHFSelect name="bloodGroup" label="Blood Group">
                  {bloodGroupOptions.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.value ? option.label : <em>{option.label}</em>}
                    </MenuItem>
                  ))}
                </RHFSelect>
              </Grid>

              <Grid item xs={12} sm={6}>
                <RHFTextField
                  name="spouse_full_name"
                  label="Spouse Full Name"
                />
              </Grid>
            </Grid>

            <Box sx={{ mt: 3 }}>
              <RHFTextField name="address" label="Address" />
            </Box>

            <Stack spacing={3} alignItems="flex-end" sx={{ mt: 3 }}>
              <RHFTextField name="about" multiline rows={4} label="About" />

              <LoadingButton
                type="submit"
                variant="contained"
                loading={isSubmitting}
                disabled={!isDirty || isSubmitting}
              >
                Save Changes
              </LoadingButton>
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </FormProvider>
  );
}
