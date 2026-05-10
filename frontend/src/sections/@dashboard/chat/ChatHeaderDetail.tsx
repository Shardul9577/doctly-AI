import { useState } from 'react';
import { styled } from '@mui/material/styles';
import {
  Box,
  Modal,
  Typography,
  Stack,
  IconButton,
  Card,
  CardActionArea,
  useMediaQuery,
  useTheme,
  Grid,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material';
import Iconify from 'src/components/Iconify';
import { VisitCardProps } from 'src/@types/user';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';

dayjs.extend(customParseFormat);

const RootStyle = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: theme.spacing(1.5, 2),
  background: theme.palette.background.paper,
  // borderRadius: theme.spacing(2),
  boxShadow: theme.shadows[1],
  width: '100%',
  [theme.breakpoints.down('sm')]: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: theme.spacing(1),
    padding: theme.spacing(1, 1),
  },
}));

const UserInfo = styled(Stack)(({ theme }) => ({
  flexDirection: 'row',
  alignItems: 'center',
  gap: theme.spacing(1.5),
}));

const ModalContent = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  padding: theme.spacing(2),
  borderRadius: 0,
  boxShadow: theme.shadows[24],
  width: '100%',
  height: '100vh',
  maxWidth: '100%',
  maxHeight: '100vh',
  overflow: 'auto',
  margin: 0,
  backgroundImage:
    'url(https://img.freepik.com/premium-vector/doctor-tools-medical-elements-seamless-pattern-cartoon-art-illustration-free-vector_11980-583.jpg)',
  backgroundSize: '300px 300px',
  backgroundRepeat: 'repeat',
  backgroundPosition: 'center',
  [theme.breakpoints.up('sm')]: {
    padding: theme.spacing(3),
    height: '100vh',
    maxHeight: '100vh',
  },
  [theme.breakpoints.up('md')]: {
    padding: theme.spacing(3),
    width: '95%',
    height: '95vh',
    maxHeight: '95vh',
    borderRadius: theme.spacing(1.5),
    margin: theme.spacing(2),
  },
  [theme.breakpoints.up('lg')]: {
    padding: theme.spacing(4),
    width: '85%',
    maxWidth: 900,
    margin: 0,
  },
}));

const InfoField = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(2),
}));

const InfoLabel = styled(Typography)(({ theme }) => ({
  ...theme.typography.caption,
  fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  fontSize: '0.75rem',
  fontWeight: 500,
  letterSpacing: '0.5px',
  color: theme.palette.text.secondary,
  marginBottom: theme.spacing(0.5),
  textTransform: 'uppercase',
}));

const InfoValue = styled(Typography)(({ theme }) => ({
  ...theme.typography.body1,
  fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  fontSize: '1rem',
  fontWeight: 600,
  color: theme.palette.text.primary,
  letterSpacing: '0.2px',
}));

const SectionHeader = styled(Stack)(({ theme }) => ({
  flexDirection: 'row',
  alignItems: 'center',
  gap: theme.spacing(1.5),
  marginBottom: theme.spacing(2),
}));

const SectionTitle = styled(Typography)(({ theme }) => ({
  ...theme.typography.h6,
  fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  fontWeight: 700,
  fontSize: '1.25rem',
  letterSpacing: '0.5px',
  color: theme.palette.text.primary,
}));

const SectionCard = styled(Card)(({ theme }) => ({
  borderRadius: theme.spacing(2.5),
  boxShadow: theme.shadows[4],
  padding: theme.spacing(2),
  backgroundColor: 'rgba(255, 255, 255, 0.98)',
  marginBottom: theme.spacing(3),
  backdropFilter: 'blur(10px)',
  border: `1px solid ${theme.palette.divider}`,
  transition: 'all 0.3s ease-in-out',
  '&:hover': {
    boxShadow: theme.shadows[8],
    transform: 'translateY(-2px)',
  },
  '&:last-child': {
    marginBottom: 0,
  },
  [theme.breakpoints.up('sm')]: {
    padding: theme.spacing(2.5),
  },
  [theme.breakpoints.up('md')]: {
    padding: theme.spacing(3.5),
  },
}));

// ----------------------------------------------------------------------

