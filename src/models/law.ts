import {
  Entity,
  Column,
  BaseEntity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  OneToOne,
} from "typeorm";
import { ChannelMessage } from "./channel-message";
import { LawCategory } from "./law-category";

@Entity()
export class Law extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column("integer", {
    nullable: false,
  })
  number!: number;

  @Column("varchar", {
    nullable: false,
    length: 2000,
  })
  text!: string;

  @OneToOne((type) => ChannelMessage, (message) => message.law, {
    nullable: true,
  })
  @JoinColumn()
  channelMessage!: ChannelMessage;

  @ManyToOne((type) => LawCategory, (category) => category.laws, {
    nullable: false,
  })
  category!: LawCategory;
}
