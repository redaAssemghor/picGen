import { PrismaClient } from "@prisma/client";

// Ensure PrismaClient is singleton in a serverless environment
declare global {
  var prisma: PrismaClient | undefined;
}

const prisma = global.prisma || new PrismaClient();

if (process.env.NODE_ENV !== "production") global.prisma = prisma;

export default prisma;
