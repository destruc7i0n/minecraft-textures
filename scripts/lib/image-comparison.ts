import { createCanvas, loadImage, type Canvas } from 'canvas';

async function imageToCanvas(source: string | Buffer): Promise<Canvas | null> {
  try {
    const image = await loadImage(source);
    const canvas = createCanvas(image.width, image.height);
    canvas.getContext('2d').drawImage(image, 0, 0);
    return canvas;
  } catch (error) {
    console.error('Error loading image:', error);
    return null;
  }
}

export async function compareImages(
  image1: string | Buffer,
  image2: string | Buffer,
): Promise<{ identical: boolean; similarity: number }> {
  const canvas1 = await imageToCanvas(image1);
  const canvas2 = await imageToCanvas(image2);

  if (!canvas1 || !canvas2) {
    return { identical: false, similarity: 0 };
  }

  if (canvas1.width !== canvas2.width || canvas1.height !== canvas2.height) {
    return { identical: false, similarity: 0 };
  }

  const ctx1 = canvas1.getContext('2d');
  const ctx2 = canvas2.getContext('2d');
  const imageData1 = ctx1.getImageData(0, 0, canvas1.width, canvas1.height);
  const imageData2 = ctx2.getImageData(0, 0, canvas2.width, canvas2.height);

  const pixels1 = imageData1.data;
  const pixels2 = imageData2.data;

  const TOLERANCE = 3; // ignore sub-pixel color drift from atlas re-encoding
  let differentPixels = 0;
  let visiblePixels = 0;

  for (let i = 0; i < pixels1.length; i += 4) {
    const a1 = pixels1[i + 3];
    const a2 = pixels2[i + 3];
    if (a1 === 0 && a2 === 0) continue; // skip fully transparent in both
    visiblePixels++;

    const pixelsDiffer =
      Math.abs(pixels1[i] - pixels2[i]) > TOLERANCE ||
      Math.abs(pixels1[i + 1] - pixels2[i + 1]) > TOLERANCE ||
      Math.abs(pixels1[i + 2] - pixels2[i + 2]) > TOLERANCE ||
      Math.abs(a1 - a2) > TOLERANCE;

    if (pixelsDiffer) {
      differentPixels++;
    }
  }

  const similarity =
    visiblePixels === 0
      ? 100
      : ((visiblePixels - differentPixels) / visiblePixels) * 100;
  const identical = differentPixels === 0;

  return { identical, similarity };
}
