import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// Create PostgreSQL connection pool
const connectionString = process.env.DATABASE_URL;

let prismaClient: PrismaClient;

if (connectionString) {
  try {
    const pool = new Pool({ connectionString });
    const adapter = new PrismaPg(pool);
    
    prismaClient = new PrismaClient({
      adapter: adapter,
      log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
    });
  } catch (error) {
    console.error("Failed to create Prisma client with adapter:", error);
    // Fallback to standard client
    prismaClient = new PrismaClient({
      log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
    });
  }
} else {
  // No DATABASE_URL, use standard client (will fail at runtime if no connection)
  prismaClient = new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  });
}

export const prisma =
  globalForPrisma.prisma ?? prismaClient;

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
