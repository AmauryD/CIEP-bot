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

  const listenChannel = (await client.channels.fetch(
    BotConfig.getKey("commandChannel")
  )) as TextChannel;

  client.on("message", (message) => {
    if (message.channel.id === listenChannel.id) {
      commandHandler.handleCommand.bind(commandHandler)(message);
    }
  });

  // await listenChannel.send(
  //   `Bonjour ! Je suis en ligne !\nN'hésitez pas à m'appeler si vous avez besoin de ${BotConfig.getKey(
  //     "commandPrefix"
  //   )}help`
  // );

  console.log("I'm ready to go");
}

init();
