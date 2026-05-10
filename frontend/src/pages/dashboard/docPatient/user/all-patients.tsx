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
import { MyUserCard } from '../../../../sections/@dashboard/user/cards';
import axiosInstance from 'src/utils/axios';
import { useEffect, useState } from 'react';
import SearchIcon from '@mui/icons-material/Search';
import Pagination from '@mui/material/Pagination';
import { useTheme } from '@mui/material/styles';
import { m } from 'framer-motion';
import { Button } from '@mui/material';
import Iconify from 'src/components/Iconify';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import { useSnackbar } from 'notistack';

UserCards.getLayout = function getLayout(page: React.ReactElement) {
  return <Layout>{page}</Layout>;
};

export default function UserCards() {
  const { themeStretch } = useSettings();
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  const [docList, setDocList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showPagination, setShowPagination] = useState(false);

  // Query parameters
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc'); // Default is ascending

  const [abhaId, setAbhaId] = useState('');
  const [meta, setMeta] = useState({ totalPages: 1, currentPage: 1 });
  const [limit, setLimit] = useState(10);
  const [relationStatus, setRelationStatus] = useState(true);

  // Fetch patients and doc list
  useEffect(() => {
    fetchDocPatients();
  }, [page, search, sortOrder, abhaId, limit, relationStatus]);

  // Toggle pagination display
  useEffect(() => {
    const handleScroll = () => {
      setShowPagination(window.scrollY > 200);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  async function fetchDocPatients() {
    try {
      const response = await axiosInstance.get('/api/doctors/patient/list', {
        params: {
          page,
          search,
          sortOrder,
          abha_id: abhaId,
          limit,
          relation_status: relationStatus,
          sortBy: 'age',
        },
      });

      setDocList(response?.data?.patients || []);
      setMeta(response?.data?.meta || { totalPages: 1, currentPage: 1 });
    } catch (error) {
      console.error('Error fetching patient list:', error);
    }
  }

  ///////////////////////////////////////////////
  /// CREATE PATIENT SECTION
  ///////////////////////////////////////////////

  const [open, setOpen] = useState(false);
  const { enqueueSnackbar } = useSnackbar();

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    age: '',
  });

  const [errors, setErrors] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    age: '',
  });

  const handleOpen = () => setOpen(true);

  const handleClose = () => {
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      address: '',
      age: '',
    });
    setErrors({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      address: '',
      age: '',
    });
    setOpen(false);
  };

  const validateField = (field: string, value: string): string => {
    if (!value.trim()) return 'This field is required';

    if (field === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      return 'Invalid email address';
    }

    if (field === 'phone' && !/^\d{10}$/.test(value)) {
      return 'Phone must be 10 digits';
    }

    if (field === 'age' && (!/^\d+$/.test(value) || parseInt(value) <= 0)) {
      return 'Age must be a valid number';
    }

    return '';
  };

  const handleChange =
    (field: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
      const value = event.target.value;

      setFormData((prev) => ({
        ...prev,
        [field]: value,
      }));

      setErrors((prev) => ({
        ...prev,
        [field]: validateField(field, value),
      }));
    };

  const isFormValid =
    Object.values(formData).every((v) => v.trim() !== '') &&
    Object.values(errors).every((e) => e === '');

  const handleSubmit = async () => {
    const newErrors: any = {};
    let valid = true;

    Object.entries(formData).forEach(([field, value]) => {
      const error = validateField(field, value);
      newErrors[field] = error;
      if (error) valid = false;
    });

    setErrors(newErrors);

    if (!valid) return;

    try {
      const response = await axiosInstance.post('/api/doctors/patient', {
        ...formData, // pass as object
      });

      enqueueSnackbar(
        response.data.message || 'Patient created successfully!',
        { variant: 'success' }
      );
      fetchDocPatients();
      handleClose();
    } catch (error) {
      enqueueSnackbar(error.message || 'Something went wrong!', {
        variant: 'error',
      });
    }
  };

  return (
    <Page title='My Patients'>
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <Box
          display='flex'
          justifyContent='space-between'
          alignItems='center'
          mb={1}
        >
          <HeaderBreadcrumbs
            heading='My Patients'
            links={[
              { name: 'Dashboard', href: PATH_DASHBOARD.root },
              { name: 'User', href: PATH_DASHBOARD.user.root },
              { name: 'My Patients' },
            ]}
          />

          <Button
            variant='contained'
            startIcon={<Iconify icon='eva:plus-fill' />}
            onClick={handleOpen}
            sx={{
              borderRadius: 2,
              px: 3,
              py: 1,
              fontWeight: 600,
              fontSize: '0.95rem',
              textTransform: 'none',
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
              transition: 'all 0.2s ease-in-out',
              '&:hover': {
                boxShadow: '0 6px 20px rgba(0,0,0,0.2)',
                transform: 'translateY(-1px)',
              },
            }}
          >
            Create New Patient
          </Button>
        </Box>

        {/* 🔍 Enhanced Filter Section */}
        <Box
          sx={{
            mb: 3,
            p: 3,
            borderRadius: 3,
            backgroundColor: 'background.neutral',
            border: '1px solid',
            borderColor: 'divider',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          }}
        >
          <Grid container spacing={3} alignItems='center'>
            <Grid item xs={12} md={4}>
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
                        onClick={() => fetchDocPatients()}
                        sx={{
                          color: 'primary.main',
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
                    '&:hover': {
                      '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'primary.main',
                      },
                    },
                    '&.Mui-focused': {
                      boxShadow: '0 0 0 2px rgba(25, 118, 210, 0.2)',
                    },
                  },
                  '& .MuiInputLabel-root': {
                    fontWeight: 500,
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
                    borderRadius: 3,
                    '&:hover': {
                      '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'primary.main',
                      },
                    },
                    '&.Mui-focused': {
                      boxShadow: '0 0 0 2px rgba(25, 118, 210, 0.2)',
                    },
                  },
                  '& .MuiInputLabel-root': {
                    fontWeight: 500,
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
                    borderRadius: 3,
                    '&:hover': {
                      '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'primary.main',
                      },
                    },
                    '&.Mui-focused': {
                      boxShadow: '0 0 0 2px rgba(25, 118, 210, 0.2)',
                    },
                  },
                  '& .MuiInputLabel-root': {
                    fontWeight: 500,
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
                value={limit}
                onChange={(e) => setLimit(Number(e.target.value))}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 3,
                    '&:hover': {
                      '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'primary.main',
                      },
                    },
                    '&.Mui-focused': {
                      boxShadow: '0 0 0 2px rgba(25, 118, 210, 0.2)',
                    },
                  },
                  '& .MuiInputLabel-root': {
                    fontWeight: 500,
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

            <Grid item xs={6} md={2}>
              <TextField
                fullWidth
                label='Relation Status'
                select
                value={relationStatus}
                onChange={(e) => setRelationStatus(e.target.value === 'true')}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 3,
                    '&:hover': {
                      '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'primary.main',
                      },
                    },
                    '&.Mui-focused': {
                      boxShadow: '0 0 0 2px rgba(25, 118, 210, 0.2)',
                    },
                  },
                  '& .MuiInputLabel-root': {
                    fontWeight: 500,
                  },
                }}
              >
                <MenuItem value='true'>Active</MenuItem>
                <MenuItem value='false'>Inactive</MenuItem>
              </TextField>
            </Grid>
          </Grid>
        </Box>

        {/* 👤 Patient Cards */}
        {docList.length === 0 ? (
          <Box
            sx={{
              py: 10,
              textAlign: 'center',
              width: '100%',
              color: theme.palette.text.secondary,
              fontSize: '1.2rem',
            }}
          >
            There is no active connection with any patient.
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
            {docList.map((user: any, index) => (
              <m.div
                key={user._id || `user-${index}`}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                transition={{ type: 'spring', stiffness: 300 }}
                style={{ cursor: 'pointer' }}
              >
                <MyUserCard relationStatus={relationStatus} user={user} />
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

        {/* Modal Dialog */}
        <Dialog open={open} onClose={handleClose} fullWidth maxWidth='sm'>
          <DialogTitle>Create Patient</DialogTitle>
          <DialogContent>
            <Box component='form' noValidate sx={{ mt: 2 }}>
              <Grid container spacing={2}>
                {[
                  { label: 'First Name', field: 'firstName' },
                  { label: 'Last Name', field: 'lastName' },
                  { label: 'Email', field: 'email' },
                  { label: 'Phone', field: 'phone' },
                  { label: 'Personal Address', field: 'address' },
                  { label: 'Age', field: 'age' },
                ].map(({ label, field }) => (
                  <Grid item xs={12} sm={6} key={field}>
                    <TextField
                      fullWidth
                      label={label}
                      value={formData[field as keyof typeof formData]}
                      onChange={handleChange(field)}
                      error={!!errors[field as keyof typeof errors]}
                      helperText={errors[field as keyof typeof errors]}
                      required
                    />
                  </Grid>
                ))}
              </Grid>
            </Box>
          </DialogContent>

          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button
              variant='contained'
              onClick={handleSubmit}
              disabled={!isFormValid}
            >
              Create Patient
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Page>
  );
}
