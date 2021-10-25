module.exports = {
  env: {
    appName: process.env.NEXT_PUBLIC_APP_NAME,
    tokenKey: process.env.NEXT_APP_TOKEN_KEY,
    redirectUri: process.env.NEXT_APP_REDIRECT_URL,
  },
  features: {
    webpack5: true,
  },
  images: {
    domains: ["flagcdn.com"],  
  },
  reactStrictMode: true
};
