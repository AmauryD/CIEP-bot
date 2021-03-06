import { Channel, TextChannel } from "discord.js";
import { BotConfig } from "../bot-config";
import { DatabaseConnection } from "../db-connection";
import { DiscordClient } from "../discordclient";
import { ChannelMessage } from "../models/channel-message";
import { State } from "../models/state";

export async function refreshStatesChannel() {
  const channel = (await DiscordClient.instance.channels.fetch(
    BotConfig.config.statesChannel
  )) as TextChannel;

  const stateRepository = DatabaseConnection.Connection!.getRepository(State);
  const stateChannelMessageRepository = DatabaseConnection.Connection!.getRepository(
    ChannelMessage
  );

  const statesWithMessages = await stateRepository
    .createQueryBuilder("states")
    .leftJoinAndSelect("states.channelMessage", "stateChannelMessage")
    .where("stateChannelMessage.channelId IS NOT NULL")
    .getMany();

  for (const sMsg of statesWithMessages) {
    const channelMessage = sMsg.channelMessage!;
    try {
      await channel.messages.fetch(channelMessage.channelId);
    } catch (e) {
      await DatabaseConnection.Connection!.getRepository(ChannelMessage).remove(
        channelMessage
      );
    }
  }

  const statesWithoutMessages = await stateRepository
    .createQueryBuilder("states")
    .leftJoinAndSelect("states.channelMessage", "stateChannelMessage")
    .where("stateChannelMessage.channelId IS NULL")
    .getMany();

  for (const s of statesWithoutMessages) {
    const message = await channel.send(s.formated);

    await stateChannelMessageRepository.save(
      stateChannelMessageRepository.create({
        channelId: message.id,
        state: s,
      })
    );
  }
}
