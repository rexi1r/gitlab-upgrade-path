import flux from "@aust/react-flux";
import BackgroundMigrations from "util/background_migrations";

function initialSettings() {
  return {
    index: BackgroundMigrations,
  };
}

const store = flux.addStore("backgroundMigrations", initialSettings());

// Selector to get migrations between versions
store.addSelector("list", (state, current, target) => {
  if (!current || !target) return [];

  const fromFloat = parseFloat(current.version);
  const toFloat = parseFloat(target.version);

  const filtered = [];

  Object.entries(BackgroundMigrations).forEach(([milestone, migrationList]) => {
    const milestoneFloat = parseFloat(milestone);
    if (milestoneFloat > fromFloat && milestoneFloat <= toFloat) {
      migrationList.forEach(migration => {
        filtered.push({ ...migration, milestone });
      });
    }
  });

  return filtered.sort((a, b) => parseFloat(a.milestone) - parseFloat(b.milestone));
});

// Selector for warning count
store.addSelector("warningCount", (state, current, target) => {
  const migrations = store.selectState("list", current, target);
  return migrations.reduce((count, migration) =>
    count + migration.warnings.length, 0
  );
});
