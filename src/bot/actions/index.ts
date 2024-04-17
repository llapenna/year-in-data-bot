import { info } from "@/utils/logger";
import { bot } from "..";
import { ENTER_SCENE } from "./form";

const actions = [ENTER_SCENE];

/**
 * Register all the actions
 */
export const registerActions = async () => {
  actions.forEach(({ name, handler }) => bot.action(name, handler));
  info(`\tRegistered ${actions.length} actions.`);
};
