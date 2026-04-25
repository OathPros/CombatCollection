"use server";

import { rollInputSchema } from "@/lib/combat/schemas";
import { loadCombatData } from "@/lib/combat/load-data";
import { rollDescriptions } from "@/lib/combat/filtering";

export async function rollAttack(rawInput: unknown) {
  const input = rollInputSchema.parse(rawInput);
  const data = await loadCombatData();
  return rollDescriptions(input, data);
}
