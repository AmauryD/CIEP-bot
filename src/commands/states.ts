import { CommandAction } from "../commandHandler";
import sleep from "../utils/sleep";
import { DatabaseConnection } from "../db-connection";
import { State } from "../models/state";
import { askQuestion } from "../utils/ask-question";
import { refreshStatesChannel } from "../channel-controller/states";

export const commandName = "states [add|remove|list]";

export const description = "[DEV] liste des états";

export const action: CommandAction = async (args, originalMessage) => {
  const stateRepository = DatabaseConnection.Connection!.getRepository(State);

  const subcomand = args.getString();

  if (!subcomand && !["add", "remove"].includes(subcomand ?? "")) {
    throw new Error("Veuillez renseigner un argument valide");
  }

  if (subcomand === "remove") {
    const name = args.getRemaining();

    if (name === null) {
      throw new Error("Vous devez renseigner le nom de l'état à supprimer");
    }

    const state = await stateRepository.findOne(
      { name },
      { relations: ["stateChannelMessage"] }
    );

    if (state === undefined) {
      throw new Error("Cet état n'existe pas");
    }

    await state.stateChannelMessage.removeAssociatedMessage();
    await stateRepository.remove(state);

    await refreshStatesChannel();
  }

  if (subcomand === "add") {
    const member = originalMessage.member;
    if (member) {
      const state = stateRepository.create();
      try {
        const name = await askQuestion("Nom de la ville ?", member);
        state.name = name;
        const mayor = await askQuestion("Maire ?", member);
        state.mayor = mayor;
        const adjoint = await askQuestion(
          "Adjoints (mettre 'skip' si aucun) ?",
          member
        );
        state.adjoints = adjoint === "skip" ? null : adjoint;
        let coordinates = await askQuestion(
          "Coordonnées en format `x,y,z`",
          member
        );
        let [x, y, z] = coordinates.split(",");
        state.coordinates = {
          x: parseInt(x),
          y: parseInt(y),
          z: z ? parseInt(z) : 0,
        };
        const continent = await askQuestion(
          "Continent ? Olderia|Helderia|Thorondor",
          member
        );
        state.continent = continent as any;

        await stateRepository.save(state);
        await member.send("Créé avec succès ! ");
        await refreshStatesChannel();
      } catch (e) {
        await member.send("La session a expiré");
      }
    }
  }

  await originalMessage.delete();
};
