import * as Yup from 'yup';
import { useCallback, useState } from 'react';
import { useSnackbar } from 'notistack';
import { useRouter } from 'next/router';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm, Controller, useFieldArray } from 'react-hook-form';
import { LoadingButton } from '@mui/lab';
import { styled } from '@mui/material/styles';
import {
  Grid,
  Card,
  Stack,
  Button,
  Typography,
  IconButton,
  TextField,
  Autocomplete,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
// import { PATH_DASHBOARD } from '../../../routes/paths';
import { CustomFile } from '../../../components/upload';
import {
  FormProvider,
  RHFTextField,
  RHFUploadSingleFile,
} from '../../../components/hook-form';
import BlogNewPostPreview from './BlogNewPostPreview';
import axiosInstance from '../../../utils/axios';

// ----------------------------------------------------------------------

const TAGS_OPTION = [
  'Company',
  'Research',
  'Product',
  'Safety',
  'Security',
  'Global Affairs',
];

const LabelStyle = styled(Typography)(({ theme }) => ({
  ...theme.typography.subtitle2,
  color: theme.palette.text.secondary,
  marginBottom: theme.spacing(1),
}));

// ----------------------------------------------------------------------

export type SectionType = {
  title: string;
  description: string;
};

export type FormValuesProps = {
  postTitle: string;
  tags: string[];
  cover: CustomFile | string | null;
  sections: SectionType[];
  created_by?: string;
};

export default function BlogNewPostForm() {
  const { push } = useRouter();
  const [open, setOpen] = useState(false);
  const { enqueueSnackbar } = useSnackbar();

  const handleOpenPreview = () => setOpen(true);
  const handleClosePreview = () => setOpen(false);

  const NewBlogSchema = Yup.object().shape({
    postTitle: Yup.string().required('Post Title is required'),
    tags: Yup.array().min(1, 'Select at least one tag'),
    cover: Yup.mixed().required('Cover is required'),
    sections: Yup.array()
      .of(
        Yup.object().shape({
          title: Yup.string().required('Section title is required'),
          description: Yup.string().required('Section description is required'),
        })
      )
      .min(1, 'Add at least one section'),
  });

  const defaultValues: FormValuesProps = {
    postTitle: '',
    tags: [],
    cover: null,
    sections: [{ title: '', description: '' }],
  };

  const methods = useForm<FormValuesProps>({
    resolver: yupResolver(NewBlogSchema),
    defaultValues,
  });

  const {
    reset,
    watch,
    control,
    setValue,
    handleSubmit,
    formState: { isSubmitting, isValid },
  } = methods;

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'sections',
  });

  const values = watch();

  const onSubmit = async (data: FormValuesProps) => {
    try {
      const formData = new FormData();
      formData?.append('postTitle', data.postTitle);
      formData?.append('tags', JSON.stringify(data.tags));
      formData?.append('sections', JSON.stringify(data.sections));

      if (data.cover instanceof File) {
        formData?.append('image', data.cover);
      }

      const response = await axiosInstance.post('/api/admin/blogs', formData);

      if (!response) {
        throw new Error('Failed to create blog post');
      }

      reset();
      handleClosePreview();
      enqueueSnackbar('Post success!');
    } catch (err: any) {
      console.error(err.response?.data || err.message);
    }
  };

  const handleDrop = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (file) {
        setValue(
          'cover',
          Object.assign(file, { preview: URL.createObjectURL(file) })
        );
      }
    },
    [setValue]
  );

  return (
    <>
      {' '}
      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        {''}
        <Grid container spacing={3}>
          {' '}
          <Grid item xs={12} md={12}>
            {' '}
            <Card sx={{ p: 3 }}>
              <Stack spacing={3}>
                <RHFTextField name='postTitle' label='Post Title' />

                <Controller
                  name='tags'
                  control={control}
                  render={({ field }) => (
                    <Autocomplete
                      multiple
                      options={TAGS_OPTION}
                      value={field.value}
                      onChange={(_, newValue) => field.onChange(newValue)}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label='Tags'
                          placeholder='Select tags'
                        />
                      )}
                    />
                  )}
                />

                <div>
                  <LabelStyle>Sections</LabelStyle>
                  {fields.map((item, index) => (
                    <Card key={item.id} sx={{ p: 2, mb: 2 }}>
                      <Stack spacing={2}>
                        <RHFTextField
                          name={`sections.${index}.title`}
                          label='Section Title'
                        />
                        <RHFTextField
                          name={`sections.${index}.description`}
                          label='Section Description'
                          multiline
                          rows={3}
                        />
                        <Stack direction='row' justifyContent='flex-end'>
                          {fields.length > 1 && (
                            <IconButton
                              color='error'
                              onClick={() => remove(index)}
                            >
                              <DeleteIcon />
                            </IconButton>
                          )}
                        </Stack>
                      </Stack>
                    </Card>
                  ))}
                  <Button
                    variant='outlined'
                    onClick={() => append({ title: '', description: '' })}
                  >
                    Add Section
                  </Button>
                </div>
                <div>
                  <LabelStyle>Cover</LabelStyle>
                  <RHFUploadSingleFile
                    name='cover'
                    maxSize={3145728}
                    onDrop={handleDrop}
                  />
                </div>
              </Stack>

              <Stack direction='row' spacing={1.5} sx={{ mt: 3 }}>
                <Button
                  fullWidth
                  color='inherit'
                  variant='outlined'
                  size='large'
                  onClick={handleOpenPreview}
                >
                  Preview
                </Button>
                <LoadingButton
                  fullWidth
                  type='submit'
                  variant='contained'
                  size='large'
                  loading={isSubmitting}
                >
                  Post
                </LoadingButton>
              </Stack>
            </Card>
          </Grid>
        </Grid>
      </FormProvider>
      <BlogNewPostPreview
        values={values}
        isOpen={open}
        isValid={isValid}
        isSubmitting={isSubmitting}
        onClose={handleClosePreview}
        onSubmit={handleSubmit(onSubmit)}
      />{' '}
    </>
  );
}
