// components/SubscriptionCard.js
import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Chip,
  Button,
  Stack,
  Box,
} from '@mui/material';
import axiosInstance from 'src/utils/axios';
import { useSnackbar } from 'notistack';

const formatDate = (dateStr: string) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString();
};

const SubscriptionCard = ({ subscription, onRenew }: any) => {
  if (!subscription) return null;

  const { enqueueSnackbar } = useSnackbar();

  const renewSubscription = async (planId: any) => {
    try {
      const response = await axiosInstance.post(`/subscriptions/renew`, {
        planId,
      });
      enqueueSnackbar('Subscription renewed successfully!', {
        variant: 'success',
      });
    } catch (error) {
      enqueueSnackbar('Failed to renew subscription', { variant: 'error' });
    }
  };

  return (
    <Card sx={{ p: 2, borderRadius: 3, boxShadow: 3 }}>
      <CardContent>
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          justifyContent='space-between'
          alignItems={{ xs: 'flex-start', sm: 'center' }}
          spacing={2}
          mb={2}
        >
          <Box>
            <Typography variant='h6' color='primary'>
              {subscription.plan_id.name}
            </Typography>
            <Typography variant='body2' color='text.secondary'>
              {formatDate(subscription.start_date)} -{' '}
              {formatDate(subscription.end_date)}
            </Typography>
          </Box>

          <Chip
            label={subscription.status}
            color='success'
            sx={{ fontWeight: 'bold' }}
          />
        </Stack>

        <Button
          variant='contained'
          color='primary'
          onClick={() => onRenew(subscription.plan_id._id)}
          sx={{ mt: 1, borderRadius: 2 }}
        >
          Renew Subscription
        </Button>
      </CardContent>
    </Card>
  );
};

export default SubscriptionCard;
