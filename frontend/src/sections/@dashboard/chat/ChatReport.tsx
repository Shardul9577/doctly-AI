import { formatDistanceToNowStrict } from 'date-fns';
// @mui
import { styled } from '@mui/material/styles';
import {
  Box,
  Typography,
  Paper,
  Button,
  Stack,
  Divider,
  Table,
  TableHead,
  TableBody,
  TableCell,
  TableRow,
  Chip,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
// components
import Iconify from '../../../components/Iconify';
import Image from '../../../components/Image';
import { VisitCardProps } from 'src/@types/user';
import { PATH_DASHBOARD } from 'src/routes/paths';
import { useRouter } from 'next/router';
import { useSnackbar } from 'notistack';
import axiosInstance from 'src/utils/axios';

// ----------------------------------------------------------------------

const MainContentStyle = styled(Box)(({ theme }) => ({
  background: '#ffffff',
  width: '100%',
  margin: 0,
  position: 'relative',
  fontFamily:
    "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
  color: '#1f2937',
  fontSize: '14px',
  lineHeight: 1.7,
}));

const ReportCardStyle = styled(Paper)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
  marginTop: theme.spacing(0.5),
  borderRadius: theme.shape.borderRadius,
  backgroundColor: '#f8fafc',
  boxShadow: theme.shadows[3],
  position: 'relative',
}));

const ReportContentStyle = styled(Box)(({ theme }) => ({
  flex: 1,
  overflowY: 'auto',
  overflowX: 'hidden',
  backgroundColor: '#f8fafc',
  '&::-webkit-scrollbar': {
    width: '8px',
  },
  '&::-webkit-scrollbar-track': {
    background: '#f1f5f9',
    borderRadius: '4px',
  },
  '&::-webkit-scrollbar-thumb': {
    background: '#cbd5e1',
    borderRadius: '4px',
    '&:hover': {
      background: '#94a3b8',
    },
  },
}));

const ReportHeaderStyle = styled(Box)(({ theme }) => ({
  padding: '40px 30px',
  background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
  color: 'white',
  textAlign: 'center',
  flexShrink: 0,
  position: 'relative',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: `url("data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><defs><pattern id='grain' width='100' height='100' patternUnits='userSpaceOnUse'><circle cx='25' cy='25' r='1' fill='white' opacity='0.1'/><circle cx='75' cy='75' r='1' fill='white' opacity='0.1'/><circle cx='50' cy='10' r='0.5' fill='white' opacity='0.1'/></pattern></defs><rect width='100' height='100' fill='url(%23grain)'/></svg>")`,
  },
}));

const ContainerStyle = styled(Box)(({ theme }) => ({
  padding: '40px 30px',
  maxWidth: '1400px',
  margin: '0 auto',
}));

const ContentGridStyle = styled(Box)(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gap: '30px',
  marginBottom: '40px',
  '& .full-width': {
    gridColumn: '1 / -1',
  },
  [theme.breakpoints.down('md')]: {
    gridTemplateColumns: '1fr',
    gap: '20px',
  },
}));

const SectionCardStyle = styled(Paper)(({ theme }) => ({
  padding: '24px',
  backgroundColor: '#ffffff',
  borderRadius: '12px',
  border: '1px solid #e5e7eb',
  boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
  transition: 'all 0.2s ease',
  position: 'relative',
  '&:hover': {
    borderColor: '#d1d5db',
    boxShadow:
      '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  },
}));

const SectionTitleStyle = styled(Typography)(({ theme }) => ({
  fontSize: '20px',
  fontWeight: 600,
  margin: '0 0 20px 0',
  color: '#1f2937',
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
  '&::before': {
    content: '""',
    width: '4px',
    height: '24px',
    background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
    borderRadius: '2px',
  },
}));

const InfoGridStyle = styled(Box)(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gap: '24px',
  [theme.breakpoints.down('sm')]: {
    gridTemplateColumns: '1fr',
    gap: '16px',
  },
}));

const InfoItemStyle = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: '4px',
}));

