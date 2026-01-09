import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { prisma } from "@/lib/db";
import { env } from "@/lib/env";

// Auth.js configuration with Google OAuth (per agents.md Section 3)
// Using JWT strategy for simplicity - user data stored in JWT token
export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/",
  },
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider === "google" && user.email) {
        // Ensure user exists in database
        try {
          await prisma.user.upsert({
            where: { email: user.email },
            update: {
              name: user.name ?? undefined,
              image: user.image ?? undefined,
            },
            create: {
              email: user.email,
              name: user.name ?? undefined,
              image: user.image ?? undefined,
            },
          });
        } catch (error) {
          // Error creating/updating user - fail silently to prevent auth issues
          // In production, this should use structured logging
          return false;
        }
      }
      return true;
    },
    async session({ session, token }) {
      if (session.user && token.sub) {
        session.user.id = token.sub;
      }
      return session;
    },
    async jwt({ token, user, account, profile }) {
      if (user) {
        token.sub = user.id;
      }
      // Fetch user ID from database if not in token
      if (!token.sub && token.email) {
        const dbUser = await prisma.user.findUnique({
          where: { email: token.email as string },
        });
        if (dbUser) {
          token.sub = dbUser.id;
        }
      }
      return token;
    },
  },
};

