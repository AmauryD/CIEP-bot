import { CommandAction, CommandHandler } from "../commandHandler";
import path from "path";

export const commandName = "hymne [stop]";

export const description = "Hymne CIEP, la seule, la vraie";

export const action: CommandAction = async function (this: CommandHandler,argsReader,originalMessage) {
  if (!originalMessage.member?.voice.channel) {
    originalMessage.reply("Vous devez être dans un channel audio :).");
    return;
  }

  const isStop = argsReader.getString();


  if (originalMessage.guild?.me?.voice.channel) {
    if (isStop === "stop") {
      originalMessage.guild?.me?.voice.channel.leave();
    }else{
      await originalMessage.reply("Je suis déjà en train de jouer quelque chose, pour m'arrêter faites la commande suivie de stop");
    }
    return;
  }

  const voiceConnection = await originalMessage.member!.voice.channel!.join();
  const soundHandler = voiceConnection.play(path.join(process.cwd(),"/static/hymne.mp3"));
  soundHandler.on("finish", () => voiceConnection.disconnect());
}

