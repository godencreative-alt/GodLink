import type { NextAuthConfig } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import Google from 'next-auth/providers/google';
import GitHub from 'next-auth/providers/github';
import { PrismaAdapter } from '@auth/prisma-adapter';
import { prisma } from './prisma';
import { compare } from 'bcryptjs';

const providers: NextAuthConfig['providers'] = [
  Credentials({
    credentials: {
      email: { label: 'Email', type: 'email' },
      password: { label: 'Password', type: 'password' }
    },
    async authorize(credentials) {
      if (!credentials?.email || !credentials?.password) return null;

      const user = await prisma.user.findUnique({
        where: { email: credentials.email as string }
      });

      if (!user || !user.password) return null;
      if (!user.emailVerified) return null;

      const isValid = await compare(credentials.password as string, user.password);
      if (!isValid) return null;

      return { id: user.id, email: user.email, name: user.name, image: user.image };
    }
  })
];

if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  providers.push(
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET
    })
  );
}

if (process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET) {
  providers.push(
    GitHub({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET
    })
  );
}

export const authConfig = {
  adapter: PrismaAdapter(prisma),
  providers,
  callbacks: {
    async jwt({ token, user }) {
      if (user?.id) {
        token.id = user.id;
        const dbUser = await prisma.user.findUnique({
          where: { id: user.id },
          select: { role: true, email: true, name: true }
        });
        token.role = dbUser?.role ?? 'USER';
        if (dbUser?.email) token.email = dbUser.email;
        if (dbUser?.name) token.name = dbUser.name;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = (token.role as string) || 'USER';
      }
      return session;
    },
    async signIn() {
      return true;
    }
  },
  pages: {
    signIn: '/auth/login',
    error: '/auth/error'
  }
} satisfies NextAuthConfig;