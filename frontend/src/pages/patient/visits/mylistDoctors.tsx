import { useEffect, useState } from 'react';
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
  Container,
  Chip,
  Box,
  Button,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import NextLink from 'next/link';

// redux
import { useDispatch } from '../../../redux/store';
// routes
// hooks
import useIsMountedRef from '../../../hooks/useIsMountedRef';
import useSettings from '../../../hooks/useSettings';
// layouts
import Layout from '../../../layouts';
// components
import Page from '../../../components/Page';
import HeaderBreadcrumbs from '../../../components/HeaderBreadcrumbs';
import axiosInstance from 'src/utils/axios';

// ----------------------------------------------------------------------

interface Doctor {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  abha_id: string;
  profile_picture?: string;
}

DoctorList.getLayout = function getLayout(page: React.ReactElement) {
  return <Layout>{page}</Layout>;
};

export default function DoctorList() {
  const { themeStretch } = useSettings();
  const dispatch = useDispatch();
  const isMountedRef = useIsMountedRef();
  const theme = useTheme();

  const [doctorList, setDoctorList] = useState<Doctor[]>([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalRows, setTotalRows] = useState(0);

  const fetchDoctorList = async (pageNumber = 1, limit = rowsPerPage) => {
    try {
      const response = await axiosInstance.get(
        `/api/patients/visit/list/doctor`,
        {
          params: {
            page: pageNumber,
            limit: limit,
          },
        }
      );
      const data = response?.data;
      console.log(data, 'data');
      setDoctorList(data?.doctors || []);
      setTotalRows(data?.meta?.total || 0);
    } catch (error) {
      console.error('Failed to fetch doctors:', error);
    }
  };

  const handleChangePage = (_: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value));
    setPage(0);
  };

  useEffect(() => {
    fetchDoctorList(page + 1, rowsPerPage);
  }, [page, rowsPerPage]);

  return (
    <Page title='Doctors: Doctor List'>
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading='Available Doctors'
          links={[{ name: 'Doctors' }, { name: 'List' }]}
        />

        <TableContainer
          component={Paper}
          sx={{
            mt: 3,
            backgroundColor: theme.palette.background.paper,
            borderRadius: 3,
            boxShadow: theme.shadows[8],
            overflowX: 'auto',
            overflowY: 'hidden',
            border: `1px solid ${theme.palette.divider}`,
          }}
        >
          <Table stickyHeader sx={{ minWidth: 720 }}>
            <TableHead>
              <TableRow
                sx={{ backgroundColor: theme.palette.background.neutral }}
              >
                <TableCell
                  sx={{
                    fontWeight: 700,
                    fontSize: '0.875rem',
                    color: theme.palette.text.primary,
                    borderBottom: `2px solid ${theme.palette.primary.main}`,
                  }}
                >
                  Doctor
                </TableCell>
                <TableCell
                  sx={{
                    fontWeight: 700,
                    fontSize: '0.875rem',
                    color: theme.palette.text.primary,
                    borderBottom: `2px solid ${theme.palette.primary.main}`,
                  }}
                >
                  Email
                </TableCell>
                <TableCell
                  sx={{
                    display: { xs: 'none', sm: 'table-cell' },
                    fontWeight: 700,
                    fontSize: '0.875rem',
                    color: theme.palette.text.primary,
                    borderBottom: `2px solid ${theme.palette.primary.main}`,
                  }}
                >
                  Phone
                </TableCell>
                <TableCell
                  sx={{
                    display: { xs: 'none', md: 'table-cell' },
                    fontWeight: 700,
                    fontSize: '0.875rem',
                    color: theme.palette.text.primary,
                    borderBottom: `2px solid ${theme.palette.primary.main}`,
                  }}
                >
                  Abha ID
                </TableCell>
                <TableCell
                  sx={{
                    fontWeight: 700,
                    fontSize: '0.875rem',
                    color: theme.palette.text.primary,
                    borderBottom: `2px solid ${theme.palette.primary.main}`,
                  }}
                >
                  Book Visit
                </TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {doctorList.length > 0 ? (
                doctorList.map((row, index) => (
                  <TableRow
                    component='a'
                    sx={{
                      cursor: 'pointer',
                      textDecoration: 'none',
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
                    <TableCell sx={{ py: 2 }}>
                      <Stack direction='row' alignItems='center' spacing={2}>
                        <Avatar
                          alt={
                            row.firstName && row.lastName
                              ? `${row.firstName} ${row.lastName}`
                              : 'Doctor'
                          }
                          src={
                            row.profile_picture ||
                            'https://www.iconpacks.net/icons/1/free-doctor-icon-284-thumb.png'
                          }
                          sx={{
                            width: { xs: 40, sm: 48 },
                            height: { xs: 40, sm: 48 },
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
                              whiteSpace: 'nowrap',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                            }}
                          >
                            {row.firstName && row.lastName
                              ? `${row.firstName} ${row.lastName}`
                              : 'Dr. Unknown'}
                          </Typography>
                        </Box>
                      </Stack>
                    </TableCell>

                    <TableCell sx={{ py: 2 }}>
                      <Typography
                        variant='body2'
                        sx={{
                          fontWeight: 500,
                          color: theme.palette.text.primary,
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                        }}
                      >
                        {row.email || 'N/A'}
                      </Typography>
                    </TableCell>

                    <TableCell
                      sx={{ py: 2, display: { xs: 'none', sm: 'table-cell' } }}
                    >
                      <Typography
                        variant='body2'
                        sx={{
                          fontWeight: 500,
                          color: theme.palette.text.primary,
                        }}
                      >
                        {row.phone || 'N/A'}
                      </Typography>
                    </TableCell>

                    <TableCell
                      sx={{ py: 2, display: { xs: 'none', md: 'table-cell' } }}
                    >
                      <Chip
                        label={row.abha_id || 'N/A'}
                        size='small'
                        sx={{
                          bgcolor: theme.palette.primary.lighter,
                          color: theme.palette.primary.dark,
                          fontWeight: 600,
                          textTransform: 'uppercase',
                        }}
                      />
                    </TableCell>
                    <TableCell sx={{ py: 2, textAlign: 'center' }}>
                      <NextLink
                        href={`/patient/visits/doctors/${row._id}`}
                        passHref
                      >
                        <Button
                          variant='contained'
                          color='primary'
                          onClick={(e) => e.stopPropagation()}
                          sx={{ textTransform: 'none', fontWeight: 600 }}
                        >
                          Book Visit
                        </Button>
                      </NextLink>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} align='center' sx={{ py: 8 }}>
                    <Box sx={{ textAlign: 'center' }}>
                      <Typography
                        variant='h6'
                        sx={{
                          color: theme.palette.text.secondary,
                          mb: 2,
                        }}
                      >
                        No doctors found
                      </Typography>
                      <Typography
                        variant='body2'
                        sx={{
                          color: theme.palette.text.secondary,
                        }}
                      >
                        No doctors have been registered yet.
                      </Typography>
                    </Box>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>

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
