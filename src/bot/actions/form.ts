import { Action } from "@/types/bot";
import { FORM_WIZARD_ID } from "../form";

enum FormActions {
  ENTER_SCENE = "ENTER_SCENE",
}

export const ENTER_SCENE: Action = {
  name: FormActions.ENTER_SCENE,
  handler: async (ctx) => {
    ctx.reply("Let's start the logging process.");
    ctx.scene.enter(FORM_WIZARD_ID);
  },
};
