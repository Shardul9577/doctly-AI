// @mui
import { Container } from '@mui/material';
// routes
import { PATH_ADMIN_DASHBOARD } from '../../../routes/paths';
// hooks
import useSettings from '../../../hooks/useSettings';
// layouts
import Layout from '../../../layouts';
// components
import Page from '../../../components/Page';
import HeaderBreadcrumbs from '../../../components/HeaderBreadcrumbs';
// sections
import { BlogNewPostForm } from '../../../sections/@admin/blog';

// ----------------------------------------------------------------------

BlogNewPost.getLayout = function getLayout(page: React.ReactElement) {
  return <Layout>{page}</Layout>;
};

// ----------------------------------------------------------------------

export default function BlogNewPost() {
  const { themeStretch } = useSettings();

  return (
    <Page title='Blog: New Post'>
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading='Create a new post'
          links={[
            { name: 'Dashboard', href: PATH_ADMIN_DASHBOARD.root },
            { name: 'Blog', href: PATH_ADMIN_DASHBOARD.blog.root },
            { name: 'New Post' },
          ]}
        />

        <BlogNewPostForm />
      </Container>
    </Page>
  );
}
