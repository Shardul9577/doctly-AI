import React, { useState } from 'react';
import { Box, Typography, Grid, IconButton } from '@mui/material';
import { styled } from '@mui/material/styles';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DeleteIcon from '@mui/icons-material/Delete';
import { Button } from '@mui/material';
import { VisitCardProps } from 'src/@types/user';

const StyledCard = styled(Box)(({ theme }) => ({
  backgroundColor: '#1A1A2F', // deep dark background
  borderRadius: 16,
  padding: theme.spacing(4),
  boxShadow: '0 0 0 1px #2A2A40',
  color: '#fff',
}));

const UploadZone = styled(Box)(({ theme }) => ({
  backgroundColor: '#252539',
  border: '2px dashed #5e5ce6',
  borderRadius: 12,
  padding: theme.spacing(5),
  textAlign: 'center',
  color: '#fff',
  cursor: 'pointer',
  transition: 'border-color 0.3s ease',
  '&:hover': {
    borderColor: '#8a7cff',
  },
}));

interface Props {
  visit: VisitCardProps;
}

export default function ImageUploadCard({ visit }: Props) {
  const [images, setImages] = useState([]);

  const handleFileChange = (e: any) => {
    const files = Array.from(e.target.files);
    const imageFiles = files.filter((file) => file.type.startsWith('image/'));

    const imagePreviews = imageFiles.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));

    setImages((prev) => [...prev, ...imagePreviews]);
  };

  const handleDrop = (e: any) => {
    e.preventDefault();
    handleFileChange({ target: { files: e.dataTransfer.files } });
  };

  const handleDelete = (index: any) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <>
      <StyledCard>
        <Typography variant='h6' sx={{ color: '#cfcfcf', mb: 2 }}>
          Report Attachments
        </Typography>

        <UploadZone onDrop={handleDrop} onDragOver={(e) => e.preventDefault()}>
          <CloudUploadIcon sx={{ fontSize: 48, color: '#a58aff' }} />
          <Typography variant='h6' sx={{ mt: 1 }}>
            Drop or Select file
          </Typography>
          <Typography variant='body2' sx={{ color: '#aaa' }}>
            Drop files here or click{' '}
            <label
              htmlFor='upload-button'
              style={{ color: '#9575cd', cursor: 'pointer' }}
            >
              browse
            </label>{' '}
            through your machine
          </Typography>
          <input
            id='upload-button'
            type='file'
            multiple
            accept='image/*'
            onChange={handleFileChange}
            style={{ display: 'none' }}
          />
        </UploadZone>

        {images.length > 0 && (
          <Grid container spacing={2} sx={{ mt: 3 }}>
            {images.map((img, index) => (
              <Grid item xs={4} key={index}>
                <Box
                  sx={{
                    position: 'relative',
                    borderRadius: 2,
                    overflow: 'hidden',
                    boxShadow: 1,
                    border: '1px solid #333',
                  }}
                >
                  <img
                    src={img.preview}
                    alt={`preview-${index}`}
                    style={{ width: '100%', height: 100, objectFit: 'cover' }}
                  />
                  <IconButton
                    size='small'
                    sx={{
                      position: 'absolute',
                      top: 4,
                      right: 4,
                      backgroundColor: '#00000088',
                    }}
                    onClick={() => handleDelete(index)}
                  >
                    <DeleteIcon fontSize='small' sx={{ color: '#fff' }} />
                  </IconButton>
                </Box>
              </Grid>
            ))}
          </Grid>
        )}

        {/* <Box
          sx={{
            display: 'flex',
            justifyContent: 'flex-end',
            gap: 2,
            mt: 4, // margin-top
            px: 2,
          }}
        >
          <Button variant='contained' sx={{ backgroundColor: '#4caf50' }}>
            Start Chat
          </Button>
          <Button variant='contained' sx={{ backgroundColor: '#2196f3' }}>
            Save Report
          </Button>
        </Box> */}
      </StyledCard>
    </>
  );
}
