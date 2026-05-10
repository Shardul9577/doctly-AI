import * as Yup from 'yup';
import { useState } from 'react';
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import {
  Stack,
  IconButton,
  InputAdornment,
  Alert,
  Snackbar,
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
// hooks
import useAuth from '../../../hooks/useAuth';
import useIsMountedRef from '../../../hooks/useIsMountedRef';
// components
import Iconify from '../../../components/Iconify';
import { FormProvider, RHFTextField } from '../../../components/hook-form';
import RoleSelector from '../../../components/hook-form/RoleSelector';
import { useSnackbar } from 'notistack';

type FormValuesProps = {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone: string;
  role: string;
  afterSubmit?: string;
};

export default function RegisterForm() {
  const { register } = useAuth();
  const isMountedRef = useIsMountedRef();
  const { enqueueSnackbar } = useSnackbar();

  const [showPassword, setShowPassword] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [successOpen, setSuccessOpen] = useState(false);

  const RegisterSchema = Yup.object().shape({
    firstName: Yup.string().required('First name required'),
    lastName: Yup.string().required('Last name required'),
    email: Yup.string()
      .email('Email must be a valid email address')
      .required('Email is required'),
    phone: Yup.string().required('Phone number is required'),
    role: Yup.string().required('Role is required'),
    password: Yup.string()
      .required('Password is required')
      .min(6, 'Password must be at least 6 characters'),
  });

  const defaultValues: FormValuesProps = {
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    phone: '',
    role: '',
  };

  const methods = useForm<FormValuesProps>({
    resolver: yupResolver(RegisterSchema),
    defaultValues,
  });

  const {
    setError,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = methods;

  const onSubmit = async (data: FormValuesProps) => {
    try {
      const { email, password, firstName, lastName, phone, role } = data;

      await register(email, password, firstName, lastName, phone, role);

      enqueueSnackbar('Registration successful!');
      setSuccessMsg('Registration successful!');
      setSuccessOpen(true);
    } catch (error: any) {
      console.error(error);

      const serverErrors = error?.errors || [];

      serverErrors.forEach((err: any) => {
        if (isMountedRef.current) {
          setError(err.path as keyof FormValuesProps, {
            type: 'server',
            message: err.msg,
          });
        }
      });

      if (isMountedRef.current && !serverErrors.length) {
        setError('afterSubmit', { type: 'manual', message: error.message });
      }
    }
  };

  const handleCloseSuccess = () => setSuccessOpen(false);

  return (
    <>
      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={3}>
          {!!errors.afterSubmit && (
            <Alert severity="error">{errors.afterSubmit.message}</Alert>
          )}

          <RoleSelector name="role" />

          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            <RHFTextField name="firstName" label="First name" />
            <RHFTextField name="lastName" label="Last name" />
          </Stack>

          <RHFTextField name="email" autoComplete="off" label="Email address" />
          <RHFTextField name="phone" label="Phone Number" />

          <RHFTextField
            name="password"
            label="Password"
            type={showPassword ? 'text' : 'password'}
            autoComplete="new-password"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    edge="end"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    <Iconify
                      icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'}
                    />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          <LoadingButton
            fullWidth
            size="large"
            type="submit"
            variant="contained"
            loading={isSubmitting}
          >
            Register
          </LoadingButton>
        </Stack>
      </FormProvider>

      <Snackbar
        open={successOpen}
        autoHideDuration={5000}
        onClose={handleCloseSuccess}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert severity="success" onClose={handleCloseSuccess}>
          {successMsg}
        </Alert>
      </Snackbar>
    </>
  );
}
