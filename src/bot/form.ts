import { Markup, Scenes } from "telegraf";

import { FormWizardContext } from "@/types/bot";
import { recordData } from "@/db/data";
import { hasInput, isInRange } from "./wizard/validations";
import { FormActions } from "./wizard/actions";
import {
  didCryHandler,
  didExerciseHandler,
  didMeditateHandler,
} from "./wizard/actions";

const moodValidator = isInRange([1, 10]);
const weightValidator = isInRange([0]);
const coffeValidator = isInRange([0]);

/**
 * Unique identifier for the form wizard
 */
export const FORM_WIZARD_ID = "form-wizard";

// TODO: add support to skip steps if the user wants to avoid entering some data
// TODO: add support for "dont remember" option
const scene = new Scenes.WizardScene<FormWizardContext>(
  FORM_WIZARD_ID,
  // ----------
  // Ask for MOOD
  // ----------
  async (ctx) => {
    ctx.reply(
      "In a scale from 1 to 10, how was your day?\n\n0 being the worst and 10 the best.",
    );

    return ctx.wizard.next();
  },
  // ----------
  // Ask for WEIGHT
  // ----------
  async (ctx) => {
    const { message } = ctx;
    if (!hasInput.fn(message)) return ctx.reply(hasInput.message);

    const mood = Number(message.text);
    if (!moodValidator.validate(mood)) return ctx.reply(moodValidator.message);

    ctx.scene.session.mood = mood;

    // Proceed to next step
    ctx.reply("Record your weight below in kg.");
    return ctx.wizard.next();
  },
  // ----------
  // Ask for COFFEE COUNT
  // ----------
  async (ctx) => {
    const { message } = ctx;
    if (!hasInput.fn(message)) return ctx.reply(hasInput.message);

    const weight = Number(message.text);
    if (!weightValidator.validate(weight))
      return ctx.reply(weightValidator.message);

    ctx.scene.session.weight = weight;

    // Proceed to next step
    ctx.reply("How many cups of coffee did you drink today?");
    return ctx.wizard.next();
  },
  // ----------
  // Ask for DID CRY
  // ----------
  async (ctx) => {
    const { message } = ctx;
    if (!hasInput.fn(message)) return ctx.reply(hasInput.message);

    const coffee = Number(message.text);
    if (!coffeValidator.validate(coffee))
      return ctx.reply(coffeValidator.message);

    ctx.scene.session.coffeeCount = coffee;

    // Proceed to next step
    await ctx.reply(
      "Did you cry today?",
      Markup.inlineKeyboard([
        Markup.button.callback("Yes", FormActions.LOG_CRY_TRUE),
        Markup.button.callback("No", FormActions.LOG_CRY_FALSE),
      ]),
    );
    return ctx.wizard.next();
  },
  // ----------
  // Ask for DID EXERCISE
  // ----------
  didCryHandler,
  // ----------
  // Ask for DID MEDITATE
  // ----------
  didExerciseHandler,
  // ----------
  // Ask for NOTES
  // ----------
  didMeditateHandler,
  // ----------
  // SUMMARY
  // ----------
  async (ctx) => {
    const { message } = ctx;
    if (!hasInput.fn(message)) {
      return ctx.reply(hasInput.message);
    }

    const id = ctx.from!.id;
    const note = message.text;
    const { mood, weight, coffeeCount, didCry, didExercise, didMeditate } =
      ctx.scene.session;

    await ctx.reply(`
    Here's a summary of your report:
      - Mood: ${mood}
      - Weight: ${weight}kg
      - Coffee cups: ${coffeeCount}
      - Did cry: ${didCry}
      - Did exercise: ${didExercise}
      - Did meditate: ${didMeditate}
      - Note: ${note}
    
    Saving the report...`);

    await recordData(id, {
      mood,
      weight,
      note,
      coffeeCount,
      didCry,
      didExercise,
      didMeditate,
    });

    await ctx.reply("Report saved successfully. Thank you! 🚀");
    return ctx.scene.leave();
  },
);

export const stage = new Scenes.Stage<FormWizardContext>([scene]);
