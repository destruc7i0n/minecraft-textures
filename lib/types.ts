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
  /** Java tooltip text, e.g. "Strength II (01:30)"; empty if no effects. */
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
