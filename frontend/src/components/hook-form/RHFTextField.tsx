import { TextField, TextFieldProps } from '@mui/material';
import { useFormContext, Controller } from 'react-hook-form';

type Props = TextFieldProps & {
  name: string;
};

export default function RHFTextField({ name, ...other }: Props) {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <TextField
          {...field}
          fullWidth
          value={field.value ?? ''}
          error={!!error}
          helperText={error?.message}
          {...other}
        />
      )}
    />
  );
}
