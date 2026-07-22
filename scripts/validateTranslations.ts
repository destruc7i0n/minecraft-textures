import * as core from '@actions/core';

import { latestVersion } from '../index';
import { resolveDataVersion } from './lib/data/resolver';
import { getVanillaName } from './lib/translations';

const main = async () => {
  const { items } = resolveDataVersion(latestVersion);

  const vanillaNames = new Map<string, string>();
  const usageCount = new Map<string, number>();

  for (const item of items) {
    const vanilla = await getVanillaName(item.id, latestVersion);

    if (!vanilla) {
      console.log(`Could not find translation for ${item.id}`);
      continue;
    }

    vanillaNames.set(item.id, vanilla);
    usageCount.set(vanilla, (usageCount.get(vanilla) ?? 0) + 1);
  }

  const mismatched: Record<string, { current: string; expected: string }> = {};
  const indistinguishable: Record<string, string> = {};

  for (const item of items) {
    const vanilla = vanillaNames.get(item.id);
    if (!vanilla) continue;

    // a name shared by more than one item is a family label (every disc is
    // just "Music Disc"), and only the tooltip says which one it is
    if ((usageCount.get(vanilla) ?? 0) > 1) {
      if (item.readable === vanilla) indistinguishable[item.id] = vanilla;
    } else if (item.readable !== vanilla) {
      mismatched[item.id] = { current: item.readable, expected: vanilla };
    }
  }

  const mismatchedCount = Object.keys(mismatched).length;
  const indistinguishableCount = Object.keys(indistinguishable).length;
  if (mismatchedCount === 0 && indistinguishableCount === 0) return;

  const messages: string[] = [];

  if (mismatchedCount > 0) {
    messages.push(`Found ${mismatchedCount} readables that no longer match.`);
    console.log(messages.at(-1));
    console.log(JSON.stringify(mismatched, null, 2));
  }

  if (indistinguishableCount > 0) {
    messages.push(
      `Found ${indistinguishableCount} readables left on a shared name. Give each a distinguishing name.`,
    );
    console.log(messages.at(-1));
    console.log(JSON.stringify(indistinguishable, null, 2));
  }

  if (process.env.GITHUB_ACTIONS) {
    core.error(messages.join(' '));
  }

  process.exit(1);
};

main();
