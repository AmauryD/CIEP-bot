import { CommandAction, CommandHandler } from "../commandHandler";
import path from "path";

export const commandName = "music";

export const description = "Musique maestro";

export const action: CommandAction = async function (this: CommandHandler,args,originalMessage) {
  if (!originalMessage.member?.voice.channel) {
    originalMessage.reply("You must be in a voice channel.");
    return;
  }
  if (originalMessage.guild?.me?.voice.channel) {
    originalMessage.reply("I'm already playing.");
    return;
  }

  const voiceConnection = await originalMessage.member!.voice.channel!.join();
  const soundHandler = voiceConnection.play(path.join(process.cwd(),"/static/hymne.mp3"));
  soundHandler.on("finish", () => voiceConnection.disconnect());
}

