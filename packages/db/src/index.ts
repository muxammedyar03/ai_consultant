import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";

/**
 * Database client — Neon serverless driver bilan
 * DATABASE_URL environment variable dan olinadi
 */
export function createDb(connectionString?: string) {
  const sql = neon(connectionString ?? process.env.DATABASE_URL!);
  return drizzle(sql, { schema });
}

export type Database = ReturnType<typeof createDb>;

// Re-export schema and drizzle utilities
export * from "./schema";
export { eq, ne, gt, gte, lt, lte, like, ilike, and, or, sql, desc, asc, count, sum } from "drizzle-orm";
