import { Scenes, Telegraf, session } from "telegraf";

import { BOT_TOKEN } from "@/utils/config";
import { info, error } from "@/utils/logger";

import { registerCommands } from "./commands";
import { startBroadcastJob } from "./broadcast";
import { stage } from "./form";
import { registerActions } from "./actions";

/**
 * Bot instance. Should not be used directly.
 */
export const bot = new Telegraf<Scenes.WizardContext>(BOT_TOKEN);

type OnStopCallback = () => Promise<void>;

/**
 * Executes cleanup tasks and stops the bot when the process receives a signal
 * @param signal NodeJS script termination signal
 * @returns Function to be called when the signal is received
 */
const handleStop = async (onStop?: OnStopCallback) => {
  // Register signal handler for both SIGINT and SIGTERM
  ["SIGINT", "SIGTERM"].forEach((signal) =>
    process.once(signal, async () => {
      try {
        info(`${signal} received, stopping bot.`);

        // Stops bot and perform cleanup
        bot.stop(signal);
        await onStop?.();

        info("Bot stopped successfully.");
      } catch (e) {
        error("An error ocurred while stopping the app!", e);
      }
    }),
  );
};

/**
 * Initializes the bot and its handlers
 * @param onStop Callback to be executed when the bot is stopped. Usually used to perform cleanup
 */
export const start = async (onStop?: OnStopCallback) => {
  // Add event handlers and commands
  info("Configuring bot...");

  // Attach middlewares
  bot.use(session());
  bot.use(stage.middleware());

  // Register commands and actions
  await registerCommands();
  await registerActions();
  // Also start the CRON job for broadcasting the message to log values
  const job = startBroadcastJob();

  bot.launch();
  info("Bot started.");

  // Add handlers to finish the bot gracefully
  handleStop(async () => {
    job.stop();
    await onStop?.();
  });
};
