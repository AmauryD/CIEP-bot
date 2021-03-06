import {
  Entity,
  BaseEntity,
  PrimaryColumn,
  OneToMany,
  JoinColumn,
  OneToOne,
} from "typeorm";
import { ChannelMessage } from "./channel-message";
import { Law } from "./law";

@Entity()
export class LawCategory extends BaseEntity {
  @PrimaryColumn("varchar")
  name!: string;

  @OneToOne((type) => ChannelMessage, (message) => message.lawCategory, {
    nullable: true,
  })
  @JoinColumn()
  channelMessage!: ChannelMessage;

  @OneToMany((type) => Law, (law) => law.category)
  laws!: Law[];
}
