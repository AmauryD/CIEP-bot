import { CommandAction } from "../commandHandler";
import { DatabaseConnection } from "../db-connection";
import { State } from "../models/state";
import { askQuestion } from "../utils/ask-question";
import { refreshStatesChannel } from "../channel-controller/states";
import { LawCategory } from "../models/law-category";

export const commandName = "loi-categorie [add|remove]";

export const description = "[DEV]";

export const action: CommandAction = async (args, originalMessage) => {
  const repository = DatabaseConnection.Connection!.getRepository(LawCategory);

  const subcomand = args.getString();

  if (!subcomand && !["add", "remove"].includes(subcomand ?? "")) {
    throw new Error("Veuillez renseigner un argument valide");
  }

  if (subcomand === "remove") {
    const name = args.getRemaining();

    if (name === null) {
      throw new Error(
        "Vous devez renseigner le nom de la catégorie à supprimer"
      );
    }

    const category = await repository.findOne(
      { name },
      { relations: ["channelMessage"] }
    );

    if (category === undefined) {
      throw new Error("Cette catégorie n'existe pas");
    }

    await category.channelMessage.removeAssociatedMessage();
    await repository.remove(category);
  }

  if (subcomand === "add") {
    const member = originalMessage.member;
    if (member) {
      const category = repository.create();
      try {
        const name = await askQuestion("Nom de la catégorie ?", member);
        category.name = name;
        await repository.save(category);
        await member.send("Créé avec succès ! ");
      } catch (e) {
        await member.send("La session a expiré");
      }
    }
  }

  await originalMessage.delete();
};
