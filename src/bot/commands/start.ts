import { Command } from "@/types/bot";
import { Markup } from "telegraf";

enum KeyboardActions {
  NOTIFY = "START_NOTIFY",
}

export const START: Command = {
  command: "start",
  description: "Start command",
  handler: (ctx) => {
    if (!ctx.from) {
      ctx.reply(
        "Couldn't retrieve your information. Please try again later or contact our support!.",
      );

      return;
    }

    // 1. Retrieve user ID
    // const { id, username } = ctx.from;

    // 2. Store the ID with the user's username in the database
    // TODO: database.user.create({ id, username })

    // 3. Send a welcome message with a button to allow the user to be notified each day o
    ctx.reply(
      "Welcome to Year in Data! 🎉.",
      Markup.inlineKeyboard([
        Markup.button.callback("Notify me daily", KeyboardActions.NOTIFY),
      ]),
    );
  },
  keyboard: [
    {
      action: KeyboardActions.NOTIFY,
      handler: (ctx) => {
        // 4. Set notify flag to true in the database'
        // TODO: database.user.update({ notify:true })

        ctx.reply("You will now receive daily updates from Year in Data! 🎉.");
      },
    },
  ],
};
