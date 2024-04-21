import { Command } from "@/types/bot";
import { FORM_WIZARD_ID } from "../form";

export const RECORD: Command = {
  command: "record",
  description: "Record data now.",
  handler: async (ctx) => {
    return ctx.scene.enter(FORM_WIZARD_ID);
  },
};
