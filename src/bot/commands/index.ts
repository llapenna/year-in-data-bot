import { Context, Telegraf } from "telegraf";
import { START } from "./start";

const commands = [START];

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

export const registerCommands = async (bot: Telegraf) => {
  // After setting this property, the bot will list all the commands
  // when the user presses the list button. It's not the same as the
  // HELP command, which is a command itself.
  await bot.telegram.setMyCommands(commands);

  commands.forEach(({ command, handler }) => {
    // Actual command + handler registration
    bot.command(command, handler);
  });

  // If we don't have a HELP command registered, set the default one
  if (!commands.find(({ command }) => command === "help")) {
    bot.help(defaultHelp);
  }
};