const InfoLabelStyle = styled(Typography)(({ theme }) => ({
  fontSize: '12px',
  fontWeight: 500,
  color: '#6b7280',
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
}));

const InfoValueStyle = styled(Typography)(({ theme }) => ({
  fontSize: '16px',
  fontWeight: 500,
  color: '#1f2937',
}));

const StatusBadgeStyle = styled(Chip)(({ theme }) => ({
  display: 'inline-flex',
  alignItems: 'center',
  padding: '4px 12px',
  borderRadius: '20px',
  fontSize: '12px',
  fontWeight: 500,
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
  height: 'auto',
  '&.status-pending': {
    background: '#fef3c7',
    color: '#92400e',
  },
  '&.status-new': {
    background: '#dbeafe',
    color: '#1e40af',
  },
}));

const ReportTableStyle = styled(Table)(({ theme }) => ({
  width: '100%',
  borderCollapse: 'collapse',
  marginTop: '16px',
  borderRadius: '8px',
  overflow: 'hidden',
  boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
  '& .MuiTableCell-root': {
    padding: '16px 20px',
    textAlign: 'left',
    border: 'none',
    fontSize: '14px',
  },
  '& .MuiTableCell-head': {
    background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
    fontWeight: 600,
    color: '#374151',
    fontSize: '14px',
    borderBottom: '2px solid #e5e7eb',
  },
  '& .MuiTableCell-body': {
    borderBottom: '1px solid #f3f4f6',
    color: '#1f2937',
    '&:last-child': {
      borderBottom: 'none',
    },
  },
  '& .MuiTableRow-root': {
    '&:hover': {
      background: '#f9fafb',
    },
  },
}));

const VitalWarningStyle = styled(Typography)(({ theme }) => ({
  color: '#dc2626',
  fontWeight: 500,
}));

const VitalNormalStyle = styled(Typography)(({ theme }) => ({
  color: '#059669',
  fontWeight: 500,
}));

const ProbabilityHighStyle = styled(Typography)(({ theme }) => ({
  color: '#dc2626',
  fontWeight: 600,
}));

const ProbabilityMediumStyle = styled(Typography)(({ theme }) => ({
  color: '#d97706',
  fontWeight: 600,
}));

const DoctorRemarksStyle = styled(Box)(({ theme }) => ({
  background: '#f8fafc',
  padding: '20px',
  borderRadius: '8px',
  borderLeft: '4px solid #3b82f6',
  marginTop: '16px',
}));

const AttachmentsGridStyle = styled(Box)(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
  gap: '20px',
  marginTop: '20px',
  [theme.breakpoints.down('sm')]: {
    gridTemplateColumns: '1fr',
  },
}));

const AttachmentItemStyle = styled(Paper)(({ theme }) => ({
  background: '#f8fafc',
  border: '2px dashed #d1d5db',
  borderRadius: '12px',
  padding: '20px',
  textAlign: 'center',
  transition: 'all 0.2s ease',
  cursor: 'pointer',
  '&:hover': {
    borderColor: '#3b82f6',
    background: '#eff6ff',
  },
}));

const AttachmentIconStyle = styled(Box)(({ theme }) => ({
  width: '48px',
  height: '48px',
  background: '#3b82f6',
  borderRadius: '12px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  margin: '0 auto 12px',
  color: 'white',
  fontSize: '24px',
}));

const ReportFooterStyle = styled(Box)(({ theme }) => ({
  padding: '24px 30px',
  background: '#f8fafc',
  textAlign: 'center',
  fontSize: '12px',
  color: '#6b7280',
  borderTop: '1px solid #e5e7eb',
  fontWeight: 400,
  flexShrink: 0,
}));

const FooterContentStyle = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  maxWidth: '1400px',
  margin: '0 auto',
  [theme.breakpoints.down('sm')]: {
    flexDirection: 'column',
    gap: '12px',
  },
}));

// ----------------------------------------------------------------------

type ChatReportProps = {
  reportData: any;
  createdAt: Date | string | number;
  visit: VisitCardProps;
};

