import { m } from 'framer-motion';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { useSnackbar } from 'notistack';
// @mui
import {
  Button,
  Typography,
  TextField,
  Stack,
  Alert,
  CircularProgress,
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
//
import { varFade, MotionViewport } from '../../components/animate';
// utils
import axiosInstance from '../../utils/axios';

// ----------------------------------------------------------------------

interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

const ContactSchema = Yup.object().shape({
  name: Yup.string()
    .required('Name is required')
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must be less than 100 characters'),
  email: Yup.string()
    .email('Invalid email format')
    .required('Email is required'),
  subject: Yup.string()
    .required('Subject is required')
    .min(5, 'Subject must be at least 5 characters')
    .max(200, 'Subject must be less than 200 characters'),
  message: Yup.string()
    .required('Message is required')
    .min(10, 'Message must be at least 10 characters')
    .max(2000, 'Message must be less than 2000 characters'),
});

export default function FaqsForm() {
  const { enqueueSnackbar } = useSnackbar();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const methods = useForm<ContactFormData>({
    resolver: yupResolver(ContactSchema),
    defaultValues: {
      name: '',
      email: '',
      subject: '',
      message: '',
    },
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = methods;

  const onSubmit = async (data: ContactFormData) => {
    try {
      setIsSubmitting(true);
      setSubmitSuccess(false);

      const response = await axiosInstance.post('/api/contact-us', data);

      if (response.data.success) {
        enqueueSnackbar(
          response.data.message ||
            'Thank you for contacting us! Your message has been sent successfully.',
          { variant: 'success' }
        );
        setSubmitSuccess(true);
        reset(); // Reset form after successful submission
      } else {
        throw new Error(response.data.message || 'Failed to send message');
      }
    } catch (error: any) {
      console.error('Contact form submission error:', error);

      let errorMessage =
        'Sorry, we encountered an issue sending your message. Please try again later.';

      if (error?.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error?.response?.data?.errors) {
        // Handle validation errors from backend
        const validationErrors = error.response.data.errors;
        const firstError = validationErrors[0];
        errorMessage = firstError?.msg || errorMessage;
      } else if (error?.message) {
        errorMessage = error.message;
      }

      enqueueSnackbar(errorMessage, { variant: 'error' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Stack component={MotionViewport} spacing={3}>
      <m.div variants={varFade().inUp} style={{ marginBottom: '13px' }}>
        <Typography variant="h3">Haven't found the right help?</Typography>
      </m.div>

      {submitSuccess && (
        <m.div variants={varFade().inUp}>
          <Alert severity="success">
            Thank you for contacting us! Your message has been sent
            successfully. We will get back to you soon.
          </Alert>
        </m.div>
      )}

      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={3}>
          <m.div variants={varFade().inUp}>
            <TextField
              fullWidth
              label="Name"
              {...register('name')}
              error={!!errors.name}
              helperText={errors.name?.message}
              disabled={isSubmitting}
            />
          </m.div>

          <m.div variants={varFade().inUp}>
            <TextField
              fullWidth
              label="Email"
              type="email"
              {...register('email')}
              error={!!errors.email}
              helperText={errors.email?.message}
              disabled={isSubmitting}
            />
          </m.div>

          <m.div variants={varFade().inUp}>
            <TextField
              fullWidth
              label="Subject"
              {...register('subject')}
              error={!!errors.subject}
              helperText={errors.subject?.message}
              disabled={isSubmitting}
            />
          </m.div>

          <m.div variants={varFade().inUp}>
            <TextField
              fullWidth
              label="Enter your message here."
              multiline
              rows={4}
              {...register('message')}
              error={!!errors.message}
              helperText={errors.message?.message}
              disabled={isSubmitting}
            />
          </m.div>

          <m.div variants={varFade().inUp}>
            <LoadingButton
              size="large"
              variant="contained"
              type="submit"
              loading={isSubmitting}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Sending...' : 'Submit Now'}
            </LoadingButton>
          </m.div>
        </Stack>
      </form>
    </Stack>
  );
}
