import { startOfWeek, setDay, isBefore, addWeeks } from "date-fns";
import { BotConfig } from "../bot-config";

export default (from: Date = new Date()) => {
    const [day,hours,minutes] = BotConfig.config.reunionTime;

    const startOfThisWeek = startOfWeek(from);
    let nextReunionDay = setDay(startOfThisWeek,day);
    nextReunionDay.setHours(hours);
    nextReunionDay.setMinutes(minutes);
    nextReunionDay.setSeconds(0);

    if (isBefore(nextReunionDay,from)) {
        nextReunionDay = addWeeks(nextReunionDay,1);
    }

    return nextReunionDay;
}