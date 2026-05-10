import { paramCase } from 'change-case';
import { useState, useEffect, useCallback, useRef } from 'react';
import { BACKEND_URL } from '../../../config';
import { useRouter } from 'next/router';
import { useSnackbar } from 'notistack';
import {
  Box,
  Tab,
  Tabs,
  Card,
  Table,
  Switch,
  Button,
  Tooltip,
  Divider,
  TableBody,
  Container,
  IconButton,
  TableContainer,
  TablePagination,
  FormControlLabel,
  CircularProgress,
  Typography,
  Alert,
} from '@mui/material';
import { PATH_ADMIN_DASHBOARD } from '../../../routes/paths';
import useTabs from '../../../hooks/useTabs';
import useSettings from '../../../hooks/useSettings';
import useTable, { getComparator, emptyRows } from '../../../hooks/useTable';
import Layout from '../../../layouts';
import Page from '../../../components/Page';
import Iconify from '../../../components/Iconify';
import Scrollbar from '../../../components/Scrollbar';
import HeaderBreadcrumbs from '../../../components/HeaderBreadcrumbs';
import {
  TableNoData,
  TableEmptyRows,
  TableHeadCustom,
  TableSelectedActions,
} from '../../../components/table';
import {
  UserTableToolbar,
  UserTableRow,
} from '../../../sections/@admin/user/list';
import axiosInstance from '../../../utils/axios';

import { PatientData, ApiPatientResponse } from '../../../@types/admin';

const STATUS_OPTIONS = ['all', 'active', 'inactive'];

const TABLE_HEAD = [
  { id: 'name', label: 'Name', align: 'left' },
  { id: 'email', label: 'Email', align: 'left' },
  { id: 'phone', label: 'Phone', align: 'left' },
  { id: 'is_active', label: 'Status', align: 'center' },
  { id: 'createdAt', label: 'Registered On', align: 'left' },
];

UserList.getLayout = function getLayout(page: React.ReactElement) {
  return <Layout>{page}</Layout>;
};

