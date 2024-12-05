// eslint-disable-next-line
import NextAuth from 'next-auth';

declare module 'next-auth' {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    id: any;
    provider: any;
    token: any;
    jobCategories?: string;
    roles: Roles;
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      jobCategories?: string | null;
      roles: Roles;
    };
  }

  interface User {
    id: string;
    name: string;
    email: string;
    jobCategories?: string | null;
    roles: Roles;
  }

  interface Roles {
    superRole: boolean;
    systemRole: boolean;
    employeeView: boolean;
    clientView: boolean;
    projectView: boolean;
    employeeEdit: boolean;
    clientEdit: boolean;
    projectEdit: boolean;
  }
}
