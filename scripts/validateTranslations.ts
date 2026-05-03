import * as core from '@actions/core';

import { resolveDataVersion } from './lib/data/resolver';
import { discoverDataVersions } from './lib/data/versions';
import { getTranslationFromId } from './lib/translations';

const main = async () => {
  const latestVersion = discoverDataVersions().at(-1);
  if (!latestVersion) throw new Error('No data versions found');

  const latest = resolveDataVersion(latestVersion);
  const invalid: Record<string, { current: string; expected: string }> = {};

  for (const item of latest.items) {
    const translationData = await getTranslationFromId(item.id);

    if (!translationData) {
      console.log(`Could not find translation for ${item.id}`);
      continue;
    }

    const { readable: translation } = translationData;

    if (translation !== item.readable) {
      if (translation === 'Music Disc') continue;
      if (translation === 'Banner Pattern') continue;
      if (translation === 'Disc Fragment') continue;
      if (translation === 'Smithing Template') continue;

      invalid[item.id] = {
        current: item.readable,
        expected: translation,
      };
    }
  }

  const invalidCount = Object.keys(invalid).length;
  if (invalidCount === 0) return;

  const message = `Found ${invalidCount} invalid translations.`;
  console.log(message);
  console.log(JSON.stringify(invalid, null, 2));

  if (process.env.GITHUB_ACTIONS) {
    core.error(message);
  }

  process.exit(1);
};

main();
