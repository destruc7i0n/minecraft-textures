export interface DataItem {
  id: string;
  readable: string;
  texture: string;
}

export type DataVersionFile<T extends DataItem = DataItem> =
  | {
      version: string;
      items: T[];
      extends?: never;
      add?: never;
      update?: never;
      remove?: never;
      order?: string[];
    }
  | {
      version: string;
      extends: string;
      add?: T[];
      update?: Record<string, Partial<T>>;
      remove?: string[];
      order?: string[];
    };

export type ResolvedItem<T extends DataItem = DataItem> = T & {
  dataTexturePath: string;
};

export interface ResolvedVersion<T extends DataItem = DataItem> {
  version: string;
  extends?: string;
  ancestry: string[];
  items: ResolvedItem<T>[];
}

export interface TextureManifest {
  comment: string;
  version: string;
  items: TextureManifestItem[];
}

export interface TextureManifestItem {
  id: string;
  readable: string;
  texture: string;
}
