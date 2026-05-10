import { FC } from 'react';
import { useTheme } from '@mui/material/styles';
import {
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  SelectChangeEvent,
} from '@mui/material';
import { Controller, useFormContext } from 'react-hook-form';

type RoleSelectorProps = {
  name: string;
};

const RoleSelector: FC<RoleSelectorProps> = ({ name }) => {
  const { control } = useFormContext();
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel
            id="role-label"
            shrink
            sx={{
              color: isDark ? '#ccc' : '#555',
              px: 0.5,
            }}
          >
            Select Role
          </InputLabel>
          <Select
            labelId="role-label"
            id="role"
            {...field}
            displayEmpty
            label="Select Role"
            sx={{
              backgroundColor: isDark ? '#161C24' : '#fff',
              color: isDark ? 'white' : 'black',
              '.MuiOutlinedInput-notchedOutline': {
                borderColor: isDark ? '#374151' : '#cbd5e1',
              },
              '&:hover .MuiOutlinedInput-notchedOutline': {
                borderColor: isDark ? '#4b5563' : '#94a3b8',
              },
              '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                borderColor: '#8b5cf6',
              },
            }}
          >
            <MenuItem value="">
              <em>Choose your role</em>
            </MenuItem>
            <MenuItem value="doctor">Doctor</MenuItem>
            <MenuItem value="patient">Patient</MenuItem>
          </Select>
        </FormControl>
      )}
    />
  );
};

export default RoleSelector;
