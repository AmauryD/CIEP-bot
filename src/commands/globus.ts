import { GuildMember, Message } from "discord.js";
import { CommandAction, CommandHandler } from "../commandHandler";
import sleep from "../utils/sleep";

export const commandName = "globus";

export const description = "Avoir ou retirer le rôle globus";

export const action: CommandAction = async function (
  this: CommandHandler,
  args,
  originalMessage
) {
  let role = originalMessage.guild!.roles.cache.find(
    (r) => r.name === "Globus"
  );

  if (role && originalMessage.member) {
    let message: Message;
    const member: GuildMember = originalMessage.member;
    if (member.roles.cache.has(role.id)) {
      await member.roles.remove(role);
      message = await originalMessage.reply("🗲 Rôle retiré");
    } else {
      await member.roles.add(role);
      message = await originalMessage.reply("🗲 Rôle ajouté");
    }

    await sleep(5000);

    await message.delete();
    await originalMessage.delete();
  }
};
