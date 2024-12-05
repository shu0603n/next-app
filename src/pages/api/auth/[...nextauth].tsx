import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
type Roles = {
  superRole: boolean;
  systemRole: boolean;
  employeeView: boolean;
  clientView: boolean;
  projectView: boolean;
  employeeEdit: boolean;
  clientEdit: boolean;
  projectEdit: boolean;
};

export default NextAuth({
  // 環境変数から秘密鍵を取得
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
        // 資格情報が不足している場合は null を返す
        if (!credentials) {
          return null;
        }

        // ユーザー情報を取得
        const user = await prisma.employee.findFirst({
          where: { email: credentials.email },
          include: {
            job_category: {
              select: {
                name: true
              }
            },
            roles: {
              select: {
                super_role: true,
                system_role: true,
                employee_view: true,
                client_view: true,
                project_view: true,
                employee_edit: true,
                client_edit: true,
                project_edit: true
              }
            }
          }
        });
        console.log('findFirst', user);

        if (user && user.password === credentials.password) {
          // ロール情報を取得し、デフォルト値を設定
          const roles = user.roles?.[0] || {
            super_role: false,
            system_role: false,
            employee_view: false,
            client_view: false,
            project_view: false,
            employee_edit: false,
            client_edit: false,
            project_edit: false
          };

          // 認証情報を返す
          return {
            id: user.id,
            name: `${user.sei} ${user.mei}`,
            email: user.email,
            jobCategories: user.job_category?.name,
            roles: {
              superRole: roles.super_role,
              systemRole: roles.system_role,
              employeeView: roles.employee_view,
              clientView: roles.client_view,
              projectView: roles.project_view,
              employeeEdit: roles.employee_edit,
              clientEdit: roles.client_edit,
              projectEdit: roles.project_edit
            }
          };
        } else {
          return null;
        }
      }
    })
  ],
  callbacks: {
    jwt: async ({ token, user, account }) => {
      console.log('jwt', token, user, account);
      // ユーザー情報をトークンに追加
      if (user) {
        // @ts-ignore
        token.accessToken = user.accessToken; // 必要ならアクセストークンも追加
        token.id = user.id;
        token.provider = account?.provider;
        token.jobCategories = user.jobCategories;
        token.roles = user.roles;
      }
      return token;
    },
    session: ({ session, token }) => {
      console.log('session', session, token);
      // トークン情報をセッションにマージ
      if (token) {
        session.id = token.id;
        session.provider = token.provider;
        session.token = token;
        session.jobCategories = token.jobCategories as string;
        session.roles = token.roles as Roles;
      }
      return session;
    }
  },
  session: {
    strategy: 'jwt', // JWT をセッション管理に利用
    maxAge: Number(process.env.REACT_APP_JWT_TIMEOUT!) // JWT の有効期限
  },
  jwt: {
    secret: process.env.REACT_APP_JWT_SECRET // JWT の秘密鍵
  },
  pages: {
    signIn: '/login', // サインインページ
    newUser: '/register' // 新規ユーザー登録ページ
  }
});
