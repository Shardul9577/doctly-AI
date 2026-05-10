import { useState } from 'react';
import { Box, Avatar, Typography, Button, Divider } from '@mui/material';
import { format } from 'date-fns';
import { sentenceCase } from 'change-case';
import Label from '../../../components/Label';
import Iconify from '../../../components/Iconify';

interface DoctorData {
  doctorName: string;
  avatar?: string;
  specialization: string;
  qualification: string;
  email: string;
  phone: string;
  date: string | Date;
  status: 'verified' | 'pending' | 'rejected';
}

interface DoctorVerificationPageProps {
  doctor: DoctorData;
  onApprove: () => void;
  onReject: () => void;
  onViewDocs: () => void;
}

export default function DoctorVerificationPage({
  doctor,
  onApprove,
  onReject,
  onViewDocs,
}: DoctorVerificationPageProps) {
  const [loading, setLoading] = useState(false);

  const handleApprove = async () => {
    setLoading(true);
    await onApprove();
    setLoading(false);
  };

  const handleReject = async () => {
    setLoading(true);
    await onReject();
    setLoading(false);
  };

  return (
    <Box sx={{ p: 3, maxWidth: 600, mx: 'auto' }}>
      {/* Doctor Profile */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <Avatar
          alt={doctor.doctorName}
          src={doctor.avatar || undefined}
          sx={{ width: 80, height: 80, mr: 2 }}
        />
        <Box>
          <Typography variant='h5'>{doctor.doctorName}</Typography>
          <Typography variant='body2' sx={{ color: 'text.secondary' }}>
            {doctor.specialization} ({doctor.qualification})
          </Typography>
          <Typography variant='caption' sx={{ color: 'text.disabled' }}>
            {doctor.email} | {doctor.phone}
          </Typography>
        </Box>
      </Box>

      {/* Status */}
      <Box sx={{ mb: 2 }}>
        <Label
          color={
            (doctor.status === 'verified' && 'success') ||
            (doctor.status === 'pending' && 'warning') ||
            'error'
          }
        >
          {sentenceCase(doctor.status)}
        </Label>
      </Box>

      {/* Registration Date */}
      <Typography variant='body2' sx={{ mb: 3 }}>
        Registered on {format(new Date(doctor.date), 'dd MMM yyyy')} at{' '}
        {format(new Date(doctor.date), 'p')}
      </Typography>

      <Divider sx={{ mb: 2 }} />

      {/* Actions */}
      <Box sx={{ display: 'flex', gap: 2 }}>
        <Button variant='contained' color='primary' onClick={onViewDocs}>
          View Documents
        </Button>
        {doctor.status === 'pending' && (
          <>
            <Button
              variant='outlined'
              color='success'
              onClick={handleApprove}
              disabled={loading}
              startIcon={<Iconify icon={'eva:checkmark-circle-2-outline'} />}
            >
              Approve
            </Button>
            <Button
              variant='outlined'
              color='error'
              onClick={handleReject}
              disabled={loading}
              startIcon={<Iconify icon={'eva:close-circle-outline'} />}
            >
              Reject
            </Button>
          </>
        )}
      </Box>
    </Box>
  );
}
