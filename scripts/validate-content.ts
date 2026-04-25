import { loadCombatDataFromJson } from "../src/lib/combat/load-data";

async function main() {
  const data = await loadCombatDataFromJson();
  console.log(
    `Validation passed: weapons=${data.weapons.length}, tagProfiles=${data.tagProfiles.length}, descriptions=${data.descriptions.length}`
  );
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
