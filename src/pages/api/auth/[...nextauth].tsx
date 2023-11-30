// next
import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

// third-party
import axios from 'utils/axios';

import { PrismaAdapter } from '@next-auth/prisma-adapter';
import { prisma } from '../db/prisma';

export let users = [
  // {
  //   id: 1,
  //   name: 'Jone Doe',
  //   email: 'info@codedthemes.com',
  //   password: '123456'
  // },
  {
    id: 1,
    name: '村井',
    email: 'murai@codedthemes.com',
    password: '123456'
  }
];

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
            // password: '123456',
            // email: 'murai@codedthemes.com'
          });
          console.log('res', user);

          if (user) {
            user.data.user['accessToken'] = user.data.serviceToken;
            return user.data.user;
          }
        } catch (e: any) {
          console.log('error', e);
          const errorMessage = e?.response.data.message;
          throw new Error(errorMessage);
        }
      }
    }),
    // 資格情報ベースの認証に提供される機能は、パスワードの使用を妨げるために意図的に制限されています。
    // それに伴う固有のセキュリティ リスクと、ユーザー名とパスワードのサポートに伴う複雑さ。
    // 特に必要な場合を除き、資格情報ベースの認証を無視することをお勧めします
    // 参照: https://next-auth.js.org/providers/credentials
    // https://github.com/nextauthjs/next-auth/issues/3562
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
          console.log(JSON.stringify(credentials));
          console.log(credentials?.password, credentials?.email);
          const user = await axios.post('/api/account/register', {
            name: credentials?.name,
            password: credentials?.password,
            email: credentials?.email
          });
          console.log(user);

          if (user) {
            users.push(user.data);
            return user.data;
          }
        } catch (e: any) {
          console.log('error', e);
          const errorMessage = e?.response.data.message;
          throw new Error(errorMessage);
        }
      }
    })
  ],
  callbacks: {
    jwt: async ({ token, user, account }) => {
      if (user) {
        // @ts-ignore
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
        session.tocken = token;
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
