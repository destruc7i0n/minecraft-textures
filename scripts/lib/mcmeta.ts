const MCMETA = 'https://raw.githubusercontent.com/misode/mcmeta';

const VERSION_FILE = `${MCMETA}/registries/version.json`;
const ITEMS_FILE = `${MCMETA}/registries/item/data.json`; // no minecraft: prefix

const ITEM_UVMAP_FILE = `${MCMETA}/atlas/items/data.min.json`;
const ITEM_ATLAS_FILE = `${MCMETA}/atlas/items/atlas.png`;

// the branch is whatever shipped last, snapshots included; pass a version to
// pin to that release
const langFile = (version?: string) =>
  `${MCMETA}/${version ? `${version}-assets` : 'assets'}/assets/minecraft/lang/en_us.json`;

export { VERSION_FILE, ITEMS_FILE, ITEM_UVMAP_FILE, ITEM_ATLAS_FILE, langFile };
