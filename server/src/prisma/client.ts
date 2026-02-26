import { PrismaClient, Prisma } from "../generated/prisma/client.js";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import "dotenv/config";

declare global {
  var prisma: PrismaClient | undefined;
}

const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);

export const prisma = global.prisma ?? new PrismaClient({ adapter });

export * from "../generated/prisma/client.js";
export * from "../generated/prisma/enums.js";

if (process.env.NODE_ENV !== "production") {
  global.prisma = prisma;
}
