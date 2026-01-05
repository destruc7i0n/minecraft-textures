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
  image2: string | Buffer
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

  let differentPixels = 0;
  const totalPixels = pixels1.length / 4;

  for (let i = 0; i < pixels1.length; i += 4) {
    const pixelsDiffer =
      pixels1[i] !== pixels2[i] ||
      pixels1[i + 1] !== pixels2[i + 1] ||
      pixels1[i + 2] !== pixels2[i + 2] ||
      pixels1[i + 3] !== pixels2[i + 3];

    if (pixelsDiffer) {
      differentPixels++;
    }
  }

  const similarity = ((totalPixels - differentPixels) / totalPixels) * 100;
  const identical = differentPixels === 0;

  return { identical, similarity };
}
