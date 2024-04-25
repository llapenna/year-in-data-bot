import { Command } from "@/types/bot";
import { FORM_WIZARD_ID } from "../form";
import { shouldRecordToday, userExists } from "@/db/user";

export const RECORD: Command = {
  command: "record",
  description: "Record data now.",
  handler: async (ctx) => {
    const telegramId = ctx.from?.id;

    if (!(await userExists(telegramId)))
      return ctx.reply("You need to register first. Use /start to begin.");

    // If the previous check passes, we can safely assume that the telegramId is defined
    if (!(await shouldRecordToday(telegramId as number)))
      return ctx.reply("You have already recorded data today.");

    return ctx.scene.enter(FORM_WIZARD_ID);
  },
};
