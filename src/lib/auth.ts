import NextAuth from 'next-auth';
import { authConfig } from './auth.config';

export const { handlers, signIn, signOut, auth } = NextAuth({
  ...authConfig,
  trustHost: true,
  session: { strategy: 'jwt' },
  jwt: { maxAge: 30 * 24 * 60 * 60 }
});