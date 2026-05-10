// @mui
import {
  Container,
  Box,
  Grid,
  TextField,
  MenuItem,
  InputAdornment,
  IconButton,
} from '@mui/material';
// routes
import { PATH_DASHBOARD } from '../../../../routes/paths';
// hooks
import useSettings from '../../../../hooks/useSettings';
// layouts
import Layout from '../../../../layouts';
// components
import Page from '../../../../components/Page';
import HeaderBreadcrumbs from '../../../../components/HeaderBreadcrumbs';
// sections
import { UserCard } from '../../../../sections/@dashboard/user/cards';
import axiosInstance from 'src/utils/axios';
import { useEffect, useState } from 'react';
import SearchIcon from '@mui/icons-material/Search';
import Pagination from '@mui/material/Pagination';
import { useTheme } from '@mui/material/styles';
import { m } from 'framer-motion';
import Iconify from '../../../../components/Iconify';

UserCards.getLayout = function getLayout(page: React.ReactElement) {
  return <Layout>{page}</Layout>;
};

export default function UserCards() {
  const { themeStretch } = useSettings();
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  const [patients, setPatients] = useState([]);
  const [docList, setDocList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showPagination, setShowPagination] = useState(false);

  // Query parameters
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc'); // Default is ascending

  const [abhaId, setAbhaId] = useState('');
  const [meta, setMeta] = useState({ totalPages: 1, currentPage: 1 });

  // Fetch patients and doc list
  useEffect(() => {
    fetchPatients();
  }, [page, search, sortOrder, abhaId]);

  // Toggle pagination display
  useEffect(() => {
    const handleScroll = () => {
      setShowPagination(window.scrollY > 200);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  async function fetchPatients() {
    setLoading(true);
    try {
      const response = await axiosInstance.get(
        '/api/doctors/patient/all/lists',
        {
          params: {
            page,
            search,
            sortOrder, // ✅ used directly
            abha_id: abhaId,
            sortBy: 'age',
          },
        }
      );
      setPatients(response?.data?.patients || []);
      setMeta(response?.data?.meta || { totalPages: 1, currentPage: 1 });
    } catch (error) {
      console.error('Error fetching patients:', error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Page title='Doctly Patients'>
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading='Doctly Patients'
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'User', href: PATH_DASHBOARD.user.root },
            { name: 'Doctly Patients' },
          ]}
        />

        {/* 🔍 Filter Inputs */}
        <Box
          sx={{
            mb: 4,
            p: 4,
            borderRadius: 3,
            backgroundColor: 'background.neutral',
            border: '1px solid',
            borderColor: 'divider',
            boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
            backdropFilter: 'blur(10px)',
          }}
        >
          <Grid container spacing={4} alignItems='center'>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label='Search Patients'
                variant='outlined'
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder='Search by name or email'
                InputProps={{
                  startAdornment: (
                    <InputAdornment position='start'>
                      <Iconify
                        icon='eva:search-fill'
                        sx={{ color: 'text.disabled', fontSize: 20 }}
                      />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position='end'>
                      <IconButton
                        onClick={fetchPatients}
                        sx={{
                          '&:hover': {
                            backgroundColor: 'primary.lighter',
                            transform: 'scale(1.1)',
                          },
                          transition: 'all 0.2s ease',
                          borderRadius: 1,
                        }}
                      >
                        <SearchIcon />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 3,
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      backgroundColor: 'grey.50',
                      transform: 'translateY(-1px)',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                      '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'primary.main',
                        borderWidth: '2px',
                      },
                    },
                    '&.Mui-focused': {
                      transform: 'translateY(-2px)',
                      boxShadow: '0 6px 20px rgba(25, 118, 210, 0.15)',
                      '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'primary.main',
                        borderWidth: '2px',
                      },
                    },
                  },
                  '& .MuiInputLabel-root': {
                    fontWeight: 600,
                    color: 'text.secondary',
                  },
                }}
              />
            </Grid>

            <Grid item xs={6} md={2}>
              <TextField
                fullWidth
                label='ABHA ID'
                value={abhaId}
                onChange={(e) => setAbhaId(e.target.value)}
                placeholder='Enter Abha Id'
                sx={{
                  '& .MuiOutlinedInput-root': {
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      backgroundColor: 'grey.50',
                      transform: 'translateY(-1px)',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                      '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'primary.main',
                        borderWidth: '2px',
                      },
                    },
                    '&.Mui-focused': {
                      transform: 'translateY(-2px)',
                      boxShadow: '0 6px 20px rgba(25, 118, 210, 0.15)',
                      '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'primary.main',
                        borderWidth: '2px',
                      },
                    },
                  },
                  '& .MuiInputLabel-root': {
                    fontWeight: 600,
                    color: 'text.secondary',
                  },
                }}
              />
            </Grid>

            <Grid item xs={6} md={2}>
              <TextField
                fullWidth
                label='Sort By Age'
                select
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value as 'asc' | 'desc')}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      backgroundColor: 'grey.50',
                      transform: 'translateY(-1px)',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                      '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'primary.main',
                        borderWidth: '2px',
                      },
                    },
                    '&.Mui-focused': {
                      transform: 'translateY(-2px)',
                      boxShadow: '0 6px 20px rgba(25, 118, 210, 0.15)',
                      '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'primary.main',
                        borderWidth: '2px',
                      },
                    },
                  },
                  '& .MuiInputLabel-root': {
                    fontWeight: 600,
                    color: 'text.secondary',
                  },
                }}
              >
                <MenuItem value='asc'>Ascending</MenuItem>
                <MenuItem value='desc'>Descending</MenuItem>
              </TextField>
            </Grid>

            <Grid item xs={6} md={2}>
              <TextField
                fullWidth
                label='Limit'
                select
                value={10}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      backgroundColor: 'grey.50',
                      transform: 'translateY(-1px)',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                      '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'primary.main',
                        borderWidth: '2px',
                      },
                    },
                    '&.Mui-focused': {
                      boxShadow: '0 6px 20px rgba(25, 118, 210, 0.15)',
                      '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'primary.main',
                        borderWidth: '2px',
                      },
                    },
                  },
                  '& .MuiInputLabel-root': {
                    fontWeight: 600,
                    color: 'text.secondary',
                  },
                }}
              >
                {[10, 20, 30, 50].map((value) => (
                  <MenuItem key={value} value={value}>
                    {value}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
          </Grid>
        </Box>

        {/* 👤 Patient Cards */}
        {/* 👤 Patient Cards or Empty State */}
        {patients.length === 0 ? (
          <Box
            sx={{
              py: 10,
              textAlign: 'center',
              width: '100%',
              color: theme.palette.text.secondary,
              fontSize: '1.2rem',
            }}
          >
            All patients are added to your list.
          </Box>
        ) : (
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
            {patients.map((user: any, index) => (
              <m.div
                key={user._id || `user-${index}`}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                transition={{ type: 'spring', stiffness: 300 }}
                style={{ cursor: 'pointer' }}
              >
                <UserCard user={user} />
              </m.div>
            ))}
          </Box>
        )}

        {/* ⬇ Pagination Controls */}
        {showPagination && (
          <Box
            sx={{
              position: 'fixed',
              bottom: 20,
              left: 0,
              width: '100%',
              display: 'flex',
              justifyContent: 'center',
              zIndex: 1300,
            }}
          >
            <Box
              sx={{
                bgcolor: isDark ? '#0f1117' : '#f0f0f0',
                px: 3,
                py: 1,
                borderRadius: '999px',
                boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <Pagination
                count={meta.totalPages}
                page={meta.currentPage}
                onChange={(e, value) => setPage(value)}
                shape='rounded'
                sx={{
                  '& .MuiPaginationItem-root': {
                    color: isDark
                      ? theme.palette.grey[300]
                      : theme.palette.grey[800],
                    backgroundColor: isDark ? '#141920' : '#e0e0e0',
                    borderRadius: '50%',
                    minWidth: 32,
                    height: 32,
                  },
                  '& .Mui-selected': {
                    color: theme.palette.primary.main,
                    backgroundColor: isDark
                      ? theme.palette.primary.dark
                      : theme.palette.primary.light,
                    fontWeight: 600,
                  },
                }}
              />
            </Box>
          </Box>
        )}
      </Container>
    </Page>
  );
}
