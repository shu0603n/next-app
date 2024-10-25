import NextAuth from 'next-auth';
import Auth0Provider from 'next-auth/providers/auth0';
import CredentialsProvider from 'next-auth/providers/credentials';

export let users = [
  {
    id: 1,
    name: 'INFO',
    email: 'info@codedthemes.com',
    password: '123456'
  },
  {
    id: 2,
    name: '村井俊介',
    email: 'shu0603n@gmail.com',
    password: '123456'
  },
  {
    id: 3,
    name: 'むらいさんドットコム',
    email: 'info@murai-san.com',
    password: '123456'
  }
];

export default NextAuth({
  secret: process.env.NEXTAUTH_SECRET_KEY,
  providers: [
    Auth0Provider({
      name: 'Auth0',
      clientId: process.env.REACT_APP_AUTH0_CLIENT_ID!,
      clientSecret: process.env.REACT_APP_AUTH0_CLIENT_SECRET!,
      issuer: `https://${process.env.REACT_APP_AUTH0_DOMAIN}`
    }),
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
          return null; // credentialsがundefinedの場合
        }

        const user = users.find((user) => user.email === credentials.email && user.password === credentials.password);

        if (user) {
          return {
            id: user.id,
            name: user.name,
            email: user.email,
          }; // User型として返す
        } else {
          return null; // 認証失敗時にはnullを返す
        }
      }
    }),
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
    signIn: '/login', // サインインページ
    newUser: '/register' // 新規ユーザー登録ページ
  }
});
