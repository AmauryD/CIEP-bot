import {
  Entity,
  Column,
  BaseEntity,
  PrimaryColumn,
  Index,
  OneToOne,
  JoinColumn,
} from "typeorm";
import { Continent } from "../enums/continent";
import { ChannelMessage } from "./channel-message";

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

  @OneToOne((type) => ChannelMessage, (state) => state.state, {
    nullable: true,
    onDelete: "SET NULL",
  })
  @JoinColumn()
  channelMessage!: ChannelMessage | null;

  get formated() {
    return `• ${this.name}\n\t Maire: ${this.mayor}\n\t Adjoint: ${
      this.adjoints ?? "aucun"
    }\n\t Coordonnées: (${this.coordinates.x},${
      this.coordinates.y
    })\n\t Continent: ${this.continent}`;
  }
}
