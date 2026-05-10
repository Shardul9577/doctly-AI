import { useEffect, useState } from 'react';
import dayjs from 'dayjs';
// @mui
import {
  Table,
  Stack,
  Paper,
  Avatar,
  TableRow,
  TableBody,
  TableCell,
  TableHead,
  Typography,
  TableContainer,
  TablePagination,
  Box,
} from '@mui/material';
import { Container, Chip } from '@mui/material';
import { useTheme } from '@mui/material/styles';

// redux
import { useDispatch } from '../../../redux/store';
// hooks
import useIsMountedRef from '../../../hooks/useIsMountedRef';
import useSettings from '../../../hooks/useSettings';
// layouts
import Layout from '../../../layouts';
// components
import Page from '../../../components/Page';
import HeaderBreadcrumbs from '../../../components/HeaderBreadcrumbs';
import axiosInstance from 'src/utils/axios';
import Label from '../../../components/Label'; // or update the path as per your project structure
import { sentenceCase } from 'change-case';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import utc from 'dayjs/plugin/utc';
import { useRouter } from 'next/router';

// ----------------------------------------------------------------------

type VisitItem = {
  _id: string;
  doctor_patient_relations_id: {
    _id: string;
    patient_id: {
      _id: string;
      firstName: string;
      lastName: string;
      email: string;
      phone: string;
      abha_id?: string;
      profile_picture?: string;
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
  visit_date: string;
  visit_time: string;
  duration: number;
  visit_type: string;
  status: string;
  case_file_type: string;
  symptoms: string[];
  diagnosis: string[];
  notes: string;
  ai_summary: string;
  attachments: any[];
  prescription: any[];
  createdAt: string;
  updatedAt: string;
  __v: number;
};

AllVisitList.getLayout = function getLayout(page: React.ReactElement) {
  return <Layout>{page}</Layout>;
};

export default function AllVisitList() {
  const { themeStretch } = useSettings();
  const dispatch = useDispatch();
  const isMountedRef = useIsMountedRef();
  const theme = useTheme();

  const [visitList, setVisitList] = useState<VisitItem[]>([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
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
    setPage(0); // Reset to first page
  };

  // const theme = useTheme();
  const isLight = theme.palette.mode === 'light';

  useEffect(() => {
    fetchVisitList(page + 1, rowsPerPage);
  }, [page, rowsPerPage]);

  dayjs.extend(customParseFormat);
  dayjs.extend(utc);

  let { push } = useRouter();

  function redirect(id: any) {
    push(`/dashboard/visits/visit-detail/${id}/`);
  }

  return (
    <Page title='Visits: Visit List'>
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading='Visit List'
          links={[
            { name: 'Visits' },
            { name: 'Visit' },
            { name: 'Visit List' },
          ]}
        />

        <TableContainer
          component={Paper}
          sx={{
            mt: 3,
            backgroundColor: theme.palette.background.paper,
            borderRadius: 3,
            boxShadow: theme.shadows[8],
            border: `1px solid ${theme.palette.divider}`,
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {/* Scrollable body */}
          <Box sx={{ overflowY: 'auto', maxHeight: 400 }}>
            <Table stickyHeader>
              <TableHead>
                <TableRow
                  sx={{ backgroundColor: theme.palette.background.neutral }}
                >
                  {[
                    'Patient',
                    'Check In Date',
                    'Check In Time',
                    'Status',
                    'Phone',
                    'Visit Duration',
                  ].map((header) => (
                    <TableCell
                      key={header}
                      sx={{
                        fontWeight: 700,
                        fontSize: '0.875rem',
                        color: theme.palette.text.primary,
                        borderBottom: `2px solid ${theme.palette.primary.main}`,
                        backgroundColor: theme.palette.background.neutral,
                      }}
                    >
                      {header}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>

              <TableBody>
                {visitList.length > 0 ? (
                  visitList.map((row, index) => (
                    <TableRow
                      key={index}
                      sx={{
                        '&:hover': {
                          backgroundColor: theme.palette.action.hover,
                          transform: 'scale(1.01)',
                          transition: 'all 0.2s ease',
                        },
                        '&:nth-of-type(even)': {
                          backgroundColor: theme.palette.background.neutral,
                        },
                      }}
                    >
                      {/* Patient */}
                      <TableCell
                        onClick={() => redirect(row._id)}
                        sx={{ py: 2 }}
                      >
                        <Stack direction='row' alignItems='center' spacing={2}>
                          <Avatar
                            alt={
                              row.doctor_patient_relations_id.patient_id
                                .firstName
                            }
                            src={
                              row.doctor_patient_relations_id.patient_id
                                .profile_picture ||
                              'https://images.icon-icons.com/2266/PNG/512/patient_icon_140481.png'
                            }
                            sx={{
                              width: 48,
                              height: 48,
                              border: '2px solid',
                              borderColor: theme.palette.primary.light,
                              boxShadow: theme.shadows[2],
                            }}
                          />
                          <Box>
                            <Typography
                              variant='subtitle1'
                              sx={{
                                fontWeight: 600,
                                color: theme.palette.text.primary,
                                mb: 0.5,
                              }}
                            >
                              {row.doctor_patient_relations_id?.patient_id
                                ?.firstName &&
                              row.doctor_patient_relations_id?.patient_id
                                ?.lastName
                                ? `${row.doctor_patient_relations_id.patient_id.firstName} ${row.doctor_patient_relations_id.patient_id.lastName}`
                                : 'None'}
                            </Typography>
                            <Typography
                              variant='caption'
                              sx={{
                                color: theme.palette.text.secondary,
                                display: 'block',
                              }}
                            >
                              Abha ID:{' '}
                              {row.doctor_patient_relations_id?.patient_id
                                ?.abha_id || 'N/A'}
                            </Typography>
                          </Box>
                        </Stack>
                      </TableCell>

                      {/* Check In Date */}
                      <TableCell sx={{ py: 2 }}>
                        <Box sx={{ textAlign: 'center' }}>
                          <Typography
                            variant='body2'
                            sx={{
                              fontWeight: 600,
                              color: theme.palette.text.primary,
                            }}
                          >
                            {dayjs(row.visit_date, 'DD/MM/YYYY').isValid()
                              ? dayjs(row.visit_date, 'DD/MM/YYYY').format(
                                  'DD MMM YYYY'
                                )
                              : 'Invalid Date'}
                          </Typography>
                          <Typography
                            variant='caption'
                            sx={{
                              color: theme.palette.text.secondary,
                            }}
                          >
                            {dayjs(row.visit_date, 'DD/MM/YYYY').isValid()
                              ? dayjs(row.visit_date, 'DD/MM/YYYY').format(
                                  'dddd'
                                )
                              : ''}
                          </Typography>
                        </Box>
                      </TableCell>

                      {/* Check In Time */}
                      <TableCell sx={{ py: 2 }}>
                        <Box sx={{ textAlign: 'center' }}>
                          <Typography
                            variant='body2'
                            sx={{
                              fontWeight: 600,
                              color: theme.palette.text.primary,
                            }}
                          >
                            {dayjs(row.visit_time, [
                              'HH:mm',
                              'hh:mm A',
                            ]).isValid()
                              ? dayjs(row.visit_time, [
                                  'HH:mm',
                                  'hh:mm A',
                                ]).format('hh:mm A')
                              : 'Invalid Time'}
                          </Typography>
                        </Box>
                      </TableCell>

                      {/* Status */}
                      <TableCell sx={{ py: 2 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                          <Label
                            variant={isLight ? 'ghost' : 'filled'}
                            color={
                              row.status === 'pending'
                                ? 'error'
                                : row.status === 'ongoing'
                                ? 'info'
                                : 'success'
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
                        </Box>
                      </TableCell>

                      {/* Phone */}
                      <TableCell sx={{ py: 2 }}>
                        <Box sx={{ textAlign: 'center' }}>
                          <Typography
                            variant='body2'
                            sx={{
                              fontWeight: 500,
                              color: theme.palette.text.primary,
                            }}
                          >
                            {row.doctor_patient_relations_id.patient_id.phone ||
                              'None'}
                          </Typography>
                        </Box>
                      </TableCell>

                      {/* Visit Duration */}
                      <TableCell sx={{ py: 2, textAlign: 'center' }}>
                        <Chip
                          label={row.duration || 'None'}
                          size='small'
                          sx={{
                            bgcolor: theme.palette.primary.lighter,
                            color: theme.palette.primary.dark,
                            fontWeight: 600,
                            textTransform: 'capitalize',
                          }}
                        />
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} align='center' sx={{ py: 8 }}>
                      <Box sx={{ textAlign: 'center' }}>
                        <Typography
                          variant='h6'
                          sx={{
                            color: theme.palette.text.secondary,
                            mb: 2,
                          }}
                        >
                          No visits found
                        </Typography>
                        <Typography
                          variant='body2'
                          sx={{
                            color: theme.palette.text.secondary,
                          }}
                        >
                          No visits have been created yet. Create your first
                          visit to get started.
                        </Typography>
                      </Box>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </Box>

          {/* Fixed Pagination */}
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component='div'
            count={totalRows}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            sx={{
              borderTop: `1px solid ${theme.palette.divider}`,
              '& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows':
                {
                  fontWeight: 600,
                  color: theme.palette.text.primary,
                },
            }}
          />
        </TableContainer>
      </Container>
    </Page>
  );
}
