import { BotConfig } from "./bot-config";
import { CommandHandler } from "./commandHandler";
import { DiscordClient } from "./discordclient";

async function init() {
  const config = await BotConfig.init();
  await DiscordClient.init(config.token);
  const botUser = DiscordClient.instance.user!;
  
  await botUser.setActivity("Je suis au service du CIEP");
  if (botUser.username !== config.botUsername) {
    await botUser.setUsername(config.botUsername);
  }
  await botUser.setStatus("dnd");

  const commandHandler = new CommandHandler(DiscordClient.instance);
  await commandHandler.init();

  //helloChannel.send("I'm online !");

  DiscordClient.instance.on("message",commandHandler.handleCommand.bind(commandHandler));
}

init();