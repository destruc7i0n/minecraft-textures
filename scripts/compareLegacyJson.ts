import {
  createLegacyIdJson,
  createLegacyJson,
  createLegacyJsonById,
} from './lib/data/legacy';
import { resolveDataVersion } from './lib/data/resolver';
import { discoverDataVersions } from './lib/data/versions';

const baseline = process.env.BASELINE_DIST;
if (!baseline) {
  throw new Error('Set BASELINE_DIST to the pre-migration dist directory');
}

const baselineJsonDir = `${baseline}/textures/json`;

let jsonDiffs = 0;
let idJsonDiffs = 0;
let intentionalByIdCorrections = 0;

for (const version of discoverDataVersions()) {
  const resolved = resolveDataVersion(version);
  const legacyFile = `${version}.json`;
  const baselineLegacyJson = await Bun.file(
    `${baselineJsonDir}/${legacyFile}`,
  ).json();
  const currentLegacyJson = await createLegacyJson(resolved);

  if (
    JSON.stringify(baselineLegacyJson) !== JSON.stringify(currentLegacyJson)
  ) {
    jsonDiffs++;
    const baselineItems = baselineLegacyJson.items as unknown[];
    const currentItems = currentLegacyJson.items as unknown[];
    let firstDiff = -1;
    for (
      let index = 0;
      index < Math.max(baselineItems.length, currentItems.length);
      index++
    ) {
      if (
        JSON.stringify(baselineItems[index]) !==
        JSON.stringify(currentItems[index])
      ) {
        firstDiff = index;
        break;
      }
    }
    console.log(
      `${legacyFile}: oldLength=${baselineItems.length} newLength=${currentItems.length} firstDiff=${firstDiff}`,
    );
  }

  const idFile = `${version}.id.json`;
  const baselineIdJson = await Bun.file(`${baselineJsonDir}/${idFile}`).json();
  const expectedIdJson = createLegacyJsonById(baselineLegacyJson);
  const currentIdJson = await createLegacyIdJson(resolved);
  const diff = diffByIdJson(expectedIdJson.items, currentIdJson.items);

  if (
    expectedIdJson.comment !== currentIdJson.comment ||
    diff.missing.length ||
    diff.extra.length ||
    diff.changed.length
  ) {
    jsonDiffs++;
    idJsonDiffs++;
    console.log(
      `${idFile}: missing=${diff.missing.length} extra=${diff.extra.length} changed=${diff.changed.length}`,
    );
    if (diff.missing[0]) console.log(`  first missing: ${diff.missing[0]}`);
    if (diff.extra[0]) console.log(`  first extra: ${diff.extra[0]}`);
    if (diff.changed[0]) console.log(`  first changed: ${diff.changed[0]}`);
  }

  const correctionDiff = diffByIdJson(
    baselineIdJson.items,
    expectedIdJson.items,
  );
  if (
    baselineIdJson.comment !== expectedIdJson.comment ||
    correctionDiff.missing.length ||
    correctionDiff.extra.length ||
    correctionDiff.changed.length
  ) {
    intentionalByIdCorrections++;
  }
}

console.log(`JSON diffs: ${jsonDiffs}`);
console.log(`.id.json diffs: ${idJsonDiffs}`);
console.log(`Intentional .id.json corrections: ${intentionalByIdCorrections}`);

if (jsonDiffs > 0) {
  process.exit(1);
}

function diffByIdJson(
  baselineItems: Record<string, unknown>,
  currentItems: Record<string, unknown>,
) {
  const baselineKeys = Object.keys(baselineItems);
  const currentKeys = Object.keys(currentItems);
  const missing = baselineKeys.filter((key) => !(key in currentItems));
  const extra = currentKeys.filter((key) => !(key in baselineItems));
  const changed = baselineKeys.filter(
    (key) =>
      key in currentItems &&
      JSON.stringify(baselineItems[key]) !== JSON.stringify(currentItems[key]),
  );

  return { missing, extra, changed };
}
