export interface ManifestIndex {
  versions: string[];
  latestVersion: string;
}

export function createRoot(manifestIndex: ManifestIndex) {
  const textures = manifestIndex.versions;
  const versions = textures;
  const latestVersion = manifestIndex.latestVersion;
  const hasVersion = (version: string) => textures.includes(version);

  return { textures, versions, latestVersion, default: hasVersion };
}
