// Global CSS and library styles
import '../locales/i18n';
import '../utils/highlight';
import 'simplebar/src/simplebar.css';
import 'mapbox-gl/dist/mapbox-gl.css';
import 'react-quill/dist/quill.snow.css';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import 'react-lazy-load-image-component/src/effects/blur.css';
import 'react-lazy-load-image-component/src/effects/opacity.css';
import 'react-lazy-load-image-component/src/effects/black-and-white.css';
import '@fullcalendar/common/main.min.css';
import '@fullcalendar/daygrid/main.min.css';

import cookie from 'cookie';
import { ReactElement, ReactNode, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import App, { AppProps, AppContext } from 'next/app';
import { NextPage } from 'next';

// MUI & Redux
import { CssBaseline, Snackbar, Alert } from '@mui/material';
import { Provider as ReduxProvider } from 'react-redux';
import { store } from '../redux/store';

// App contexts and utils
import { getSettings } from '../utils/getSettings';
import { SettingsProvider } from '../contexts/SettingsContext';
import { CollapseDrawerProvider } from '../contexts/CollapseDrawerContext';
import ThemeProvider from '../theme';
import ThemeSettings from '../components/settings';
import { SettingsValueProps } from '../components/settings/type';
import { ChartStyle } from '../components/chart';
import ProgressBar from '../components/ProgressBar';
import NotistackProvider from '../components/NotistackProvider';
import MotionLazyContainer from '../components/animate/MotionLazyContainer';
import { AuthProvider } from '../contexts/JWTContext';
import axiosInstance from '../utils/axios';
import { isTokenExpired, tokenManager } from '../utils/tokenManager';
// ---------------------------------------------------------------

type NextPageWithLayout = NextPage & {
  getLayout?: (page: ReactElement) => ReactNode;
};

interface MyAppProps extends AppProps {
  settings: SettingsValueProps;
  Component: NextPageWithLayout;
}

// ----------------- MyApp Entry Point -----------------

export default function MyApp(props: MyAppProps) {
  const { Component, pageProps, settings } = props;
  const getLayout = Component.getLayout ?? ((page) => page);

  const router = useRouter();
  const [token, setToken] = useState('');

  useEffect(() => {
    const storedToken = localStorage.getItem('accessToken') || '';
    setToken(storedToken);

    if (storedToken) {
      const checkToken = async () => {
        const expired = isTokenExpired(storedToken);
        if (expired) {
          await tokenManager(router);
        }
      };

      checkToken(); // initial check

      const interval = setInterval(checkToken, 60 * 1000); // every 1 minute
      return () => clearInterval(interval);
    }
  }, [router]);

  return (
    <>
      <Head>
        <meta name='viewport' content='initial-scale=1, width=device-width' />
      </Head>
      <AuthProvider>
        <ReduxProvider store={store}>
          <CollapseDrawerProvider>
            <SettingsProvider defaultSettings={settings}>
              <MotionLazyContainer>
                <ThemeProvider>
                  <ThemeSettings>
                    <NotistackProvider>
                      <ChartStyle />
                      <ProgressBar />
                      {getLayout(<Component {...pageProps} />)}
                    </NotistackProvider>
                  </ThemeSettings>
                </ThemeProvider>
              </MotionLazyContainer>
            </SettingsProvider>
          </CollapseDrawerProvider>
        </ReduxProvider>
      </AuthProvider>
    </>
  );
}

// ----------------- Get Initial Props for SSR -----------------

MyApp.getInitialProps = async (context: AppContext) => {
  const appProps = await App.getInitialProps(context);
  const cookies = cookie.parse(
    context.ctx.req ? context.ctx.req.headers.cookie || '' : document.cookie
  );
  const settings = getSettings(cookies);
  return {
    ...appProps,
    settings,
  };
};
