import orderBy from 'lodash/orderBy';
import { useEffect, useCallback, useState, useMemo } from 'react';
import NextLink from 'next/link';
import { Grid, Button, Container, Stack, Chip, Box } from '@mui/material';
import useSettings from '../../../hooks/useSettings';
import useIsMountedRef from '../../../hooks/useIsMountedRef';
import axios from '../../../utils/axios';
import { PATH_ADMIN_DASHBOARD } from '../../../routes/paths';
import { Post } from '../../../@types/blog';
import Layout from '../../../layouts';
import Page from '../../../components/Page';
import Iconify from '../../../components/Iconify';
import { SkeletonPostItem } from '../../../components/skeleton';
import HeaderBreadcrumbs from '../../../components/HeaderBreadcrumbs';
import {
  BlogPostCard,
  BlogPostsSort,
  BlogPostsSearch,
} from '../../../sections/@admin/blog';
import { useTheme } from '@mui/material/styles';

const SORT_OPTIONS = [
  { value: 'latest', label: 'Latest' },
  { value: 'oldest', label: 'Oldest' },
];

BlogPosts.getLayout = function getLayout(page: React.ReactElement) {
  return <Layout>{page}</Layout>;
};

const applySortAndFilter = (
  posts: Post[],
  sortBy: string,
  searchQuery: string,
  selectedTag: string
) => {
  let filteredPosts = posts;

  if (selectedTag && selectedTag !== 'All') {
    filteredPosts = filteredPosts.filter((post) =>
      (post.tags || []).some(
        (tag) => tag?.toLowerCase() === selectedTag.toLowerCase()
      )
    );
  }

  if (searchQuery) {
    const lowercasedQuery = searchQuery.toLowerCase();
    filteredPosts = filteredPosts.filter((post) => {
      const matchesTitle = post.postTitle
        ?.toLowerCase()
        .includes(lowercasedQuery);
      const matchesSections = post.sections?.some((sec) =>
        sec.description?.toLowerCase().includes(lowercasedQuery)
      );
      const matchesAuthor = post.author?.name
        ?.toLowerCase()
        .includes(lowercasedQuery);
      return matchesTitle || matchesSections || matchesAuthor;
    });
  }

  if (sortBy === 'latest') {
    return orderBy(filteredPosts, ['createdAt'], ['desc']);
  }

  if (sortBy === 'oldest') {
    return orderBy(filteredPosts, ['createdAt'], ['asc']);
  }

  return filteredPosts;
};

export default function BlogPosts() {
  const { themeStretch } = useSettings();
  const isMountedRef = useIsMountedRef();

  const [posts, setPosts] = useState<Post[]>([]);
  const [filters, setFilters] = useState('latest');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState('All');
  const [tags, setTags] = useState<string[]>(['All']);
  const theme = useTheme();

  const filteredSortedPosts = useMemo(
    () => applySortAndFilter(posts, filters, searchQuery, selectedTag),
    [posts, filters, searchQuery, selectedTag]
  );

  const getAllPosts = useCallback(async () => {
    try {
      const response = await axios.get('/api/admin/blogs');
      if (isMountedRef.current) {
        const fetchedPosts: Post[] = response?.data?.blogs || [];
        setPosts(fetchedPosts);

        const uniqueTags = Array.from(
          new Set(
            fetchedPosts
              .flatMap((post) => post.tags || [])
              .filter((tag): tag is string => Boolean(tag))
          )
        );

        setTags(['All', ...uniqueTags]);
      }
    } catch (error) {
      console.error(error);
    }
  }, [isMountedRef]);

  useEffect(() => {
    getAllPosts();
  }, [getAllPosts]);

  const handleChangeSort = (value: string) => {
    if (value) setFilters(value);
  };

  const handleSearch = (value: string) => {
    setSearchQuery(value);
  };

  return (
    <Page title='Blog: Posts'>
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading='Blog'
          links={[
            { name: 'Dashboard', href: PATH_ADMIN_DASHBOARD.root },
            { name: 'Blog', href: PATH_ADMIN_DASHBOARD.blog.root },
            { name: 'Posts' },
          ]}
          action={
            <NextLink href={PATH_ADMIN_DASHBOARD.blog.new} passHref>
              <Button
                variant='contained'
                startIcon={<Iconify icon={'eva:plus-fill'} />}
              >
                New Post
              </Button>
            </NextLink>
          }
        />

        <Stack
          mb={3}
          direction='row'
          alignItems='center'
          justifyContent='space-between'
          flexWrap='wrap'
          gap={2}
        >
          <BlogPostsSearch onSearch={handleSearch} />
          <BlogPostsSort
            query={filters}
            options={SORT_OPTIONS}
            onSort={handleChangeSort}
          />
        </Stack>

        <Box sx={{ overflowX: 'auto', mb: 3 }}>
          <Stack direction='row' spacing={1} sx={{ pb: 1 }}>
            {tags.map((tag) => (
              <Chip
                key={tag}
                label={tag}
                clickable
                variant={selectedTag === tag ? 'filled' : 'outlined'}
                onClick={() => setSelectedTag(tag)}
                sx={{
                  color:
                    selectedTag === tag
                      ? theme.palette.primary.contrastText
                      : theme.palette.text.primary,
                  backgroundColor:
                    selectedTag === tag
                      ? theme.palette.primary.main
                      : 'transparent',
                  fontWeight: selectedTag === tag ? 'bold' : 'normal',
                  borderColor:
                    selectedTag === tag
                      ? theme.palette.primary.main
                      : theme.palette.divider,
                  '&:hover': {
                    backgroundColor:
                      selectedTag === tag
                        ? theme.palette.primary.dark
                        : theme.palette.action.hover,
                  },
                }}
              />
            ))}
          </Stack>
        </Box>

        <Grid container spacing={3}>
          {(!posts.length ? [...Array(12)] : filteredSortedPosts).map(
            (post, index) =>
              post ? (
                <Grid
                  key={post._id}
                  item
                  xs={12}
                  sm={6}
                  md={(index === 0 && 6) || 3}
                >
                  <BlogPostCard post={post} index={index} />
                </Grid>
              ) : (
                <SkeletonPostItem key={index} />
              )
          )}
        </Grid>
      </Container>
    </Page>
  );
}