type Props = {
  visit: VisitCardProps | null;
};

export default function ChatHeaderDetail({ visit }: Props) {
  const [openModal, setOpenModal] = useState<null | 'reports' | 'visit'>(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleOpen = (type: 'reports' | 'visit') => setOpenModal(type);
  const handleClose = () => setOpenModal(null);

  const renderInfoField = (label: string, value: string) => (
    <InfoField>
      <InfoLabel>{label}</InfoLabel>
      <InfoValue>{value || 'None'}</InfoValue>
    </InfoField>
  );

  // Format date
  const formattedDate = visit?.visit_date
    ? dayjs(visit.visit_date, 'DD/MM/YYYY').format('DD MMM YYYY')
    : 'None';

  // Format time
  const formattedTime = (() => {
    if (!visit?.visit_time) return 'None';
    const timeStr = String(visit.visit_time);
    const isAmPm = /am|pm/i.test(timeStr);
    const parsed = dayjs(timeStr, isAmPm ? 'h:mm A' : 'HH:mm', true);
    return parsed.isValid() ? parsed.format('hh:mm A') : timeStr;
  })();

  return (
    <RootStyle>
      <Stack direction='row' spacing={3} sx={{ width: '100%' }}>
        <Card sx={{ flex: 1, boxShadow: 3 }}>
          <CardActionArea
            onClick={() => handleOpen('visit')}
            sx={{
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              height: '100%',
            }}
          >
            <Iconify
              icon='mdi:calendar-account'
              width={32}
              height={32}
              color='#FFA726'
            />
            <Typography variant='subtitle2' color='text.primary' sx={{ mt: 1 }}>
              Visit Details
            </Typography>
          </CardActionArea>
        </Card>
        <Card sx={{ flex: 1, boxShadow: 3, borderRadius: 2 }}>
          <CardActionArea
            onClick={() => handleOpen('reports')}
            sx={{
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              height: '100%',
            }}
          >
            <Iconify
              icon='mdi:file-document-outline'
              width={32}
              height={32}
              color='#42A5F5'
            />
            <Typography variant='subtitle2' color='text.primary' sx={{ mt: 1 }}>
              Old Reports
            </Typography>
          </CardActionArea>
        </Card>
      </Stack>
      <Modal
        open={!!openModal}
        onClose={handleClose}
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 0,
          [theme.breakpoints.up('md')]: {
            padding: theme.spacing(2),
          },
        }}
      >
        <ModalContent sx={{ position: 'relative' }}>
          <IconButton
            onClick={handleClose}
            sx={{
              position: 'absolute',
              top: { xs: 4, sm: 8 },
              right: { xs: 4, sm: 8 },
              zIndex: 1,
              backgroundColor: 'rgba(255, 255, 255, 0.9)',
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 1)',
              },
            }}
            aria-label='close'
          >
            <Iconify
              icon='eva:close-fill'
              width={24}
              height={24}
              sx={{ fontSize: { xs: 20, sm: 24 } }}
            />
          </IconButton>
          {openModal === 'reports' ? (
            <>
              <Typography variant='h6'>Old Reports</Typography>
              <Typography sx={{ mt: 2 }}>
                This will show the patient's old report list.
              </Typography>
            </>
          ) : openModal === 'visit' && visit ? (
            <Box sx={{ mt: { xs: 1, sm: 2 } }}>
              <Card
                sx={{
                  backgroundColor: '#ffffff',
                  borderRadius: { xs: 2, sm: 2.5 },
                  boxShadow: { xs: 2, sm: 4 },
                  p: { xs: 2, sm: 2.5, md: 3 },
                  mb: { xs: 2, sm: 3, md: 4 },
                  width: '100%',
                }}
              >
                <Stack
                  direction={{ xs: 'column', sm: 'row' }}
                  alignItems={{ xs: 'center', sm: 'center' }}
                  justifyContent={{ xs: 'center', sm: 'flex-start' }}
                  spacing={{ xs: 1, sm: 1.5, md: 2 }}
                  sx={{
                    textAlign: { xs: 'center', sm: 'left' },
                    width: '100%',
                  }}
                  flexWrap='wrap'
                >
                  <Iconify
                    icon='mdi:calendar-clock'
                    sx={{
                      fontSize: {
                        xs: '1.75rem',
                        sm: '2.5rem',
                        md: '3rem',
                        lg: '3.5rem',
                      },
                      color: '#0007ff',
                      position: 'relative',
                      flexShrink: 0,
                    }}
                  />
                  <Typography
                    variant='h3'
                    component='h1'
                    sx={{
                      fontSize: {
                        xs: '1.25rem',
                        sm: '1.75rem',
                        md: '2.25rem',
                        lg: '2.75rem',
                      },
                      fontWeight: { xs: 700, sm: 800 },
                      fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
                      letterSpacing: { xs: '0.5px', sm: '1px', md: '2px' },
                      color: '#0007ff',
                      position: 'relative',
                      textTransform: 'uppercase',
                      mb: 0,
                      lineHeight: { xs: 1.2, sm: 1.25, md: 1.3 },
                      wordBreak: 'break-word',
                      maxWidth: '100%',
                    }}
                  >
                    VISIT DETAILS
                  </Typography>
                </Stack>
              </Card>

              <Box>
                {/* Visit Summary */}
                <SectionCard>
                  <SectionHeader>
                    <Iconify
                      icon='mdi:calendar-clock'
                      width={28}
                      height={28}
                      color={theme.palette.primary.main}
                    />
                    <SectionTitle>Visit Summary</SectionTitle>
                  </SectionHeader>
                  <Grid container spacing={{ xs: 2, sm: 3 }}>
                    <Grid item xs={12} sm={6}>
                      {renderInfoField('Date', formattedDate)}
                      {renderInfoField('Time', formattedTime)}
                      {renderInfoField(
                        'Duration',
                        `${visit.duration || 'None'} minutes`
                      )}
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      {renderInfoField('Status', visit.status || 'None')}
                      {renderInfoField('Type', visit.visit_type || 'None')}
                      {renderInfoField(
                        'Case File Type',
                        visit.case_file_type || 'None'
                      )}
                    </Grid>
                  </Grid>
                </SectionCard>

                {/* Patient & Doctor Information */}
                <SectionCard>
                  <SectionHeader>
                    <Iconify
                      icon='mdi:account-group'
                      width={28}
                      height={28}
                      color={theme.palette.info.main}
                    />
                    <SectionTitle>Patient & Doctor</SectionTitle>
                  </SectionHeader>
                  <Grid container spacing={{ xs: 2, sm: 3 }}>
                    <Grid item xs={12} sm={6}>
                      <Typography
                        variant='body2'
                        sx={{
                          mb: 1.5,
                          fontWeight: 600,
                          fontFamily:
                            '"Roboto", "Helvetica", "Arial", sans-serif',
                          letterSpacing: '1px',
                          color: theme.palette.text.secondary,
                          textTransform: 'uppercase',
                          fontSize: { xs: '0.7rem', sm: '0.75rem' },
                        }}
                      >
                        PATIENT
                      </Typography>
                      <Divider sx={{ mb: 2 }} />
                      {renderInfoField(
                        'Name',
                        `${
                          visit.doctor_patient_relations_id?.patient_id
                            ?.firstName || ''
                        } ${
                          visit.doctor_patient_relations_id?.patient_id
                            ?.lastName || ''
                        }`.trim()
                      )}
                      {renderInfoField(
                        'Email',
                        visit.doctor_patient_relations_id?.patient_id?.email ||
                          ''
                      )}
                      {renderInfoField(
                        'Phone',
                        visit.doctor_patient_relations_id?.patient_id?.phone ||
                          ''
                      )}
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography
                        variant='body2'
                        sx={{
                          mb: 1.5,
                          fontWeight: 600,
                          fontFamily:
                            '"Roboto", "Helvetica", "Arial", sans-serif',
                          letterSpacing: '1px',
                          color: theme.palette.text.secondary,
                          textTransform: 'uppercase',
                          fontSize: { xs: '0.7rem', sm: '0.75rem' },
                        }}
                      >
                        DOCTOR
                      </Typography>
                      <Divider sx={{ mb: 2 }} />
                      {renderInfoField(
                        'Name',
                        `${
                          visit.doctor_patient_relations_id?.doctor_id
                            ?.firstName || ''
                        } ${
                          visit.doctor_patient_relations_id?.doctor_id
                            ?.lastName || ''
                        }`.trim()
                      )}
                      {renderInfoField(
                        'Email',
                        visit.doctor_patient_relations_id?.doctor_id?.email ||
                          ''
                      )}
                      {renderInfoField(
                        'Phone',
                        visit.doctor_patient_relations_id?.doctor_id?.phone ||
                          ''
                      )}
                    </Grid>
                  </Grid>
                </SectionCard>

                {/* Clinical Notes */}
                <SectionCard>
                  <SectionHeader>
                    <Iconify
                      icon='mdi:note-text'
                      width={28}
                      height={28}
                      color={theme.palette.success.main}
                    />
                    <SectionTitle>Clinical Notes</SectionTitle>
                  </SectionHeader>
                  <Grid container spacing={{ xs: 2, sm: 3 }}>
                    <Grid item xs={12} sm={6}>
                      {renderInfoField(
                        'Symptoms',
                        Array.isArray(visit.symptoms)
                          ? visit.symptoms.join(', ')
                          : 'No symptoms noted.'
                      )}
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      {renderInfoField(
                        'Notes',
                        visit.notes || 'No notes available.'
                      )}
                    </Grid>
                    {visit.ai_summary && (
                      <Grid item xs={12}>
                        {renderInfoField('AI Summary', visit.ai_summary)}
                      </Grid>
                    )}
                  </Grid>
                </SectionCard>

                {/* Diagnosis */}
                {visit.diagnosis && visit.diagnosis.length > 0 && (
                  <SectionCard>
                    <SectionHeader>
                      <Iconify
                        icon='mdi:stethoscope'
                        width={28}
                        height={28}
                        color={theme.palette.warning.main}
                      />
                      <SectionTitle>Diagnosis</SectionTitle>
                    </SectionHeader>
                    <TableContainer
                      component={Paper}
                      variant='outlined'
                      sx={{
                        borderRadius: theme.spacing(1),
                        overflow: 'auto',
                        maxWidth: '100%',
                      }}
                    >
                      <Table size='small' sx={{ minWidth: 250 }}>
                        <TableHead>
                          <TableRow
                            sx={{
                              backgroundColor: theme.palette.grey[100],
                            }}
                          >
                            <TableCell
                              sx={{
                                fontWeight: 700,
                                width: { xs: 50, sm: 80 },
                                fontFamily:
                                  '"Roboto", "Helvetica", "Arial", sans-serif',
                                fontSize: { xs: '0.75rem', sm: '0.875rem' },
                                padding: { xs: 1, sm: 1.5 },
                              }}
                            >
                              #
                            </TableCell>
                            <TableCell
                              sx={{
                                fontWeight: 700,
                                fontFamily:
                                  '"Roboto", "Helvetica", "Arial", sans-serif',
                                fontSize: { xs: '0.75rem', sm: '0.875rem' },
                                padding: { xs: 1, sm: 1.5 },
                              }}
                            >
                              Diagnosis
                            </TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {visit.diagnosis.map(
                            (item: string, index: number) => (
                              <TableRow key={index}>
                                <TableCell
                                  sx={{
                                    fontFamily:
                                      '"Roboto", "Helvetica", "Arial", sans-serif',
                                    fontSize: { xs: '0.75rem', sm: '0.875rem' },
                                    padding: { xs: 1, sm: 1.5 },
                                  }}
                                >
                                  {index + 1}
                                </TableCell>
                                <TableCell
                                  sx={{
                                    fontFamily:
                                      '"Roboto", "Helvetica", "Arial", sans-serif',
                                    fontSize: { xs: '0.75rem', sm: '0.875rem' },
                                    padding: { xs: 1, sm: 1.5 },
                                  }}
                                >
                                  {item}
                                </TableCell>
                              </TableRow>
                            )
                          )}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </SectionCard>
                )}

                {/* Prescription */}
                {visit.prescription && visit.prescription.length > 0 && (
                  <SectionCard>
                    <SectionHeader>
                      <Iconify
                        icon='mdi:pill'
                        width={28}
                        height={28}
                        color={theme.palette.secondary.main}
                      />
                      <SectionTitle>Prescription</SectionTitle>
                    </SectionHeader>
                    <TableContainer
                      component={Paper}
                      variant='outlined'
                      sx={{
                        borderRadius: theme.spacing(1),
                        overflow: 'auto',
                        maxWidth: '100%',
                      }}
                    >
                      <Table
                        size='small'
                        sx={{ minWidth: { xs: 600, sm: '100%' } }}
                      >
                        <TableHead>
                          <TableRow
                            sx={{
                              backgroundColor: theme.palette.grey[100],
                            }}
                          >
                            <TableCell
                              sx={{
                                fontWeight: 700,
                                fontFamily:
                                  '"Roboto", "Helvetica", "Arial", sans-serif',
                                fontSize: { xs: '0.7rem', sm: '0.875rem' },
                                padding: { xs: 1, sm: 1.5 },
                                whiteSpace: 'nowrap',
                              }}
                            >
                              Medicine
                            </TableCell>
                            <TableCell
                              sx={{
                                fontWeight: 700,
                                fontFamily:
                                  '"Roboto", "Helvetica", "Arial", sans-serif',
                                fontSize: { xs: '0.7rem', sm: '0.875rem' },
                                padding: { xs: 1, sm: 1.5 },
                                whiteSpace: 'nowrap',
                              }}
                            >
                              Dosage
                            </TableCell>
                            <TableCell
                              sx={{
                                fontWeight: 700,
                                fontFamily:
                                  '"Roboto", "Helvetica", "Arial", sans-serif',
                                fontSize: { xs: '0.7rem', sm: '0.875rem' },
                                padding: { xs: 1, sm: 1.5 },
                                whiteSpace: 'nowrap',
                              }}
                            >
                              Duration
                            </TableCell>
                            <TableCell
                              sx={{
                                fontWeight: 700,
                                fontFamily:
                                  '"Roboto", "Helvetica", "Arial", sans-serif',
                                fontSize: { xs: '0.7rem', sm: '0.875rem' },
                                padding: { xs: 1, sm: 1.5 },
                              }}
                            >
                              Instructions
                            </TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {visit.prescription.map(
                            (
                              p: {
                                medicine_name?: string;
                                dosage?: string;
                                duration?: string;
                                instructions?: string;
                              },
                              index: number
                            ) => (
                              <TableRow key={index}>
                                <TableCell
                                  sx={{
                                    fontFamily:
                                      '"Roboto", "Helvetica", "Arial", sans-serif',
                                    fontSize: { xs: '0.75rem', sm: '0.875rem' },
                                    padding: { xs: 1, sm: 1.5 },
                                  }}
                                >
                                  {p.medicine_name || '-'}
                                </TableCell>
                                <TableCell
                                  sx={{
                                    fontFamily:
                                      '"Roboto", "Helvetica", "Arial", sans-serif',
                                    fontSize: { xs: '0.75rem', sm: '0.875rem' },
                                    padding: { xs: 1, sm: 1.5 },
                                  }}
                                >
                                  {p.dosage || '-'}
                                </TableCell>
                                <TableCell
                                  sx={{
                                    fontFamily:
                                      '"Roboto", "Helvetica", "Arial", sans-serif',
                                    fontSize: { xs: '0.75rem', sm: '0.875rem' },
                                    padding: { xs: 1, sm: 1.5 },
                                  }}
                                >
                                  {p.duration || '-'}
                                </TableCell>
                                <TableCell
                                  sx={{
                                    fontFamily:
                                      '"Roboto", "Helvetica", "Arial", sans-serif',
                                    fontSize: { xs: '0.75rem', sm: '0.875rem' },
                                    padding: { xs: 1, sm: 1.5 },
                                  }}
                                >
                                  {p.instructions || '-'}
                                </TableCell>
                              </TableRow>
                            )
                          )}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </SectionCard>
                )}
              </Box>
            </Box>
          ) : openModal === 'visit' ? (
            <>
              <Typography variant='h6'>Visit Details</Typography>
              <Typography sx={{ mt: 2 }}>No visit data available.</Typography>
            </>
          ) : (
            <></>
          )}
        </ModalContent>
      </Modal>
    </RootStyle>
  );
}
