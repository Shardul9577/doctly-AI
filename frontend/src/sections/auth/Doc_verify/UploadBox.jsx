import React, { useRef } from 'react';
import { Box, Typography, IconButton } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DeleteIcon from '@mui/icons-material/Delete';

const UploadBox = ({ label, image, onUpload, onDelete }) => {
  const inputRef = useRef(null);

  const handleClick = () => {
    inputRef.current.click();
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'stretch',
        borderRadius: 2,
        backgroundColor: '#1e1f2b',
        padding: 2,
        color: '#fff',
        minHeight: 200,
        gap: 2,
        border: '2px dashed #6366f1',
      }}
    >
      {/* Upload Area */}
      <Box
        sx={{
          flex: 1.5,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          gap: 1,
          cursor: 'pointer',
          textAlign: 'center',
          borderRight: '2px dashed #6366f1',
          pr: 2,
        }}
        onClick={handleClick}
      >
        <CloudUploadIcon sx={{ fontSize: 40, color: '#a78bfa' }} />
        <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
          Drop or Select file
        </Typography>
        <Typography variant="body2" sx={{ color: '#cbd5e1' }}>
          Click to browse your machine
        </Typography>
        <input
          type="file"
          accept="image/*"
          hidden
          ref={inputRef}
          onChange={(e) => onUpload(e.target.files[0])}
        />
      </Box>

      {/* Preview Area */}
      <Box
        sx={{
          flex: 2.5,
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {image ? (
          <>
            <Box
              component="img"
              src={URL.createObjectURL(image)}
              alt={label}
              sx={{
                width: '100%',
                maxHeight: 150,
                objectFit: 'contain',
                borderRadius: 2,
                border: '1px solid #334155',
              }}
            />
            <IconButton
              onClick={onDelete}
              size="small"
              sx={{
                position: 'absolute',
                top: 8,
                right: 8,
                color: '#f87171',
                backgroundColor: '#334155',
                '&:hover': { backgroundColor: '#475569' },
              }}
            >
              <DeleteIcon />
            </IconButton>
          </>
        ) : (
          <Typography sx={{ color: 'red', fontStyle: 'italic' }}>
            No image uploaded yet
          </Typography>
        )}
      </Box>
    </Box>
  );
};

export default UploadBox;
