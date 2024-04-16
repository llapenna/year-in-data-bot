import { Markup } from "telegraf";

import { createUser, toggleNotify } from "@/db/user";
import { Command } from "@/types/bot";

enum KeyboardActions {
  NOTIFY = "START_NOTIFY",
}

export const START: Command = {
  command: "start",
  description: "Start command",
  handler: async (ctx) => {
    if (!ctx.from || !ctx.from.username) {
      return ctx.reply(
        "Couldn't retrieve your information. Please try again later or contact our support!.",
      );
    }

    // 1. Retrieve user ID
    const { id, username } = ctx.from;

    // 2. Store the ID with the user's username in the database
    const user = await createUser({ telegramId: id, username });

    if (!user)
      return ctx.reply(
        "An error occurred while creating your account. Please try again later or contact our support!.",
      );

    // 3. Send a welcome message with a button to allow the user to be notified each day o
    return ctx.reply(
      "Welcome to Year in Graphs! 🎉.",
      Markup.inlineKeyboard([
        Markup.button.callback("Notify me daily", KeyboardActions.NOTIFY),
      ]),
    );
  },
  keyboard: [
    {
      action: KeyboardActions.NOTIFY,
      handler: async (ctx) => {
        if (!ctx.from) {
          return ctx.reply(
            "Couldn't retrieve your information. Please try again later or contact our support!.",
          );
        }
        // 4. Set notify flag to true in the database'
        await toggleNotify(ctx.from.id);

        return ctx.reply(
          "You will now receive daily updates from Year in Graphs! 🎉.",
        );
      },
    },
  ],
};
