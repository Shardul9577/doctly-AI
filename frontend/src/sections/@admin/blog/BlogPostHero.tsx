import {
  Box,
  Avatar,
  Typography,
  SpeedDial,
  SpeedDialAction,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { useState } from 'react';
import useResponsive from '../../../hooks/useResponsive';
import { fDate } from '../../../utils/formatTime';
import { Post } from '../../../@types/blog';
import Image from '../../../components/Image';
import Iconify from '../../../components/Iconify';
import axios from '../../../utils/axios';
import { useRouter } from 'next/router';

// Share options
const SOCIALS = [
  {
    name: 'Facebook',
    icon: (
      <Iconify
        icon='eva:facebook-fill'
        width={20}
        height={20}
        color='#1877F2'
      />
    ),
  },
  {
    name: 'Instagram',
    icon: (
      <Iconify
        icon='ant-design:instagram-filled'
        width={20}
        height={20}
        color='#D7336D'
      />
    ),
  },
  {
    name: 'Linkedin',
    icon: (
      <Iconify
        icon='eva:linkedin-fill'
        width={20}
        height={20}
        color='#006097'
      />
    ),
  },
  {
    name: 'Twitter',
    icon: (
      <Iconify icon='eva:twitter-fill' width={20} height={20} color='#1C9CEA' />
    ),
  },
];

// Styled overlays
const Overlay = styled('div')(() => ({
  position: 'absolute',
  inset: 0,
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
  zIndex: 1,
}));

const Content = styled(Box)(({ theme }) => ({
  position: 'absolute',
  bottom: 0,
  left: 0,
  right: 0,
  zIndex: 2,
  color: theme.palette.common.white,
  padding: theme.spacing(4),
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'flex-end',
  [theme.breakpoints.up('sm')]: {
    alignItems: 'center',
  },
}));

type Props = {
  post: Post;
};

export default function BlogPostHero({ post }: Props) {
  const { image, title, author, createdAt, _id } = post;
  const isDesktop = useResponsive('up', 'sm');

  const router = useRouter();
  const [openDialog, setOpenDialog] = useState(false);

  const handleOpenDialog = () => setOpenDialog(true);
  const handleCloseDialog = () => setOpenDialog(false);

 
  const handleDeleteConfirm = async () => {
    try {
    
      await axios.delete(`/api/admin/blogs/${_id}`);
      router.push('/admin/blog/posts');
    } catch (error) {
      console.error('Error deleting post:', error);
    }
    setOpenDialog(false);
  };

  return (
    <Box sx={{ position: 'relative' }}>
      <Image alt='Post cover' src={image} />
      <Overlay />

      <Content>
        
        <Box>
          <Typography variant={isDesktop ? 'h3' : 'h4'} gutterBottom>
            {title}
          </Typography>

          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Avatar
              src={author.profile_picture}
              alt={author.firstName}
              sx={{ width: 40, height: 40 }}
            />
            <Box sx={{ ml: 2 }}>
              <Typography variant='subtitle2'>{author.firstName}</Typography>
              <Typography variant='caption' color='grey.400'>
                {fDate(createdAt)}
              </Typography>
            </Box>
          </Box>
        </Box>

        
        <Box sx={{ display: 'flex', gap: 1 }}>
       
          <SpeedDial
            direction={isDesktop ? 'left' : 'up'}
            ariaLabel='Share post'
            icon={
              <Iconify icon='eva:share-fill' sx={{ width: 20, height: 20 }} />
            }
            sx={{
              '& .MuiSpeedDial-fab': {
                width: 48,
                height: 48,
                bgcolor: 'primary.main',
                '&:hover': { bgcolor: 'primary.dark' },
              },
            }}
          >
            {SOCIALS.map((action) => (
              <SpeedDialAction
                key={action.name}
                icon={action.icon}
                tooltipTitle={action.name}
                tooltipPlacement='top'
                FabProps={{ color: 'default' }}
              />
            ))}
          </SpeedDial>

          {/* Delete Button */}
          <IconButton
            onClick={handleOpenDialog}
            sx={{
              width: 48,
              height: 48,
              bgcolor: 'error.main',
              color: 'common.white',
              '&:hover': { bgcolor: 'error.dark' },
            }}
          >
            <Iconify icon='eva:trash-2-outline' />
          </IconButton>
        </Box>
      </Content>

      {/* Delete Confirmation Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Delete Post</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this post? This action cannot be
            undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color='inherit'>
            Cancel
          </Button>
          <Button
            onClick={handleDeleteConfirm}
            color='error'
            variant='contained'
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
