import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
// @mui
import { styled } from '@mui/material/styles';
import {
  Box,
  Card,
  IconButton,
  Typography,
  CardContent,
  TablePagination,
  CircularProgress,
  Alert,
} from '@mui/material';
// utils
import { fDate } from '../../../../utils/formatTime';
import cssStyles from '../../../../utils/cssStyles';
// @types
import { Gallery } from '../../../../@types/user';
// components
import Image from '../../../../components/Image';
import Iconify from '../../../../components/Iconify';
import LightboxModal from '../../../../components/LightboxModal';
import axiosInstance from '../../../../utils/axios';

// ----------------------------------------------------------------------

const DEFAULT_REPORT_IMAGE =
  'https://thumbs.dreamstime.com/b/medical-report-concept-vector-illustration-flat-design-isolated-white-background-clipboard-stethoscope-icon-187331118.jpg';

const CaptionStyle = styled(CardContent)(({ theme }) => ({
  ...cssStyles().bgBlur({ blur: 2, color: theme.palette.grey[900] }),
  bottom: 0,
  width: '100%',
  display: 'flex',
  alignItems: 'center',
  position: 'absolute',
  justifyContent: 'space-between',
  color: theme.palette.common.white,
}));

// ----------------------------------------------------------------------

type Report = {
  _id: string;
  visit: {
    _id: string;
    doctor_patient_relations_id: {
      doctor_id: {
        _id: string;
        firstName: string;
        lastName: string;
        email: string;
        phone: string;
        profile_picture?: string;
        abha_id?: string;
      };
      patient_id: {
        _id: string;
        firstName: string;
        lastName: string;
        email: string;
        phone: string;
        profile_picture?: string;
        abha_id?: string;
      };
    };
  };
  diagnosis: string;
  vitals: Array<{
    vital_sign: string;
    reading: string;
    normal_range: string;
    status: string;
  }>;
  doctor_remarks?: string;
  ai_health_analysis: {
    current_health_summary: string[];
    predicted_disease_probability: Array<{
      disease: string;
      probability: number;
      risk_level: string;
      reason: string;
    }>;
  };
  created_at: string;
  updated_at?: string;
  deleted_at?: string;
};

type PaginationMeta = {
  total: number;
  limit: number;
  currentPage: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  nextPage: number | null;
  prevPage: number | null;
  resultCount: number;
  sortBy: string;
  sortOrder: string;
};

export default function ProfileGallery() {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(6);
  const [paginationMeta, setPaginationMeta] = useState<PaginationMeta | null>(
    null
  );
  const [openLightbox, setOpenLightbox] = useState(false);
  const [selectedImage, setSelectedImage] = useState<number>(0);

  const fetchReports = async (pageNumber = 1, limit = rowsPerPage) => {
    try {
      setLoading(true);
      setError(null);
      const response = await axiosInstance.get(
        '/api/patients/profile/reports',
        {
          params: {
            page: pageNumber,
            limit: limit,
            sortBy: 'created_at',
            sortOrder: 'desc',
          },
        }
      );

      if (response.data?.status) {
        setReports(response.data.reports || []);
        setPaginationMeta(response.data.meta || null);
      } else {
        setError(response.data?.message || 'Failed to fetch reports');
      }
    } catch (err: any) {
      console.error('Failed to fetch reports:', err);
      setError(
        err.response?.data?.message ||
          'An error occurred while fetching reports'
      );
      setReports([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports(page + 1, rowsPerPage);
  }, [page, rowsPerPage]);

  const handleChangePage = (_: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // For backward compatibility with gallery prop (if still used)
  const displayItems =
    reports.length > 0
      ? reports.map((report) => ({
          id: report._id,
          reportId: report._id,
          imageUrl: DEFAULT_REPORT_IMAGE,
          title: `Report - ${
            report.visit?.doctor_patient_relations_id?.doctor_id?.firstName ||
            ''
          } ${
            report.visit?.doctor_patient_relations_id?.doctor_id?.lastName || ''
          }`,
          postAt: report.created_at,
        }))
      : [];

  const imagesLightbox = displayItems
    .map((item) => item.imageUrl)
    .filter(Boolean);

  const handleOpenLightbox = (url: string) => {
    const selectedImageIndex = imagesLightbox.findIndex((img) => img === url);
    if (selectedImageIndex !== -1) {
      setOpenLightbox(true);
      setSelectedImage(selectedImageIndex);
    }
  };

  return (
    <Box sx={{ mt: 5 }}>
      {/* <Typography variant='h4' sx={{ mb: 3 }}>
        My Reports
      </Typography> */}

      <Card sx={{ p: 3 }}>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 5 }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Alert severity='error' sx={{ mb: 3 }}>
            {error}
          </Alert>
        ) : reports.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 5 }}>
            <Typography variant='body1' color='text.secondary'>
              No reports found
            </Typography>
          </Box>
        ) : (
          <>
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
              {displayItems.map((item) => (
                <GalleryItem
                  key={item.id}
                  image={item}
                  reportId={item.reportId}
                  onOpenLightbox={handleOpenLightbox}
                />
              ))}
            </Box>

            {paginationMeta && (
              <TablePagination
                component='div'
                count={paginationMeta.total}
                page={page}
                onPageChange={handleChangePage}
                rowsPerPage={rowsPerPage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                rowsPerPageOptions={[6, 12, 18]}
                sx={{ mt: 3 }}
              />
            )}

            {imagesLightbox.length > 0 && (
              <LightboxModal
                images={imagesLightbox}
                mainSrc={imagesLightbox[selectedImage]}
                photoIndex={selectedImage}
                setPhotoIndex={setSelectedImage}
                isOpen={openLightbox}
                onCloseRequest={() => setOpenLightbox(false)}
              />
            )}
          </>
        )}
      </Card>
    </Box>
  );
}

// ----------------------------------------------------------------------

type GalleryItemProps = {
  image: Gallery & { reportId?: string };
  reportId?: string;
  onOpenLightbox: (value: string) => void;
};

function GalleryItem({ image, reportId, onOpenLightbox }: GalleryItemProps) {
  const { imageUrl, title, postAt } = image;
  const router = useRouter();

  const handleCardClick = (reportId: string) => {
    if (reportId) {
      router.push(`/patient/user/report/${reportId}`);
    }
  };

  return (
    <Card sx={{ cursor: 'pointer', position: 'relative' }}>
      <Image
        alt='gallery image'
        ratio='1/1'
        src={imageUrl}
        onClick={() => reportId && handleCardClick(reportId)}
      />

      <CaptionStyle>
        <div>
          <Typography variant='subtitle1'>{title}</Typography>
          <Typography variant='body2' sx={{ opacity: 0.72 }}>
            {fDate(postAt)}
          </Typography>
        </div>
        <IconButton
          color='inherit'
          onClick={(e) => {
            e.stopPropagation();
            if (reportId) {
              router.push(`/patient/user/report/${reportId}`);
            }
          }}
        >
          <Iconify icon={'eva:more-vertical-fill'} width={20} height={20} />
        </IconButton>
      </CaptionStyle>
    </Card>
  );
}
