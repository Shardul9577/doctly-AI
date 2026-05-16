import Slider from 'react-slick';
import { useEffect, useRef, useState } from 'react';
// @mui
import { useTheme } from '@mui/material/styles';
import {
  Box,
  Stack,
  Paper,
  Avatar,
  Typography,
  CardHeader,
  Button,
  Modal,
  Fade,
  Backdrop,
  TextField,
  MenuItem,
} from '@mui/material';
// utils
import { fDateTime } from '../../../../utils/formatTime';
// components
import Label from '../../../../components/Label';
import Image from '../../../../components/Image';
import Iconify from '../../../../components/Iconify';
import { CarouselArrows } from '../../../../components/carousel';
import axiosInstance from 'src/utils/axios';
import { PATH_DASHBOARD } from 'src/routes/paths';
import { Autocomplete, Chip } from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useSnackbar } from 'notistack';
import dayjs from 'dayjs';
import { Grid } from '@mui/material';
import { useRouter } from 'next/router';

// ----------------------------------------------------------------------

interface visitObject {
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
  visit_date: string;
  visit_time: string;
  duration: number;
  visit_type: string;
  status: string;
  case_file_type: string;
  symptoms: string[];
  notes: string;
  attachments: any[]; // or more specific type if known
  prescription: any[]; // or more specific type if known
  createdAt: string;
  updatedAt: string;
  __v: number;
}

interface Props {
  title?: string;
  subheader?: string;
  list?: any[];
  sx?: any;
}

// const {
//   handleSubmit,
//   control,
//   formState: { errors },
// } = useForm({
//   resolver: yupResolver(visitSchema),
// });

