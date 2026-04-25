import { readFile } from "node:fs/promises";
import path from "node:path";
import { prisma } from "@/lib/prisma";
import { formatZodError, validateCombatData } from "@/lib/combat/validation";
import { ZodError } from "zod";
import type { LoadedCombatData } from "@/lib/combat/types";

async function readJsonFile<T>(filePath: string): Promise<T> {
  const raw = await readFile(filePath, "utf-8");
  return JSON.parse(raw) as T;
}

export async function loadCombatDataFromJson(): Promise<LoadedCombatData> {
  const base = path.join(process.cwd(), "data");

  try {
    const [weapons, tagProfiles, descriptions] = await Promise.all([
      readJsonFile<unknown>(path.join(base, "weapons.json")),
      readJsonFile<unknown>(path.join(base, "tagProfiles.json")),
      readJsonFile<unknown>(path.join(base, "descriptions.json"))
    ]);
    return validateCombatData({ weapons, tagProfiles, descriptions });
  } catch (error) {
    if (error instanceof ZodError) {
      throw new Error(formatZodError(error, "content"));
    }
    throw error;
  }
}

export async function loadCombatData(): Promise<LoadedCombatData> {
  const [dbWeapons, dbProfiles, dbDescriptions] = await Promise.all([
    prisma.weapon.findMany(),
    prisma.tagProfile.findMany(),
    prisma.combatDescription.findMany()
  ]);

  if (dbWeapons.length || dbProfiles.length || dbDescriptions.length) {
    return validateCombatData({
      weapons: dbWeapons,
      tagProfiles: dbProfiles,
      descriptions: dbDescriptions
    });
  }

  return loadCombatDataFromJson();
}
