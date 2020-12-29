import { promises as fs } from "fs";

export interface BotConfigObject {
  token: string;
  reunionTime: [number, number, number];
  reunionTagRolesIds: string[];
  reunionTagChannelId: string;
  botUsername: string;
  commandPrefix: string;
  commandChannel: string;
}

export class BotConfig {
  private static _config: BotConfigObject;

  public static get config() {
    if (BotConfig._config === undefined) {
      throw new Error("Config is not loaded yet");
    }
    return BotConfig._config;
  }

  public static getKey(key: keyof BotConfigObject): any {
    return BotConfig._config[key];
  }

  public static async init(): Promise<BotConfigObject> {
    return (BotConfig._config = JSON.parse(
      await fs.readFile("./config.json", "utf-8")
    ));
  }
}
