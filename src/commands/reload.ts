import { BotConfig } from "../bot-config";
import { CommandAction } from "../commandHandler";
import sleep from "../utils/sleep";

export const commandName = "reload";

export const description = "Recharger la configuration";

export const action : CommandAction = async (args,originalMessage) => {
   await BotConfig.init();
   const msg = await originalMessage.channel.send("Configuration rechargée !");
   await sleep(5000);
   await msg.delete();
}