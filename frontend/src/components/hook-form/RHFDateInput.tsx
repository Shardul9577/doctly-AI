import { useState } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { styled } from '@mui/system';
import { useTheme } from '@mui/material/styles';

type Props = {
  name: string;
  label: string;
};

export default function RHFDateInput({ name, label }: Props) {
  const { control } = useFormContext();
  const theme = useTheme();
  const [focused, setFocused] = useState(false);

  return (
    <>
      <Controller
        name={name}
        control={control}
        render={({ field, fieldState: { error } }) => {
          const isFloating = focused || !!field.value;

          return (
            <>
              <InputWrapper>
                <StyledInput
                  type='date'
                  {...field}
                  hasError={!!error}
                  theme={theme}
                  onFocus={() => setFocused(true)}
                  onBlur={(e) => {
                    setFocused(false);
                    field.onBlur();
                  }}
                />
                <FloatingLabel
                  isFloating={isFloating}
                  hasError={!!error}
                  theme={theme}
                >
                  {label}
                </FloatingLabel>
              </InputWrapper>
              {error && <ErrorText theme={theme}>{error.message}</ErrorText>}
            </>
          );
        }}
      />
    </>
  );
}

// Styled Components

const InputWrapper = styled('div')(({ theme }) => ({
  position: 'relative',
  width: '100%',
  height: 55, // Fixed height (label + input + error space)
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'flex-end',
}));

const StyledInput = styled('input')<{ hasError: boolean }>(
  ({ hasError, theme }) => ({
    width: '100%',
    height: '100%',
    padding: theme.spacing(1, 1.25, 0.75, 1.25),
    fontSize: 14,
    fontWeight: 500,
    borderRadius: theme.shape.borderRadius,
    border: `2px solid ${
      hasError ? theme.palette.error.main : theme.palette.divider
    }`,
    backgroundColor: theme.palette.background.paper,
    color: theme.palette.text.primary,
    outline: 'none',
    appearance: 'none',
    WebkitAppearance: 'none',
    MozAppearance: 'textfield',

    // ✅ SMOOTH transitions on multiple properties
    transition: 'border 0.25s ease-in-out, box-shadow 0.2s ease-in-out',

    '&::-webkit-calendar-picker-indicator': {
      filter: 'invert(0.4)',
      cursor: 'pointer',
      marginRight: theme.spacing(0.5),
    },

    '&:focus': {
      borderColor: hasError
        ? theme.palette.error.main
        : theme.palette.primary.main,

      // Optional: add a subtle focus ring
      boxShadow: hasError
        ? `0 0 0 2px ${theme.palette.error.light}`
        : `0 0 0 2px ${theme.palette.primary.light}`,
    },
  })
);

const FloatingLabel = styled('label')<{
  isFloating: boolean;
  hasError: boolean;
}>(({ isFloating, hasError, theme }) => ({
  position: 'absolute',
  left: theme.spacing(1.75),
  top: isFloating ? -12 : 16,
  fontSize: isFloating ? 13 : 16,
  fontWeight: 500,
  lineHeight: isFloating ? '18px' : '22px',
  color: hasError ? theme.palette.error.main : theme.palette.grey[500],
  backgroundColor: theme.palette.background.paper,
  padding: isFloating ? theme.spacing(0.25, 1) : theme.spacing(0, 0.25),
  pointerEvents: 'none',

  // ✅ Smooth transitions
  transition:
    'top 0.2s ease, font-size 0.2s ease, line-height 0.2s ease, color 0.2s ease, padding 0.2s ease',
}));

const ErrorText = styled('span')(({ theme }) => ({
  color: theme.palette.error.main,
  fontSize: 12,
  marginTop: theme.spacing(0.5),
}));
