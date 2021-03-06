import { CommandAction } from "../commandHandler";
import { DatabaseConnection } from "../db-connection";
import { Law } from "../models/law";
import { askQuestion } from "../utils/ask-question";

export const commandName = "loi-categorie [add|remove]";

export const description = "[DEV]";

export const action: CommandAction = async (args, originalMessage) => {
  const repository = DatabaseConnection.Connection!.getRepository(Law);

  const subcomand = args.getString();

  if (!subcomand && !["add", "remove"].includes(subcomand ?? "")) {
    throw new Error("Veuillez renseigner un argument valide");
  }

  if (subcomand === "remove") {
    const lawNumber = args.getInt();

    if (lawNumber === null) {
      throw new Error("Vous devez renseigner le numéro de la loi à supprimer");
    }

    const category = await repository.findOne(
      { number: lawNumber },
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
        const name = await askQuestion("Numéro de la loi ?", member);
        // category. = name;
        await repository.save(category);
        await member.send("Créé avec succès ! ");
      } catch (e) {
        await member.send("La session a expiré");
      }
    }
  }

  await originalMessage.delete();
};
