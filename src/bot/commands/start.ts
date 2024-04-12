import { Command } from "@/types/bot";

export const START: Command = {
  command: "start",
  description: "Start command",
  handler: (ctx) => {
    ctx.reply("Hello! I am a bot!");
  },
};
