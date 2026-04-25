"use server";

import { prisma } from "@/lib/prisma";

export async function deleteCharacter(id: string) {
  return prisma.character.delete({ where: { id } });
}
