import { useEffect } from 'react';
import { useSnackbar } from 'notistack';
import { useForm } from 'react-hook-form';
import { Stack, Card, InputAdornment } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { Profile } from '../../../../@types/user';
import Iconify from '../../../../components/Iconify';
import axiosInstance from 'src/utils/axios';
import { FormProvider, RHFTextField } from '../../../../components/hook-form';

// ----------------------------------------------------------------------

const SOCIAL_LINKS = [
  {
    value: 'facebook',
    icon: <Iconify icon={'eva:facebook-fill'} width={24} height={24} />,
  },
  {
    value: 'instagram',
    icon: (
      <Iconify icon={'ant-design:instagram-filled'} width={24} height={24} />
    ),
  },
  {
    value: 'linkedin',
    icon: <Iconify icon={'eva:linkedin-fill'} width={24} height={24} />,
  },
  {
    value: 'twitter',
    icon: <Iconify icon={'eva:twitter-fill'} width={24} height={24} />,
  },
] as const;

// ----------------------------------------------------------------------

type FormValuesProps = {
  facebook: string;
  instagram: string;
  linkedin: string;
  twitter: string;
};

type Props = {
  myProfile?: Partial<Profile> | Record<string, any>;
};

export default function AccountSocialLinks({ myProfile }: Props) {
  const { enqueueSnackbar } = useSnackbar();

  const methods = useForm<FormValuesProps>({
    defaultValues: {
      facebook: '',
      instagram: '',
      linkedin: '',
      twitter: '',
    },
    mode: 'onChange',
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting, isDirty },
  } = methods;

  const fetchSocialLinks = async () => {
    try {
      const res = await axiosInstance.get('/api/admin/account');
      const user = res?.data?.user;

      reset({
        facebook: user?.social_links?.facebook || '',
        instagram: user?.social_links?.instagram || '',
        linkedin: user?.social_links?.linkedin || '',
        twitter: user?.social_links?.twitter || '',
      });
    } catch (error) {
      console.error('Fetch social links error:', error);
      enqueueSnackbar('Failed to load social links', { variant: 'error' });
    }
  };

  useEffect(() => {
    fetchSocialLinks();
  }, []);

  const onSubmit = async (data: FormValuesProps) => {
    try {
      const payload = {
        social_links: {
          facebook: data.facebook,
          instagram: data.instagram,
          linkedin: data.linkedin,
          twitter: data.twitter,
        },
      };

      const res = await axiosInstance.put('/api/admin/account', payload);
      enqueueSnackbar(
        res?.data?.message || 'Social links updated successfully!',
        {
          variant: 'success',
        }
      );
      reset(data); 
    } catch (error: any) {
      console.error('Update error:', error);
      enqueueSnackbar(error?.message || 'Failed to update social links', {
        variant: 'error',
      });
    }
  };

  return (
    <Card sx={{ p: 3 }}>
      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={3} alignItems='flex-end'>
          {SOCIAL_LINKS.map((link) => (
            <RHFTextField
              key={link.value}
              name={link.value}
              placeholder={`Enter ${link.value}`}
              InputProps={{
                startAdornment: (
                  <InputAdornment position='start'>{link.icon}</InputAdornment>
                ),
              }}
            />
          ))}

          <LoadingButton
            type='submit'
            variant='contained'
            loading={isSubmitting}
            disabled={!isDirty || isSubmitting}
          >
            Save Changes
          </LoadingButton>
        </Stack>
      </FormProvider>
    </Card>
  );
}
