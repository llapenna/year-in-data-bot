import { Context } from "telegraf";

/**
 * Keyboard button type used to register new keyboard buttons INSIDE
 * a command
 */
export interface Keyboardbutton {
  action: string;
  handler: (ctx: Context) => void;
}

/**
 * Command type used to register new commands
 */
export interface Command {
  command: string;
  description: string;
  handler: (ctx: Context) => void;
  keyboard?: Keyboardbutton[];
}
