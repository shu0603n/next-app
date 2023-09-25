/** @type {import('next').NextConfig} */

/* eslint-disable @typescript-eslint/no-var-requires */
const withTM = require('next-transpile-modules')(['@babel/preset-react']);

module.exports = withTM({
  reactStrictMode: true,
  images: {
    domains: ['flagcdn.com']
  },
  env: {
    REACT_APP_VERSION: process.env.REACT_APP_VERSION,
    REACT_APP_GOOGLE_MAPS_API_KEY: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
    REACT_APP_API_URL: process.env.REACT_APP_API_URL
  },
  async redirects() {
    // redirect - default first page should be `login` when root URL like http://example.com/
    return [
      {
        source: '/',
        destination: '/login',
        permanent: true
      }
    ];
  }
});
