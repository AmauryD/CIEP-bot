import { CommandAction } from "../commandHandler";
import sleep from "../utils/sleep";
import { DatabaseConnection } from "../db-connection";
import { State } from "../models/state";
import { askQuestion } from "../utils/ask-question";
import { refreshStatesChannel } from "../channel-controller/states";
import { TextChannel } from "discord.js";
import { BotConfig } from "../bot-config";
import { DiscordClient } from "../discordclient";

export const commandName = "states [add|remove|list]";

export const description = "[DEV] liste des états";

export const action: CommandAction = async (args, originalMessage) => {
  const stateRepository = DatabaseConnection.Connection!.getRepository(State);

  const subcomand = args.getString();

  if (!subcomand && !["add", "remove", "edit"].includes(subcomand ?? "")) {
    throw new Error("Veuillez renseigner un argument valide");
  }

  if (subcomand === "remove") {
    const name = args.getRemaining();

    if (name === null) {
      throw new Error("Vous devez renseigner le nom de l'état à supprimer");
    }

    const state = await stateRepository.findOne(
      { name },
      { relations: ["channelMessage"] }
    );

    if (state === undefined) {
      throw new Error("Cet état n'existe pas");
    }

    await state.channelMessage!.removeAssociatedMessage();
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

  if (subcomand === "edit") {
    const channel = (await DiscordClient.instance.channels.fetch(
      BotConfig.config.statesChannel
    )) as TextChannel;

    const member = originalMessage.member;
    if (member) {
      const stateName = args.getRemaining();

      if (stateName === null) {
        throw new Error("Vous devez renseigner le nom de l'état à éditer");
      }

      const state = await stateRepository.findOne(
        { name: stateName },
        {
          relations: ["channelMessage"],
        }
      );

      if (!state) {
        throw new Error("L'état n'a pas été trouvé");
      }

      try {
        const name = await askQuestion(
          "Nom de la ville ? ('pass' pour passer)",
          member
        );
        state.name = name === "pass" ? state.name : name;
        const mayor = await askQuestion("Maire ?", member);
        state.mayor = mayor === "pass" ? state.mayor : mayor;
        const adjoints = await askQuestion(
          "Adjoints (mettre 'skip' si aucun) ? ('pass' pour passer)",
          member
        );
        state.adjoints = mayor === "pass" ? state.adjoints : adjoints;
        let coordinates = await askQuestion(
          "Coordonnées en format `x,y,z` ('pass' pour passer)",
          member
        );
        if (coordinates !== "pass") {
          let [x, y, z] = coordinates.split(",");
          state.coordinates = {
            x: parseInt(x),
            y: parseInt(y),
            z: z ? parseInt(z) : 0,
          };
        }
        const continent = await askQuestion(
          "Continent ? Olderia|Helderia|Thorondor ('pass' pour passer)",
          member
        );
        if (continent !== "pass") {
          state.continent = continent as any;
        }

        const messageEdit = await channel.messages.fetch(
          state.channelMessage!.channelId
        );

        await stateRepository.save(state);

        messageEdit.edit(state.formated);
        await member.send("Editée avec succès ! ");
      } catch (e) {
        await member.send("La session a expiré");
      }
    }
  }

  await originalMessage.delete();
};
