import { TextChannel } from "discord.js";
import { BotConfig } from "./bot-config";
import { DiscordClient } from "./discordclient";

async function init() {
  const config = await BotConfig.init();
  await DiscordClient.init(config.token);
  const botUser = DiscordClient.instance.user!;
  
  await botUser.setActivity("Je suis au service du CIEP");
  if (botUser.username !== config.botUsername) {
    // await botUser.setUsername(config.botUsername);
  }
  await botUser.setStatus("dnd");

  // registerCronJobs();
  // console.log("bot ready");
}

init();