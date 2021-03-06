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
import { Law } from "./law";
import { LawCategory } from "./law-category";
import { State } from "./state";

@Entity()
export class ChannelMessage extends BaseEntity {
  @PrimaryColumn("varchar")
  channelId!: string;

  @OneToOne((type) => State, (state) => state.channelMessage, {
    onDelete: "CASCADE",
  })
  state!: State;

  @OneToOne((type) => LawCategory, (category) => category.channelMessage, {
    onDelete: "CASCADE",
  })
  lawCategory!: LawCategory;

  @OneToOne((type) => State, (law) => law.channelMessage, {
    onDelete: "CASCADE",
  })
  law!: Law;

  @BeforeRemove()
  async removeAssociatedMessage() {
    const channel = (await DiscordClient.instance.channels.fetch(
      BotConfig.config.statesChannel
    )) as TextChannel;
    try {
      await channel.messages.delete(
        await channel.messages.fetch(this.channelId)
      );
    } catch (e) {}
  }
}
