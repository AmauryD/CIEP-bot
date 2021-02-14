import {
  Entity,
  Column,
  BaseEntity,
  PrimaryColumn,
  Index,
  OneToOne,
} from "typeorm";
import { Continent } from "../enums/continent";
import { StateChannelMessage } from "./state-channel-message";

@Entity()
export class State extends BaseEntity {
  @PrimaryColumn("varchar")
  name!: string;

  @Index()
  @Column("varchar", {
    nullable: false,
  })
  mayor!: string;

  @Column("varchar", {
    nullable: true,
  })
  adjoints!: string | null;

  @Column("simple-json", {
    nullable: false,
  })
  coordinates!: {
    x: number;
    y: number;
    z?: number;
  };

  @Column("enum", {
    enum: Continent,
    default: Continent.Olderia,
    nullable: false,
  })
  continent!: Continent;

  @OneToOne((type) => StateChannelMessage, (state) => state.state)
  stateChannelMessage!: StateChannelMessage;
}
