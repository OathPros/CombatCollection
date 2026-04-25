"use server";

import { prisma } from "@/lib/prisma";

export async function listCharacters() {
  if (!process.env.DATABASE_URL) {
    return [];
  }

  try {
    return prisma.character.findMany({ orderBy: { updatedAt: "desc" } });
  } catch {
    return [];
  }
}