export default function ChatReport({
  reportData,
  createdAt,
  visit,
}: ChatReportProps) {
  const theme = useTheme();
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();

  async function onApprove() {
    try {
      await axiosInstance.patch(`/api/doctors/visit/${visit._id}`, {
        status: 'completed',
      });
      enqueueSnackbar('Visit approved successfully', { variant: 'success' });
      router.push(PATH_DASHBOARD.general.booking);
    } catch (error: any) {
      console.error('Failed to approve visit:', error);
      enqueueSnackbar(
        error.response?.data?.message ||
          error.message ||
          'Failed to approve visit',
        { variant: 'error' },
      );
    }
  }

  function onReject() {
    router.push(`/dashboard/visits/visit-detail/${visit._id}`);
  }

  return (
    <ReportCardStyle elevation={3}>
      <MainContentStyle>
        {/* Report Header */}
        <ReportHeaderStyle>
          <Typography
            variant='h4'
            sx={{
              fontWeight: 700,
              mb: 0.5,
              color: 'white',
              fontSize: '32px',
              letterSpacing: '-0.025em',
              position: 'relative',
              zIndex: 1,
            }}
          >
            Doctly's Patient Report
          </Typography>
          <Typography
            sx={{
              marginTop: '8px',
              fontSize: '18px',
              fontWeight: 400,
              opacity: 0.9,
              color: 'white',
              position: 'relative',
              zIndex: 1,
            }}
          >
            Comprehensive Health Analysis & Recommendations
          </Typography>
        </ReportHeaderStyle>

        {/* Scrollable Content */}
        <ReportContentStyle>
          <ContainerStyle>
            <ContentGridStyle>
              {/* Visit Summary */}
              {visit && (
                <Box>
                  <SectionCardStyle>
                    <SectionTitleStyle variant='h6'>
                      Visit Summary
                    </SectionTitleStyle>
                    <InfoGridStyle>
                      <Box>
                        <InfoItemStyle>
                          <InfoLabelStyle>Visit ID</InfoLabelStyle>
                          <InfoValueStyle>{visit._id || '-'}</InfoValueStyle>
                        </InfoItemStyle>
                        <InfoItemStyle sx={{ mt: 2 }}>
                          <InfoLabelStyle>Duration</InfoLabelStyle>
                          <InfoValueStyle>
                            {visit.duration || '1 hour'}
                          </InfoValueStyle>
                        </InfoItemStyle>
                        <InfoItemStyle sx={{ mt: 2 }}>
                          <InfoLabelStyle>Case File Type</InfoLabelStyle>
                          <StatusBadgeStyle
                            label={visit.case_file_type || 'NEW'}
                            className='status-new'
                            size='small'
                          />
                        </InfoItemStyle>
                      </Box>
                      <Box>
                        <InfoItemStyle>
                          <InfoLabelStyle>Date</InfoLabelStyle>
                          <InfoValueStyle>
                            {visit.visit_date ||
                              new Date().toLocaleDateString('en-GB', {
                                day: '2-digit',
                                month: 'short',
                                year: 'numeric',
                              })}
                          </InfoValueStyle>
                        </InfoItemStyle>
                        <InfoItemStyle sx={{ mt: 2 }}>
                          <InfoLabelStyle>Time</InfoLabelStyle>
                          <InfoValueStyle>
                            {visit.visit_time ||
                              new Date().toLocaleTimeString('en-US', {
                                hour: '2-digit',
                                minute: '2-digit',
                                hour12: true,
                              })}
                          </InfoValueStyle>
                        </InfoItemStyle>
                        <InfoItemStyle sx={{ mt: 2 }}>
                          <InfoLabelStyle>Status</InfoLabelStyle>
                          <StatusBadgeStyle
                            label={visit.status || 'PENDING'}
                            className='status-pending'
                            size='small'
                          />
                        </InfoItemStyle>
                        <InfoItemStyle sx={{ mt: 2 }}>
                          <InfoLabelStyle>Type</InfoLabelStyle>
                          <InfoValueStyle>
                            {visit.visit_type || 'Check Up'}
                          </InfoValueStyle>
                        </InfoItemStyle>
                      </Box>
                    </InfoGridStyle>
                  </SectionCardStyle>
                </Box>
              )}

              {/* Patient Information */}
              {visit && (
                <Box>
                  <SectionCardStyle>
                    <SectionTitleStyle variant='h6'>
                      Patient Information
                    </SectionTitleStyle>
                    <Stack spacing={2}>
                      <InfoItemStyle>
                        <InfoLabelStyle>Full Name</InfoLabelStyle>
                        <InfoValueStyle>
                          {visit.doctor_patient_relations_id.patient_id
                            .firstName || '-'}
                          {visit.doctor_patient_relations_id.patient_id
                            .lastName || '-'}
                        </InfoValueStyle>
                      </InfoItemStyle>
                      <InfoItemStyle>
                        <InfoLabelStyle>Email Address</InfoLabelStyle>
                        <InfoValueStyle>
                          {visit.doctor_patient_relations_id.patient_id.email ||
                            '-'}
                        </InfoValueStyle>
                      </InfoItemStyle>
                      <InfoItemStyle>
                        <InfoLabelStyle>Phone Number</InfoLabelStyle>
                        <InfoValueStyle>
                          {visit.doctor_patient_relations_id.patient_id.phone ||
                            '-'}
                        </InfoValueStyle>
                      </InfoItemStyle>
                    </Stack>
                  </SectionCardStyle>
                </Box>
              )}

              {/* Doctor Information */}
              {visit.doctor_patient_relations_id.doctor_id && (
                <Box className='full-width'>
                  <SectionCardStyle>
                    <SectionTitleStyle variant='h6'>
                      Doctor Information
                    </SectionTitleStyle>
                    <Box
                      sx={{
                        display: 'grid',
                        gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr 1fr' },
                        gap: '24px',
                      }}
                    >
                      <InfoItemStyle>
                        <InfoLabelStyle>Doctor Name</InfoLabelStyle>
                        <InfoValueStyle>
                          {visit.doctor_patient_relations_id.doctor_id
                            .firstName || '-'}
                          {visit.doctor_patient_relations_id.doctor_id
                            .lastName || '-'}
                        </InfoValueStyle>
                      </InfoItemStyle>
                      <InfoItemStyle>
                        <InfoLabelStyle>Email Address</InfoLabelStyle>
                        <InfoValueStyle>
                          {visit.doctor_patient_relations_id.doctor_id.email ||
                            '-'}
                        </InfoValueStyle>
                      </InfoItemStyle>
                      <InfoItemStyle>
                        <InfoLabelStyle>Phone Number</InfoLabelStyle>
                        <InfoValueStyle>
                          {visit.doctor_patient_relations_id.doctor_id.phone ||
                            '-'}
                        </InfoValueStyle>
                      </InfoItemStyle>
                    </Box>
                  </SectionCardStyle>
                </Box>
              )}

              {/* Diagnosis */}
              {reportData.diagnosis && (
                <Box className='full-width'>
                  <SectionCardStyle>
                    <SectionTitleStyle variant='h6'>
                      Diagnosis
                    </SectionTitleStyle>
                    <Typography
                      sx={{
                        fontSize: '16px',
                        lineHeight: 1.6,
                        color: '#374151',
                        margin: 0,
                        '& strong': {
                          fontWeight: 600,
                        },
                      }}
                    >
                      {reportData.diagnosis}
                    </Typography>
                  </SectionCardStyle>
                </Box>
              )}

              {/* Vitals */}
              {reportData.vitals && Array.isArray(reportData.vitals) && (
                <Box className='full-width'>
                  <SectionCardStyle>
                    <SectionTitleStyle variant='h6'>Vitals</SectionTitleStyle>
                    <Box sx={{ overflowX: 'auto' }}>
                      <ReportTableStyle>
                        <TableHead>
                          <TableRow>
                            <TableCell>Vital Sign</TableCell>
                            <TableCell>Reading</TableCell>
                            <TableCell>Normal Range</TableCell>
                            <TableCell>Status</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {reportData.vitals.map(
                            (vital: any, index: number) => (
                              <TableRow key={index}>
                                <TableCell>
                                  <strong>{vital.vital_sign || '-'}</strong>
                                </TableCell>
                                <TableCell>{vital.reading || '-'}</TableCell>
                                <TableCell>
                                  {vital.normal_range || '-'}
                                </TableCell>
                                <TableCell>
                                  {vital.status === 'Normal' ? (
                                    <VitalNormalStyle>
                                      {vital.status}
                                    </VitalNormalStyle>
                                  ) : vital.status === 'High' ||
                                    vital.status === 'Elevated' ? (
                                    <VitalWarningStyle>
                                      {vital.status}
                                    </VitalWarningStyle>
                                  ) : (
                                    <Typography sx={{ fontWeight: 500 }}>
                                      {vital.status || '-'}
                                    </Typography>
                                  )}
                                </TableCell>
                              </TableRow>
                            ),
                          )}
                        </TableBody>
                      </ReportTableStyle>
                    </Box>
                  </SectionCardStyle>
                </Box>
              )}

              {/* Prescriptions */}
              {visit.prescription &&
              Array.isArray(visit.prescription) &&
              visit.prescription.length > 0 ? (
                <Box className='full-width'>
                  <SectionCardStyle>
                    <SectionTitleStyle variant='h6'>
                      Prescriptions
                    </SectionTitleStyle>
                    <Box sx={{ overflowX: 'auto' }}>
                      <ReportTableStyle>
                        <TableHead>
                          <TableRow>
                            <TableCell>Medicine</TableCell>
                            <TableCell>Dosage</TableCell>
                            <TableCell>Duration</TableCell>
                            <TableCell>Instructions</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {visit.prescription.map((med: any, index: number) => (
                            <TableRow key={index}>
                              <TableCell>
                                <strong>{med.medicine_name || '-'}</strong>
                              </TableCell>
                              <TableCell>{med.dosage || '-'}</TableCell>
                              <TableCell>{med.duration || '-'}</TableCell>
                              <TableCell>{med.instructions || '-'}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </ReportTableStyle>
                    </Box>
                  </SectionCardStyle>
                </Box>
              ) : reportData.prescriptions ? (
                <Box className='full-width'>
                  <SectionCardStyle>
                    <SectionTitleStyle variant='h6'>
                      Prescriptions
                    </SectionTitleStyle>
                    <Typography
                      sx={{
                        fontSize: '14px',
                        color: '#374151',
                        lineHeight: 1.8,
                      }}
                    >
                      {typeof reportData.prescriptions === 'string'
                        ? reportData.prescriptions
                        : JSON.stringify(reportData.prescriptions, null, 2)}
                    </Typography>
                  </SectionCardStyle>
                </Box>
              ) : null}

              {/* Doctor's Remarks */}
              {reportData.audioTranscription && (
                <Box className='full-width'>
                  <SectionCardStyle>
                    <SectionTitleStyle variant='h6'>
                      Doctor's Remarks
                    </SectionTitleStyle>
                    <DoctorRemarksStyle>
                      <Typography
                        sx={{
                          fontSize: '16px',
                          lineHeight: 1.6,
                          color: '#374151',
                          margin: 0,
                        }}
                      >
                        {reportData.audioTranscription}
                      </Typography>
                    </DoctorRemarksStyle>
                  </SectionCardStyle>
                </Box>
              )}

              {/* AI Health Analysis */}
              {reportData.healthSummary && (
                <Box className='full-width'>
                  <SectionCardStyle>
                    <SectionTitleStyle variant='h6'>
                      AI Health Analysis
                    </SectionTitleStyle>

                    {/* Current Health Summary */}
                    {reportData.healthSummary && (
                      <Box sx={{ marginBottom: '24px' }}>
                        <Typography
                          sx={{
                            fontSize: '16px',
                            fontWeight: 600,
                            color: '#374151',
                            margin: '0 0 16px 0',
                          }}
                        >
                          Current Health Summary
                        </Typography>
                        <Box
                          component='ul'
                          sx={{ margin: 0, paddingLeft: '20px' }}
                        >
                          {Array.isArray(reportData.healthSummary)
                            ? reportData.healthSummary.map(
                                (item: string, idx: number) => (
                                  <Typography
                                    key={idx}
                                    component='li'
                                    sx={{
                                      marginBottom: '8px',
                                      color: '#374151',
                                      fontSize: '14px',
                                      lineHeight: 1.7,
                                    }}
                                  >
                                    {item}
                                  </Typography>
                                ),
                              )
                            : typeof reportData.healthSummary === 'string' && (
                                <Typography
                                  component='li'
                                  sx={{
                                    color: '#374151',
                                    fontSize: '14px',
                                    lineHeight: 1.7,
                                  }}
                                >
                                  {reportData.healthSummary}
                                </Typography>
                              )}
                        </Box>
                      </Box>
                    )}

                    {/* Predicted Disease Probability */}
                    {reportData.diseases &&
                    Array.isArray(reportData.diseases) &&
                    reportData.diseases.length > 0 ? (
                      <Box>
                        <Typography
                          sx={{
                            fontSize: '16px',
                            fontWeight: 600,
                            color: '#374151',
                            margin: '0 0 16px 0',
                          }}
                        >
                          Predicted Disease Probability
                        </Typography>
                        <Box sx={{ overflowX: 'auto' }}>
                          <ReportTableStyle>
                            <TableHead>
                              <TableRow>
                                <TableCell>Disease</TableCell>
                                <TableCell>Probability</TableCell>
                                <TableCell>Risk Level</TableCell>
                                <TableCell>Reason</TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {reportData.diseases.map(
                                (disease: any, idx: number) => {
                                  const probability =
                                    typeof disease.probability === 'number'
                                      ? `${(disease.probability * 100).toFixed(
                                          0,
                                        )}%`
                                      : disease.probability || '-';
                                  const riskLevel = disease.risk_level || '-';

                                  return (
                                    <TableRow key={idx}>
                                      <TableCell>
                                        <strong>
                                          {disease.disease || '-'}
                                        </strong>
                                      </TableCell>
                                      <TableCell>
                                        {riskLevel === 'High' ||
                                        riskLevel === 'High Risk' ? (
                                          <ProbabilityHighStyle>
                                            {probability}
                                          </ProbabilityHighStyle>
                                        ) : riskLevel === 'Medium' ||
                                          riskLevel === 'Medium Risk' ? (
                                          <ProbabilityMediumStyle>
                                            {probability}
                                          </ProbabilityMediumStyle>
                                        ) : (
                                          <Typography sx={{ fontWeight: 600 }}>
                                            {probability}
                                          </Typography>
                                        )}
                                      </TableCell>
                                      <TableCell>
                                        {riskLevel === 'High' ||
                                        riskLevel === 'High Risk' ? (
                                          <VitalWarningStyle>
                                            {riskLevel}
                                          </VitalWarningStyle>
                                        ) : riskLevel === 'Medium' ||
                                          riskLevel === 'Medium Risk' ? (
                                          <Typography
                                            sx={{
                                              color: '#d97706',
                                              fontWeight: 500,
                                            }}
                                          >
                                            {riskLevel}
                                          </Typography>
                                        ) : (
                                          <VitalNormalStyle>
                                            {riskLevel}
                                          </VitalNormalStyle>
                                        )}
                                      </TableCell>
                                      <TableCell>
                                        <Typography
                                          sx={{
                                            fontSize: '14px',
                                            color: '#374151',
                                            lineHeight: 1.5,
                                          }}
                                        >
                                          {disease.reason || '-'}
                                        </Typography>
                                      </TableCell>
                                    </TableRow>
                                  );
                                },
                              )}
                            </TableBody>
                          </ReportTableStyle>
                        </Box>
                      </Box>
                    ) : null}
                  </SectionCardStyle>
                </Box>
              )}

              {/* Medical Attachments */}
              {visit.attachments &&
              Array.isArray(visit.attachments) &&
              visit.attachments.length > 0 ? (
                <Box className='full-width'>
                  <SectionCardStyle>
                    <SectionTitleStyle variant='h6'>
                      Medical Attachments
                    </SectionTitleStyle>
                    <AttachmentsGridStyle>
                      {visit.attachments.map((attachment: any, idx: number) => (
                        <Box key={idx}>
                          <AttachmentItemStyle>
                            {attachment[idx] || attachment ? (
                              <Image
                                src={visit.attachments[idx]}
                                alt={`Attachment ${idx + 1}`}
                                sx={{
                                  width: '100%',
                                  height: '200px',
                                  objectFit: 'cover',
                                  borderRadius: '8px',
                                  marginBottom: '12px',
                                  border: '1px solid #e5e7eb',
                                }}
                              />
                            ) : (
                              <AttachmentIconStyle>
                                <Iconify
                                  icon='mdi:file-document-outline'
                                  width={24}
                                  height={24}
                                />
                              </AttachmentIconStyle>
                            )}
                            <Typography
                              sx={{
                                fontWeight: 600,
                                color: '#1f2937',
                                marginBottom: '8px',
                                fontSize: '14px',
                              }}
                            >
                              {`Attachment ${idx + 1}`}
                            </Typography>
                          </AttachmentItemStyle>
                        </Box>
                      ))}
                    </AttachmentsGridStyle>
                  </SectionCardStyle>
                </Box>
              ) : null}

              {/* Fallback: Display raw data if structure is different */}
              {!reportData.patient &&
                !visit &&
                !reportData.assessment &&
                !reportData.vitals &&
                !reportData.aiHealthAnalysis && (
                  <Box className='full-width'>
                    <SectionCardStyle>
                      <Typography
                        component='pre'
                        sx={{
                          fontFamily: 'monospace',
                          fontSize: '0.75rem',
                          color: '#6b7280',
                          lineHeight: 1.8,
                        }}
                      >
                        {JSON.stringify(reportData, null, 2)}
                      </Typography>
                    </SectionCardStyle>
                  </Box>
                )}
            </ContentGridStyle>
          </ContainerStyle>
        </ReportContentStyle>

        {/* Footer */}
        <ReportFooterStyle>
          <FooterContentStyle>
            <Box sx={{ textAlign: 'left' }}>
              <Image
                src='/Images/logo_single.png'
                alt='Doctly'
                sx={{ height: '24px', opacity: 0.7 }}
              />
            </Box>
            <Box sx={{ textAlign: 'center' }}>
              <Typography
                variant='body2'
                sx={{ fontSize: '12px', color: '#6b7280', fontWeight: 400 }}
              >
                This is a system-generated report from Doctly. No signature
                required if printed.
              </Typography>
            </Box>
            <Box sx={{ textAlign: 'right' }}>
              <Typography
                variant='body2'
                sx={{ fontSize: '12px', color: '#6b7280', fontWeight: 400 }}
              >
                Generated on:{' '}
                {new Date(createdAt).toLocaleDateString('en-GB', {
                  day: '2-digit',
                  month: 'short',
                  year: 'numeric',
                })}
              </Typography>
            </Box>
          </FooterContentStyle>
        </ReportFooterStyle>

        {/* Action Buttons */}
        <Box
          sx={{
            p: 2,
            display: 'flex',
            gap: 2,
            justifyContent: 'flex-end',
            flexShrink: 0,
            bgcolor: 'background.paper',
            borderTop: `1px solid ${theme.palette.divider}`,
          }}
        >
          <Button
            variant='contained'
            color='success'
            startIcon={<Iconify icon='eva:checkmark-circle-2-fill' />}
            onClick={onApprove}
            sx={{ minWidth: 120 }}
          >
            Approve
          </Button>
          <Button
            variant='contained'
            color='error'
            startIcon={<Iconify icon='eva:close-circle-fill' />}
            onClick={onReject}
            sx={{ minWidth: 120 }}
          >
            Reject
          </Button>
        </Box>
      </MainContentStyle>
    </ReportCardStyle>
  );
}
