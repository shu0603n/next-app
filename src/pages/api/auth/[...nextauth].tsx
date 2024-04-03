// next
import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

// third-party
import axios from 'utils/axios';

import { PrismaAdapter } from '@next-auth/prisma-adapter';
import { prisma } from '../db/prisma';

export default NextAuth({
  adapter: PrismaAdapter(prisma),
  secret: process.env.NEXTAUTH_SECRET_KEY,
  providers: [
    CredentialsProvider({
      id: 'login',
      name: 'Login',
      credentials: {
        email: { label: 'Email', type: 'email', placeholder: 'Enter Email' },
        password: { label: 'Password', type: 'password', placeholder: 'Enter Password' }
      },
      async authorize(credentials) {
        try {
          console.log(JSON.stringify(credentials));
          console.log(credentials?.password, credentials?.email);
          const user = await axios.post('/api/account/login', {
            password: credentials?.password,
            email: credentials?.email
          });

          console.log('res', user);

          if (user && user.data && user.data.user) {
            user.data.user['accessToken'] = user.data.serviceToken;
            return user.data.user;
          }
        } catch (e: any) {
          console.log('error', e);
          const errorMessage = e?.response?.data?.message || 'Failed to login';
          throw new Error(errorMessage);
        }
      }
    }),
    CredentialsProvider({
      id: 'register',
      name: 'Register',
      credentials: {
        name: { label: 'Name', type: 'text', placeholder: 'Enter Name' },
        email: { label: 'Email', type: 'email', placeholder: 'Enter Email' },
        password: { label: 'Password', type: 'password', placeholder: 'Enter Password' }
      },
      async authorize(credentials) {
        try {
          console.log(process.env.REACT_APP_AUTH0_DOMAIN);
          console.log(JSON.stringify(credentials));
          console.log("リクエスト",credentials?.password, credentials?.email);
          const user = await axios.post('/api/account/register', {
            name: credentials?.name,
            password: credentials?.password,
            email: credentials?.email
          });

          console.log("レスポンス", user);

          if (user && user.data && user.data.user) {
            return user.data.user;
          }
        } catch (e: any) {
          console.log('error', e);
          const errorMessage = e?.response?.data?.message || 'Failed to register';
          throw new Error(errorMessage);
        }
      }
    })
  ],
  callbacks: {
    jwt: async ({ token, user, account }) => {
      if (user && 'accessToken' in user) {
        token.accessToken = user.accessToken;
        token.id = user.id;
        token.provider = account?.provider;
      }
      return token;
    },
    session: ({ session, token }) => {
      if (token) {
        session.id = token.id;
        session.provider = token.provider;
        session.token = token;
      }
      return session;
    }
  },
  session: {
    strategy: 'jwt',
    maxAge: Number(process.env.REACT_APP_JWT_TIMEOUT!)
  },
  jwt: {
    secret: process.env.REACT_APP_JWT_SECRET
  },
  pages: {
    signIn: '/login',
    newUser: '/register'
  }
});
