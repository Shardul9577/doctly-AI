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
  Box,
  Card,
  Grid,
  Alert,
  CircularProgress,
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
// components
import { MotionViewport, varFade } from '../../components/animate';
import Iconify from '../../components/Iconify';
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

export default function ContactForm() {
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
    <Grid container spacing={5} component={MotionViewport}>
      {/* Left Side - Contact Form (60%) */}
      <Grid item xs={12} md={7.2}>
        <m.div variants={varFade().inUp}>
          <Typography variant="h5" sx={{ mb: 3 }}>
            Contact Us
          </Typography>
        </m.div>

        {submitSuccess && (
          <m.div variants={varFade().inUp}>
            <Alert severity="success" sx={{ mb: 3 }}>
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
          </Stack>

          <m.div variants={varFade().inUp}>
            <LoadingButton
              size="large"
              variant="contained"
              type="submit"
              loading={isSubmitting}
              disabled={isSubmitting}
              sx={{ mt: 3 }}
            >
              {isSubmitting ? 'Sending...' : 'Submit Now'}
            </LoadingButton>
          </m.div>
        </form>
      </Grid>

      {/* Right Side - Contact Information (40%) */}
      <Grid item xs={12} md={4.8}>
        <m.div variants={varFade().inUp}>
          <Card sx={{ p: 3, height: 'fit-content' }}>
            <Typography variant="h6" sx={{ mb: 3, color: 'primary.main' }}>
              Get in Touch
            </Typography>

            <Stack spacing={3}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Iconify
                  icon="eva:email-fill"
                  sx={{ mr: 2, color: 'primary.main' }}
                />
                <Box>
                  <Typography variant="subtitle2">Email</Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    doctly9577@gmail.com
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Iconify
                  icon="eva:phone-fill"
                  sx={{ mr: 2, color: 'primary.main' }}
                />
                <Box>
                  <Typography variant="subtitle2">Phone</Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    +91 780-182-6550
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Iconify
                  icon="eva:map-pin-fill"
                  sx={{ mr: 2, color: 'primary.main' }}
                />
                <Box>
                  <Typography variant="subtitle2">Address</Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    34 anmol - 2, sahara township, Radhanpur road, Mehesana -
                    384002
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Iconify
                  icon="eva:clock-fill"
                  sx={{ mr: 2, color: 'primary.main' }}
                />
                <Box>
                  <Typography variant="subtitle2">Office Hours</Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    Monday - Friday: 9:00 AM - 6:00 PM
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    Saturday: 9:00 AM - 2:00 PM
                  </Typography>
                </Box>
              </Box>
            </Stack>

            <Box
              sx={{
                mt: 4,
                p: 2,
                bgcolor: 'background.neutral',
                borderRadius: 1,
              }}
            >
              <Typography
                variant="body2"
                sx={{ color: 'text.secondary', textAlign: 'center' }}
              >
                We typically respond within 24 hours during business days.
              </Typography>
            </Box>
          </Card>
        </m.div>
      </Grid>
    </Grid>
  );
}
