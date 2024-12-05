import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default NextAuth({
  secret: process.env.NEXTAUTH_SECRET_KEY,
  providers: [
    CredentialsProvider({
      id: 'login',
      name: 'Login',
      credentials: {
        email: { label: 'Email', type: 'email', placeholder: 'Enter Email' },
        password: { label: 'Password', type: 'password', placeholder: 'Enter Password' }
      },
      // @ts-ignore
      async authorize(credentials) {
        if (!credentials) {
          return null;
        }

        const user = await prisma.employee.findFirst({
          where: { email: credentials.email },
          include: {
            job_category: {
              select: {
                name: true
              }
            }
          }
        });
        if (user && user.password === credentials.password) {
          return {
            id: user.id,
            name: `${user.sei} ${user.mei}`,
            email: user.email,
            jobCategories: user.job_category?.name
          };
        } else {
          return null;
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
        token.jobCategories = user.jobCategories;
      }
      return token;
    },
    session: ({ session, token }) => {
      if (token) {
        session.id = token.id;
        session.provider = token.provider;
        session.token = token;
        session.jobCategories = token.jobCategories as string;
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
    signIn: '/login', // サインインページ
    newUser: '/register' // 新規ユーザー登録ページ
  }
});
