import { paramCase } from 'change-case';
import NextLink from 'next/link';
import { alpha, styled } from '@mui/material/styles';
import {
  Box,
  Card,
  Avatar,
  Typography,
  CardContent,
  Link,
  Stack,
} from '@mui/material';
import { PATH_PATIENT_DASHBOARD } from '../../../routes/paths';
import useResponsive from '../../../hooks/useResponsive';
import { fDate } from '../../../utils/formatTime';
import Image from '../../../components/Image';
import TextMaxLine from '../../../components/TextMaxLine';
import SvgIconStyle from '../../../components/SvgIconStyle';

const OverlayStyle = styled('div')(({ theme }) => ({
  top: 0,
  zIndex: 1,
  width: '100%',
  height: '100%',
  position: 'absolute',
  backgroundColor: alpha(theme.palette.grey[900], 0.8),
}));

type Props = {
  post: any;
  index?: number;
};

export default function BlogPostCard({ post, index }: Props) {
  const isDesktop = useResponsive('up', 'md');

  const { postTitle, sections, tags, createdAt, image, _id, author } = post;

  const latestPost = index === 0 || index === 1 || index === 2;

  const avatarName = author?.name || 'Unknown';
  const avatarUrl = author?.avatarUrl || '/placeholder-avatar.png';
  const postImage = image || '/placeholder-image.png';

  if (isDesktop && latestPost) {
    return (
      <Card>
        <Avatar
          alt={avatarName}
          src={avatarUrl}
          sx={{
            zIndex: 9,
            top: 24,
            left: 24,
            width: 40,
            height: 40,
            position: 'absolute',
          }}
        />
        <PostContent
          title={postTitle}
          id={_id}
          createdAt={createdAt}
          index={index}
        />
        <OverlayStyle />
        <Image alt='image' src={postImage} sx={{ height: 360 }} />
      </Card>
    );
  }

  return (
    <Card>
      <Box sx={{ position: 'relative' }}>
        <SvgIconStyle
          src='https://minimal-assets-api-dev.vercel.app/assets/icons/shape-avatar.svg'
          sx={{
            width: 80,
            height: 36,
            zIndex: 9,
            bottom: -15,
            position: 'absolute',
            color: 'background.paper',
          }}
        />
        <Avatar
          alt={avatarName}
          src={avatarUrl}
          sx={{
            left: 24,
            zIndex: 9,
            width: 32,
            height: 32,
            bottom: -16,
            position: 'absolute',
          }}
        />
        <Image alt='image' src={postImage} ratio='4/3' />
      </Box>

      <PostContent title={postTitle} id={_id} createdAt={createdAt} />
    </Card>
  );
}

// ----------------------------------------------------------------------

type PostContentProps = {
  title: string;
  id: string;
  createdAt: Date | string | number;
  index?: number;
};

export function PostContent({ title, createdAt, index, id }: PostContentProps) {
  const isDesktop = useResponsive('up', 'md');
  const linkTo = PATH_PATIENT_DASHBOARD.blog.detailed.replace('[id]', id);

  const latestPostLarge = index === 0;
  const latestPostSmall = index === 1 || index === 2;

  return (
    <CardContent
      sx={{
        pt: 4.5,
        width: 1,
        ...((latestPostLarge || latestPostSmall) && {
          pt: 0,
          zIndex: 9,
          bottom: 0,
          position: 'absolute',
          color: 'common.white',
        }),
      }}
    >
      <Typography
        gutterBottom
        variant='caption'
        component='div'
        sx={{
          color: 'text.disabled',
          ...((latestPostLarge || latestPostSmall) && {
            opacity: 0.64,
            color: 'common.white',
          }),
        }}
      >
        {fDate(createdAt)}
      </Typography>

      <NextLink href={linkTo} passHref>
        <Link color='inherit'>
          <TextMaxLine
            variant={isDesktop && latestPostLarge ? 'h5' : 'subtitle2'}
            line={2}
            persistent
          >
            {title}
          </TextMaxLine>
        </Link>
      </NextLink>
    </CardContent>
  );
}
