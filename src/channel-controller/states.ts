import { Channel, TextChannel } from "discord.js";
import { BotConfig } from "../bot-config";
import { DatabaseConnection } from "../db-connection";
import { DiscordClient } from "../discordclient";
import { State } from "../models/state";
import { StateChannelMessage } from "../models/state-channel-message";

export async function refreshStatesChannel() {
  const channel = (await DiscordClient.instance.channels.fetch(
    BotConfig.config.statesChannel
  )) as TextChannel;

  const stateRepository = DatabaseConnection.Connection!.getRepository(State);
  const stateChannelMessageRepository = DatabaseConnection.Connection!.getRepository(
    StateChannelMessage
  );

  const statesWithoutMessages = await stateRepository
    .createQueryBuilder("states")
    .leftJoinAndSelect("states.stateChannelMessage", "stateChannelMessage")
    .where("stateChannelMessage.channelId IS NULL")
    .getMany();

  for (const s of statesWithoutMessages) {
    const message = await channel.send(
      `• ${s.name}\n\t Maire: ${s.mayor}\n\t Adjoint: ${
        s.adjoints ?? "aucun"
      }\n\t Coordonnées: (${s.coordinates.x},${
        s.coordinates.y
      })\n\t Continent: ${s.continent}`
    );

    await stateChannelMessageRepository.save(
      stateChannelMessageRepository.create({
        channelId: message.id,
        state: s,
      })
    );
  }
}
