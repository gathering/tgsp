import * as React from "react";
import PropTypes from "prop-types";
import Head from "next/head";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { CacheProvider } from "@emotion/react";
import theme from "utils/theme";
import createEmotionCache from "utils/createEmotionCache";
import { SessionProvider } from "next-auth/react";
import axios from "axios";
import getConfig from "next/config";

import Layout from "./_layout";

// Client-side cache, shared for the whole session of the user in the browser.
const clientSideEmotionCache = createEmotionCache();

const { publicRuntimeConfig } = getConfig();

export default function App({
  Component,
  pageProps,
  user,
  emotionCache = clientSideEmotionCache,
}) {
  return (
    <CacheProvider value={emotionCache}>
      <Head>
        <title>The Gathering Server Panel</title>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />
        <link rel="manifest" href="/site.webmanifest" />
      </Head>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <SessionProvider session={pageProps?.session}>
          <Layout user={user}>
            <Component {...pageProps} user={user} />
          </Layout>
        </SessionProvider>
      </ThemeProvider>
    </CacheProvider>
  );
}

App.propTypes = {
  Component: PropTypes.elementType.isRequired,
  emotionCache: PropTypes.object,
};

App.getInitialProps = async (appContext) => {
  // Server Side
  if (appContext.ctx.req) {
    try {
      const response = await axios({
        method: "GET",
        url: `${publicRuntimeConfig.url}/api/auth/user`,
        headers: {
          Cookie: `next-auth.session-token=${appContext.ctx.req.cookies["next-auth.session-token"]}`,
        },
      });
      return { user: response?.data?.user };
    } catch (e) {
      return { user: null, error: e?.data?.user };
    }
  }

  // Client Side
  const response = await fetch(`${publicRuntimeConfig.url}/api/auth/user`, {
    credentials: "same-origin",
  });
  const data = await response.json();
  return { user: data.user };
};