export default function UserList() {
  const {
    dense,
    page,
    order,
    orderBy,
    rowsPerPage,
    setPage,
    setSelected,
    selected,
    onSelectRow,
    onSelectAllRows,
    onSort,
    onChangeDense,
    onChangePage,
    onChangeRowsPerPage,
  } = useTable();

  const { themeStretch } = useSettings();
  const { enqueueSnackbar } = useSnackbar();
  const [tableData, setTableData] = useState<PatientData[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [totalDocs, setTotalDocs] = useState(0);
  const [loading, setLoading] = useState(true); 
  const [isSearching, setIsSearching] = useState(false); 

  const [searchInputValue, setSearchInputValue] = useState('');
  const [debouncedFilterName, setDebouncedFilterName] = useState('');

  const [filterRole, setFilterRole] = useState('all');
  const { currentTab: filterStatus, onChangeTab: onChangeFilterStatus } =
    useTabs('all');

  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [sortBy, setSortBy] = useState<string | null>(null);

  const initialLoad = useRef(true);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedFilterName(searchInputValue);
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [searchInputValue]);

  const fetchPatients = useCallback(async () => {
    setError(null);

    if (initialLoad.current || (!tableData.length && !error)) {
      setLoading(true);
    } else {
      setIsSearching(true)
    }

    try {
      const params: any = {
        page: page + 1,
        limit: rowsPerPage,
      };

      if (debouncedFilterName) {
        params.search = debouncedFilterName;
      }
      if (filterStatus !== 'all') {
        params.status = filterStatus;
      }

      if (sortBy) {
        params.sortBy = sortBy;
        params.sortOrder = sortDirection;
      } else if (orderBy) {
        params.sortBy = orderBy;
        params.sortOrder = order;
      }

      const response = await axiosInstance.get<ApiPatientResponse>(
        `${BACKEND_URL}/api/admin/patients`,
        { params }
      );

      if (response.data.status) {
        setTableData(response.data.data);
        setTotalDocs(response.data.pagination.totalDocs);
        if (initialLoad.current) {
          initialLoad.current = false;
        }
      } else {
        enqueueSnackbar(response.data.message || 'Failed to fetch patients.', {
          variant: 'error',
        });
        setError(response.data.message || 'Failed to load data.');
        setTableData([]);
        setTotalDocs(0);
      }
    } catch (err: any) {
      console.error('Error fetching patients:', err);
      enqueueSnackbar(
        err.message ||
          'An error occurred while fetching patients. Please try again later.',
        { variant: 'error' }
      );
      setError(err.message || 'Failed to load data.');
      setTableData([]);
      setTotalDocs(0);
    } finally {
      setLoading(false);
      setIsSearching(false); 
    }
  }, [
    page,
    rowsPerPage,
    debouncedFilterName,
    filterStatus,
    sortBy,
    sortDirection,
    order,
    orderBy,
    enqueueSnackbar,
    tableData.length,
    error,
  ]);


  useEffect(() => {
    setPage(0)
    fetchPatients();
  }, [
    debouncedFilterName,
    filterStatus,
    sortBy,
    sortDirection,
    order,
    orderBy,
  ]);


  useEffect(() => {
    fetchPatients();
  }, [fetchPatients]);

  const handleFilterName = (name: string) => {
    setSearchInputValue(name);
  };

  const handleFilterRole = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFilterRole(event.target.value);
  };

  const handleSortByName = () => {
    const newSortDirection = sortDirection === 'asc' ? 'desc' : 'asc';
    setSortDirection(newSortDirection);
    setSortBy('name');
  };

  const dataDisplay = tableData;

  const denseHeight = dense ? 52 : 72;


  const isNotFound =
    !loading && !error && dataDisplay.length === 0 && !isSearching;

  return (
    <Page title='User: List'>
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading='Patient List'
          links={[
            { name: 'Dashboard', href: PATH_ADMIN_DASHBOARD.root },
            { name: 'User', href: PATH_ADMIN_DASHBOARD.user.root },
            { name: 'Patients' },
          ]}
        />

        <Card>
          <Tabs
            allowScrollButtonsMobile
            variant='scrollable'
            scrollButtons='auto'
            value={filterStatus}
            onChange={onChangeFilterStatus}
            sx={{ px: 2, bgcolor: 'background.neutral' }}
          >
            {STATUS_OPTIONS.map((tab) => (
              <Tab disableRipple key={tab} label={tab} value={tab} />
            ))}
          </Tabs>

          <Divider />

          <UserTableToolbar
            filterName={searchInputValue}
            onFilterName={handleFilterName}
            sortDirection={sortDirection}
            onSortByName={handleSortByName}
          />

          <Scrollbar>
            <TableContainer sx={{ minWidth: 800, position: 'relative' }}>
              {selected.length > 0 && (
                <TableSelectedActions
                  dense={dense}
                  numSelected={selected.length}
                  rowCount={tableData.length}
                  onSelectAllRows={(checked) =>
                    onSelectAllRows(
                      checked,
                      dataDisplay.map((row) => row._id)
                    )
                  }
                />
              )}

        
              {loading && dataDisplay.length === 0 ? (
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    minHeight: denseHeight * 5,
                  }}
                >
                  <CircularProgress />
                </Box>
              ) : error && dataDisplay.length === 0 ? ( 
                <Alert severity='error' sx={{ m: 2 }}>
                  {error}
                </Alert>
              ) : (
                <Table size={dense ? 'small' : 'medium'}>
                  <TableHeadCustom
                    order={order}
                    orderBy={orderBy}
                    headLabel={TABLE_HEAD}
                    rowCount={dataDisplay.length}
                    numSelected={selected.length}
                    onSort={onSort}
                    onSelectAllRows={(checked) =>
                      onSelectAllRows(
                        checked,
                        dataDisplay.map((row) => row._id)
                      )
                    }
                  />

                  <TableBody>
                    {dataDisplay.map((row) => (
                      <UserTableRow
                        key={row._id}
                        row={{
                          id: row._id,
                          name: `${row.firstName} ${row.lastName}`,
                          email: row.email,
                          company: row.phone, 
                          role: row.role,
                          isVerified: row.abha_id ? true : false,
                          status: row.is_active ? 'active' : 'inactive',
                          avatarUrl: '',
                          createdAt: row.createdAt,
                        }}
                        selected={selected.includes(row._id)}
                        onSelectRow={() => onSelectRow(row._id)}
                      />
                    ))}

                    <TableEmptyRows
                      height={denseHeight}
                      emptyRows={emptyRows(page, rowsPerPage, totalDocs)}
                    />

                    {!error &&
                      !loading &&
                      dataDisplay.length === 0 &&
                      !isSearching && <TableNoData isNotFound={isNotFound} />}
                  </TableBody>
                </Table>
              )}
            </TableContainer>
          </Scrollbar>

          <Box sx={{ position: 'relative' }}>
            <TablePagination
              rowsPerPageOptions={[1, 10, 25]}
              component='div'
              count={totalDocs}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={onChangePage}
              onRowsPerPageChange={onChangeRowsPerPage}
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
                <Typography variant='caption'>Searching...</Typography>
              </Box>
            )}
          </Box>
        </Card>
      </Container>
    </Page>
  );
}

function applySortFilter({
  tableData,
  comparator,
  filterName,
  filterStatus,
  filterRole,
}: {
  tableData: PatientData[];
  comparator: (a: any, b: any) => number;
  filterName: string;
  filterStatus: string;
  filterRole: string;
}) {
  let processedData = [...tableData];

  if (filterName) {
    processedData = processedData.filter(
      (item: PatientData) =>
        item.firstName.toLowerCase().includes(filterName.toLowerCase()) ||
        item.lastName.toLowerCase().includes(filterName.toLowerCase()) ||
        item.email.toLowerCase().includes(filterName.toLowerCase())
    );
  }

  if (filterStatus !== 'all') {
    if (filterStatus === 'active') {
      processedData = processedData.filter(
        (item: PatientData) => item.is_active
      );
    } else if (filterStatus === 'inactive') {
      processedData = processedData.filter(
        (item: PatientData) => !item.is_active
      );
    }
  }

  if (filterRole !== 'all') {
    processedData = processedData.filter(
      (item: PatientData) => item.role === filterRole
    );
  }

  return processedData;
}
