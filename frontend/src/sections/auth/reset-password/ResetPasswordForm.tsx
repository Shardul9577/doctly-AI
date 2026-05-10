import * as Yup from 'yup';
// next
import { useRouter } from 'next/router';
// form
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
// @mui
import { Stack, Snackbar, Alert } from '@mui/material';
import { LoadingButton } from '@mui/lab';
// routes
import { PATH_AUTH } from '../../../routes/paths';
// components
import { FormProvider, RHFTextField } from '../../../components/hook-form';
import { useState } from 'react';
import axios from '../../../utils/axios'; // Adjust path to your axios instance
import { BACKEND_URL } from '../../../config';

// ----------------------------------------------------------------------

type FormValuesProps = {
  email: string;
};

export default function ResetPasswordForm() {
  const { push } = useRouter();

  const [responseMsg, setResponseMsg] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [isError, setIsError] = useState(false);

  const ResetPasswordSchema = Yup.object().shape({
    email: Yup.string()
      .email('Email must be a valid email address')
      .required('Email is required'),
  });

  const methods = useForm<FormValuesProps>({
    resolver: yupResolver(ResetPasswordSchema),
    defaultValues: { email: 'demo@minimals.cc' },
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = async (data: FormValuesProps) => {
    try {
      const res = await axios.post(
        `${BACKEND_URL}/api/auth/forgot-password`,
        data
      );

      setResponseMsg(res.data.message || 'Request sent successfully');
      setIsError(false);
      setOpen(true);

      sessionStorage.setItem('email-recovery', data.email);

      // Redirect to login page after 10 seconds
      setTimeout(() => {
        push(PATH_AUTH.login);
      }, 1000); // 10000ms = 10 seconds
    } catch (error: any) {
      setResponseMsg(error?.message || 'Something went wrong');
      setIsError(true);
      setOpen(true);
    }
  };

  const handleClose = () => setOpen(false);

  return (
    <>
      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={3}>
          <RHFTextField name="email" label="Email address" />

          <LoadingButton
            fullWidth
            size="large"
            type="submit"
            variant="contained"
            loading={isSubmitting}
          >
            Send Request
          </LoadingButton>
        </Stack>
      </FormProvider>

      <Snackbar
        open={open}
        autoHideDuration={4000}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert
          severity={isError ? 'error' : 'success'}
          onClose={handleClose}
          sx={{ width: '100%' }}
        >
          {responseMsg}
        </Alert>
      </Snackbar>
    </>
  );
}
