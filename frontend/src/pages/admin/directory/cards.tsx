// frontend/src/pages/admin/doctors.tsx

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

import { PATH_ADMIN_DASHBOARD } from '../../../routes/paths';
import useSettings from '../../../hooks/useSettings';
import React from 'react';

import Layout from '../../../layouts';
import Page from '../../../components/Page';
import HeaderBreadcrumbs from '../../../components/HeaderBreadcrumbs';
import { UserCard } from '../../../sections/@admin/user/cards';

import axiosInstance from '../../../utils/axios';

import { DoctorData, PaginationInfo } from '../../../@types/admin';

UserCards.getLayout = function getLayout(page: React.ReactElement) {
  return <Layout>{page}</Layout>;
};

export default function UserCards() {
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
      const response = await axiosInstance.get(
        `${BACKEND_URL}/api/admin/doctors`,
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
        setDoctors(response.data.data);
        setPaginationInfo(response.data.pagination);
        if (initialLoad.current) {
          initialLoad.current = false;
        }
      } else {
        enqueueSnackbar(response.data.message || 'Failed to fetch doctors.', {
          variant: 'error',
        });
        setError(response.data.message || 'Failed to load doctors.');
        setDoctors([]);
        setPaginationInfo(null);
      }
    } catch (err: any) {
      console.error('Error fetching doctors:', err);
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
  }, [page]);

  const handleSortByDate = () => {
    if (sortBy === 'createdAt') {
      setSortOrder((prevOrder) => (prevOrder === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortBy('createdAt');
      setSortOrder('desc');
    }
  };

  const handleSortByName = () => {
    if (sortBy === 'name') {
      setSortOrder((prevOrder) => (prevOrder === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortBy('name');
      setSortBy('name');
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
    <Page title='User: Doctors'>
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading='All Doctors'
          links={[
            { name: 'Dashboard', href: PATH_ADMIN_DASHBOARD.root },
            { name: 'User', href: PATH_ADMIN_DASHBOARD.user.root },
            { name: 'Doctors' },
          ]}
        />

        <Box
          sx={{
            mb: 4,
            display: 'flex',
            alignItems: 'center',
            gap: 2,
            flexWrap: 'wrap',
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
              sortBy === 'name' ? (
                sortOrder === 'asc' ? (
                  <ArrowUpwardIcon fontSize='small' />
                ) : (
                  <ArrowDownwardIcon fontSize='small' />
                )
              ) : null
            }
            sx={{
              backgroundColor: sortBy === 'name' ? 'primary.main' : 'grey.700',
              color: 'white',
              '&:hover': {
                backgroundColor:
                  sortBy === 'name' ? 'primary.dark' : 'grey.800',
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
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 5 }}>
            <CircularProgress />
            <Typography variant='h6' sx={{ ml: 2 }}>
              Loading Doctors...
            </Typography>
          </Box>
        ) : error && doctors.length === 0 ? (
          <Box sx={{ py: 5, textAlign: 'center' }}>
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
                }}
              >
                {doctors.map((doctor) => (
                  <UserCard
                    key={doctor._id}
                    relationStatus
                    user={{
                      id: doctor._id,
                      abha_id: doctor.abha_id,
                      phone: doctor.phone,
                      age: doctor.age,
                      firstName: doctor.firstName,
                      lastName: doctor.lastName,
                      email: doctor.email,
                      role: doctor.role,
                      gender: doctor.gender,
                      marital_status: doctor.marital_status,
                      spouse_full_name: doctor.spouse_full_name,
                      personal_address: doctor.personal_address,
                      blood_group: doctor.blood_group,
                      avatarUrl: doctor.profile_picture,
                      status: doctor.is_active ? 'active' : 'inactive',
                    }}
                  />
                ))}
              </Box>
            ) : (
              <Box sx={{ py: 5, textAlign: 'center' }}>
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
