import * as Yup from 'yup';
import { useState } from 'react';
import { useSnackbar } from 'notistack';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import { Stack, Card, IconButton, InputAdornment } from '@mui/material';
import { LoadingButton } from '@mui/lab';

import Iconify from '../../../../components/Iconify'; // adjust if needed
import { FormProvider, RHFTextField } from '../../../../components/hook-form';
import axiosInstance from 'src/utils/axios';

type FormValuesProps = {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
};

export default function AccountChangePassword() {
  const { enqueueSnackbar } = useSnackbar();

  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const ChangePasswordSchema = Yup.object().shape({
    oldPassword: Yup.string().required('Old Password is required'),
    newPassword: Yup.string()
      .min(6, 'New Password must be at least 6 characters')
      .required('New Password is required'),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('newPassword')], 'Passwords must match')
      .required('Please confirm your new password'),
  });

  const defaultValues: FormValuesProps = {
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  };

  const methods = useForm<FormValuesProps>({
    resolver: yupResolver(ChangePasswordSchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    setError,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = async (data: FormValuesProps) => {
    try {
      const res = await axiosInstance.put('/api/auth/password/update', {
        oldPassword: data.oldPassword,
        newPassword: data.newPassword,
        confirmPassword: data.confirmPassword, // ✅ included here
      });

      enqueueSnackbar(res?.data?.message || 'Password updated successfully!', {
        variant: 'success',
      });
      reset();
    } catch (error: any) {
      console.error('Change password error:', error);

      const serverErrors = error?.response?.data?.errors;

      if (Array.isArray(serverErrors)) {
        serverErrors.forEach((err: any) => {
          if (err.path && err.msg) {
            setError(err.path as keyof FormValuesProps, {
              type: 'server',
              message: err.msg,
            });
          }
        });
      } else {
        enqueueSnackbar(error?.message || 'Failed to update password', {
          variant: 'error',
        });
      }
    }
  };

  return (
    <Card sx={{ p: 3 }}>
      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={3} alignItems='flex-end'>
          <RHFTextField
            name='oldPassword'
            type={showOldPassword ? 'text' : 'password'}
            label='Old Password'
            InputProps={{
              endAdornment: (
                <InputAdornment position='end'>
                  <IconButton
                    onClick={() => setShowOldPassword((prev) => !prev)}
                    edge='end'
                  >
                    <Iconify
                      icon={
                        showOldPassword ? 'eva:eye-off-fill' : 'eva:eye-fill'
                      }
                    />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          <RHFTextField
            name='newPassword'
            type={showNewPassword ? 'text' : 'password'}
            label='New Password'
            InputProps={{
              endAdornment: (
                <InputAdornment position='end'>
                  <IconButton
                    onClick={() => setShowNewPassword((prev) => !prev)}
                    edge='end'
                  >
                    <Iconify
                      icon={
                        showNewPassword ? 'eva:eye-off-fill' : 'eva:eye-fill'
                      }
                    />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          <RHFTextField
            name='confirmPassword'
            type={showConfirmPassword ? 'text' : 'password'}
            label='Confirm New Password'
            InputProps={{
              endAdornment: (
                <InputAdornment position='end'>
                  <IconButton
                    onClick={() => setShowConfirmPassword((prev) => !prev)}
                    edge='end'
                  >
                    <Iconify
                      icon={
                        showConfirmPassword
                          ? 'eva:eye-off-fill'
                          : 'eva:eye-fill'
                      }
                    />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          <LoadingButton
            type='submit'
            variant='contained'
            loading={isSubmitting}
          >
            Save Changes
          </LoadingButton>
        </Stack>
      </FormProvider>
    </Card>
  );
}
