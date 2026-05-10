import { useState, useEffect } from 'react';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
// @mui
import {
  Box,
  Typography,
  CircularProgress,
  Alert,
  Container,
  useTheme,
  Card,
  Dialog,
  DialogContent,
  IconButton,
} from '@mui/material';
import { styled, alpha } from '@mui/material/styles';
// components
import Iconify from '../../../../components/Iconify';
// hooks
import useSettings from '../../../../hooks/useSettings';
// utils
import axiosInstance from '../../../../utils/axios';

dayjs.extend(customParseFormat);

// ----------------------------------------------------------------------

const MainContentStyle = styled(Box)(({ theme }) => ({
  background: theme.palette.background.default,
  width: '100%',
  margin: 0,
  position: 'relative',
}));

const HeaderStyle = styled(Box)(({ theme }) => ({
  background: `linear-gradient(135deg, ${theme.palette.primary.light} 0%, ${theme.palette.primary.main} 100%)`,
  color: theme.palette.primary.contrastText || theme.palette.common.white,
  padding: theme.spacing(5, 3.75),
  textAlign: 'center',
  position: 'relative',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: `url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grain" width="100" height="100" patternUnits="userSpaceOnUse"><circle cx="25" cy="25" r="1" fill="white" opacity="0.1"/><circle cx="75" cy="75" r="1" fill="white" opacity="0.1"/><circle cx="50" cy="10" r="0.5" fill="white" opacity="0.1"/></pattern></defs><rect width="100" height="100" fill="url(%23grain)"/></svg>')`,
    opacity: 0.3,
  },
}));

const ContainerStyle = styled(Container)(({ theme }) => ({
  padding: theme.spacing(5, 3.75),
  margin: '0 auto',
}));

const ContentGridStyle = styled(Box)(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gap: theme.spacing(3.75),
  marginBottom: theme.spacing(5),
  [theme.breakpoints.down('lg')]: {
    gridTemplateColumns: '1fr',
    gap: theme.spacing(2.5),
  },
}));

const SectionStyle = styled(Card)(({ theme }) => ({
  padding: theme.spacing(3),
  transition: 'all 0.2s ease',
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  '&:hover': {
    boxShadow: theme.customShadows.z16,
  },
}));

const SectionTitleStyle = styled(Typography)(({ theme }) => ({
  fontSize: '20px',
  fontWeight: 600,
  margin: `0 0 ${theme.spacing(2.5)} 0`,
  color: theme.palette.text.primary,
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1.5),
  '&::before': {
    content: '""',
    width: '4px',
    height: '24px',
    background: `linear-gradient(135deg, ${theme.palette.primary.light} 0%, ${theme.palette.primary.main} 100%)`,
    borderRadius: '2px',
  },
}));

const GridStyle = styled(Box)(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gap: theme.spacing(3),
  [theme.breakpoints.down('md')]: {
    gridTemplateColumns: '1fr',
    gap: theme.spacing(2),
  },
}));

const InfoItemStyle = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(0.5),
}));

const InfoLabelStyle = styled(Typography)(({ theme }) => ({
  fontSize: '12px',
  fontWeight: 500,
  color: theme.palette.text.secondary,
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
}));

const InfoValueStyle = styled(Typography)(({ theme }) => ({
  fontSize: '16px',
  fontWeight: 500,
  color: theme.palette.text.primary,
}));

