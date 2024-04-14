import { start } from "./bot";
import { disconnect } from "./database";

(async () => {
  await start(async () => {
    await disconnect();
  });
})();
