import fetch from 'node-fetch';

import { LANG_FILE } from './mcmeta';
import { TextureType } from './types';

const globalLang = global as unknown as { lang: Record<string, string> };

export const getLang = async () => {
  if (globalLang.lang) return globalLang.lang;

  const lang = (await (await fetch(LANG_FILE)).json()) as Record<
    string,
    string
  >;
  globalLang.lang = lang;
  return lang;
};

export const getTranslationFromId = async (id: string) => {
  const lang = await getLang();

  if (id.startsWith('minecraft:')) id = id.replace('minecraft:', '');
  const translationKey = `minecraft.${id}`;
  if (lang[`block.${translationKey}`]) {
    return {
      type: TextureType.BLOCK,
      readable: lang[`block.${translationKey}`],
    };
  } else if (lang[`item.${translationKey}`]) {
    return {
      type: TextureType.ITEM,
      readable: lang[`item.${translationKey}`],
    };
  }
};
