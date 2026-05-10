import { sentenceCase } from 'change-case';
import { useEffect, useState } from 'react';
import { useCallback } from 'react';
// next
import { useRouter } from 'next/router';
// @mui
import { alpha, styled } from '@mui/material/styles';
import { Box, Tab, Card, Grid, Divider, Container, Typography } from '@mui/material';
import { TabContext, TabList, TabPanel } from '@mui/lab';
// redux
import { useDispatch, useSelector } from '../../../../redux/store';
import { getProduct, addCart, onGotoStep } from '../../../../redux/slices/product';
// routes
import { PATH_ADMIN_DASHBOARD } from '../../../../routes/paths';
// @types
import { CartItem } from '../../../../@types/product';
// hooks
import useSettings from '../../../../hooks/useSettings';
// layouts
import Layout from '../../../../layouts';
// components
import Page from '../../../../components/Page';
import Iconify from '../../../../components/Iconify';
import Markdown from '../../../../components/Markdown';
import { SkeletonProduct } from '../../../../components/skeleton';
import HeaderBreadcrumbs from '../../../../components/HeaderBreadcrumbs';
// sections
import {
  ProductDetailsSummary,
  ProductDetailsReview,
  ProductDetailsCarousel,
} from '../../../../sections/@admin/e-commerce/product-details';
import CartWidget from '../../../../sections/@admin/e-commerce/CartWidget';
import {
  AppAreaInstalled,
} from '../../../../sections/@admin/general/app';
import { useTheme } from '@mui/material/styles';
import {
  AnalyticsNewsUpdate,
} from '../../../../sections/@admin/general/analytics';
import { _analyticPost } from '../../../../_mock';
import ImageUploadCard from '../../../../sections/@admin/Inspect/ImageUploadCard'
import SymptomsInput from '../../../../sections/@admin/Inspect/SymptomsInput'

// ----------------------------------------------------------------------

const LabelStyle = styled(Typography)(({ theme }) => ({
  ...theme.typography.subtitle2,
  color: theme.palette.text.secondary,
  marginBottom: theme.spacing(1),
}));

const PRODUCT_DESCRIPTION = [
  {
    title: '100% Original',
    description: 'Chocolate bar candy canes ice cream toffee cookie halvah.',
    icon: 'ic:round-verified',
  },
  {
    title: '10 Day Replacement',
    description: 'Marshmallow biscuit donut dragée fruitcake wafer.',
    icon: 'eva:clock-fill',
  },
  {
    title: 'Year Warranty',
    description: 'Cotton candy gingerbread cake I love sugar sweet.',
    icon: 'ic:round-verified-user',
  },
];

const IconWrapperStyle = styled('div')(({ theme }) => ({
  margin: 'auto',
  display: 'flex',
  borderRadius: '50%',
  alignItems: 'center',
  width: theme.spacing(8),
  justifyContent: 'center',
  height: theme.spacing(8),
  marginBottom: theme.spacing(3),
  color: theme.palette.primary.main,
  backgroundColor: `${alpha(theme.palette.primary.main, 0.08)}`,
}));

// ----------------------------------------------------------------------

EcommerceProductDetails.getLayout = function getLayout(page: React.ReactElement) {
  return <Layout>{page}</Layout>;
};

// ----------------------------------------------------------------------

export default function EcommerceProductDetails() {
  const { themeStretch } = useSettings();

  const dispatch = useDispatch();
    const theme = useTheme();

  const [value, setValue] = useState('1');

  const { query } = useRouter();

  const { name } = query;

  const { product, error, checkout } = useSelector((state) => state.product);

  useEffect(() => {
    dispatch(getProduct(name as string));
  }, [dispatch, name]);

  const handleAddCart = (product: CartItem) => {
    dispatch(addCart(product));
  };

  const handleGotoStep = (step: number) => {
    dispatch(onGotoStep(step));
  };

  return (
    <Page title="Ecommerce: Product Details">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading="Product Details"
          links={[
            { name: 'Dashboard', href: PATH_ADMIN_DASHBOARD.root },
            {
              name: 'E-Commerce',
              href: PATH_ADMIN_DASHBOARD.eCommerce.root,
            },
            {
              name: 'Shop',
              href: PATH_ADMIN_DASHBOARD.eCommerce.shop,
            },
            { name: sentenceCase(name as string) },
          ]}
        />

        <CartWidget />

        {/* {product && (
          <>
            <Card>
              <Grid container>
                <Grid item xs={12} md={6} lg={7}>
                  <ProductDetailsCarousel product={product} />
                </Grid>
                <Grid item xs={12} md={6} lg={5}>
                  <ProductDetailsSummary
                    product={product}
                    cart={checkout.cart}
                    onAddCart={handleAddCart}
                    onGotoStep={handleGotoStep}
                  />
                </Grid>
              </Grid>
            </Card>

            <Grid container sx={{ my: 8 }}>
              {PRODUCT_DESCRIPTION.map((item) => (
                <Grid item xs={12} md={4} key={item.title}>
                  <Box sx={{ my: 2, mx: 'auto', maxWidth: 280, textAlign: 'center' }}>
                    <IconWrapperStyle>
                      <Iconify icon={item.icon} width={36} height={36} />
                    </IconWrapperStyle>
                    <Typography variant="subtitle1" gutterBottom>
                      {item.title}
                    </Typography>
                    <Typography sx={{ color: 'text.secondary' }}>{item.description}</Typography>
                  </Box>
                </Grid>
              ))}
            </Grid>

            <Card>
              <TabContext value={value}>
                <Box sx={{ px: 3, bgcolor: 'background.neutral' }}>
                  <TabList onChange={(e, value) => setValue(value)}>
                    <Tab disableRipple value="1" label="Description" />
                    <Tab
                      disableRipple
                      value="2"
                      label={`Review (${product.reviews.length})`}
                      sx={{ '& .MuiTab-wrapper': { whiteSpace: 'nowrap' } }}
                    />
                  </TabList>
                </Box>

                <Divider />

                <TabPanel value="1">
                  <Box sx={{ p: 3 }}>
                    <Markdown children={product.description} />
                  </Box>
                </TabPanel>
                <TabPanel value="2">
                  <ProductDetailsReview product={product} />
                </TabPanel>
              </TabContext>
            </Card>
          </>
        )}
        {!product && <SkeletonProduct />}
        {error && <Typography variant="h6">404 Product not found</Typography>} */}

        <Grid container spacing={3}>
          <Grid item xs={12} md={12}>
              <AppAreaInstalled
                title="Number of Patients"
                subheader="(+43%) than last year"
                chartLabels={['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep']}
                chartData={[
                  {
                    year: '2019',
                    data: [
                      { name: 'Asia', data: [10, 41, 35, 51, 49, 62, 69, 91, 148] },
                      { name: 'America', data: [10, 34, 13, 56, 77, 88, 99, 77, 45] },
                    ],
                  },
                  {
                    year: '2020',
                    data: [
                      { name: 'Asia', data: [148, 91, 69, 62, 49, 51, 35, 41, 10] },
                      { name: 'America', data: [45, 77, 99, 88, 77, 56, 13, 34, 10] },
                    ],
                  },
                ]}
              />
          </Grid>

          <Grid item xs={12} md={12}>
            <AnalyticsNewsUpdate title="Current Health Update" list={_analyticPost} />
          </Grid>

          <Grid item xs={12} md={12}>
            <SymptomsInput/>
          </Grid>

          <Grid item xs={12} md={12}>
            <ImageUploadCard/>
          </Grid>
        </Grid>
      
      </Container>
    </Page>
  );
}
