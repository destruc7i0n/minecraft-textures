const PNG_DATA_URL_PREFIX = 'data:image/png;base64,';

export function dataUrlToPng(dataUrl: string): Uint8Array {
  if (!dataUrl.startsWith(PNG_DATA_URL_PREFIX)) {
    throw new Error('Expected PNG data URL');
  }
  return Uint8Array.from(
    Buffer.from(dataUrl.slice(PNG_DATA_URL_PREFIX.length), 'base64'),
  );
}

export async function pngToDataUrl(filePath: string): Promise<string> {
  const bytes = await Bun.file(filePath).bytes();
  return `${PNG_DATA_URL_PREFIX}${Buffer.from(bytes).toString('base64')}`;
}
