import { PrismaClient } from "@prisma/client";

/**
 * Prisma klient jako singleton.
 *
 * Next.js za vývoje překládá moduly znovu při každé změně — bez tohohle
 * cache by se s každým hot reloadem otevřelo nové spojení do databáze.
 */
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
