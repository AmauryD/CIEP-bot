import { CommandAction } from "../commandHandler";
import sleep from "../utils/sleep";
import { DatabaseConnection } from "../db-connection";
import { State } from "../models/state";

export const commandName = "states";

export const description = "[DEV] liste des états";

export const action: CommandAction = async (args, originalMessage) => {
  const states = await DatabaseConnection.Connection!.getRepository(
    State
  ).find();

  const reply = await originalMessage.reply(
    `\n\`\`\`${states
      .map((s) => {
        return `• ${s.name}\n\t Maire: ${s.mayor}\n\t Adjoint: ${
          s.adjoints ?? "aucun"
        }\n\t Coordonnées: (${s.coordinates.x},${
          s.coordinates.y
        })\n\t Continent: ${s.continent}`;
      })
      .join("\n")}\`\`\``
  );

  await sleep(10000);

  await originalMessage.delete();
  await reply.delete();
};
