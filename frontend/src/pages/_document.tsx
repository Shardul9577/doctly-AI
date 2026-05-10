import * as React from 'react';
import Document, { Html, Head, Main, NextScript } from 'next/document';
import palette from '../theme/palette';
import createCache from '@emotion/cache';
import createEmotionServer from '@emotion/server/create-instance';
import { CacheProvider } from '@emotion/react';

export default class MyDocument extends Document {
  render() {
    return (
      <Html lang='en'>
        <Head>
          <meta charSet='utf-8' />

          <link
            rel='apple-touch-icon'
            sizes='180x180'
            href='/favicon/apple-touch-icon.png'
          />
          <link
            rel='icon'
            type='image/png'
            sizes='32x32'
            href='/favicon/favicon-32x32.png'
          />
          <link
            rel='icon'
            type='image/png'
            sizes='16x16'
            href='/favicon/favicon-16x16.png'
          />

          <meta name='theme-color' content={palette.light.primary.main} />
          <link rel='manifest' href='/manifest.json' />
          <link rel='preconnect' href='https://fonts.gstatic.com' />
          <link
            href='https://fonts.googleapis.com/css2?family=Public+Sans:wght@400;500;600;700&display=swap'
            rel='stylesheet'
          />

          {/* Doctly specific metadata */}
          <title>Doctly - AI-powered Healthcare Solutions</title>
          <meta
            name='description'
            content='Doctly empowers healthcare with AI: automated medical documentation, early disease detection, and secure digital records for doctors, clinics, and insurers.'
          />
          <meta
            name='keywords'
            content='Doctly, AI healthcare, medical documentation, early disease detection, digital health records, insurance verification, telemedicine, healthtech'
          />
          <meta name='author' content='Doctly' />

          {/* Open Graph for social media */}
          <meta
            property='og:title'
            content='Doctly - AI-powered Healthcare Solutions'
          />
          <meta
            property='og:description'
            content='Transforming healthcare with AI: Doctly automates doctor-patient documentation and predicts disease risks for smarter, seamless care.'
          />
          <meta property='og:image' content='/images/doctly-og-image.png' />
          <meta property='og:type' content='website' />
          <meta property='og:url' content='https://doctly.ai' />

          {/* Twitter Card */}
          <meta name='twitter:card' content='summary_large_image' />
          <meta
            name='twitter:title'
            content='Doctly - AI-powered Healthcare Solutions'
          />
          <meta
            name='twitter:description'
            content='Doctly empowers doctors with AI tools for automated documentation and early disease prediction.'
          />
          <meta name='twitter:image' content='/images/doctly-og-image.png' />
        </Head>

        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

// ----------------------------------------------------------------------

MyDocument.getInitialProps = async (ctx) => {
  const originalRenderPage = ctx.renderPage;

  function createEmotionCache() {
    return createCache({ key: 'css', prepend: true });
  }

  const cache = createEmotionCache();

  const { extractCriticalToChunks } = createEmotionServer(cache);

  ctx.renderPage = () =>
    originalRenderPage({
      enhanceApp: (App) => (props) =>
        (
          <CacheProvider value={cache}>
            <App {...props} />
          </CacheProvider>
        ),
    });

  const initialProps = await Document.getInitialProps(ctx);

  const emotionStyles = extractCriticalToChunks(initialProps.html);

  const emotionStyleTags = emotionStyles.styles.map((style) => (
    <style
      data-emotion={`${style.key} ${style.ids.join(' ')}`}
      key={style.key}
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: style.css }}
    />
  ));

  return {
    ...initialProps,
    emotionStyleTags,
  };
};
