import { PrismaClient } from "@prisma/client";

// Database instance
export const prisma = new PrismaClient();

/**
 * Disconnects the bot from the database when the script is stopped
 */
export const disconnect = () => prisma.$disconnect();
