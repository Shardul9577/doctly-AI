import React, { useState } from 'react';
import {
  Box,
  Grid,
  Modal,
  Typography,
  Stack,
  Card,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import { styled, alpha } from '@mui/material/styles';
import {
  PersonOutlineOutlined as PersonIcon,
  MedicalInformationOutlined as DoctorIcon,
  AttachFileOutlined as AttachmentsIcon,
  ChecklistOutlined as ListIcon,
  NotesOutlined as NotesIcon,
} from '@mui/icons-material';
import { VisitCardProps } from 'src/@types/user';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';

dayjs.extend(customParseFormat);

// ----------------------------------------------------------------------
// Styled Components
// ----------------------------------------------------------------------

const StyledCard = styled(Card)(({ theme }) => ({
  borderRadius: theme.spacing(2),
  boxShadow: theme.customShadows.z8,
  padding: theme.spacing(3),
  backgroundColor: theme.palette.background.paper,
  height: '100%',
}));

const SectionHeader = styled(Stack)(({ theme }) => ({
  flexDirection: 'row',
  alignItems: 'center',
  gap: theme.spacing(1.5),
  marginBottom: theme.spacing(2),
}));

const SectionTitle = styled(Typography)(({ theme }) => ({
  ...theme.typography.h6,
  fontWeight: 700,
}));

const InfoField = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(2),
}));

const InfoLabel = styled(Typography)(({ theme }) => ({
  ...theme.typography.caption,
  color: theme.palette.text.secondary,
  marginBottom: theme.spacing(0.5),
}));

const InfoValue = styled(Typography)(({ theme }) => ({
  ...theme.typography.body1,
  fontWeight: 600,
  color: theme.palette.text.primary,
}));

const FilePreview = styled(Box)(({ theme }) => ({
  position: 'relative',
  height: 120,
  borderRadius: theme.spacing(1.5),
  overflow: 'hidden',
  cursor: 'pointer',
  transition: 'transform 0.2s, box-shadow 0.2s',
  border: `1px solid ${theme.palette.divider}`,
  '&:hover': {
    transform: 'scale(1.02)',
    boxShadow: theme.customShadows.z8,
  },
}));

const FileImg = styled('img')({
  width: '100%',
  height: '100%',
  objectFit: 'cover',
});

const ModalPreview = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  backgroundColor: theme.palette.background.paper,
  boxShadow: theme.shadows[24],
  padding: theme.spacing(2),
  borderRadius: theme.spacing(2),
}));

const ModalImage = styled('img')(({ theme }) => ({
  maxWidth: '100%',
  maxHeight: '80vh',
  borderRadius: theme.spacing(1),
}));

// ----------------------------------------------------------------------
// Main Component
// ----------------------------------------------------------------------

interface Props {
  visit?: VisitCardProps;
}

