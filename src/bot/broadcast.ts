import { Convenience } from "telegraf/types";
import { CronJob } from "cron";

import { getAllNotifiableUsers } from "@/db/user";
import { BROADCAST_SCHEDULE } from "@/utils/config";
import { info } from "@/utils/logger";

import { bot } from ".";

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
      info("Should broadcast messages.");
      // TODO: add message with button to initiate the recording
      // ctx.scene.enter(...)
    },
    start: true,
    timeZone: "America/Buenos_Aires",
  });

  return job;
};