export default function BookingNewestBooking({
  title,
  subheader,
  list,
  sx,
  ...other
}: Props) {
  const theme = useTheme();
  const carouselRef = useRef<Slider | null>(null);
  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const { enqueueSnackbar } = useSnackbar();
  const { push } = useRouter();

  const visitSchema = yup.object().shape({
    patient: yup
      .object()
      .required('Patient is required')
      .typeError('Patient is required'),
    visit_date: yup.string().required('Visit date is required'),
    visit_time: yup.string().required('Visit time is required'),
    duration: yup.string().required('Duration is required'),
    visit_type: yup.string().required('Visit type is required'),
    case_file_type: yup.string().required('Case file type is required'),
    symptoms: yup.array().min(1, 'Enter at least one symptom'),
    notes: yup.string().required('Notes are required'),
  });

  const handlePrevious = () => carouselRef.current?.slickPrev();
  const handleNext = () => carouselRef.current?.slickNext();

  const [users, setUsers] = useState<any[]>([]);
  const [selectedPatient, setSelectedPatient] = useState<any>(null);
  const [searchText, setSearchText] = useState('');
  const [visitList, setVisitList] = useState<visitObject[]>([]);
  const today = new Date();
  const day = String(today.getDate()).padStart(2, '0');
  const month = String(today.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
  const year = today.getFullYear();
  const visitDate = `${day}/${month}/${year}`;

  useEffect(() => {
    if (open) {
      fetchUsers('');
    }
  }, [open]);

  // useEffect(() => {
  //   const delayDebounce = setTimeout(() => {
  //     fetchUsers(searchText);
  //   }, 400);
  //   return () => clearTimeout(delayDebounce);
  // }, [searchText]);

  const settings: Slider['props'] = {
    arrows: false,
    dots: false,
    speed: 600,
    swipeToSlide: true,
    rtl: theme.direction === 'rtl',
    infinite: visitList.length > 1, // turn off loop if one slide
    slidesToShow: Math.min(3, visitList.length),
    slidesToScroll: 1,
    responsive: [
      { breakpoint: 1280, settings: { slidesToShow: 3 } },
      { breakpoint: 960, settings: { slidesToShow: 2 } },
      { breakpoint: 600, settings: { slidesToShow: 1 } },
    ],
  };

  // visit_date

  const fetchUsers = async (query: string) => {
    try {
      const response = await axiosInstance.get(
        `/api/doctors/patient/all/lists?search=${query}`
      );
      setUsers(response?.data?.patients || []);
    } catch (error) {
      console.error('Failed to fetch users:', error);
    }
  };

  const fetchVisitList = async () => {
    try {
      const response = await axiosInstance.get(`/api/doctors/visit/list`, {
        params: { visit_date: visitDate },
      });
      setVisitList(response?.data?.visits || []);
    } catch (error) {
      console.error('Failed to fetch users:', error);
    }
  };

  useEffect(() => {
    fetchVisitList();
  }, [visitDate]);

  const onSubmit = async (data: any) => {
    try {
      const payload = {
        patient_id: data.patient?._id,
        visit_date: dayjs(data.visit_date).format('DD/MM/YYYY'),
        visit_time: data.visit_time,
        duration: Number(data.duration),
        visit_type: data.visit_type,
        case_file_type: data.case_file_type,
        notes: data.notes || '',
        symptoms: data.symptoms || [],
      };

      const response = await axiosInstance.post('/api/doctors/visit', payload);

      enqueueSnackbar(
        response?.data?.message || 'Visit created successfully!',
        { variant: 'success' }
      );
      fetchVisitList();
      handleClose();
    } catch (error) {
      console.error('Submission error:', error);
      enqueueSnackbar(
        error?.response?.data?.message || 'Something went wrong',
        { variant: 'error' }
      );
    }
  };

  const {
    control,
    formState: { errors },
    handleSubmit,
  } = useForm({
    resolver: yupResolver(visitSchema),
  });

  return (
    <Box sx={{ py: 2, ...sx }} {...other}>
      <CardHeader
        title={title}
        subheader={subheader}
        action={
          <Box display='flex' alignItems='center' gap={1}>
            <Button
              variant='contained'
              size='small'
              onClick={() => push('/dashboard/visits/createVisit')}
            >
              Add New Case +
            </Button>
            <CarouselArrows
              customIcon={'ic:round-keyboard-arrow-right'}
              onNext={handleNext}
              onPrevious={handlePrevious}
              sx={{ '& .arrow': { width: 28, height: 28, p: 0 } }}
            />
          </Box>
        }
        sx={{ p: 0, mb: 3, '& .MuiCardHeader-action': { alignSelf: 'center' } }}
      />

      {visitList.length === 0 ? (
        <Typography variant='subtitle1' sx={{ p: 2, textAlign: 'center' }}>
          No visits scheduled today
        </Typography>
      ) : (
        <Slider ref={carouselRef} {...settings}>
          {visitList.map((item) => (
            <Box key={item._id} sx={{ px: 1 }}>
              <BookingItem item={item} />
            </Box>
          ))}
        </Slider>
      )}

      <Modal
        open={open}
        onClose={(event, reason) => {
          if (reason === 'backdropClick' || reason === 'escapeKeyDown') {
            handleClose();
          }
        }}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{ timeout: 500 }}
      >
        <Fade in={open}>
          <div onClick={(e) => e.stopPropagation()}>
            <form onSubmit={handleSubmit(onSubmit)}>
              <Box
                sx={{
                  p: { xs: 2, sm: 3, md: 4 },
                  width: {
                    xs: '90vw', // Mobile: almost full width
                    sm: '80vw', // Tablet: slightly narrower
                    md: '700px', // Desktop: fixed wide box
                  },
                  maxHeight: '90vh',
                  overflowY: 'auto',
                  mx: 'auto',
                  mt: { xs: '10%', md: '5%' },
                  bgcolor: 'background.paper',
                  borderRadius: 2,
                  boxShadow: 24,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 2,
                  zIndex: (theme) => theme.zIndex.modal + 1,
                  position: 'relative',
                }}
              >
                <Typography variant='h6'>Add New Case</Typography>

                <Controller
                  name='patient'
                  control={control}
                  rules={{ required: 'Patient is required' }}
                  render={({ field }) => (
                    <Autocomplete
                      {...field}
                      options={users}
                      getOptionLabel={(option) =>
                        `${option.firstName} ${option.lastName}`
                      }
                      isOptionEqualToValue={(option, value) =>
                        option.abha_id === value.abha_id
                      }
                      filterOptions={(options) => options}
                      onChange={(e, newValue) => field.onChange(newValue)}
                      inputValue={searchText}
                      onInputChange={(e, newInputValue) =>
                        setSearchText(newInputValue)
                      }
                      renderOption={(props, option) => (
                        <Box
                          component='li'
                          {...props}
                          display='flex'
                          flexDirection='column'
                        >
                          <Typography variant='subtitle2'>
                            {option.firstName} {option.lastName}
                          </Typography>
                          <Typography variant='caption' color='text.secondary'>
                            ABHA ID: {option.abha_id}
                          </Typography>
                        </Box>
                      )}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label='Select Existing Patient'
                          fullWidth
                          error={!!errors.patient}
                          helperText={errors.patient?.message as string}
                        />
                      )}
                    />
                  )}
                />

                <Controller
                  name='visit_date'
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label='Visit Date'
                      type='date'
                      fullWidth
                      InputLabelProps={{ shrink: true }}
                      error={!!errors.visit_date}
                      helperText={errors?.visit_date?.message as string}
                    />
                  )}
                />

                <Controller
                  name='visit_time'
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label='Visit Time'
                      type='time'
                      fullWidth
                      InputLabelProps={{ shrink: true }}
                      error={!!errors.visit_time}
                      helperText={errors?.visit_time?.message as string}
                    />
                  )}
                />

                <Controller
                  name='duration'
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label='Duration (hours)'
                      type='number'
                      fullWidth
                      error={!!errors.duration}
                      helperText={errors?.duration?.message as string}
                    />
                  )}
                />

                <Controller
                  name='visit_type'
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      select
                      label='Visit Type'
                      fullWidth
                      error={!!errors.visit_type}
                      helperText={errors?.visit_type?.message as string}
                    >
                      <MenuItem value='check-up'>Check-up</MenuItem>
                      <MenuItem value='follow-up'>Follow-up</MenuItem>
                      <MenuItem value='emergency'>Emergency</MenuItem>
                    </TextField>
                  )}
                />

                <Controller
                  name='case_file_type'
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      select
                      label='Case File Type'
                      fullWidth
                      error={!!errors.case_file_type}
                      helperText={errors.case_file_type?.message as string}
                    >
                      <MenuItem value='new'>New</MenuItem>
                      <MenuItem value='existing'>Existing</MenuItem>
                    </TextField>
                  )}
                />

                <Controller
                  name='symptoms'
                  control={control}
                  defaultValue={[]}
                  render={({ field }) => (
                    <Autocomplete
                      multiple
                      freeSolo
                      options={[]}
                      value={field.value}
                      onChange={(_, newValue) => field.onChange(newValue)}
                      renderTags={(value, getTagProps) =>
                        value.map((option, index) => (
                          <Chip
                            variant='outlined'
                            label={option}
                            {...getTagProps({ index })}
                            key={option}
                          />
                        ))
                      }
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label='Symptoms'
                          placeholder='Enter symptoms'
                          fullWidth
                          error={!!errors.symptoms}
                          helperText={errors.symptoms?.message as string}
                        />
                      )}
                    />
                  )}
                />

                <Controller
                  name='notes'
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label='Notes'
                      multiline
                      rows={3}
                      fullWidth
                      error={!!errors.notes}
                      helperText={errors.notes?.message as string}
                    />
                  )}
                />

                <Box display='flex' justifyContent='flex-end' gap={1}>
                  <Button onClick={handleClose} variant='outlined'>
                    Cancel
                  </Button>
                  <Button variant='contained' type='submit'>
                    Submit
                  </Button>
                </Box>
              </Box>
            </form>
          </div>
        </Fade>
      </Modal>
    </Box>
  );
}

