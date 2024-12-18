/** @type {import('next').NextConfig} */

const withTM = require('next-transpile-modules')([
  '@babel/preset-react',
  '@fullcalendar/common',
  '@fullcalendar/daygrid',
  '@fullcalendar/interaction',
  '@fullcalendar/list',
  '@fullcalendar/react',
  '@fullcalendar/timegrid',
  '@fullcalendar/timeline',
  'react-syntax-highlighter',
  'react-dnd',
  'react-dnd-html5-backend'
]);

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
  },
  async headers() {
    const headers = [];
    // noindex ヘッダーを追加
    headers.push({
      headers: [
        {
          key: 'X-Robots-Tag',
          value: 'noindex'
        }
      ],
      source: '/:path*' // すべてのページに適用
    });
    return headers;
  }
});