export default function VisitViewPage({ visit, ...other }: Props) {
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [open, setOpen] = useState(false);

  console.log(visit);

  const handleImageClick = (url: string) => {
    setPreviewImage(url);
    setOpen(true);
  };

  const getAttachmentUrl = (attachment: any): string => {
    if (!attachment) return '';
    if (typeof attachment === 'string') return attachment;
    return attachment.url || attachment.name || '';
  };

  const renderInfoField = (label: string, value: string) => (
    <InfoField>
      <InfoLabel>{label}</InfoLabel>
      <InfoValue>{value}</InfoValue>
    </InfoField>
  );

  // Corrected date and time formatting
  const formattedDate = visit?.visit_date
    ? dayjs(visit.visit_date, 'DD/MM/YYYY').format('DD MMM YYYY')
    : 'None';
  const formattedTime = (() => {
    if (!visit?.visit_time) return 'None';
    const timeStr = String(visit.visit_time);
    const isAmPm = /am|pm/i.test(timeStr);
    const parsed = dayjs(timeStr, isAmPm ? 'h:mm A' : 'HH:mm', true);
    return parsed.isValid() ? parsed.format('hh:mm A') : timeStr;
  })();

  return (
    <Box {...other}>
      <Grid container spacing={3}>
        {/* Visit Summary Card */}
        <Grid item xs={12} md={5}>
          <StyledCard>
            <SectionHeader>
              <NotesIcon sx={{ fontSize: 32, color: 'primary.main' }} />
              <SectionTitle color='primary'>Visit Summary</SectionTitle>
            </SectionHeader>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                {renderInfoField('Date', formattedDate)}
                {renderInfoField('Time', formattedTime)}
                {renderInfoField(
                  'Duration',
                  `${visit?.duration || 'None'} minutes`
                )}
              </Grid>
              <Grid item xs={12} sm={6}>
                {renderInfoField('Status', visit?.status || 'None')}
                {renderInfoField('Type', visit?.visit_type || 'None')}
                {renderInfoField(
                  'Case File Type',
                  visit?.case_file_type || 'None'
                )}
              </Grid>
            </Grid>
          </StyledCard>
        </Grid>

        {/* Patient & Doctor Information Card */}
        <Grid item xs={12} md={7}>
          <StyledCard>
            <SectionHeader>
              <PersonIcon sx={{ fontSize: 32, color: 'info.main' }} />
              <SectionTitle color='info'>Patient & Doctor</SectionTitle>
            </SectionHeader>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <Typography variant='body2' color='text.secondary' mb={1}>
                  PATIENT
                </Typography>
                <Divider sx={{ mb: 2 }} />
                {renderInfoField(
                  'Name',
                  `${
                    visit?.doctor_patient_relations_id?.patient_id?.firstName ||
                    ''
                  } ${
                    visit?.doctor_patient_relations_id?.patient_id?.lastName ||
                    ''
                  }`.trim() || 'None'
                )}
                {renderInfoField(
                  'Email',
                  visit?.doctor_patient_relations_id?.patient_id?.email ||
                    'None'
                )}
                {renderInfoField(
                  'Phone',
                  visit?.doctor_patient_relations_id?.patient_id?.phone ||
                    'None'
                )}
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant='body2' color='text.secondary' mb={1}>
                  DOCTOR
                </Typography>
                <Divider sx={{ mb: 2 }} />
                {renderInfoField(
                  'Name',
                  `${
                    visit?.doctor_patient_relations_id?.doctor_id?.firstName ||
                    ''
                  } ${
                    visit?.doctor_patient_relations_id?.doctor_id?.lastName ||
                    ''
                  }`.trim() || 'None'
                )}
                {renderInfoField(
                  'Email',
                  visit?.doctor_patient_relations_id?.doctor_id?.email || 'None'
                )}
                {renderInfoField(
                  'Phone',
                  visit?.doctor_patient_relations_id?.doctor_id?.phone || 'None'
                )}
              </Grid>
            </Grid>
          </StyledCard>
        </Grid>

        {/* Symptoms & Notes Card */}
        <Grid item xs={12}>
          <StyledCard>
            <SectionHeader>
              <ListIcon sx={{ fontSize: 32, color: 'success.main' }} />
              <SectionTitle color='success'>Clinical Notes</SectionTitle>
            </SectionHeader>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                {renderInfoField(
                  'Symptoms',
                  Array.isArray(visit?.symptoms)
                    ? visit?.symptoms?.join(', ')
                    : 'No symptoms noted.'
                )}
              </Grid>
              <Grid item xs={12} sm={6}>
                {renderInfoField(
                  'Notes',
                  visit?.notes || 'No notes available.'
                )}
              </Grid>
            </Grid>
          </StyledCard>
        </Grid>

        {/* Diagnosis Card */}
        <Grid item xs={12}>
          <StyledCard>
            <SectionHeader>
              <ListIcon sx={{ fontSize: 32, color: 'warning.main' }} />
              <SectionTitle color='warning'>Diagnosis</SectionTitle>
            </SectionHeader>
            {visit?.diagnosis && visit.diagnosis.length > 0 ? (
              <TableContainer>
                <Table size='small'>
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 700, width: 80 }}>
                        #
                      </TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>Diagnosis</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {visit.diagnosis.map((item: string, index: number) => (
                      <TableRow key={index}>
                        <TableCell>{index + 1}</TableCell>
                        <TableCell>{item}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            ) : (
              <Typography variant='body2' color='gray'>
                No diagnosis available.
              </Typography>
            )}
          </StyledCard>
        </Grid>

        {/* Prescription Card */}
        <Grid item xs={12}>
          <StyledCard>
            <SectionHeader>
              <ListIcon sx={{ fontSize: 32, color: 'secondary.main' }} />
              <SectionTitle color='secondary'>Prescription</SectionTitle>
            </SectionHeader>
            {visit?.prescription && visit.prescription.length > 0 ? (
              <TableContainer>
                <Table size='small'>
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 700 }}>Medicine</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>Dosage</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>Duration</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>
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
                          <TableCell>{p.medicine_name || '-'}</TableCell>
                          <TableCell>{p.dosage || '-'}</TableCell>
                          <TableCell>{p.duration || '-'}</TableCell>
                          <TableCell>{p.instructions || '-'}</TableCell>
                        </TableRow>
                      )
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            ) : (
              <Typography variant='body2' color='gray'>
                No prescriptions available.
              </Typography>
            )}
          </StyledCard>
        </Grid>

        {/* Report Attachments Card */}
        <Grid item xs={12}>
          <StyledCard>
            <SectionHeader>
              <AttachmentsIcon sx={{ fontSize: 32, color: 'error.main' }} />
              <SectionTitle color='error'>Report Attachments</SectionTitle>
            </SectionHeader>
            <Grid container spacing={2}>
              {visit?.attachments && visit.attachments.length > 0 ? (
                visit.attachments
                  .map((att: any) => getAttachmentUrl(att))
                  .filter((url: string) => !!url)
                  .map((url: string, index: number) => (
                    <Grid item key={index} xs={6} sm={4} md={3} lg={2}>
                      <FilePreview onClick={() => handleImageClick(url)}>
                        <FileImg src={url} alt={`attachment-${index}`} />
                      </FilePreview>
                    </Grid>
                  ))
              ) : (
                <Grid item xs={12}>
                  <Typography variant='body2' color='gray'>
                    No attachments available.
                  </Typography>
                </Grid>
              )}
            </Grid>
          </StyledCard>
        </Grid>
      </Grid>

      <Modal open={open} onClose={() => setOpen(false)}>
        <ModalPreview>
          {previewImage && <ModalImage src={previewImage} alt='preview' />}
        </ModalPreview>
      </Modal>
    </Box>
  );
}
