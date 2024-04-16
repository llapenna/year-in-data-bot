type Callback = (ctx: Context) => Promise<void>;

/**
 * Keyboard button type used to register new keyboard buttons INSIDE
 * a command
 */
export interface Keyboardbutton {
  action: string;
  handler: Callback;
}

/**
 * Command type used to register new commands
 */
export interface Command {
  command: string;
  description: string;
  handler: Callback;
  keyboard?: Keyboardbutton[];
}
