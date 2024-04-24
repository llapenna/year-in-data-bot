import { Context } from "telegraf";
import { info } from "@/utils/logger";

import { bot } from "..";
import { START } from "./start";
import { RECORD } from "./record";

const commands = [START, RECORD];

/**
 * Default help command. It will list all the commands registered when no
 * other HELP command is registered.
 */
const defaultHelp = async (ctx: Context) => {
  const commands = await ctx.telegram.getMyCommands();
  const info = commands.reduce(
    (acc, val) => `${acc}/${val.command} - ${val.description}\n`,
    "",
  );

  return ctx.reply(info);
};

/**
 * Register all the commands and associated actions
 */
export const registerCommands = async () => {
  // After setting this property, the bot will list all the commands
  // when the user presses the list button. It's not the same as the
  // HELP command, which is a command itself.
  await bot.telegram.setMyCommands(commands);

  commands.forEach(({ command, handler, keyboard }) => {
    // Actual command + handler registration
    bot.command(command, handler);

    // Do the same if we have a keyboard handler
    if (keyboard) {
      keyboard.forEach(({ name, handler }) => bot.action(name, handler));
    }
  });

  info(
    `\tRegistered ${commands.length} commands and ${commands.reduce(
      (acc, { keyboard }) => acc + (keyboard?.length ?? 0),
      0,
    )} associated actions.`,
  );

  // If we don't have a HELP command registered, set the default one
  if (!commands.find(({ command }) => command === "help")) {
    bot.help(defaultHelp);
  }
};