// ----------------------------------------------------------------------

type BookingItemProps = {
  item: visitObject;
};
function BookingItem({ item }: BookingItemProps) {
  const {
    visit_date,
    doctor_patient_relations_id,
    visit_time,
    duration,
    status,
    attachments,
  } = item;

  const patient = doctor_patient_relations_id?.patient_id;
  const { push } = useRouter();

  function redirect(id: string) {
    push(PATH_DASHBOARD.visits.detailed.replace('[name]', id));
  }

  return (
    <Paper
      sx={{
        mx: 1.5,
        borderRadius: 2,
        bgcolor: 'background.neutral',
      }}
      onClick={() => redirect(item._id)}
    >
      <Stack spacing={2.5} sx={{ p: 3, pb: 2.5 }}>
        {/* Patient Info */}
        <Stack direction='row' alignItems='center' spacing={2}>
          <Avatar
            src={
              patient?.profile_picture ||
              'https://cdn-icons-png.flaticon.com/512/2854/2854581.png'
            }
          />
          <div>
            <Typography variant='subtitle2'>
              {patient?.firstName} {patient?.lastName}
            </Typography>
            <Typography
              variant='caption'
              sx={{ color: 'text.disabled', mt: 0.5, display: 'block' }}
            >
              {visit_date}
            </Typography>
          </div>
        </Stack>

        {/* Time and Duration */}
        <Stack
          direction='row'
          alignItems='center'
          spacing={3}
          sx={{ color: 'text.secondary' }}
        >
          <Stack direction='row' alignItems='center' spacing={1}>
            <Iconify icon='ic:round-access-time' width={16} height={16} />
            <Typography variant='caption'>
              {new Date(`1970-01-01T${visit_time}:00`).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
                hour12: true,
              })}
            </Typography>
          </Stack>

          <Stack direction='row' alignItems='center' spacing={1}>
            <Iconify icon='mdi:timer-outline' width={16} height={16} />
            <Typography variant='caption'>{duration} hrs</Typography>
          </Stack>
        </Stack>
      </Stack>

      {/* Image & Status */}
      <Box sx={{ p: 1, position: 'relative' }}>
        <Label
          variant='filled'
          color={
            (status === 'pending' && 'error') ||
            (status === 'solved' && 'info') ||
            'warning'
          }
          sx={{
            right: 16,
            zIndex: 9,
            bottom: 16,
            position: 'absolute',
            textTransform: 'capitalize',
          }}
        >
          {status}
        </Label>

        <Image
          alt='cover'
          // src={attachments[0].url}
          sx={{
            height: 140,
            width: '100%',
            borderRadius: 1.5,
            objectFit: 'cover',
          }}
        />
      </Box>
    </Paper>
  );
}
