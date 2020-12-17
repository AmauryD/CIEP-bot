import { BotConfig } from "../bot-config";
import { CommandAction, CommandHandler } from "../commandHandler";
import sleep from "../utils/sleep";

export const commandName = "help";

export const description = "Obtenir de l'aide";

export const action : CommandAction = async function(this: CommandHandler,args,originalMessage) {
    const reply = await originalMessage.reply(`\n\`\`\`${Object.values(this._commands).map((mod) => {
        return `• ${BotConfig.config.commandPrefix}${mod.commandName}\n\t- ${mod.description}`
    }).join("\n")}\`\`\``);

    await sleep(10000);

    await originalMessage.delete();
    await reply.delete();
}