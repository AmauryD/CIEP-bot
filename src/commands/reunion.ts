import { startOfWeek , isBefore,addWeeks  , formatDistance , format, setDay } from "date-fns";
import { BotConfig } from "../bot-config";
import { fr } from 'date-fns/locale'
import { CommandAction } from "../commandHandler";

export const commandName = "réunion";

export const description = "Obtenir le jour et dans combien de temps est la réunion";

export const action : CommandAction = async (args,originalMessage) => {
    const [day,hours,minutes] = BotConfig.config.reunionTime;

    const today = new Date();

    const startOfThisWeek = startOfWeek(today);
    let nextReunionDay = setDay(startOfThisWeek,day);
    nextReunionDay.setHours(hours);
    nextReunionDay.setMinutes(minutes);
    nextReunionDay.setSeconds(0);
    
    originalMessage.delete();

    if (isBefore(nextReunionDay,today)) {
        nextReunionDay = addWeeks(nextReunionDay,1);
    }

    const interval = formatDistance(today,nextReunionDay,{
        locale : fr
    });

    const reply = await originalMessage.reply(`\n\`\`\`📅 Le jour de la réunion est le ${format(nextReunionDay,"EEEE",{
        locale : fr
    })} à ${format(nextReunionDay,"kk'h'mm",{
        locale : fr
    })} !\n🕑 La prochaine réunion est dans ${interval} !\`\`\``);

    setTimeout(() => reply.delete(),10000);
}