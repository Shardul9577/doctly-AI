// ----------------------------------------------------------------------
import { useEffect, useState, useCallback } from 'react';
import { sentenceCase } from 'change-case';
// next
import { useRouter } from 'next/router';
// @mui
import { Box, Card, Container, Typography } from '@mui/material';
// routes
import { PATH_DASHBOARD } from '../../../../routes/paths';
// hooks
import useSettings from '../../../../hooks/useSettings';
import useIsMountedRef from '../../../../hooks/useIsMountedRef';
// utils
import axios from '../../../../utils/axios';
// layouts
import Layout from '../../../../layouts';
// @types
import { Post } from '../../../../@types/blog';
// components
import Page from '../../../../components/Page';
import HeaderBreadcrumbs from '../../../../components/HeaderBreadcrumbs';
import { SkeletonPost } from '../../../../components/skeleton';
// sections
import { BlogPostHero } from '../../../../sections/@dashboard/blog';

// ----------------------------------------------------------------------

BlogPost.getLayout = function getLayout(page: React.ReactElement) {
  return <Layout>{page}</Layout>;
};

// ----------------------------------------------------------------------

export default function BlogPost() {
  const { themeStretch } = useSettings();

  const isMountedRef = useIsMountedRef();

  const { query } = useRouter();

  const { id } = query;

  const [post, setPost] = useState<Post | null>(null);

  const [error, setError] = useState(null);

  const getPost = useCallback(async () => {
    try {
      const response = await axios.get(`/api/admin/blogs/${id}`);

      if (isMountedRef.current) {
        setPost(response.data.blog);
      }
    } catch (error: any) {
      console.error(error);
      setError(error.message);
    }
  }, [isMountedRef, id]);

  useEffect(() => {
    getPost();
  }, [getPost]);

  return (
    <Page title='Blog: Post Details'>
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading='Post Details'
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'Blog', href: PATH_DASHBOARD.blog.root },
            { name: sentenceCase(id as string) },
          ]}
        />

        {post && (
          <Card>
            <BlogPostHero post={post} />

            <Box sx={{ p: { xs: 3, md: 5 } }}>
              {post.sections && post.sections.length > 0 && (
                <Box sx={{ mb: 5 }}>
                  {post.sections.map((section: any, index: number) => (
                    <Box key={index} sx={{ mb: 4 }}>
                      {/* Section Title */}
                      {section.title && (
                        <Typography variant='h5' gutterBottom>
                          {section.title}
                        </Typography>
                      )}

                      {section.description && (
                        <Typography
                          variant='body1'
                          sx={{ whiteSpace: 'pre-line' }}
                        >
                          {section.description}
                        </Typography>
                      )}
                    </Box>
                  ))}
                </Box>
              )}

              <Box
                sx={{
                  mb: 5,
                  mt: 3,
                  display: 'flex',
                  justifyContent: 'flex-end',
                }}
              ></Box>
            </Box>
          </Card>
        )}

        {!post && !error && <SkeletonPost />}

        {error && <Typography variant='h6'>404 {error}!</Typography>}
      </Container>
    </Page>
  );
}
