"use server";

import { prisma } from "@/lib/prisma";
import { characterSchema } from "@/lib/combat/schemas";

export async function saveCharacter(rawCharacter: unknown) {
  const character = characterSchema.parse(rawCharacter);

  if (character.id) {
    return prisma.character.update({
      where: { id: character.id },
      data: {
        name: character.name,
        attackAttribute: character.attackAttribute,
        primaryWeaponSlug: character.primaryWeaponSlug,
        primaryMode: character.primaryMode,
        secondaryWeaponSlug: character.secondaryWeaponSlug,
        secondaryMode: character.secondaryMode
      }
    });
  }

  return prisma.character.create({
    data: {
      userId: character.userId,
      name: character.name,
      attackAttribute: character.attackAttribute,
      primaryWeaponSlug: character.primaryWeaponSlug,
      primaryMode: character.primaryMode,
      secondaryWeaponSlug: character.secondaryWeaponSlug,
      secondaryMode: character.secondaryMode
    }
  });
}