const StatusBadgeStyle = styled(Box)<{ status?: string }>(
  ({ theme, status }) => {
    const isLight = theme.palette.mode === 'light';
    return {
      display: 'inline-flex',
      alignItems: 'center',
      padding: theme.spacing(0.5, 1.5),
      borderRadius: '20px',
      fontSize: '12px',
      fontWeight: 500,
      textTransform: 'uppercase',
      letterSpacing: '0.05em',
      ...(status === 'pending' && {
        background: isLight
          ? alpha(theme.palette.warning.main, 0.16)
          : alpha(theme.palette.warning.main, 0.24),
        color: isLight
          ? theme.palette.warning.darker
          : theme.palette.warning.light,
      }),
      ...(status === 'new' && {
        background: isLight
          ? alpha(theme.palette.info.main, 0.16)
          : alpha(theme.palette.info.main, 0.24),
        color: isLight ? theme.palette.info.darker : theme.palette.info.light,
      }),
      ...(status === 'completed' && {
        background: isLight
          ? alpha(theme.palette.success.main, 0.16)
          : alpha(theme.palette.success.main, 0.24),
        color: isLight
          ? theme.palette.success.darker
          : theme.palette.success.light,
      }),
    };
  }
);

const TableStyle = styled('table')(({ theme }) => ({
  width: '100%',
  borderCollapse: 'collapse',
  marginTop: theme.spacing(2),
  borderRadius: theme.spacing(1),
  overflow: 'hidden',
  boxShadow: theme.shadows[1],
  '& th, & td': {
    padding: theme.spacing(2, 2.5),
    textAlign: 'left',
    border: 'none',
  },
  '& th': {
    background:
      theme.palette.mode === 'light'
        ? `linear-gradient(135deg, ${theme.palette.grey[100]} 0%, ${theme.palette.grey[200]} 100%)`
        : alpha(theme.palette.grey[800], 0.8),
    fontWeight: 600,
    color: theme.palette.text.primary,
    fontSize: '14px',
    borderBottom: `2px solid ${theme.palette.divider}`,
  },
  '& td': {
    borderBottom: `1px solid ${theme.palette.divider}`,
    fontSize: '14px',
    color: theme.palette.text.primary,
  },
  '& tr:hover': {
    background: theme.palette.action.hover,
  },
  '& tr:last-child td': {
    borderBottom: 'none',
  },
}));

const FooterStyle = styled(Box)(({ theme }) => ({
  background:
    theme.palette.mode === 'light'
      ? theme.palette.background.neutral || theme.palette.grey[100]
      : theme.palette.background.paper,
  padding: theme.spacing(3, 3.75),
  textAlign: 'center',
  fontSize: '12px',
  color: theme.palette.text.secondary,
  borderTop: `1px solid ${theme.palette.divider}`,
  fontWeight: 400,
  width: '100%',
  marginTop: theme.spacing(3),
}));

// ----------------------------------------------------------------------

type ReportData = {
  _id: string;
  visit: {
    _id: string;
    visit_date: string;
    visit_time: string;
    duration: number;
    visit_type: string;
    status: string;
    case_file_type: string;
    prescription: Array<{
      medicine_name: string;
      dosage: string;
      duration: string;
      instructions: string;
    }>;
    attachments: string[];
    doctor_patient_relations_id: {
      doctor_id: {
        _id: string;
        firstName: string;
        lastName: string;
        email: string;
        phone: string;
        profile_picture?: string;
      };
      patient_id: {
        _id: string;
        firstName: string;
        lastName: string;
        email: string;
        phone: string;
      };
    };
  };
  diagnosis: string;
  vitals: Array<{
    vital_sign: string;
    reading: string;
    normal_range: string;
    status: string;
  }>;
  doctor_remarks?: string;
  ai_health_analysis: {
    current_health_summary: string[];
    predicted_disease_probability: Array<{
      disease: string;
      probability: number;
      risk_level: string;
      reason: string;
    }>;
  };
  created_at: string;
};

type Props = {
  reportId: string;
};

