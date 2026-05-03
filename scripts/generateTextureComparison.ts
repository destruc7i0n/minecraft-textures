import { mkdir, rm } from 'fs/promises';

import { latestVersion } from '../index';
import type { DataItem } from './lib/data/types';
import { ItemTextures } from './lib/item-textures';
import { compareImages } from './lib/image-comparison';
import { defaultTextureName, resolveDataVersion } from './lib/data/resolver';
import { pngBytesToDataUrl, pngToDataUrl } from './lib/data/png';

interface ChangedItem {
  id: string;
  readable: string;
  similarity: number;
  currentTexture: string;
  remoteTexture: string;
  textureFile: string;
}

interface ChangedCandidate {
  id: string;
  readable: string;
  similarity: number;
  dataTexturePath: string;
  preferredTextureFile: string;
  defaultTextureFile: string;
  remoteTextureBytes: Uint8Array;
}

const OUTPUT_DIR = './debug/texture-comparison';

const main = async () => {
  await rm(OUTPUT_DIR, { recursive: true, force: true });
  await rm('./debug/texture-comparison.html', { force: true });

  const latest = resolveDataVersion(latestVersion);
  const itemTextures = new ItemTextures();
  await itemTextures.initialize();

  const candidates: ChangedCandidate[] = [];

  for (const item of latest.items) {
    const remoteId = item.id.replace('minecraft:', '');
    const remoteBuf = await itemTextures.getImageBufferById(`item/${remoteId}`);
    if (!remoteBuf) continue;

    const { identical, similarity } = await compareImages(
      item.dataTexturePath,
      remoteBuf,
    );
    if (!identical) {
      candidates.push({
        id: item.id,
        readable: item.readable,
        similarity,
        dataTexturePath: item.dataTexturePath,
        preferredTextureFile: item.texture.split('/').at(-1)!,
        defaultTextureFile: defaultTextureName(item.id),
        remoteTextureBytes: new Uint8Array(remoteBuf),
      });
    }
  }

  const preferredCounts = candidates.reduce((acc, item) => {
    acc.set(
      item.preferredTextureFile,
      (acc.get(item.preferredTextureFile) ?? 0) + 1,
    );
    return acc;
  }, new Map<string, number>());

  const changed: ChangedItem[] = [];
  const textureOverrides: Record<string, Partial<DataItem>> = {};

  for (const item of candidates.sort((a, b) => a.similarity - b.similarity)) {
    const hasFilenameConflict =
      (preferredCounts.get(item.preferredTextureFile) ?? 0) > 1;
    const textureFile = hasFilenameConflict
      ? item.defaultTextureFile
      : item.preferredTextureFile;
    const needsTextureOverride = textureFile !== item.preferredTextureFile;

    if (needsTextureOverride) {
      textureOverrides[item.id] = { texture: textureFile };
    }

    changed.push({
      id: item.id,
      readable: item.readable,
      similarity: item.similarity,
      currentTexture: await pngToDataUrl(item.dataTexturePath),
      remoteTexture: pngBytesToDataUrl(item.remoteTextureBytes),
      textureFile,
    });
  }

  const cards = changed
    .map(
      (item) => `
    <div class="card">
      <div class="viewer" data-mode="slider" data-dragging="false">
        <img class="img-old" src="${item.currentTexture}" alt="old" draggable="false" />
        <img class="img-new" src="${item.remoteTexture}" alt="new" draggable="false" />
        <div class="handle"></div>
      </div>
      <div class="label">
        <strong>${item.readable}</strong>
        <span>${item.id}</span>
        <span>${item.textureFile}</span>
        <span>${item.similarity.toFixed(1)}% similar</span>
      </div>
    </div>`,
    )
    .join('');

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Texture Comparison - ${latestVersion} vs remote</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: monospace; background: #1a1a1a; color: #eee; padding: 24px; }
    h1 { margin-bottom: 8px; font-size: 1.1rem; color: #aaa; }
    .controls { display: flex; gap: 8px; align-items: center; margin-bottom: 24px; }
    .controls p { font-size: 0.8rem; color: #666; margin: 0; }
    button {
      font-family: monospace;
      font-size: 0.75rem;
      background: #333;
      color: #eee;
      border: 1px solid #555;
      padding: 4px 10px;
      cursor: pointer;
      border-radius: 3px;
    }
    button.active { background: #555; border-color: #aaa; }
    .grid { display: flex; flex-wrap: wrap; gap: 16px; }
    .card { display: flex; flex-direction: column; gap: 8px; }
    .viewer {
      position: relative;
      width: 128px;
      height: 128px;
      background: #333;
      border: 1px solid #444;
      overflow: hidden;
    }
    .img-old, .img-new {
      position: absolute;
      top: 0; left: 0;
      width: 128px;
      height: 128px;
      image-rendering: pixelated;
    }
    .viewer[data-mode="slider"] { cursor: ew-resize; user-select: none; }
    .viewer[data-mode="slider"] .img-new { clip-path: inset(0 50% 0 0); }
    .viewer[data-mode="slider"] .handle { display: block; }
    .viewer[data-mode="overlay"] .img-new { opacity: 0.5; }
    .viewer[data-mode="overlay"] .handle { display: none; }
    .viewer[data-mode="diff"] .img-old { display: none; }
    .viewer[data-mode="diff"] .img-new { mix-blend-mode: difference; background: white; }
    .viewer[data-mode="diff"] .handle { display: none; }
    .handle {
      display: none;
      position: absolute;
      top: 0; left: 50%;
      transform: translateX(-50%);
      width: 2px;
      height: 100%;
      background: rgba(255,255,255,0.9);
      pointer-events: none;
    }
    .handle::after {
      content: '';
      position: absolute;
      top: 50%; left: 50%;
      transform: translate(-50%, -50%);
      width: 12px; height: 12px;
      border-radius: 50%;
      background: #fff;
      border: 2px solid #333;
    }
    .label { font-size: 0.7rem; color: #aaa; display: flex; flex-direction: column; gap: 2px; max-width: 128px; word-break: break-all; }
    .label strong { color: #eee; }
  </style>
</head>
<body>
  <h1>Texture Comparison - local ${latestVersion} (left) vs remote atlas (right)</h1>
  <div class="controls">
    <p>${changed.length} items differ.</p>
    <button id="btn-slider" class="active" onclick="setMode('slider')">Slider</button>
    <button id="btn-overlay" onclick="setMode('overlay')">Overlay</button>
    <button id="btn-diff" onclick="setMode('diff')">Diff</button>
  </div>
  <div class="grid">${cards}</div>
  <script>
    function setMode(mode) {
      document.querySelectorAll('.viewer').forEach(v => {
        v.dataset.mode = mode;
        if (mode !== 'slider') {
          v.querySelector('.img-new').style.clipPath = '';
          v.querySelector('.handle').style.left = '50%';
        }
      });
      document.querySelectorAll('button').forEach(b => b.classList.remove('active'));
      document.getElementById('btn-' + mode).classList.add('active');
    }

    document.querySelectorAll('.viewer').forEach(wrap => {
      const imgNew = wrap.querySelector('.img-new');
      const handle = wrap.querySelector('.handle');

      function setPos(x) {
        if (wrap.dataset.mode !== 'slider') return;
        const rect = wrap.getBoundingClientRect();
        const ratio = Math.max(0, Math.min(1, (x - rect.left) / rect.width));
        imgNew.style.clipPath = 'inset(0 ' + ((1 - ratio) * 100) + '% 0 0)';
        handle.style.left = (ratio * 100) + '%';
      }

      wrap.addEventListener('mousedown', e => {
        wrap.dataset.dragging = 'true';
        setPos(e.clientX);
      });
      window.addEventListener('mousemove', e => {
        if (wrap.dataset.dragging === 'true') setPos(e.clientX);
      });
      window.addEventListener('mouseup', () => wrap.dataset.dragging = 'false');
      wrap.addEventListener('touchstart', e => setPos(e.touches[0].clientX), { passive: true });
      wrap.addEventListener('touchmove', e => {
        setPos(e.touches[0].clientX);
        e.preventDefault();
      }, { passive: false });
    });
  </script>
</body>
</html>`;

  await mkdir(OUTPUT_DIR, { recursive: true });
  await Bun.write(`${OUTPUT_DIR}/index.html`, html);

  console.log(`${changed.length} changed textures.`);
  changed.forEach((item) =>
    console.log(
      `  ${item.id} (${item.readable}): ${item.similarity.toFixed(1)}% similar -> ${item.textureFile}`,
    ),
  );
  console.log(`Wrote ${OUTPUT_DIR}/index.html`);

  if (Object.keys(textureOverrides).length > 0) {
    console.log('Filename conflicts; add this update block:');
    console.log(JSON.stringify({ update: textureOverrides }, null, 2));
  }
};

main();
