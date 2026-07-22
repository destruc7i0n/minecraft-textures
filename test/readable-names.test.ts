import { describe, expect, test } from 'bun:test';

import { versions } from '../index';
import { resolveDataVersion } from '../scripts/lib/data/resolver';

// 1.12 has intentional duplicate ids for the legacy array, and clay_ball only
// got its own name in 1.16
const LEGACY_VERSIONS = new Set(['1.12', '1.13', '1.14', '1.15']);

const allVersions = [...versions];

describe('readable names', () => {
  test.each(allVersions.filter((version) => !LEGACY_VERSIONS.has(version)))(
    '%s readables are unique',
    (version) => {
      const byReadable = new Map<string, string[]>();
      for (const item of resolveDataVersion(version).items) {
        byReadable.set(item.readable, [
          ...(byReadable.get(item.readable) ?? []),
          item.id,
        ]);
      }

      const duplicates = [...byReadable]
        .filter(([, ids]) => ids.length > 1)
        .map(([readable, ids]) => `${readable}: ${ids.join(', ')}`);

      expect(duplicates).toEqual([]);
    },
  );
});
