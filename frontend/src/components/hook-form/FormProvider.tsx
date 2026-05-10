import { ReactNode } from 'react';
// form
import { FormProvider as RHFormProvider, UseFormReturn } from 'react-hook-form';

// ----------------------------------------------------------------------

type Props = {
  children: ReactNode;
  methods: UseFormReturn<any>;
  onSubmit?: (data: any) => void;
};

export default function FormProvider({ children, onSubmit, methods }: Props) {
  return (
    <RHFormProvider {...methods}>
      <form
        onSubmit={onSubmit ? methods.handleSubmit(onSubmit) : undefined}
        autoComplete='off'
      >
        {children}
      </form>
    </RHFormProvider>
  );
}
