import { Context, Scenes } from "telegraf";

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

interface FormWizardSession extends Scenes.WizardSessionData {
  mood?: number;
  note?: string;
  weight?: number;
}
/**
 * Context for the form wizard. It stores the "form" data in the session
 * @example
 * // Retrieve data from the session
 * const mood = ctx.scene.session.mood
 */
export type FormWizardContext = Scenes.WizardContext<FormWizardSession>;
