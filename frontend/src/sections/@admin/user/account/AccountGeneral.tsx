import * as Yup from 'yup';
import { useSnackbar } from 'notistack';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import {
  Box,
  Grid,
  Card,
  Stack,
  Typography,
  MenuItem,
  IconButton,
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import DeleteIcon from '@mui/icons-material/Delete';
import { fData } from '../../../../utils/formatNumber';
import { CustomFile } from '../../../../components/upload';
import {
  FormProvider,
  RHFSelect,
  RHFTextField,
  RHFUploadAvatar,
  RHFDateInput,
} from '../../../../components/hook-form';
import dayjs from 'dayjs';
import axiosInstance from 'src/utils/axios';



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

export default function AccountGeneral() {
  const { enqueueSnackbar } = useSnackbar();
  const [user, setUser] = useState<FormValuesProps | null>(null);
  const [isImageDeleted, setIsImageDeleted] = useState(false);


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
        if (isImageDeleted || !file) return false;
        return true;
      }
    ),
  });
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
  const methods = useForm<FormValuesProps>({
    resolver: yupResolver(UpdateUserSchema),
    defaultValues,
    mode: 'onChange',
  });

  const {
    watch,
    reset,
    setValue,
    handleSubmit,
    formState: { isSubmitting, isDirty, errors },
  } = methods;

  const fetchUserData = async () => {
    try {
      const response = await axiosInstance('/api/admin/account/my-account');

      const userData = response?.data?.aboutDetails;
      const fullName = userData?.personal_info?.fullName || '';
      const [firstName = '', lastName = ''] = fullName.split(' ');
      const rawDob = userData?.personal_info?.date_of_birth || '';

      const transformedData: FormValuesProps = {
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
      setUser(transformedData);
      reset(transformedData);
      if (
        transformedData.profile_picture &&
        typeof transformedData.profile_picture === 'string'
      ) {
        setValue('profile_picture', {
          preview: transformedData.profile_picture,
        } as any);
      }
    } catch (err: any) {
      console.error('Error fetching doctor profile:');
      enqueueSnackbar('Failed to load profile data', { variant: 'error' });
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  const onSubmit = async (data: FormValuesProps) => {
    try {
      const formData = new FormData();
      const formattedDate = data.date_of_birth.split('-').reverse().join('/');

      if (data.profile_picture instanceof File) {
        formData.append('profile_picture', data.profile_picture);
      } else if (typeof data.profile_picture === 'string' && !isImageDeleted) {
        formData.append('profile_picture', data.profile_picture);
      } else if (isImageDeleted || !data.profile_picture) {
        formData.append('profile_picture', '');
      }

      formData.append('firstName', data.firstName);
      formData.append('lastName', data.lastName);
      formData.append('phone', data.phone || '');
      formData.append('personal_address', data.address || '');
      formData.append('about', data.about || '');
      formData.append('age', data.age);
      formData.append('gender', data.gender);
      formData.append('marital_status', data.maritalStatus);
      formData.append('birth_date', formattedDate);
      formData.append('blood_group', data.bloodGroup);
      formData.append('spouse_full_name', data.spouse_full_name);

      let res = await axiosInstance.put('/api/admin/account', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      enqueueSnackbar(res?.data?.message || 'Profile updated successfully!', {
        variant: 'success',
      });
      reset(data);
      setIsImageDeleted(false);
    } catch (error: any) {
      console.error('Update error:', error);
      enqueueSnackbar(error?.message || 'Failed to update profile', {
        variant: 'error',
      });
    }
  };

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

  const profilePicture = watch('profile_picture');

  if (!user) {
    return <Typography>Loading profile...</Typography>;
  }

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Card
            sx={{ py: 10, px: 3, textAlign: 'center', position: 'relative' }}
          >
            <RHFUploadAvatar
              name='profile_picture'
              maxSize={3145728}
              onDrop={handleDrop}
              error={Boolean(errors.profile_picture)}
              helperText={
                errors.profile_picture ? (
                  <Typography
                    variant='caption'
                    color='error'
                    sx={{ mt: 2, display: 'block' }}
                  >
                    {errors.profile_picture.message}
                  </Typography>
                ) : (
                  <Typography
                    variant='caption'
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
                onClick={() => {
                  setValue('profile_picture', null, {
                    shouldValidate: true,
                    shouldDirty: true,
                  });
                  setIsImageDeleted(true);
                }}
                sx={{
                  position: 'absolute',
                  top: 8,
                  right: 8,
                  backgroundColor: 'rgba(255,255,255,0.8)',
                  zIndex: 2,
                }}
              >
                <DeleteIcon color='error' />
              </IconButton>
            )}
          </Card>
        </Grid>

        <Grid item xs={12} md={8}>
          <Card sx={{ p: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <RHFTextField name='firstName' label='First Name' />
              </Grid>

              <Grid item xs={12} sm={6}>
                <RHFTextField name='lastName' label='Last Name' />
              </Grid>

              <Grid item xs={12} sm={6}>
                <RHFTextField name='email' label='Email Address' />
              </Grid>

              <Grid item xs={12} sm={6}>
                <RHFTextField name='phone' label='Phone Number' />
              </Grid>

              <Grid item xs={12} sm={6}>
                <RHFTextField name='age' label='Age' />
              </Grid>

              <Grid item xs={12} sm={6}>
                <RHFSelect name='gender' label='Gender'>
                  <MenuItem value=''>
                    <em>Select Gender</em>
                  </MenuItem>
                  <MenuItem value='male'>Male</MenuItem>
                  <MenuItem value='female'>Female</MenuItem>
                  <MenuItem value='other'>Other</MenuItem>
                </RHFSelect>
              </Grid>

              <Grid item xs={12} sm={6}>
                <RHFSelect name='maritalStatus' label='Marital Status'>
                  <MenuItem value=''>
                    <em>Select Marital Status</em>
                  </MenuItem>
                  <MenuItem value='single'>Single</MenuItem>
                  <MenuItem value='married'>Married</MenuItem>
                </RHFSelect>
              </Grid>

              <Grid item xs={12} sm={6}>
                <RHFDateInput name='date_of_birth' label='Date Of Birth' />
              </Grid>

              <Grid item xs={12} sm={6}>
                <RHFSelect name='bloodGroup' label='Blood Group'>
                  <MenuItem value=''>
                    <em>Select Blood Group</em>
                  </MenuItem>
                  <MenuItem value='A+'>A+</MenuItem>
                  <MenuItem value='A-'>A-</MenuItem>
                  <MenuItem value='B+'>B+</MenuItem>
                  <MenuItem value='B-'>B-</MenuItem>
                  <MenuItem value='O+'>O+</MenuItem>
                  <MenuItem value='O-'>O-</MenuItem>
                  <MenuItem value='AB+'>AB+</MenuItem>
                  <MenuItem value='AB-'>AB-</MenuItem>
                </RHFSelect>
              </Grid>

              <Grid item xs={12} sm={6}>
                <RHFTextField
                  name='spouse_full_name'
                  label='Spouse Full Name'
                />
              </Grid>
            </Grid>

            <Box sx={{ mt: 3 }}>
              <RHFTextField name='address' label='Address' />
            </Box>

            <Stack spacing={3} alignItems='flex-end' sx={{ mt: 3 }}>
              <RHFTextField name='about' multiline rows={4} label='About' />

              <LoadingButton
                type='submit'
                variant='contained'
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
