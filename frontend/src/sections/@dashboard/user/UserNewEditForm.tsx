import * as Yup from 'yup';
import { useEffect, useMemo } from 'react';
import { useSnackbar } from 'notistack';
// next
import { useRouter } from 'next/router';
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { LoadingButton } from '@mui/lab';
import { Box, Card, Grid, Stack, Typography } from '@mui/material';
// routes
import { PATH_DASHBOARD } from '../../../routes/paths';
// components
import { FormProvider, RHFTextField } from '../../../components/hook-form';
import axiosInstance from '../../../utils/axios';
import { firstName } from 'src/_mock/name';

// ----------------------------------------------------------------------

type FormValuesProps = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  personal_address: string;
  age: number;
};

type Props = {
  isEdit?: boolean;
  currentUser?: Partial<FormValuesProps>;
};

export default function UserNewEditForm({
  isEdit = false,
  currentUser,
}: Props) {
  const { push } = useRouter();
  const { enqueueSnackbar } = useSnackbar();

  const NewUserSchema = Yup.object().shape({
    firstName: Yup.string().required('First name is required'),
    lastName: Yup.string().required('Last name is required'),
    email: Yup.string().email('Invalid email').required('Email is required'),
    phone: Yup.string().required('Phone number is required'),
    personal_address: Yup.string().required('Address is required'),
    age: Yup.number()
      .required('Age is required')
      .typeError('Age must be a number'),
  });

  const defaultValues = useMemo(
    () => ({
      firstName: currentUser?.firstName || '',
      lastName: currentUser?.lastName || '',
      email: currentUser?.email || '',
      phone: currentUser?.phone || '',
      personal_address: currentUser?.personal_address || '',
      age: currentUser?.age ?? 0,
    }),
    [currentUser]
  );

  const methods = useForm<FormValuesProps>({
    resolver: yupResolver(NewUserSchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  useEffect(() => {
    if (isEdit && currentUser) {
      reset(defaultValues);
    }
    if (!isEdit) {
      reset(defaultValues);
    }
  }, [isEdit, currentUser]);

  const createPatient = async (payload: any) => {
    const response = await axiosInstance.post('/api/doctors/patient', payload); // Replace with actual endpoint
    return response.data;
  };

  const onSubmit = async (data: FormValuesProps) => {
    const payload = {
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      phone: data.phone,
      address: data.personal_address,
      age: data.age,
    };

    try {
      await createPatient(payload);
      enqueueSnackbar('Patient created successfully!', { variant: 'success' });
      reset({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        personal_address: '',
        age: 0,
      });
    } catch (error: any) {
      enqueueSnackbar(error?.message || 'Something went wrong!', {
        variant: 'error',
      });
      console.error(error);
    }
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit as any)}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={12}>
          <Typography variant='h5' sx={{ mb: 2, fontWeight: 600 }}>
            Create New Patient
          </Typography>

          <Card sx={{ p: 3 }}>
            <Box
              sx={{
                display: 'grid',
                columnGap: 2,
                rowGap: 3,
                gridTemplateColumns: {
                  xs: 'repeat(1, 1fr)',
                  sm: 'repeat(2, 1fr)',
                },
              }}
            >
              <RHFTextField name='firstName' label='First Name' />
              <RHFTextField name='lastName' label='Last Name' />
              <RHFTextField name='email' label='Email Address' />
              <RHFTextField name='phone' label='Phone Number' />
              <RHFTextField name='personal_address' label='Address' />
              <RHFTextField name='age' label='Age' />
            </Box>

            <Stack alignItems='flex-end' sx={{ mt: 3 }}>
              <LoadingButton
                type='submit'
                variant='contained'
                loading={isSubmitting}
              >
                {!isEdit ? 'Create User' : 'Save Changes'}
              </LoadingButton>
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </FormProvider>
  );
}
