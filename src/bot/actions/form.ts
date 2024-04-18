import { Action } from "@/types/bot";
import { FORM_WIZARD_ID } from "../form";

export const FORM_ENTER_SCENE = "FORM_ENTER_SCENE";

export const ENTER_SCENE: Action = {
  name: FORM_ENTER_SCENE,
  handler: async (ctx) => {
    await ctx.reply("Let's start the logging process.");
    return ctx.scene.enter(FORM_WIZARD_ID);
  },
};
