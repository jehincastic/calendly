import * as React from "react";
import { AppProps } from "next/app";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { CacheProvider, EmotionCache } from "@emotion/react";

import "@styles/index.css";
import theme from "@lib/theme";
import { createEmotionCache } from "@lib/createEmotionCache";
import AlertProvider from "@providers/AlertProvider";
import LoadingProvider from "@providers/LoadingProvider";
import { AuthProvider } from "@providers/AuthProvider";

interface MyAppProps extends AppProps {
  emotionCache?: EmotionCache;
}

const clientSideEmotionCache = createEmotionCache();

const MyApp = (props: MyAppProps) => {
  const { Component, emotionCache = clientSideEmotionCache, pageProps } = props;
  return (
    <CacheProvider value={emotionCache}>
      <LoadingProvider>
        <AlertProvider>
          <AuthProvider>
            <ThemeProvider theme={theme}>
              <CssBaseline />
              <Component {...pageProps} />
            </ThemeProvider>
          </AuthProvider>
        </AlertProvider>
      </LoadingProvider>
    </CacheProvider>
  );
}
export default MyApp
