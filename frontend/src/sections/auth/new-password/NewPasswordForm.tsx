import * as Yup from 'yup';
import { useSnackbar } from 'notistack';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Stack, IconButton, InputAdornment } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import Iconify from '../../../components/Iconify';
import { FormProvider, RHFTextField } from '../../../components/hook-form';
import axios from '../../../utils/axios';
import { useRouter } from 'next/router';
import { BACKEND_URL } from 'src/config';

// ----------------------------------------------------------------------

type FormValuesProps = {
  password: string;
  confirmPassword: string;
};

export default function NewPasswordForm() {
  const { enqueueSnackbar } = useSnackbar();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const { query, push } = useRouter();

  const token = query?.token.slice(6);

  const Schema = Yup.object().shape({
    password: Yup.string()
      .min(6, 'Password must be at least 6 characters')
      .required('Password is required'),
    confirmPassword: Yup.string()
      .required('Confirm password is required')
      .oneOf([Yup.ref('password')], 'Passwords must match'),
  });

  const defaultValues = {
    password: '',
    confirmPassword: '',
  };

  const methods = useForm({
    mode: 'all',
    resolver: yupResolver(Schema),
    defaultValues,
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = async (data: FormValuesProps) => {
    try {
      setLoading(true);

      const response = await axios.post(
        `${BACKEND_URL}/api/auth/reset-password?token=${token}`,
        {
          password: data.password,
        }
      );

      enqueueSnackbar('Password reset successful!', { variant: 'success' });
      push('/auth/login');
    } catch (error: any) {
      const message =
        error?.response?.data?.message || '❌ Password reset failed';
      enqueueSnackbar(message, { variant: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={3}>
        <RHFTextField
          name="password"
          label="New Password"
          type={showPassword ? 'text' : 'password'}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  onClick={() => setShowPassword(!showPassword)}
                  edge="end"
                >
                  <Iconify
                    icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'}
                  />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        <RHFTextField
          name="confirmPassword"
          label="Confirm Password"
          type={showPassword ? 'text' : 'password'}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  onClick={() => setShowPassword(!showPassword)}
                  edge="end"
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
          loading={loading || isSubmitting}
          sx={{ mt: 3 }}
        >
          Change Password
        </LoadingButton>
      </Stack>
    </FormProvider>
  );
}
