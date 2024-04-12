import { Telegraf } from "telegraf";

import { BOT_TOKEN } from "@/utils/config";
import { info, error } from "@/utils/logger";

import { registerCommands } from "./commands";

/**
 * Executes cleanup tasks and stops the bot when the process receives a signal
 * @param signal NodeJS script termination signal
 * @returns Function to be called when the signal is received
 */
const handleStop = async (bot: Telegraf) => {
  // Register signal handler for both SIGINT and SIGTERM
  ["SIGINT", "SIGTERM"].forEach((signal) =>
    process.once(signal, async () => {
      try {
        info(`${signal} received, stopping bot.`);

        // Stops bot and perform cleanup
        bot.stop(signal);
        // TODO: add cleanup function in case of database

        info("Bot stopped successfully.");
      } catch (e) {
        error("An error ocurred while stopping the app!", e);
      }
    }),
  );
};

/**
 * Initializes the bot and its handlers
 * @param onStop Callback to be executed when the bot is stopped. Usually used to disconnect from the database
 */
export const start = async () => {
  // Generate instance
  const bot = new Telegraf(BOT_TOKEN);
  info("Bot created.");

  // Add event handlers and commands
  await registerCommands(bot);
  info("Bot configured.");

  bot.launch();
  info("Bot started.");

  // Add handlers to finish the bot gracefully
  handleStop(bot);
};
