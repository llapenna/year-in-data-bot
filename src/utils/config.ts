import { info } from "@/utils/logger";

/**
 * @description Checks if an environment variable exists
 * @param identifier Name of the environment variable
 * @returns Value of the environment variable if it exists, otherwise throws an error
 */
function checkVariable(identifier: string) {
  const variable = process.env[identifier];

  if (process.env.NODE_ENV !== "production")
    info(`Checking:\t${identifier} = '${variable}'`);
  if (typeof variable === "undefined") {
    throw new Error(`Environment variable "${identifier}" is not defined.`);
  } else return variable;
}

/**
 * Node environment. Could be 'production' or 'development'.
 */
export const NODE_ENV = checkVariable("NODE_ENV");

/**
 * Telegram bot token
 */
export const BOT_TOKEN = checkVariable("BOT_TOKEN");

/**
 * Everyday at 10 PM
 */
export const BROADCAST_SCHEDULE = "0 22 * * *";

/**
 * Where the frontend is hosted
 */
export const FRONTEND_URL = checkVariable("FRONTEND_URL");

/**
 * Secret used to sign JWT tokens
 */
export const JWT_SECRET = checkVariable("JWT_SECRET");
