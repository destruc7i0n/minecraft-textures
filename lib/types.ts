export interface TexturesType {
  comment: string;
  items: Item[];
}

export interface TexturesTypeById {
  comment: string;
  items: {
    [id: string]: {
      readable: string;
      texture: string;
    };
  };
}

export interface Item {
  readable: string;
  id: string;
  texture: string;
}

export interface Potion extends Item {
  potion?: string;
  bedrockPotion?: string;
  /** Java effect lines at 20 ticks/second; empty for effectless potions. */
  tooltip?: string[];
}

export interface PotionTexturesType {
  comment: string;
  version: string;
  items: Potion[];
}

export type Last<T extends readonly any[]> = T extends readonly [
  ...any[],
  infer L,
]
  ? L
  : never;
