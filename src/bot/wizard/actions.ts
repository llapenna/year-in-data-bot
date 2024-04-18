import { FormWizardContext as Context } from "@/types/bot";
import { Composer, Markup } from "telegraf";

export enum FormActions {
  LOG_CRY_TRUE = "FORM_LOG_CRY_TRUE",
  LOG_CRY_FALSE = "FORM_LOG_CRY_FALSE",
  LOG_EXERCISE_TRUE = "FORM_LOG_EXERCISE_TRUE",
  LOG_EXERCISE_FALSE = "FORM_LOG_EXERCISE_FALSE",
  LOG_MEDITATE_TRUE = "FORM_LOG_MEDITATE_TRUE",
  LOG_MEDITATE_FALSE = "FORM_LOG_MEDITATE_FALSE",
}

interface ComposerAction {
  name: string;
  handler: (ctx: Context) => Promise<void>;
}

/**
 * Creates a `Composer` object with the actions attached to it.
 * @param message Message to be sent when the action takes place.
 * @param keyboard Keyboard actions to attach to the message. To don't attach any keyboard, pass `null`.
 * @param actions Actions to be executed when the action takes place.
 * @returns A `Composer`.
 */
const createStepHandler = (
  message: string,
  keyboard: ReturnType<typeof Markup.inlineKeyboard> | null,
  ...actions: ComposerAction[]
): Composer<Context> => {
  const composer = new Composer<Context>();

  for (const action of actions) {
    composer.action(action.name, async (ctx) => {
      // code should update the session with the desired value
      action.handler(ctx);
      await ctx.reply(message, keyboard ?? undefined);
      return ctx.wizard.next();
    });
  }

  return composer;
};

export const didCryHandler = createStepHandler(
  // Message to be sent
  "Did you exercise today?",
  Markup.inlineKeyboard([
    Markup.button.callback("Yes", FormActions.LOG_EXERCISE_TRUE),
    Markup.button.callback("No", FormActions.LOG_EXERCISE_FALSE),
  ]),
  // Code to execute depending on the action
  {
    name: FormActions.LOG_CRY_TRUE,
    handler: async (ctx) => {
      ctx.scene.session.didCry = true;
    },
  },
  {
    name: FormActions.LOG_CRY_FALSE,
    handler: async (ctx) => {
      ctx.scene.session.didCry = false;
    },
  },
);

export const didExerciseHandler = createStepHandler(
  "Did you meditate today?",
  Markup.inlineKeyboard([
    Markup.button.callback("Yes", FormActions.LOG_MEDITATE_TRUE),
    Markup.button.callback("No", FormActions.LOG_MEDITATE_FALSE),
  ]),
  // Code to execute depending on the action
  {
    name: FormActions.LOG_EXERCISE_TRUE,
    handler: async (ctx) => {
      ctx.scene.session.didExercise = true;
    },
  },
  {
    name: FormActions.LOG_EXERCISE_FALSE,
    handler: async (ctx) => {
      ctx.scene.session.didExercise = false;
    },
  },
);

export const didMeditateHandler = createStepHandler(
  "Any notes you'd like to add?",
  null,
  // Code to execute depending on the action
  {
    name: FormActions.LOG_MEDITATE_TRUE,
    handler: async (ctx) => {
      ctx.scene.session.didMeditate = true;
    },
  },
  {
    name: FormActions.LOG_MEDITATE_FALSE,
    handler: async (ctx) => {
      ctx.scene.session.didMeditate = false;
    },
  },
);
