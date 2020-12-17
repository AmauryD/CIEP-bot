import {
    CronJob
} from "cron";
import {
    TextChannel
} from "discord.js";
import {
    DiscordClient
} from "./discordclient";
import {
    differenceInMinutes
} from "date-fns";
import {
    BotConfig
} from "./bot-config";



const sendReminder = async () => {
    const actualDate = new Date();
    const reunionDate = new Date();
    const [day, hours, minutes] = BotConfig.config.reunionTime;
    reunionDate.setHours(hours, minutes, 0, 0);
    const diff = differenceInMinutes(reunionDate, actualDate);

    if (actualDate.getDay() !== day) {
        console.log("not the day");
        return;
    }

    const channel = await DiscordClient.instance.channels.fetch(BotConfig.config.reunionTagChannelId) as TextChannel;
    const tags = `${BotConfig.config.reunionTagRolesIds.map((id) => `<@&${id}>`).join(" ")}`;
    let message;

    switch (diff) {
        case 30:
            message = "Réunion dans 30 minutes !";
            break;
        case 10:
            message = "Réunion dans 15 minutes !";
            break;
        case 0:
            message = "Réunion imminente !";
            break;
    }

    if (message) {
        await channel.send(`${tags}\n${message}`);
    }
}

export default function registerCronJobs() {
    const [reunionDay] = BotConfig.config.reunionTime;
    const jobs = [{
        time: `* * * * *`,
        function: sendReminder
    }];

    for (const job of jobs) {
        new CronJob(job.time, job.function, null, true, 'Europe/Brussels').start();
    }

}