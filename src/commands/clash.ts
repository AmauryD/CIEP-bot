import { BotConfig } from "../bot-config";
import { CommandAction, CommandHandler } from "../commandHandler";
import sleep from "../utils/sleep";

export const commandName = "clash";

export const description = "Clash baudoin";

const clashes = [
  "T gros",
  "C où la réunion ?",
  "Comment va ton église ?",
  "Représentant de quoi déjà ?",
];

export const action: CommandAction = async function (
  this: CommandHandler,
  args,
  originalMessage
) {
  const reply = await originalMessage.channel.send(
    "<@293518052106960897> " +
      clashes[Math.floor(Math.random() * clashes.length)]
  );

  await originalMessage.delete();
};
