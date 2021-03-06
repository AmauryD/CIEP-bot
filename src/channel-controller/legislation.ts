import { Channel, TextChannel } from "discord.js";
import { BotConfig } from "../bot-config";
import { DatabaseConnection } from "../db-connection";
import { DiscordClient } from "../discordclient";
import { State } from "../models/state";

export async function refreshStatesChannel() {
  const channel = (await DiscordClient.instance.channels.fetch(
    BotConfig.config.statesChannel
  )) as TextChannel;
}
