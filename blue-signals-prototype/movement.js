const mount = document.querySelector('.water-hero__movement');
const hero = document.querySelector('.water-hero');
const water = window.blueSignalsWater;
let runtime;
let notebook;
let restartToken = 0;
let lastSettings = '';
let loadError;

function updateAppearance() {
  const color = water.settings.wakeColor.replace('#', '');
  const red = parseInt(color.slice(0, 2), 16) / 255;
  const green = parseInt(color.slice(2, 4), 16) / 255;
  const blue = parseInt(color.slice(4, 6), 16) / 255;
  const matrix = document.querySelector('#cyan-wake feColorMatrix');
  matrix.setAttribute('values', `0 0 0 0 ${red} 0 0 0 0 ${green} 0 0 0 0 ${blue} -.2126 -.7152 -.0722 0 1`);
  const canvas = mount.querySelector('canvas');
  if (canvas) canvas.style.opacity = water.settings.wakeOpacity;
}

function notebookSettings() {
  return {
    autoInput: water.settings.wakeAutoInput,
    h: water.settings.wakeDepth,
    g: water.settings.wakeGravity,
    speed: water.settings.wakeSourceSpeed,
    inputStrength: water.settings.wakeInputStrength,
    resolution: water.settings.wakeResolution,
    dt: water.settings.wakeTimeStep,
    decayTime: water.settings.wakeHalfLife
  };
}

async function applySettings(force = false) {
  if (!notebook) return;
  const settings = notebookSettings();
  const serialized = JSON.stringify(settings);
  if (!force && serialized === lastSettings) return;
  lastSettings = serialized;
  await Promise.all(Object.entries(settings).map(([name, value]) => notebook.redefine(name, value)));
}

async function resizeNotebook() {
  if (!notebook) return;
  const bounds = hero.getBoundingClientRect();
  await notebook.redefine('canvasSize', {
    width: Math.max(1, Math.round(bounds.width)),
    height: Math.max(1, Math.round(bounds.height))
  });
  const container = await notebook.value('canvas');
  await notebook.redefine('attachMouseInput', [], () => attachThresholdInput(container));
}

function attachThresholdInput(container) {
  return function attachMouseInput() {
    const queue = [];
    let previousX;
    let previousY;
    let previousTime;
    function queueInput(position, magnitude) {
      queue.push({ position, magnitude });
    }
    function onPointerMove(event) {
      const canvas = container.querySelector('canvas');
      if (!canvas) return;
      const bounds = canvas.getBoundingClientRect();
      const position = [
        (event.clientX - bounds.left) / bounds.width * canvas.width,
        (event.clientY - bounds.top) / bounds.height * canvas.height
      ];
      const now = performance.now();
      if (previousTime !== undefined) {
        const distance = Math.hypot(event.clientX - previousX, event.clientY - previousY);
        const speed = distance / Math.max(1, now - previousTime) * 1000;
        if (speed >= water.settings.wakeMouseCutoff) queueInput(position, water.settings.wakeInputStrength);
      }
      previousX = event.clientX;
      previousY = event.clientY;
      previousTime = now;
    }
    function onPointerLeave() {
      previousTime = undefined;
    }
    container.addEventListener('pointermove', onPointerMove);
    container.addEventListener('pointerleave', onPointerLeave);
    return {
      queue,
      queueInput,
      cancel() {
        container.removeEventListener('pointermove', onPointerMove);
        container.removeEventListener('pointerleave', onPointerLeave);
      }
    };
  };
}

async function initialize() {
  try {
    const [{ Runtime, Inspector }, { default: define }] = await Promise.all([
      import('https://cdn.jsdelivr.net/npm/@observablehq/runtime@5/+esm'),
      import('https://api.observablehq.com/@rreusser/dispersion-in-water-surface-waves.js?v=3')
    ]);
    runtime = new Runtime();
    const quietObserver = {
      fulfilled() {},
      rejected(error) {
        loadError = error;
        console.error(error);
      }
    };
    notebook = runtime.module(define, name => {
      if (name === 'canvas') return new Inspector(mount);
      if (name === 'frameLoop' || name === 'onRestart') return quietObserver;
      return null;
    });
    await Promise.all([
      notebook.redefine('duck', false),
      notebook.redefine('colorscaleName', 'Greys'),
      notebook.redefine('power', 'power (squared amplitude)'),
      notebook.redefine('run', true),
      notebook.redefine('drawWakeAngle', false),
      notebook.redefine('restart', restartToken),
      resizeNotebook(),
      applySettings(true)
    ]);
    updateAppearance();
  } catch (error) {
    loadError = error;
    console.error(error);
  }
}

function update() {
  const active = water.settings.pointerMode === 'movement';
  mount.style.display = active ? 'block' : 'none';
  mount.dataset.composite = water.settings.wakeComposite;
  if (active && loadError) mount.dataset.error = 'Movement renderer could not load';
  if (active) updateAppearance();
  applySettings();
  requestAnimationFrame(update);
}

window.blueSignalsMovement = {
  reset() {
    if (!notebook) return;
    restartToken += 1;
    notebook.redefine('restart', restartToken);
  },
  resize: resizeNotebook
};

new ResizeObserver(() => resizeNotebook()).observe(hero);
initialize();
requestAnimationFrame(update);
window.addEventListener('pagehide', () => runtime?.dispose());
