import { Connection, createConnection } from "typeorm";
import { State } from "./models/state";

export class DatabaseConnection {
  private static _connection: Connection | null = null;

  public static get Connection() {
    return this._connection;
  }

  public static async connect() {
    return (this._connection = await createConnection({
      type: "mysql",
      port: 3306,
      host: "us-cdbr-east-03.cleardb.com",
      username: "b390f81023d4d3",
      password: "c8a2dc97",
      database: "heroku_d9e52cf6d1d0619",
      entities: [State],
      synchronize: true,
    }));
  }
}
