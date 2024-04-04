// next
import NextAuth from 'next-auth';
import Auth0Provider from 'next-auth/providers/auth0';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';

// third-party
import axios from 'utils/axios';

export let users = [
  {
    id: 1,
    name: 'Jone Doe',
    email: 'info@codedthemes.com',
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
  //   GoogleProvider({
  //     name: 'Google',
  //     clientId: process.env.REACT_APP_GOOGLE_CLIENT_ID!,
  //     clientSecret: process.env.REACT_APP_GOOGLE_CLIENT_SECRET!,
  //     authorization: {
  //       params: {
  //         prompt: 'consent',
  //         access_type: 'offline',
  //         response_type: 'code'
  //       }
  //     }
  //   }),
  //   CredentialsProvider({
  //     id: 'login',
  //     name: 'Login',
  //     credentials: {
  //       email: { label: 'Email', type: 'email', placeholder: 'Enter Email' },
  //       password: { label: 'Password', type: 'password', placeholder: 'Enter Password' }
  //     },
  //     async authorize(credentials) {
  //       try {
  //         console.log("login-",JSON.stringify(credentials))
  //         const user = await axios.post('/api/account/login', {
  //           password: credentials?.password,
  //           email: credentials?.email
  //         });
  //         console.log("login-",user)

  //         if (user) {
  //           user.data.user['accessToken'] = user.data.serviceToken;
  //           return user.data.user;
  //         }
  //       } catch (e: any) {
  //         console.log("login-Error",e)
  //         throw new Error(e?.message);
  //       }
  //     }
  //   }),
  //   CredentialsProvider({
  //     id: 'register',
  //     name: 'Register',
  //     credentials: {
  //       name: { label: 'Name', type: 'text', placeholder: 'Enter Name' },
  //       email: { label: 'Email', type: 'email', placeholder: 'Enter Email' },
  //       password: { label: 'Password', type: 'password', placeholder: 'Enter Password' }
  //     },
  //     async authorize(credentials) {
  //       try {
  //         console.log("register",credentials)
  //         const user = await axios.post('/api/account/register', {
  //           name: credentials?.name,
  //           password: credentials?.password,
  //           email: credentials?.email
  //         });
  //         console.log("register",user)

  //         if (user) {
  //           users.push(user.data);
  //           return user.data;
  //         }
  //       } catch (e: any) {
  //                   const errorMessage = e?.response.data.message;
  //         throw new Error(errorMessage);
  //       }
  //     }
  //   })
  ],
  // callbacks: {
  //   jwt: async ({ token, user, account }) => {
  //     if (user) {
  //       // @ts-ignore
  //       token.accessToken = user.accessToken;
  //       token.id = user.id;
  //       token.provider = account?.provider;
  //     }
  //     return token;
  //   },
  //   session: ({ session, token }) => {
  //     if (token) {
  //       session.id = token.id;
  //       session.provider = token.provider;
  //       session.token = token;
  //     }
  //     return session;
  //   }
  // },
  session: {
    strategy: 'jwt',
    maxAge: Number(process.env.REACT_APP_JWT_TIMEOUT!)
  },
  // jwt: {
  //   secret: process.env.REACT_APP_JWT_SECRET
  // },
  // pages: {
  //   signIn: '/login',
  //   newUser: '/register'
  // }
});
