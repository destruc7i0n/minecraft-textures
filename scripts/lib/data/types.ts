export interface DataItem {
  id: string;
  readable: string;
  texture: string;
}

export type DataVersionFile =
  | {
      version: string;
      items: DataItem[];
      extends?: never;
      add?: never;
      update?: never;
      remove?: never;
      order?: string[];
    }
  | {
      version: string;
      extends: string;
      add?: DataItem[];
      update?: Record<string, Partial<DataItem>>;
      remove?: string[];
      order?: string[];
    };

export interface ResolvedItem {
  id: string;
  readable: string;
  texture: string;
  dataTexturePath: string;
}

export interface ResolvedVersion {
  version: string;
  extends?: string;
  ancestry: string[];
  items: ResolvedItem[];
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
