// frontend/src/pages/patient/myDoctors.tsx

import { useState, useEffect, useCallback, useRef } from 'react';
import { BACKEND_URL } from '../../../config';
import { useSnackbar } from 'notistack';
import {
  Container,
  Box,
  TextField,
  Button,
  CircularProgress,
  Typography,
  Pagination,
} from '@mui/material';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import { PATH_PATIENT_DASHBOARD } from '../../../routes/paths';
import useSettings from '../../../hooks/useSettings';
import React from 'react';

import Layout from '../../../layouts';
import Page from '../../../components/Page';
import HeaderBreadcrumbs from '../../../components/HeaderBreadcrumbs';
import { UserCard } from '../../../sections/@patient/user/cards';

import axiosInstance from '../../../utils/axios';

import {
  DoctorData,
  PaginationInfo,
  DoctorApiResponse,
} from '../../../@types/admin';

PatientMyDoctorsPage.getLayout = function getLayout(page: React.ReactElement) {
  return <Layout>{page}</Layout>;
};

export default function PatientMyDoctorsPage() {
  const { themeStretch } = useSettings();
  const { enqueueSnackbar } = useSnackbar();
  const [doctors, setDoctors] = useState<DoctorData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [searchInputValue, setSearchInputValue] = useState<string>('');
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState<string>('');

  const [sortBy, setSortBy] = useState<string>('createdAt');
  const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>('desc');
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(9);
  const [paginationInfo, setPaginationInfo] = useState<PaginationInfo | null>(
    null
  );

  const initialLoad = useRef(true);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchQuery(searchInputValue);
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [searchInputValue]);

  const fetchDoctors = useCallback(async () => {
    setError(null);

    if (initialLoad.current || (!doctors.length && !error)) {
      setLoading(true);
    } else {
      setIsSearching(true);
    }

    try {
      const response = await axiosInstance.get<DoctorApiResponse>(
        `${BACKEND_URL}/api/patients/doctor`,
        {
          params: {
            search: debouncedSearchQuery,
            page: page,
            limit: limit,
            sortBy: sortBy,
            sortOrder: sortOrder,
          },
        }
      );

      if (response.data.status) {
        setDoctors(response.data.doctors);
        setPaginationInfo(response.data.meta);
        if (initialLoad.current) {
          initialLoad.current = false;
        }
      } else {
        enqueueSnackbar('Failed to fetch doctors.', {
          variant: 'error',
        });
        setError('Failed to load doctors.');
        setDoctors([]);
        setPaginationInfo(null);
      }
    } catch (err: any) {
      enqueueSnackbar(
        err.message || 'An error occurred while fetching doctors.',
        { variant: 'error' }
      );
      setError(err.message || 'Failed to load doctors.');
      setDoctors([]);
      setPaginationInfo(null);
    } finally {
      setLoading(false);
      setIsSearching(false);
    }
  }, [
    debouncedSearchQuery,
    page,
    limit,
    sortBy,
    sortOrder,
    doctors.length,
    error,
  ]);

  useEffect(() => {
    if (page === 1) {
      fetchDoctors();
    } else {
      setPage(1);
    }
  }, [debouncedSearchQuery, sortBy, sortOrder]);

  useEffect(() => {
    if (!initialLoad.current) {
      fetchDoctors();
    }
  }, [page, fetchDoctors]);

  const handleSortByDate = () => {
    if (sortBy === 'createdAt') {
      setSortOrder((prevOrder) => (prevOrder === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortBy('createdAt');
      setSortOrder('desc');
    }
  };

  const handleSortByName = () => {
    if (sortBy === 'firstName') {
      setSortOrder((prevOrder) => (prevOrder === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortBy('firstName');
      setSortOrder('asc');
    }
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchInputValue(event.target.value);
  };

  const handlePageChange = (
    event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    setPage(value);
  };

  const isNoDoctorsFound =
    !loading && !error && doctors.length === 0 && !isSearching;

  return (
    <Page title='Patient: My Doctors'>
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading='My Doctors'
          links={[
            { name: 'Dashboard', href: PATH_PATIENT_DASHBOARD.root },
            { name: 'Doctors', href: PATH_PATIENT_DASHBOARD.user.myDoctors },
          ]}
        />

        <Box
          sx={{
            mb: 4,
            display: 'flex',
            alignItems: 'center',
            gap: 2,
            flexWrap: 'wrap',
            '&::-webkit-scrollbar': {
              width: '0px',
              display: 'none',
            },
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
          }}
        >
          <TextField
            label='Search Doctor by Name or Email'
            variant='outlined'
            value={searchInputValue}
            onChange={handleSearchChange}
            sx={{ flexGrow: 1, minWidth: '250px' }}
          />

          <Button
            variant='contained'
            onClick={handleSortByName}
            endIcon={
              sortBy === 'firstName' ? (
                sortOrder === 'asc' ? (
                  <ArrowUpwardIcon fontSize='small' />
                ) : (
                  <ArrowDownwardIcon fontSize='small' />
                )
              ) : null
            }
            sx={{
              backgroundColor:
                sortBy === 'firstName' ? 'primary.main' : 'grey.700',
              color: 'white',
              '&:hover': {
                backgroundColor:
                  sortBy === 'firstName' ? 'primary.dark' : 'grey.800',
              },
            }}
          >
            Sort by Name
          </Button>

          <Button
            variant='contained'
            onClick={handleSortByDate}
            endIcon={
              sortBy === 'createdAt' ? (
                sortOrder === 'asc' ? (
                  <ArrowUpwardIcon fontSize='small' />
                ) : (
                  <ArrowDownwardIcon fontSize='small' />
                )
              ) : null
            }
            sx={{
              backgroundColor:
                sortBy === 'createdAt' ? 'primary.main' : 'grey.700',
              color: 'white',
              '&:hover': {
                backgroundColor:
                  sortBy === 'createdAt' ? 'primary.dark' : 'grey.800',
              },
            }}
          >
            Sort by Date
          </Button>
        </Box>

        {loading && doctors.length === 0 ? (
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              py: 5,
              '&::-webkit-scrollbar': {
                width: '0px',
                display: 'none',
              },
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
            }}
          >
            <CircularProgress />
            <Typography variant='h6' sx={{ ml: 2 }}>
              Loading Doctors...
            </Typography>
          </Box>
        ) : error && doctors.length === 0 ? (
          <Box
            sx={{
              py: 5,
              textAlign: 'center',
              '&::-webkit-scrollbar': {
                width: '0px',
                display: 'none',
              },
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
            }}
          >
            <Typography color='error' variant='h6'>
              {error}
            </Typography>
          </Box>
        ) : (
          <>
            {doctors.length > 0 ? (
              <Box
                sx={{
                  display: 'grid',
                  gap: 3,
                  gridTemplateColumns: {
                    xs: 'repeat(1, 1fr)',
                    sm: 'repeat(2, 1fr)',
                    md: 'repeat(3, 1fr)',
                  },
                  '&::-webkit-scrollbar': {
                    width: '0px',
                    display: 'none',
                  },
                  scrollbarWidth: 'none',
                  msOverflowStyle: 'none',
                }}
              >
                {doctors.map((doctor) => (
                  <UserCard key={doctor._id} user={doctor} />
                ))}
              </Box>
            ) : (
              <Box
                sx={{
                  py: 5,
                  textAlign: 'center',
                  '&::-webkit-scrollbar': {
                    width: '0px',
                    display: 'none',
                  },
                  scrollbarWidth: 'none',
                  msOverflowStyle: 'none',
                }}
              >
                <Typography variant='h6' color='text.secondary'>
                  {isNoDoctorsFound
                    ? 'No doctors found matching your criteria.'
                    : 'Loading or searching...'}
                </Typography>
              </Box>
            )}

            {paginationInfo && paginationInfo.totalPages > 1 && (
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  mt: 4,
                  pb: 2,
                  position: 'relative',
                  '&::-webkit-scrollbar': {
                    width: '0px',
                    display: 'none',
                  },
                  scrollbarWidth: 'none',
                  msOverflowStyle: 'none',
                }}
              >
                <Pagination
                  count={paginationInfo.totalPages}
                  page={paginationInfo.page}
                  onChange={handlePageChange}
                  color='primary'
                />
                {isSearching && (
                  <Box
                    sx={{
                      position: 'absolute',
                      right: 16,
                      bottom: 16,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1,
                      color: 'text.secondary',
                      '&::-webkit-scrollbar': {
                        width: '0px',
                        display: 'none',
                      },
                      scrollbarWidth: 'none',
                      msOverflowStyle: 'none',
                    }}
                  >
                    <CircularProgress size={20} />
                    <Typography variant='caption'>Updating...</Typography>
                  </Box>
                )}
              </Box>
            )}
          </>
        )}
      </Container>
    </Page>
  );
}
