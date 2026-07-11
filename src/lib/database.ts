import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function createPrismaClient() {
  return new PrismaClient({
    log:
      process.env.NODE_ENV === "development"
        ? ["error", "warn"]
        : ["error"],
  });
}

/**
 * Prisma singleton for Next.js hot reload.
 * Callers should check `isDatabaseConfigured()` before querying.
 */
export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

export function isDatabaseConfigured() {
  const url = process.env.DATABASE_URL?.trim();
  if (!url) return false;

  // Treat scaffold placeholders as unconfigured so pages fail gracefully.
  const looksLikePlaceholder =
    /@(HOST|localhost dummy)|USER:PASSWORD@HOST|:5432\/portfolio\?sslmode=require/i.test(
      url,
    ) ||
    url.includes("@HOST:") ||
    url.includes("USER:PASSWORD");

  return !looksLikePlaceholder;
}

export class DatabaseUnavailableError extends Error {
  constructor(message = "Database is not configured.") {
    super(message);
    this.name = "DatabaseUnavailableError";
  }
}

export function requireDatabase() {
  if (!isDatabaseConfigured()) {
    throw new DatabaseUnavailableError();
  }
  return prisma;
}
