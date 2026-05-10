// form
import { useFormContext, Controller } from 'react-hook-form';
// @mui
import {
  TextField,
  TextFieldProps,
  MenuItem,
  SelectProps,
} from '@mui/material';
import { ReactNode } from 'react';

// ----------------------------------------------------------------------

type IProps = {
  name: string;
  children: ReactNode;
  selectProps?: Partial<SelectProps>;
};

type Props = IProps & TextFieldProps;

export default function RHFSelect({
  name,
  children,
  selectProps,
  ...other
}: Props) {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <TextField
          select
          fullWidth
          {...field}
          SelectProps={{
            ...selectProps,
            // Remove `native: true` to allow floating label
            native: false,
          }}
          error={!!error}
          helperText={error?.message}
          {...other}
        >
          {children}
        </TextField>
      )}
    />
  );
}
