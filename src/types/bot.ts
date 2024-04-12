import { Context } from "telegraf";

/**
 * Command type used to register new commands
 */
export interface Command {
  command: string;
  description: string;
  handler: (ctx: Context) => void;
}
