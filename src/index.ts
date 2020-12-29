import { TextChannel } from "discord.js";
import { BotConfig } from "./bot-config";
import { CommandHandler } from "./commandHandler";
import { DiscordClient } from "./discordclient";

/*
  CIEP BOT - by AmauryD
  config.json is not public, sorry :(
  I'm trying a mix of static classes and normal classes , why not
*/
async function init() {
  const config = await BotConfig.init();
  const client = await DiscordClient.init(config.token);
  const botUser = client.user!;

  await botUser.setActivity("Je suis au service du CIEP");
  if (botUser.username !== config.botUsername) {
    await botUser.setUsername(config.botUsername);
  }
  await botUser.setStatus("dnd");

  const commandHandler = new CommandHandler(client);
  await commandHandler.init();

  client.on("message", commandHandler.handleCommand.bind(commandHandler));

  console.log("I'm ready to go");
}

init();
