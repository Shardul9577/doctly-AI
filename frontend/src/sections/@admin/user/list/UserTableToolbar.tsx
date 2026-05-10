import { Stack, InputAdornment, TextField, Button } from '@mui/material';
// components
import Iconify from '../../../../components/Iconify';

// ----------------------------------------------------------------------

type Props = {
  filterName: string;
  onFilterName: (value: string) => void;
  sortDirection: 'asc' | 'desc';
  onSortByName: () => void; 
};

export default function UserTableToolbar({
  filterName,
  onFilterName,
  sortDirection,
  onSortByName,
}: Props) {
  return (
    <Stack
      spacing={2}
      direction={{ xs: 'column', sm: 'row' }}
      sx={{ py: 2.5, px: 3 }}
    >
      {/* Sort Button */}
      <Button
        variant='outlined'
        onClick={onSortByName}
        startIcon={
          <Iconify
            icon={
              sortDirection === 'asc'
                ? 'eva:arrow-up-fill'
                : 'eva:arrow-down-fill'
            }
          />
        }
        sx={{
          maxWidth: { sm: 240 },
          textTransform: 'capitalize',
        }}
      >
        Sort Name ({sortDirection === 'asc' ? 'Ascending' : 'Descending'})
      </Button>

      <TextField
        fullWidth
        value={filterName}
        onChange={(event) => onFilterName(event.target.value)}
        placeholder='Search user...'
        InputProps={{
          startAdornment: (
            <InputAdornment position='start'>
              <Iconify
                icon={'eva:search-fill'}
                sx={{ color: 'text.disabled', width: 20, height: 20 }}
              />
            </InputAdornment>
          ),
        }}
      />
    </Stack>
  );
}
