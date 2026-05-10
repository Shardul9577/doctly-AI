// frontend/src/pages/admin/doctors.tsx

import { useState, useEffect, useCallback } from "react";
import { useSnackbar } from 'notistack';
import {
  Typography,
  Container,
  Box,
  Card,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  CircularProgress,
  Alert,
  TextField,
  InputAdornment,
  IconButton,
  Pagination,
} from "@mui/material";
import Head from "next/head";
import Iconify from "../../components/Iconify"; 
import { getDoctorsList, UserData, PaginationInfo } from "../../services/admin"; 
import useDebounce from "../../hooks/useDebounce"; 

function AdminDoctorsListContent() {
  const [doctors, setDoctors] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10); 
  const [paginationInfo, setPaginationInfo] = useState<PaginationInfo | null>(
    null
  );
  const { enqueueSnackbar } = useSnackbar();

  const debouncedSearchQuery = useDebounce(searchQuery, 500); 

  const fetchDoctors = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getDoctorsList({
        search: debouncedSearchQuery,
        page: page,
        limit: limit,
      });
      if (response.status) {
        setDoctors(response.data);
        setPaginationInfo(response.pagination);
      } else {
        enqueueSnackbar(response.message || "Failed to fetch doctors.");
      }
    } catch (err) {
      console.error("Error fetching doctors:", err);
      enqueueSnackbar("An error occurred while fetching doctors.",{variant: 'error'  });
    } finally {
      setLoading(false);
    }
  }, [debouncedSearchQuery, page, limit]); 
  useEffect(() => {
    fetchDoctors();
  }, [fetchDoctors]);


  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
    setPage(1); 
  };


  const handlePageChange = (
    event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    setPage(value);
  };

  return (
    <>
      <Head>
        <title>Admin: Doctors List | Doctlly</title>
      </Head>
      <Container maxWidth="xl">
        <Typography variant="h4" sx={{ mb: 5 }}>
          Doctors List
        </Typography>

        <Card sx={{ p: 3 }}>
          <TextField
            fullWidth
            value={searchQuery}
            onChange={handleSearchChange}
            placeholder="Search doctors by name or email..."
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Iconify
                    icon={"eva:search-fill"}
                    sx={{ color: "text.disabled", width: 20, height: 20 }}
                  />
                </InputAdornment>
              ),
            }}
            sx={{ mb: 3 }}
          />

          {loading ? (
            <Box sx={{ display: "flex", justifyContent: "center", p: 3 }}>
              <CircularProgress />
            </Box>
          ) : error ? (
            <Alert severity="error">{error}</Alert>
          ) : (
            <>
              <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="doctors table">
                  <TableHead>
                    <TableRow>
                      <TableCell>Name</TableCell>
                      <TableCell>Email</TableCell>
                      <TableCell>Role</TableCell>
                      
                      <TableCell align="right">Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {doctors.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={4} sx={{ textAlign: "center" }}>
                          No doctors found.
                        </TableCell>
                      </TableRow>
                    ) : (
                      doctors.map((doctor) => (
                        <TableRow
                          key={doctor._id}
                          sx={{
                            "&:last-child td, &:last-child th": { border: 0 },
                          }}
                        >
                          <TableCell>{`${doctor.firstName} ${doctor.lastName}`}</TableCell>
                          <TableCell>{doctor.email}</TableCell>
                          <TableCell>{doctor.role}</TableCell>
                          <TableCell align="right">
                            
                            <IconButton>
                              <Iconify icon={"eva:more-vertical-fill"} />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
              {paginationInfo && paginationInfo.totalPages > 1 && (
                <Box
                  sx={{ display: "flex", justifyContent: "flex-end", mt: 3 }}
                >
                  <Pagination
                    count={paginationInfo.totalPages}
                    page={paginationInfo.page}
                    onChange={handlePageChange}
                    color="primary"
                  />
                </Box>
              )}
            </>
          )}
        </Card>
      </Container>
    </>
  );
}


export default function AdminDoctorsListPage() {
  return (
  
      <AdminDoctorsListContent />

  );
}
