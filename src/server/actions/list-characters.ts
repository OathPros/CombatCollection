"use server";

import { prisma } from "@/lib/prisma";

export async function listCharacters() {
  return prisma.character.findMany({ orderBy: { updatedAt: "desc" } });
}
