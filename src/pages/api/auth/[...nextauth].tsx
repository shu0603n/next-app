import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { PrismaClient } from '@prisma/client'; // Import PrismaClient

const prisma = new PrismaClient(); // Create a Prisma client instance

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
          return null; // credentialsがundefinedの場合
        }

        // employeeテーブルからユーザーを取得
        const user = await prisma.employee.findFirst({
          where: { email: credentials.email } // emailで検索
        });

        // ユーザーが存在し、パスワードが一致するか確認
        if (user && user.password === credentials.password) {
          // 本番環境ではパスワードをハッシュ化することを忘れずに
          return {
            id: user.id,
            name: user.sei + user.mei, // 名前の結合
            email: user.email
          };
        } else {
          return null; // 認証失敗時にはnullを返す
        }
      }
    })
  ],
  callbacks: {
    jwt: async ({ token, user, account }) => {
      if (user) {
        // @ts-ignore
        token.accessToken = user.accessToken; // アクセストークン
        token.id = user.id; // ユーザーID
        token.provider = account?.provider; // プロバイダー情報
      }
      return token;
    },
    session: ({ session, token }) => {
      if (token) {
        session.id = token.id; // セッションにユーザーIDを追加
        session.provider = token.provider; // プロバイダー情報を追加
        session.token = token; // トークン情報を追加
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
