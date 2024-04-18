import { Convenience } from "telegraf/types";
import { Markup } from "telegraf";
import { CronJob } from "cron";

import { getAllNotifiableUsers } from "@/db/user";
import { BROADCAST_SCHEDULE } from "@/utils/config";
import { info } from "@/utils/logger";

import { bot } from ".";
import { FORM_ENTER_SCENE } from "./actions/form";

/**
 * Sends a message to all the users that have notifications enabled.
 * @param msg Text message to be broadcasted.
 * @param extras Extra options for the message. Keyboards, etc.
 */
export const broadcast = async (
  msg: string,
  extras?: Convenience.ExtraReplyMessage,
): Promise<void> => {
  const users = await getAllNotifiableUsers();
  const telegramIds = users.map((u) => u.telegramId);

  // Wait for all the messages to be sent
  await Promise.all(
    telegramIds.map((id) => bot.telegram.sendMessage(id, msg, extras)),
  );
};

/**
 * Creates and starts a CRON job that broadcasts a message to all the users with notifications enabled.
 * @returns A CRON job. The job starts automatically.
 */
export const startBroadcastJob = () => {
  const job = CronJob.from({
    cronTime: BROADCAST_SCHEDULE,
    onTick: async () => {
      broadcast(
        "It's time to record your daily data!",
        Markup.inlineKeyboard([
          Markup.button.callback("Record!", FORM_ENTER_SCENE),
        ]),
      );
    },
    start: true,
    timeZone: "America/Buenos_Aires",
  });

  info("\tBroadcast job started.");
  return job;
};
