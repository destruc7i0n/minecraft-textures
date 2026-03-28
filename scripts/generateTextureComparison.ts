import type { TexturesType } from '../lib/types';
import { latestVersion } from '../index';
import { ItemTextures } from './lib/item-textures';
import { compareImages } from './lib/image-comparison';

interface ComparisonItem {
  id: string;
  readable: string;
  similarity: number;
  currentTexture: string;
  remoteTexture: string;
}

const main = async () => {
  const latest: TexturesType = (await import(`../textures/${latestVersion}.ts`))
    .default;

  const itemTextures = new ItemTextures();
  await itemTextures.initialize();

  const changed: ComparisonItem[] = [];

  for (const item of latest.items) {
    if (!item.texture) continue;
    const remoteId = item.id.replace('minecraft:', '');
    const remoteBuf = await itemTextures.getImageBufferById(`item/${remoteId}`);
    if (!remoteBuf) continue;

    const { identical, similarity } = await compareImages(
      item.texture,
      remoteBuf,
    );
    if (!identical) {
      changed.push({
        id: item.id,
        readable: item.readable,
        similarity,
        currentTexture: item.texture,
        remoteTexture: `data:image/png;base64,${remoteBuf.toString('base64')}`,
      });
    }
  }

  changed.sort((a, b) => a.similarity - b.similarity);

  console.log(`Found ${changed.length} items with different textures.`);
  changed.forEach((item) =>
    console.log(
      `  ${item.id} (${item.readable}): ${item.similarity.toFixed(1)}% similar`,
    ),
  );

  const updatePropertiesData = JSON.stringify(
    changed.map((item) => ({ id: item.id, texture: item.remoteTexture })),
  );

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

    /* slider mode */
    .viewer[data-mode="slider"] { cursor: ew-resize; user-select: none; }
    .viewer[data-mode="slider"] .img-new { clip-path: inset(0 50% 0 0); }
    .viewer[data-mode="slider"] .handle { display: block; }

    /* overlay mode */
    .viewer[data-mode="overlay"] .img-new { opacity: 0.5; }
    .viewer[data-mode="overlay"] .handle { display: none; }

    /* diff mode */
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
    <button onclick="copyUpdateProperties()">Copy updatePropertiesOfItems</button>
  </div>
  <div class="grid">${cards}</div>
  <script>
    const UPDATE_DATA = ${updatePropertiesData};

    function copyUpdateProperties() {
      const entries = UPDATE_DATA.map(({ id, texture }) =>
        "  '" + id + "': { 'texture': '" + texture + "' },"
      ).join('\\n');
      const ts = 'const PrevItems = updatePropertiesOfItems({\\n' + entries + '\\n}, Prev.items);';
      navigator.clipboard.writeText(ts).then(() => {
        const btn = event.target;
        btn.textContent = 'Copied!';
        setTimeout(() => btn.textContent = 'Copy updatePropertiesOfItems', 1500);
      });
    }

    let currentMode = 'slider';

    function setMode(mode) {
      currentMode = mode;
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

  await Bun.write('./debug/texture-comparison.html', html);
  console.log('Written to ./debug/texture-comparison.html');
};

main();
