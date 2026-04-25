import { readFile } from "node:fs/promises";
import path from "node:path";
import { PrismaClient } from "@prisma/client";
import { validateCombatData } from "../src/lib/combat/validation";

const prisma = new PrismaClient();

async function readJson(file: string) {
  const raw = await readFile(file, "utf8");
  return JSON.parse(raw) as unknown;
}

async function main() {
  const dataDir = path.join(process.cwd(), "data");
  const [weaponsRaw, profilesRaw, descriptionsRaw] = await Promise.all([
    readJson(path.join(dataDir, "weapons.json")),
    readJson(path.join(dataDir, "tagProfiles.json")),
    readJson(path.join(dataDir, "descriptions.json"))
  ]);

  const { weapons, tagProfiles, descriptions } = validateCombatData({
    weapons: weaponsRaw,
    tagProfiles: profilesRaw,
    descriptions: descriptionsRaw
  });

  for (const weapon of weapons) {
    await prisma.weapon.upsert({
      where: { slug: weapon.slug },
      update: weapon,
      create: weapon
    });
  }

  for (const profile of tagProfiles) {
    await prisma.tagProfile.upsert({
      where: { id: profile.id },
      update: profile,
      create: profile
    });
  }

  for (const description of descriptions) {
    await prisma.combatDescription.upsert({
      where: { id: description.id },
      update: description,
      create: description
    });
  }

  console.log(
    `Seed complete: weapons=${weapons.length}, tagProfiles=${tagProfiles.length}, descriptions=${descriptions.length}`
  );
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
