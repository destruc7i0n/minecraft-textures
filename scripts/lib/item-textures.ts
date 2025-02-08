import { createCanvas, loadImage, Canvas, Image } from 'canvas';
import { ITEM_ATLAS_FILE, ITEM_UVMAP_FILE } from './mcmeta';
import { IDMap, UVMap } from './types';

class ItemTextures {
  private uvMap: UVMap | null = null;
  private atlas: Image | null = null;
  private canvas: Canvas | null = null;
  private idMap: IDMap | null = null;

  public async initialize(): Promise<void> {
    if (!this.uvMap) {
      const response = await fetch(ITEM_UVMAP_FILE);
      this.uvMap = (await response.json()) as UVMap;
    }
    if (!this.atlas) {
      this.atlas = await loadImage(ITEM_ATLAS_FILE);
    }
    if (!this.canvas) {
      const atlasSize = this.upperPowerOfTwo(
        Math.max(this.atlas.width, this.atlas.height)
      );
      this.canvas = createCanvas(atlasSize, atlasSize);
      const ctx = this.canvas.getContext('2d');
      ctx.drawImage(this.atlas, 0, 0);
    }
    if (!this.idMap && this.uvMap && this.canvas) {
      const atlasSize = this.canvas.width;
      this.idMap = this.createIDMap(atlasSize);
    }
  }

  private upperPowerOfTwo(x: number): number {
    x -= 1;
    x |= x >> 1;
    x |= x >> 2;
    x |= x >> 4;
    x |= x >> 8;
    x |= x >> 18;
    x |= x >> 32;
    return x + 1;
  }

  private createIDMap(atlasSize: number): IDMap {
    const idMap: IDMap = {};

    for (const key of Object.keys(this.uvMap!)) {
      const u: number = this.uvMap![key][0] / atlasSize;
      const v: number = this.uvMap![key][1] / atlasSize;
      const part: number = 16 / atlasSize;
      idMap[key] = [u, v, u + part, v + part];
    }

    return idMap;
  }

  public getIdMap(): IDMap {
    return this.idMap!;
  }

  public async getImageBufferById(id: string) {
    if (!this.uvMap || !this.atlas || !this.canvas || !this.idMap) {
      throw new Error('Failed to initialize');
    }

    const atlasSize = this.canvas.width;

    if (!this.idMap[id]) return;
    const [u1, v1, u2, v2] = this.idMap[id];

    // the uv coordinates are 16x16, so we need to scale them up to 32x32
    const itemCanvas: Canvas = createCanvas(32, 32);
    const itemCtx = itemCanvas.getContext('2d');
    itemCtx.imageSmoothingEnabled = false;
    itemCtx.drawImage(
      this.canvas,
      u1 * atlasSize,
      v1 * atlasSize,
      (u2 - u1) * atlasSize,
      (v2 - v1) * atlasSize,
      0,
      0,
      32,
      32
    );

    return itemCanvas.toBuffer('image/png');
  }
}

export { ItemTextures };
