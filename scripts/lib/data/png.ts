const PNG_DATA_URL_PREFIX = 'data:image/png;base64,';

export function pngBytesToDataUrl(bytes: Uint8Array): string {
  return `${PNG_DATA_URL_PREFIX}${Buffer.from(bytes).toString('base64')}`;
}

export async function pngToDataUrl(filePath: string): Promise<string> {
  const bytes = await Bun.file(filePath).bytes();
  return pngBytesToDataUrl(bytes);
}
