import { Markup } from "telegraf";
import jwt from "jsonwebtoken";

import { getUserByTelegramId } from "@/db/user";
import { Command } from "@/types/bot";
import { FRONTEND_URL, JWT_SECRET } from "@/utils/config";
import { User } from "@prisma/client";

export const getFrontendUrl = (id: User["id"]) => {
  // TODO: it'd nice to hide the id from the JWT because in the frontend one can manually set
  // the cookie. Maybe use an UUID instead of an int?
  const token = jwt.sign({ id }, JWT_SECRET);

  return `${FRONTEND_URL}/auth?jwt=${token}`;
};

export const GRAPHS: Command = {
  command: "graphs",
  handler: async (ctx) => {
    const telegramId = ctx.from?.id;
    if (!telegramId)
      return ctx.reply("An error ocurred while processing the request");

    const user = await getUserByTelegramId(telegramId);
    if (!user)
      return ctx.reply(
        "You're not registered yet! Please, use the /start command to register.",
      );

    return ctx.reply(
      "Press the button below to see the graphs.",
      Markup.inlineKeyboard([
        Markup.button.url("View your data!", getFrontendUrl(user.id)),
      ]),
    );
  },
  description: "Redirects you to the frontend to see the graphs.",
};
