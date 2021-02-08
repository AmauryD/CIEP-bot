import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  PrimaryColumn,
  Index,
} from "typeorm";
import { Continent } from "../enums/continent";

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
  adjoints!: string;

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
}
