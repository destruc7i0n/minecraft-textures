import { langFile } from './mcmeta';

const langCache = new Map<string, Record<string, string>>();

export const getLang = async (
  version?: string,
): Promise<Record<string, string>> => {
  const url = langFile(version);
  const cached = langCache.get(url);
  if (cached) return cached;

  const response = await fetch(url);
  // unreleased versions have no tag yet, the branch is all there is
  if (!response.ok && version) {
    console.warn(
      `No mcmeta lang tag for ${version}; falling back to the latest release.`,
    );
    return getLang();
  }
  if (!response.ok) {
    throw new Error(`Could not fetch ${url}: ${response.status}`);
  }

  const lang = (await response.json()) as Record<string, string>;
  langCache.set(url, lang);
  return lang;
};

export const getVanillaName = async (
  id: string,
  version?: string,
): Promise<string | undefined> => {
  const lang = await getLang(version);
  const key = `minecraft.${id.replace(/^minecraft:/, '')}`;
  return lang[`block.${key}`] ?? lang[`item.${key}`];
};
