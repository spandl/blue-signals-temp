const canvas = document.querySelector('.water-hero__canvas');
const context = canvas.getContext('2d', { alpha: false });
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
const buffer = document.createElement('canvas');
const bufferContext = buffer.getContext('2d', { alpha: false });

let width = 0;
let height = 0;
let columns = 0;
let rows = 0;
let current;
let previous;
let image;
let frame = 0;
let lastFrame = 0;
let nextDrop = 0;
let pointerX = -1;
let pointerY = -1;
let lastPointerDrop = 0;

const cyan = [6, 182, 212];
const simulationScale = 5;
const frameInterval = 1000 / 30;
const settings = {
  damping: .995,
  dropStrength: .4,
  dropRadius: .01,
  dropIntervalMin: 1,
  dropIntervalMax: 8,
  pointerMode: 'movement',
  pointerStrength: .35,
  wakeAutoInput: true,
  wakeComposite: 'transparency',
  wakeColor: '#009bb5',
  wakeOpacity: .29,
  wakeMouseCutoff: 180,
  wakeDepth: 49.71,
  wakeGravity: .5,
  wakeSourceSpeed: .3,
  wakeInputStrength: 10.2,
  wakeTimeStep: 1.05,
  wakeHalfLife: 151,
  wakeResolution: 512,
  wakeSourceSize: .021,
  baseTint: .04,
  depthTint: .2,
  waveContrast: .7,
  highlight: 30
};

function resize() {
  const bounds = canvas.getBoundingClientRect();
  const dpr = Math.min(devicePixelRatio || 1, 1.5);
  width = Math.max(1, Math.round(bounds.width * dpr));
  height = Math.max(1, Math.round(bounds.height * dpr));
  canvas.width = width;
  canvas.height = height;
  columns = Math.max(80, Math.round(width / simulationScale));
  rows = Math.max(64, Math.round(height / simulationScale));
  buffer.width = columns;
  buffer.height = rows;
  current = new Float32Array(columns * rows);
  previous = new Float32Array(columns * rows);
  image = bufferContext.createImageData(columns, rows);
  context.imageSmoothingEnabled = true;
  disturb(.24, .3, .022, 1.35);
  disturb(.76, .62, .018, 1.05);
  nextDrop = performance.now() + 900;
  render();
}

function disturb(x, y, radius, strength) {
  const centerX = Math.round(x * columns);
  const centerY = Math.round(y * rows);
  const radiusInCells = Math.max(2, radius * Math.min(columns, rows));
  const minX = Math.max(1, Math.floor(centerX - radiusInCells));
  const maxX = Math.min(columns - 2, Math.ceil(centerX + radiusInCells));
  const minY = Math.max(1, Math.floor(centerY - radiusInCells));
  const maxY = Math.min(rows - 2, Math.ceil(centerY + radiusInCells));

  for (let row = minY; row <= maxY; row += 1) {
    for (let column = minX; column <= maxX; column += 1) {
      const distance = Math.hypot(column - centerX, row - centerY) / radiusInCells;
      if (distance < 1) current[row * columns + column] += (Math.cos(distance * Math.PI) + 1) * .5 * strength;
    }
  }
}

function step() {
  const next = previous;
  const coupling = .5;
  const damping = settings.damping;
  for (let row = 1; row < rows - 1; row += 1) {
    const rowOffset = row * columns;
    for (let column = 1; column < columns - 1; column += 1) {
      const index = rowOffset + column;
      const laplacian = current[index - 1] + current[index + 1] + current[index - columns] + current[index + columns] - current[index] * 4;
      next[index] = (current[index] * 2 - previous[index] + laplacian * coupling) * damping;
    }
  }
  previous = current;
  current = next;
}

function render() {
  if (!image || !current || !previous) return;
  const pixels = image.data;
  for (let row = 0; row < rows; row += 1) {
    const vertical = row / Math.max(1, rows - 1);
    for (let column = 0; column < columns; column += 1) {
      const index = row * columns + column;
      const pixel = index * 4;
      const left = current[index - (column > 0 ? 1 : 0)];
      const right = current[index + (column < columns - 1 ? 1 : 0)];
      const up = current[index - (row > 0 ? columns : 0)];
      const down = current[index + (row < rows - 1 ? columns : 0)];
      const slopeX = right - left;
      const slopeY = down - up;
      const amplitude = Math.abs(current[index]) * .14;
      const energy = Math.min(.4, (amplitude + Math.hypot(slopeX, slopeY) * 1.8) * settings.waveContrast);
      const directional = Math.max(-.14, Math.min(.14, (slopeX - slopeY) * .28 * settings.waveContrast));
      const tint = Math.max(.005, settings.baseTint + vertical * settings.depthTint + energy + directional);
      const light = Math.max(0, -current[index]) * settings.highlight;

      pixels[pixel] = Math.min(255, 255 + (cyan[0] - 255) * tint + light);
      pixels[pixel + 1] = Math.min(255, 255 + (cyan[1] - 255) * tint + light);
      pixels[pixel + 2] = Math.min(255, 255 + (cyan[2] - 255) * tint + light);
      pixels[pixel + 3] = 255;
    }
  }
  bufferContext.putImageData(image, 0, 0);
  context.drawImage(buffer, 0, 0, width, height);
}

function animate(time) {
  requestAnimationFrame(animate);
  if (document.hidden || time - lastFrame < frameInterval) return;
  lastFrame = time;
  if (!image || !current || !previous) return;

  if (!reducedMotion.matches) {
    if (time > nextDrop) {
      disturb(.08 + Math.random() * .84, .08 + Math.random() * .72, settings.dropRadius * (.8 + Math.random() * .4), settings.dropStrength * (.82 + Math.random() * .36));
      const minimumDelay = Math.min(settings.dropIntervalMin, settings.dropIntervalMax);
      const maximumDelay = Math.max(settings.dropIntervalMin, settings.dropIntervalMax);
      nextDrop = time + (minimumDelay + Math.random() * (maximumDelay - minimumDelay)) * 1000;
    }
    step();
  }

  render();
  frame += 1;
}

function handlePointer(event) {
  const bounds = canvas.getBoundingClientRect();
  const x = (event.clientX - bounds.left) / bounds.width;
  const y = (event.clientY - bounds.top) / bounds.height;
  const distance = Math.hypot(x - pointerX, y - pointerY);
  const now = performance.now();

  if (!reducedMotion.matches && pointerX >= 0 && settings.pointerMode === 'drops' && distance > .006 && now - lastPointerDrop > 55) {
    disturb(x, y, settings.dropRadius * .82 + Math.min(distance, .028), Math.min(settings.pointerStrength * 1.3, settings.pointerStrength * .44 + distance * 5));
    lastPointerDrop = now;
  }
  pointerX = x;
  pointerY = y;
}

window.blueSignalsWater = {
  settings,
  drop() {
    disturb(.1 + Math.random() * .8, .1 + Math.random() * .7, settings.dropRadius, settings.dropStrength);
  },
  reset() {
    current?.fill(0);
    previous?.fill(0);
  },
  rebuild: resize
};

canvas.addEventListener('pointermove', handlePointer, { passive: true });
canvas.addEventListener('pointerleave', () => { pointerX = -1; pointerY = -1; });
new ResizeObserver(resize).observe(canvas);
requestAnimationFrame(animate);