export default function ReportDetail({ reportId }: Props) {
  const theme = useTheme();
  const { themeStretch } = useSettings();
  const [report, setReport] = useState<ReportData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openImageDialog, setOpenImageDialog] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  useEffect(() => {
    const fetchReport = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await axiosInstance.get(
          `/api/patients/profile/reports/${reportId}`
        );

        if (response.data?.status && response.data?.report) {
          setReport(response.data.report);
        } else {
          setError(response.data?.message || 'Failed to fetch report');
        }
      } catch (err: any) {
        console.error('Failed to fetch report:', err);
        setError(
          err.response?.data?.message ||
            'An error occurred while fetching report'
        );
      } finally {
        setLoading(false);
      }
    };

    if (reportId) {
      fetchReport();
    }
  }, [reportId]);

  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '400px',
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error || !report) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity='error'>{error || 'Report not found'}</Alert>
      </Box>
    );
  }

  const visit = report.visit;
  const doctor = visit?.doctor_patient_relations_id?.doctor_id;
  const patient = visit?.doctor_patient_relations_id?.patient_id;

  // Format date
  const visitDate = visit?.visit_date
    ? dayjs(visit.visit_date, 'DD/MM/YYYY').format('DD MMM YYYY')
    : dayjs(report.created_at).format('DD MMM YYYY');

  // Format time
  const visitTime = visit?.visit_time
    ? dayjs(visit.visit_time, 'HH:mm').format('hh:mm A')
    : '';

  // Format duration
  const durationText = visit?.duration
    ? `${visit.duration} ${visit.duration === 1 ? 'hour' : 'hours'}`
    : '';

  // Format generated date
  const generatedDate = dayjs(report.created_at).format('DD MMM YYYY');

  const getVitalStatusClass = (status: string) => {
    if (status?.toLowerCase().includes('normal')) return 'vital-normal';
    if (
      status?.toLowerCase().includes('high') ||
      status?.toLowerCase().includes('elevated')
    )
      return 'vital-warning';
    return '';
  };

  const getRiskLevelClass = (riskLevel: string) => {
    if (riskLevel?.toLowerCase().includes('high')) return 'probability-high';
    if (riskLevel?.toLowerCase().includes('medium'))
      return 'probability-medium';
    if (riskLevel?.toLowerCase().includes('low')) return 'probability-low';
    return '';
  };

  return (
    <MainContentStyle>
      <Box>
        <HeaderStyle
          sx={{
            padding: themeStretch
              ? theme.spacing(5, 2)
              : theme.spacing(5, 3.75),
          }}
        >
          <Box sx={{ position: 'relative', zIndex: 1 }}>
            <Typography
              variant='h3'
              sx={{
                margin: 0,
                fontSize: { xs: '24px', sm: '32px' },
                fontWeight: 700,
                letterSpacing: '-0.025em',
              }}
            >
              Doctly's Patient Report
            </Typography>
            <Typography
              sx={{
                marginTop: '8px',
                fontSize: { xs: '16px', sm: '18px' },
                fontWeight: 400,
                opacity: 0.9,
              }}
            >
              Comprehensive Health Analysis & Recommendations
            </Typography>
          </Box>
        </HeaderStyle>
        <ContainerStyle
          maxWidth={themeStretch ? false : 'xl'}
          sx={{
            padding: themeStretch
              ? theme.spacing(5, 2)
              : theme.spacing(5, 3.75),
          }}
        >
          <ContentGridStyle>
            {/* Visit Summary */}
            <SectionStyle>
              <SectionTitleStyle variant='h6'>Visit Summary</SectionTitleStyle>
              <GridStyle>
                <Box>
                  <InfoItemStyle>
                    <InfoLabelStyle>Visit ID</InfoLabelStyle>
                    <InfoValueStyle>{visit?._id || 'N/A'}</InfoValueStyle>
                  </InfoItemStyle>
                  <InfoItemStyle sx={{ mt: 2 }}>
                    <InfoLabelStyle>Duration</InfoLabelStyle>
                    <InfoValueStyle>{durationText || 'N/A'}</InfoValueStyle>
                  </InfoItemStyle>
                  <InfoItemStyle sx={{ mt: 2 }}>
                    <InfoLabelStyle>Case File Type</InfoLabelStyle>
                    <StatusBadgeStyle status={visit?.case_file_type || 'new'}>
                      {visit?.case_file_type
                        ? visit.case_file_type.charAt(0).toUpperCase() +
                          visit.case_file_type.slice(1)
                        : 'New'}
                    </StatusBadgeStyle>
                  </InfoItemStyle>
                </Box>
                <Box>
                  <InfoItemStyle>
                    <InfoLabelStyle>Date</InfoLabelStyle>
                    <InfoValueStyle>{visitDate}</InfoValueStyle>
                  </InfoItemStyle>
                  <InfoItemStyle sx={{ mt: 2 }}>
                    <InfoLabelStyle>Time</InfoLabelStyle>
                    <InfoValueStyle>{visitTime || 'N/A'}</InfoValueStyle>
                  </InfoItemStyle>
                  <InfoItemStyle sx={{ mt: 2 }}>
                    <InfoLabelStyle>Status</InfoLabelStyle>
                    <StatusBadgeStyle status={visit?.status || 'pending'}>
                      {visit?.status
                        ? visit.status.charAt(0).toUpperCase() +
                          visit.status.slice(1)
                        : 'Pending'}
                    </StatusBadgeStyle>
                  </InfoItemStyle>
                  <InfoItemStyle sx={{ mt: 2 }}>
                    <InfoLabelStyle>Type</InfoLabelStyle>
                    <InfoValueStyle>
                      {visit?.visit_type || 'N/A'}
                    </InfoValueStyle>
                  </InfoItemStyle>
                </Box>
              </GridStyle>
            </SectionStyle>

            {/* Patient Information */}
            <SectionStyle>
              <SectionTitleStyle variant='h6'>
                Patient Information
              </SectionTitleStyle>
              <GridStyle>
                <InfoItemStyle>
                  <InfoLabelStyle>Full Name</InfoLabelStyle>
                  <InfoValueStyle>
                    {patient?.firstName} {patient?.lastName}
                  </InfoValueStyle>
                </InfoItemStyle>
                <InfoItemStyle>
                  <InfoLabelStyle>Email Address</InfoLabelStyle>
                  <InfoValueStyle>{patient?.email || 'N/A'}</InfoValueStyle>
                </InfoItemStyle>
                <InfoItemStyle>
                  <InfoLabelStyle>Phone Number</InfoLabelStyle>
                  <InfoValueStyle>{patient?.phone || 'N/A'}</InfoValueStyle>
                </InfoItemStyle>
              </GridStyle>
            </SectionStyle>

            {/* Doctor Information */}
            <SectionStyle>
              <SectionTitleStyle variant='h6'>
                Doctor Information
              </SectionTitleStyle>
              <GridStyle>
                <InfoItemStyle>
                  <InfoLabelStyle>Doctor Name</InfoLabelStyle>
                  <InfoValueStyle>
                    Dr. {doctor?.firstName} {doctor?.lastName}
                  </InfoValueStyle>
                </InfoItemStyle>
                <InfoItemStyle>
                  <InfoLabelStyle>Email Address</InfoLabelStyle>
                  <InfoValueStyle>{doctor?.email || 'N/A'}</InfoValueStyle>
                </InfoItemStyle>
                <InfoItemStyle>
                  <InfoLabelStyle>Phone Number</InfoLabelStyle>
                  <InfoValueStyle>{doctor?.phone || 'N/A'}</InfoValueStyle>
                </InfoItemStyle>
              </GridStyle>
            </SectionStyle>

            {/* Diagnosis */}
            <SectionStyle sx={{ gridColumn: '1 / -1' }}>
              <SectionTitleStyle variant='h6'>Diagnosis</SectionTitleStyle>
              <Typography
                sx={{
                  fontSize: '16px',
                  lineHeight: 1.6,
                  color: theme.palette.text.primary,
                  margin: 0,
                  '& strong': {
                    fontWeight: 600,
                  },
                }}
              >
                {report.diagnosis || 'No diagnosis provided'}
              </Typography>
            </SectionStyle>

            {/* Doctor Remarks */}
            {report.doctor_remarks && (
              <SectionStyle sx={{ gridColumn: '1 / -1' }}>
                <SectionTitleStyle variant='h6'>
                  Doctor's Remarks
                </SectionTitleStyle>
                <Box
                  sx={{
                    background:
                      theme.palette.mode === 'light'
                        ? theme.palette.background.neutral ||
                          theme.palette.grey[100]
                        : alpha(theme.palette.grey[800], 0.5),
                    padding: theme.spacing(2.5),
                    borderRadius: theme.spacing(1),
                    borderLeft: `4px solid ${theme.palette.primary.main}`,
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: '16px',
                      lineHeight: 1.6,
                      color: theme.palette.text.primary,
                      margin: 0,
                    }}
                  >
                    {report.doctor_remarks}
                  </Typography>
                </Box>
              </SectionStyle>
            )}

            {/* AI Health Analysis */}
            {report.ai_health_analysis && (
              <SectionStyle sx={{ gridColumn: '1 / -1' }}>
                <SectionTitleStyle variant='h6'>
                  AI Health Analysis
                </SectionTitleStyle>

                {report.ai_health_analysis.current_health_summary &&
                  report.ai_health_analysis.current_health_summary.length >
                    0 && (
                    <Box sx={{ marginBottom: theme.spacing(3) }}>
                      <Typography
                        sx={{
                          fontSize: '16px',
                          fontWeight: 600,
                          color: theme.palette.text.primary,
                          margin: `0 0 ${theme.spacing(2)} 0`,
                        }}
                      >
                        Current Health Summary
                      </Typography>
                      <Box
                        component='ul'
                        sx={{ margin: 0, paddingLeft: theme.spacing(2.5) }}
                      >
                        {report.ai_health_analysis.current_health_summary.map(
                          (summary, index) => (
                            <Typography
                              key={index}
                              component='li'
                              sx={{
                                marginBottom: theme.spacing(1),
                                color: theme.palette.text.primary,
                              }}
                            >
                              {summary}
                            </Typography>
                          )
                        )}
                      </Box>
                    </Box>
                  )}

                {report.ai_health_analysis.predicted_disease_probability &&
                  report.ai_health_analysis.predicted_disease_probability
                    .length > 0 && (
                    <Box>
                      <Typography
                        sx={{
                          fontSize: '16px',
                          fontWeight: 600,
                          color: theme.palette.text.primary,
                          margin: `0 0 ${theme.spacing(2)} 0`,
                        }}
                      >
                        Predicted Disease Probability
                      </Typography>
                      <TableStyle>
                        <thead>
                          <tr>
                            <th>Disease</th>
                            <th>Probability</th>
                            <th>Risk Level</th>
                          </tr>
                        </thead>
                        <tbody>
                          {report.ai_health_analysis.predicted_disease_probability.map(
                            (disease, index) => (
                              <tr key={index}>
                                <td>
                                  <strong>{disease.disease}</strong>
                                </td>
                                <td>
                                  <Typography
                                    className={getRiskLevelClass(
                                      disease.risk_level
                                    )}
                                    sx={{
                                      fontWeight: 600,
                                      color: disease.risk_level
                                        ?.toLowerCase()
                                        .includes('high')
                                        ? theme.palette.error.main
                                        : disease.risk_level
                                            ?.toLowerCase()
                                            .includes('medium')
                                        ? theme.palette.warning.main
                                        : theme.palette.success.main,
                                    }}
                                  >
                                    {disease.probability}%
                                  </Typography>
                                </td>
                                <td>
                                  <Typography
                                    sx={{
                                      fontWeight: 500,
                                      color: disease.risk_level
                                        ?.toLowerCase()
                                        .includes('high')
                                        ? theme.palette.error.main
                                        : disease.risk_level
                                            ?.toLowerCase()
                                            .includes('medium')
                                        ? theme.palette.warning.main
                                        : theme.palette.success.main,
                                    }}
                                  >
                                    {disease.risk_level}
                                  </Typography>
                                </td>
                              </tr>
                            )
                          )}
                        </tbody>
                      </TableStyle>
                    </Box>
                  )}
              </SectionStyle>
            )}

            {/* Vitals */}
            {report.vitals && report.vitals.length > 0 && (
              <SectionStyle sx={{ gridColumn: '1 / -1' }}>
                <SectionTitleStyle variant='h6'>Vitals</SectionTitleStyle>
                <TableStyle>
                  <thead>
                    <tr>
                      <th>Vital Sign</th>
                      <th>Reading</th>
                      <th>Normal Range</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {report.vitals.map((vital, index) => (
                      <tr key={index}>
                        <td>
                          <strong>{vital.vital_sign}</strong>
                        </td>
                        <td>{vital.reading}</td>
                        <td>{vital.normal_range}</td>
                        <td>
                          <Typography
                            className={getVitalStatusClass(vital.status)}
                            sx={{
                              fontWeight: 500,
                              color: vital.status
                                ?.toLowerCase()
                                .includes('normal')
                                ? theme.palette.success.main
                                : vital.status
                                    ?.toLowerCase()
                                    .includes('high') ||
                                  vital.status
                                    ?.toLowerCase()
                                    .includes('elevated')
                                ? theme.palette.error.main
                                : theme.palette.text.primary,
                            }}
                          >
                            {vital.status}
                          </Typography>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </TableStyle>
              </SectionStyle>
            )}

            {/* Prescriptions */}
            {visit?.prescription && visit.prescription.length > 0 && (
              <SectionStyle sx={{ gridColumn: '1 / -1' }}>
                <SectionTitleStyle variant='h6'>
                  Prescriptions
                </SectionTitleStyle>
                <TableStyle>
                  <thead>
                    <tr>
                      <th>Medicine</th>
                      <th>Dosage</th>
                      <th>Duration</th>
                      <th>Instructions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {visit.prescription.map((prescription, index) => (
                      <tr key={index}>
                        <td>
                          <strong>{prescription.medicine_name || 'N/A'}</strong>
                        </td>
                        <td>{prescription.dosage || 'N/A'}</td>
                        <td>{prescription.duration || 'N/A'}</td>
                        <td>{prescription.instructions || 'N/A'}</td>
                      </tr>
                    ))}
                  </tbody>
                </TableStyle>
              </SectionStyle>
            )}

            {/* Attachments */}
            {visit?.attachments && visit.attachments.length > 0 && (
              <SectionStyle sx={{ gridColumn: '1 / -1' }}>
                <SectionTitleStyle variant='h6'>
                  Medical Attachments
                </SectionTitleStyle>
                <Box
                  sx={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                    gap: theme.spacing(2.5),
                    marginTop: theme.spacing(2.5),
                  }}
                >
                  {visit.attachments.map((attachment, index) => (
                    <Box
                      key={index}
                      sx={{
                        background:
                          theme.palette.mode === 'light'
                            ? theme.palette.background.neutral ||
                              theme.palette.grey[100]
                            : alpha(theme.palette.grey[800], 0.5),
                        border: `2px dashed ${theme.palette.divider}`,
                        borderRadius: theme.spacing(1.5),
                        padding: theme.spacing(2.5),
                        textAlign: 'center',
                        transition: 'all 0.2s ease',
                        cursor: 'pointer',
                        '&:hover': {
                          borderColor: theme.palette.primary.main,
                          background: alpha(theme.palette.primary.main, 0.08),
                        },
                      }}
                    >
                      {attachment.match(/\.(jpg|jpeg|png|gif|webp)$/i) ? (
                        <Box
                          component='img'
                          src={attachment}
                          alt={`Attachment ${index + 1}`}
                          onClick={() => {
                            setSelectedImage(attachment);
                            setOpenImageDialog(true);
                          }}
                          sx={{
                            width: '100%',
                            height: '200px',
                            objectFit: 'cover',
                            borderRadius: theme.spacing(1),
                            marginBottom: theme.spacing(1.5),
                            border: `1px solid ${theme.palette.divider}`,
                            cursor: 'pointer',
                            transition: 'transform 0.2s ease',
                            '&:hover': {
                              transform: 'scale(1.02)',
                            },
                          }}
                        />
                      ) : (
                        <Box
                          sx={{
                            width: '48px',
                            height: '48px',
                            background: theme.palette.primary.main,
                            borderRadius: theme.spacing(1.5),
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            margin: `0 auto ${theme.spacing(1.5)}`,
                            color: theme.palette.common.white,
                            fontSize: '24px',
                          }}
                        >
                          📄
                        </Box>
                      )}
                      <Typography
                        sx={{
                          fontWeight: 600,
                          color: theme.palette.text.primary,
                          marginBottom: theme.spacing(1),
                        }}
                      >
                        Attachment {index + 1}
                      </Typography>
                      <Typography
                        sx={{
                          fontSize: '12px',
                          color: theme.palette.text.secondary,
                          marginBottom: theme.spacing(1.5),
                        }}
                      >
                        {attachment.match(/\.(jpg|jpeg|png|gif|webp)$/i)
                          ? 'Medical Image'
                          : 'Document'}
                      </Typography>
                      <Typography
                        sx={{
                          fontSize: '11px',
                          color: theme.palette.text.disabled,
                        }}
                      >
                        Uploaded: {generatedDate}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              </SectionStyle>
            )}
          </ContentGridStyle>
        </ContainerStyle>

        <FooterStyle>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              maxWidth: '1400px',
              margin: '0 auto',
              flexWrap: 'wrap',
              gap: theme.spacing(1.5),
            }}
          >
            <Box sx={{ textAlign: 'left' }}>
              <Typography
                sx={{ fontSize: '12px', color: theme.palette.text.secondary }}
              >
                Doctly
              </Typography>
            </Box>
            <Box sx={{ textAlign: 'center' }}>
              <Typography
                sx={{ fontSize: '12px', color: theme.palette.text.secondary }}
              >
                This is a system-generated report from Doctly. No signature
                required if printed.
              </Typography>
            </Box>
            <Box sx={{ textAlign: 'right' }}>
              <Typography
                sx={{ fontSize: '12px', color: theme.palette.text.secondary }}
              >
                Generated on: {generatedDate}
              </Typography>
            </Box>
          </Box>
        </FooterStyle>
      </Box>

      {/* Image Preview Dialog */}
      <Dialog
        open={openImageDialog}
        onClose={() => setOpenImageDialog(false)}
        maxWidth='lg'
        fullWidth
        PaperProps={{
          sx: {
            backgroundColor: 'transparent',
            boxShadow: 'none',
            maxHeight: '90vh',
          },
        }}
      >
        <DialogContent
          sx={{
            padding: 0,
            position: 'relative',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: alpha(theme.palette.background.paper, 0.95),
            borderRadius: theme.spacing(1),
          }}
        >
          <IconButton
            onClick={() => setOpenImageDialog(false)}
            sx={{
              position: 'absolute',
              top: theme.spacing(1),
              right: theme.spacing(1),
              backgroundColor: alpha(theme.palette.background.paper, 0.9),
              color: theme.palette.text.primary,
              zIndex: 1,
              '&:hover': {
                backgroundColor: theme.palette.background.paper,
              },
            }}
          >
            <Iconify icon='eva:close-fill' width={24} height={24} />
          </IconButton>
          {selectedImage && (
            <Box
              component='img'
              src={selectedImage}
              alt='Preview'
              sx={{
                maxWidth: '100%',
                maxHeight: '90vh',
                objectFit: 'contain',
                borderRadius: theme.spacing(1),
              }}
            />
          )}
        </DialogContent>
      </Dialog>
    </MainContentStyle>
  );
}
