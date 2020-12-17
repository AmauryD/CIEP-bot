import { fr } from 'date-fns/locale'
import { CommandAction } from "../commandHandler";
import sleep from "../utils/sleep";
import nextReunionDay from "../utils/next-reunion-day";
import { format, formatDistance } from 'date-fns';

export const commandName = "réunion";

export const description = "Obtenir le jour et dans combien de temps est la réunion";

export const action : CommandAction = async (args,originalMessage) => {
    const today = new Date();
    let nextReu = nextReunionDay(today);

    const interval = formatDistance(today,nextReu,{
        locale : fr
    });

    const reply = await originalMessage.reply(`\n\`\`\`📅 Le jour de la réunion est le ${format(nextReu,"EEEE",{
        locale : fr
    })} à ${format(nextReu,"kk'h'mm",{
        locale : fr
    })} !\n🕑 La prochaine réunion est dans ${interval} !\`\`\``);

    await sleep(10000);

    await reply.delete();
}