import { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { sentenceCase } from 'change-case';
// @mui
import { useTheme } from '@mui/material/styles';
import {
  Box,
  Card,
  Stack,
  Table,
  Avatar,
  Button,
  Divider,
  MenuItem,
  TableRow,
  TableBody,
  TableCell,
  CardProps,
  CardHeader,
  Typography,
  TableContainer,
} from '@mui/material';
// components
import Label from '../../../../components/Label';
import Iconify from '../../../../components/Iconify';
import Scrollbar from '../../../../components/Scrollbar';
import { TableMoreMenu, TableHeadCustom } from '../../../../components/table';
import axiosInstance from 'src/utils/axios';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { TableHead, Paper, TablePagination } from '@mui/material';
import { useRouter } from 'next/router';
import { PATH_DASHBOARD } from 'src/routes/paths';

// ----------------------------------------------------------------------

type RowProps = {
  _id: string;
  doctor_patient_relations_id: {
    _id: string;
    patient_id: {
      _id: string;
      firstName: string;
      lastName: string;
      email: string;
      phone: string;
      abha_id: string;
      profile_picture: string;
    };
    doctor_id: {
      _id: string;
      firstName: string;
      lastName: string;
      email: string;
      phone: string;
      profile_picture: string;
    };
    organization_id: string;
    is_active: boolean;
    createdAt: string;
    updatedAt: string;
    __v: number;
  };
  is_active: boolean;
  visit_date: string; // e.g., "11/07/2025"
  visit_time: string; // e.g., "22:18"
  duration: number; // in hours
  visit_type: string; // e.g., "check-up"
  status: string; // e.g., "pending"
  case_file_type: string; // e.g., "new"
  symptoms: string[];
  notes: string;
  attachments: any[]; // could be refined if you know the structure
  prescription: any[]; // same here
  createdAt: string;
  updatedAt: string;
  __v: number;
};

interface Props extends CardProps {
  title?: string;
  subheader?: string;
  tableLabels: any;
  tableData: RowProps[];
}

export default function BookingDetails({
  title,
  subheader,
  tableLabels,
  tableData,
  ...other
}: Props) {
  const [visitList, setVisitList] = useState<RowProps[]>([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10); // now changeable
  const [totalRows, setTotalRows] = useState(0);

  const fetchVisitList = async (pageNumber = 1, limit = rowsPerPage) => {
    try {
      const response = await axiosInstance.get(
        `/api/doctors/visit/list?page=${pageNumber}&limit=${limit}`
      );
      const data = response?.data;
      setVisitList(data?.visits || []);
      setTotalRows(data?.meta?.total || 0);
    } catch (error) {
      console.error('Failed to fetch visits:', error);
    }
  };

  const handleChangePage = (_: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0); // Reset to first page when rows per page changes
  };

  useEffect(() => {
    fetchVisitList(page + 1, rowsPerPage);
  }, [page, rowsPerPage]);

  return (
    <Card {...other}>
      <CardHeader title={title} subheader={subheader} sx={{ mb: 3 }} />
      <Scrollbar>
        <TableContainer sx={{ minWidth: 720 }}>
          <Table>
            <TableHeadCustom headLabel={tableLabels} />

            <TableBody>
              {visitList.map((row) => (
                <BookingDetailsRow key={row._id} row={row} />
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Scrollbar>

      <Divider />

      {/* <Box sx={{ p: 2, textAlign: 'right' }}>
        <Button
          size='small'
          color='inherit'
          endIcon={<Iconify icon={'eva:arrow-ios-forward-fill'} />}
        >
          View All
        </Button>
      </Box> */}

      <TablePagination
        component='div'
        count={totalRows}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        rowsPerPageOptions={[5, 10, 25, 50]} // You can customize these options
      />
    </Card>
  );
}

// ----------------------------------------------------------------------

type BookingDetailsRowProps = {
  row: RowProps;
};

function BookingDetailsRow({ row }: BookingDetailsRowProps) {
  const theme = useTheme();

  const isLight = theme.palette.mode === 'light';
  dayjs.extend(customParseFormat);

  let { push } = useRouter();

  const redirect = (id: string) => {
    push(PATH_DASHBOARD.visits.detailed.replace('[name]', id));
  };

  return (
    <TableRow>
      <TableCell>
        <Stack
          direction='row'
          onClick={() => redirect(row._id)}
          alignItems='center'
          spacing={2}
        >
          <Avatar
            alt={row.doctor_patient_relations_id.patient_id.firstName}
            src={
              row.doctor_patient_relations_id.patient_id.profile_picture ||
              'https://images.icon-icons.com/2266/PNG/512/patient_icon_140481.png'
            }
          />
          <Typography variant='subtitle2'>
            {row.doctor_patient_relations_id?.patient_id?.firstName &&
            row.doctor_patient_relations_id?.patient_id?.lastName
              ? `${row.doctor_patient_relations_id.patient_id.firstName} ${row.doctor_patient_relations_id.patient_id.lastName}`
              : 'None'}
          </Typography>
        </Stack>
      </TableCell>

      {/* ✅ Check In Date */}
      <TableCell>
        {dayjs(row.visit_date, 'DD/MM/YYYY').isValid()
          ? dayjs(row.visit_date, 'DD/MM/YYYY').format('DD MMM YYYY')
          : 'Invalid Date'}
      </TableCell>

      {/* ✅ Check In Time */}
      <TableCell>
        {dayjs(row.visit_time, 'HH:mm').isValid()
          ? dayjs(row.visit_time, 'HH:mm').format('hh:mm A')
          : 'Invalid Time'}
      </TableCell>

      <TableCell>
        <Label
          variant={isLight ? 'ghost' : 'filled'}
          color={
            row.status === 'pending'
              ? 'error' // red
              : row.status === 'ongoing'
              ? 'info' // blue
              : 'success' // completed = green
          }
          sx={{
            px: 2,
            py: 0.5,
            borderRadius: 2,
            fontWeight: 600,
            fontSize: '0.75rem',
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
          }}
        >
          {sentenceCase(row.status) || 'None'}
        </Label>
      </TableCell>

      <TableCell>
        {row.doctor_patient_relations_id.patient_id.phone || 'None'}
      </TableCell>

      <TableCell sx={{ textTransform: 'capitalize' }}>
        {row.duration || 'None'}
      </TableCell>
    </TableRow>
  );
}
