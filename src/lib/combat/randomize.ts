import type { CombatDescription } from "@/lib/combat/types";

export function weightedSampleUnique(items: CombatDescription[], count: number): CombatDescription[] {
  const pool = [...items];
  const picked: CombatDescription[] = [];
  const target = Math.min(count, pool.length);

  while (picked.length < target && pool.length > 0) {
    const total = pool.reduce((sum, item) => sum + Math.max(1, item.weight), 0);
    let random = Math.random() * total;
    let index = 0;

    for (let i = 0; i < pool.length; i += 1) {
      random -= Math.max(1, pool[i].weight);
      if (random <= 0) {
        index = i;
        break;
      }
    }

    picked.push(pool[index]);
    pool.splice(index, 1);
  }

  return picked;
}
