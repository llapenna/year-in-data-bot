/* eslint-disable no-console */
import { LoggerFunction } from "@/types/logger";

const priorities = {
  ERROR: 3,
  WARN: 4,
  INFO: 6,
};

const prefix = (type: keyof typeof priorities) =>
  `<${priorities[type]}> [${new Date().toLocaleString()} - ${type}]:`;

/**
 * Interface for `console.log`. Won't print on 'production' mode
 * @param args Same arguments as `console.log`
 */
const info: LoggerFunction = (...args) => {
  if (process.env.NODE_ENV !== "production") {
    console.log(prefix("INFO"), ...args);
  }
};

/**
 * Interface for `console.error`. Always print
 * @param args Same arguments as `console.error`
 */
const error: LoggerFunction = (...args) => {
  console.error(prefix("ERROR"), ...args);
};

/**
 * Interface for `console.warn`
 * @param args Same arguments as `console.warn`
 */
const warn: LoggerFunction = (...args) => {
  console.warn(prefix("WARN"), ...args);
};

const logger = {
  info,
  error,
  warn,
};

export default logger;
