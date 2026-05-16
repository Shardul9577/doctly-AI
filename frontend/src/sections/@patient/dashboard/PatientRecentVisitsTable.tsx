import { useRouter } from 'next/router';
import NextLink from 'next/link';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { sentenceCase } from 'change-case';
import {
  Box,
  Card,
  Table,
  Avatar,
  Button,
  TableRow,
  TableBody,
  TableCell,
  CardHeader,
  Typography,
  TableContainer,
  CardProps,
  Stack,
} from '@mui/material';
import Scrollbar from '../../../components/Scrollbar';
import Label from '../../../components/Label';
import Iconify from '../../../components/Iconify';
import { TableHeadCustom } from '../../../components/table';
import { PATH_PATIENT_DASHBOARD } from '../../../routes/paths';
import { PatientVisit, getVisitDoctorName } from '../../../hooks/usePatientDashboard';

dayjs.extend(customParseFormat);

type Props = CardProps & {
  title?: string;
  subheader?: string;
  visits: PatientVisit[];
};

const TABLE_HEAD = [
  { id: 'doctor', label: 'Doctor' },
  { id: 'date', label: 'Date' },
  { id: 'type', label: 'Type' },
  { id: 'status', label: 'Status' },
  { id: '' },
];

function statusColor(status: string) {
  const s = status?.toLowerCase() || '';
  if (s.includes('complete')) return 'success';
  if (s.includes('pending') || s.includes('schedule')) return 'warning';
  if (s.includes('cancel')) return 'error';
  return 'info';
}

export default function PatientRecentVisitsTable({
  title = 'Recent visits',
  subheader,
  visits,
  ...other
}: Props) {
  const { push } = useRouter();

  return (
    <Card {...other}>
      <CardHeader title={title} subheader={subheader} sx={{ mb: 1 }} />

      <Scrollbar>
        <TableContainer sx={{ minWidth: 720 }}>
          <Table>
            <TableHeadCustom headLabel={TABLE_HEAD} />
            <TableBody>
              {visits.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} align="center" sx={{ py: 6 }}>
                    <Typography variant="body2" color="text.secondary">
                      No visits yet. Book an appointment with a doctor.
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                visits.map((row) => {
                  const doctor = row.doctor_patient_relations_id?.doctor_id;
                  const doctorName = getVisitDoctorName(row);
                  const date = dayjs(row.visit_date, 'DD/MM/YYYY');

                  return (
                    <TableRow
                      key={row._id}
                      hover
                      sx={{ cursor: 'pointer' }}
                      onClick={() =>
                        push(
                          PATH_PATIENT_DASHBOARD.visits.detailed.replace('[id]', row._id)
                        )
                      }
                    >
                      <TableCell>
                        <Stack direction="row" alignItems="center" spacing={2}>
                          <Avatar
                            src={doctor?.profile_picture}
                            alt={doctorName}
                            sx={{ width: 40, height: 40 }}
                          />
                          <Typography variant="subtitle2">{doctorName}</Typography>
                        </Stack>
                      </TableCell>
                      <TableCell>
                        {date.isValid() ? date.format('DD MMM YYYY') : row.visit_date}
                        {row.visit_time && (
                          <Typography variant="caption" display="block" color="text.secondary">
                            {row.visit_time}
                          </Typography>
                        )}
                      </TableCell>
                      <TableCell>
                        {sentenceCase(row.visit_type || 'consultation')}
                      </TableCell>
                      <TableCell>
                        <Label color={statusColor(row.status)} variant="ghost">
                          {sentenceCase(row.status)}
                        </Label>
                      </TableCell>
                      <TableCell align="right">
                        <Iconify icon="eva:arrow-ios-forward-fill" width={20} />
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Scrollbar>

      <Box sx={{ p: 2, textAlign: 'right' }}>
        <NextLink href={PATH_PATIENT_DASHBOARD.visits.list} passHref>
          <Button
            size="small"
            color="inherit"
            component="a"
            endIcon={<Iconify icon="eva:arrow-ios-forward-fill" />}
          >
            View all visits
          </Button>
        </NextLink>
      </Box>
    </Card>
  );
}
