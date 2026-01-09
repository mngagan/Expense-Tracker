import { PrismaClient } from "@prisma/client";

// Prisma client singleton for Vercel Postgres (per agents.md Section 15)
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

// Helper function to ensure all queries are user-scoped
// This is a type helper - actual queries must include where: { userId }
export type UserScopedQuery<T> = T & {
  where: T["where"] & { userId: string };
};

// Never expose raw Prisma client - use helper functions instead
// All database operations should go through Server Actions that validate userId



