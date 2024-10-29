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
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      jobCategories?: string | null;
    };
  }

  interface User {
    id: string;
    name: string;
    email: string;
    jobCategories?: string | null;
  }
}
