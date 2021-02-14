import { TextChannel } from "discord.js";
import {
  Entity,
  Column,
  BaseEntity,
  PrimaryColumn,
  Index,
  OneToOne,
  JoinColumn,
  BeforeRemove,
} from "typeorm";
import { BotConfig } from "../bot-config";
import { DiscordClient } from "../discordclient";
import { State } from "./state";

@Entity()
export class StateChannelMessage extends BaseEntity {
  @PrimaryColumn("varchar")
  channelId!: string;

  @OneToOne((type) => State, (state) => state.name, {
    primary: true,
    onDelete: "CASCADE",
  })
  @JoinColumn()
  state!: State;

  @BeforeRemove()
  async removeAssociatedMessage() {
    const channel = (await DiscordClient.instance.channels.fetch(
      BotConfig.config.statesChannel
    )) as TextChannel;
    await channel.messages.delete(await channel.messages.fetch(this.channelId));
  }
}
