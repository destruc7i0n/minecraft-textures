import { addMetadata } from 'meta-png';

const PNG_DATA_URL_PREFIX = 'data:image/png;base64,';

export const DIST_PNG_METADATA = {
  Software: 'minecraft-textures',
  Source: 'https://github.com/destruc7i0n/minecraft-textures',
} as const;

export function pngBytesToDataUrl(bytes: Uint8Array): string {
  return `${PNG_DATA_URL_PREFIX}${Buffer.from(bytes).toString('base64')}`;
}

export async function pngToDataUrl(filePath: string): Promise<string> {
  const bytes = await Bun.file(filePath).bytes();
  return pngBytesToDataUrl(bytes);
}

export function addPngTextMetadata(
  bytes: Uint8Array,
  metadata: Record<string, string>,
): Uint8Array {
  let output = bytes;
  for (const [keyword, value] of Object.entries(metadata)) {
    output = addMetadata(output, keyword, value);
  }

  return output;
}
