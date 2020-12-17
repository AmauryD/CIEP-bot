import { CommandAction, CommandHandler } from "../commandHandler";

export const commandName = "helpCIEP";

export const description = "Obtenir de l'aide";

export const action : CommandAction = async function(this: CommandHandler,args,originalMessage) {
    const reply = await originalMessage.reply(`\n\`\`\`${Object.values(this._commands).map((mod) => {
        return `• !${mod.commandName}\n\t- ${mod.description}`
    }).join("\n")}\`\`\``);

    setTimeout(() => originalMessage.delete(),10000);
    setTimeout(() => reply.delete(),10000);
}