import { PrismaClient } from "@prisma/client";

// Database instance
const client = new PrismaClient();

/**
 * Disconnects the bot from the database when the script is stopped
 */
export const disconnect = () => client.$disconnect();
