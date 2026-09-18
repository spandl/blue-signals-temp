const water = window.blueSignalsWater;
const mount = document.querySelector('.page-space');

const presets = {
  'Original study': {
    damping: .993,
    dropStrength: 1.25,
    dropRadius: .022,
    dropIntervalMin: 2.2,
    dropIntervalMax: 4,
    pointerStrength: .55,
    baseTint: .028,
    depthTint: .025,
    waveContrast: 1,
    highlight: 18
  },
  'Ralph study 01': {
    damping: .983,
    dropStrength: .3,
    dropRadius: .009,
    dropIntervalMin: 3,
    dropIntervalMax: 8,
    pointerStrength: .05,
    baseTint: .035,
    depthTint: .12,
    waveContrast: 1,
    highlight: 20
  },
  'Ralph study 02': {
    damping: .99,
    dropStrength: .35,
    dropRadius: .01,
    dropIntervalMin: 1,
    dropIntervalMax: 7,
    pointerStrength: .05,
    baseTint: .04,
    depthTint: .15,
    waveContrast: 0.75,
    highlight: 30
  }
};

const movementPresets = {
  'Observable base': {
    wakeDepth: 50,
    wakeGravity: .5,
    wakeSourceSpeed: .93,
    wakeInputStrength: 15,
    wakeTimeStep: 1.88,
    wakeHalfLife: 103,
    wakeResolution: 256,
    wakeSourceSize: .009,
    wakeMouseCutoff: 40,
    wakeColor: '#06b6d4',
    wakeOpacity: 1
  },
  'Ralph pointer 01': {
    wakeDepth: 23.71,
    wakeGravity: .5,
    wakeSourceSpeed: .78,
    wakeInputStrength: 5.1,
    wakeTimeStep: 1.14,
    wakeHalfLife: 200,
    wakeResolution: 256,
    wakeSourceSize: .012,
    wakeMouseCutoff: 40,
    wakeColor: '#06b6d4',
    wakeOpacity: .65
  }
};

const movementControls = [
  ['wakeDepth', 'Depth, h', .01, 50, .01],
  ['wakeGravity', 'Gravity, g', .5, 100, .1],
  ['wakeSourceSpeed', 'Speed', .5, 2, .01],
  ['wakeInputStrength', 'Input strength', 0, 20, .1],
  ['wakeTimeStep', 'Time step, Δt', .01, 10, .01],
  ['wakeHalfLife', 'Damping half-life', 1, 200, 1],
  ['wakeResolution', 'Resolution', 128, 512, 128],
  ['wakeSourceSize', 'Source size', .004, .03, .001],
  ['wakeOpacity', 'Overlay opacity', 0, 1, .01],
  ['wakeMouseCutoff', 'Mouse speed cutoff', 0, 500, 5, ' px/s']
];

const controls = [
  ['damping', 'Decay', .96, .999, .001],
  ['dropStrength', 'Drop force', .1, 3, .05],
  ['dropRadius', 'Drop size', .006, .06, .001],
  ['pointerStrength', 'Pointer force', .05, 1.5, .05],
  ['baseTint', 'Base cyan', .005, .12, .001],
  ['depthTint', 'Depth tint', 0, .2, .001],
  ['waveContrast', 'Wave contrast', .1, 3, .05],
  ['highlight', 'Highlight', 0, 50, 1]
];

const panel = document.createElement('div');
panel.className = 'water-controls';
panel.innerHTML = `
  <div class="water-controls__heading">
    <div><span>Water study</span><strong>Live parameters</strong></div>
    <div class="water-controls__actions">
      <label class="water-controls__preset">Pointer
        <select data-control="pointer-mode" aria-label="Pointer variant">
          <option value="drops">Drops</option>
          <option value="movement">Movement</option>
        </select>
      </label>
      <label class="water-controls__preset">Preset
        <select data-control="preset" aria-label="Water preset">
          <option value="Original study">Original study</option>
          <option value="Ralph study 01">Ralph study 01</option>
          <option value="Ralph study 02" selected>Ralph study 02</option>
        </select>
      </label>
      <button type="button" data-action="drop">Add drop</button>
      <button type="button" data-action="reset">Clear</button>
    </div>
  </div>
  <div class="water-controls__grid"></div>
`;

const grid = panel.querySelector('.water-controls__grid');
const fields = new Map();
const intervalField = document.createElement('label');
const intervalValue = document.createElement('output');
const intervalRange = document.createElement('span');
const intervalMinimum = document.createElement('input');
const intervalMaximum = document.createElement('input');
intervalField.className = 'water-controls__range';
intervalValue.value = `${water.settings.dropIntervalMin}–${water.settings.dropIntervalMax}s`;
intervalRange.className = 'water-controls__range-track';

function updateInterval(changed) {
  if (changed === intervalMinimum && Number(intervalMinimum.value) > Number(intervalMaximum.value)) intervalMinimum.value = intervalMaximum.value;
  if (changed === intervalMaximum && Number(intervalMaximum.value) < Number(intervalMinimum.value)) intervalMaximum.value = intervalMinimum.value;
  water.settings.dropIntervalMin = Number(intervalMinimum.value);
  water.settings.dropIntervalMax = Number(intervalMaximum.value);
  intervalValue.value = `${intervalMinimum.value}–${intervalMaximum.value}s`;
  intervalRange.style.setProperty('--range-start', `${(Number(intervalMinimum.value) - .5) / 14.5 * 100}%`);
  intervalRange.style.setProperty('--range-end', `${(Number(intervalMaximum.value) - .5) / 14.5 * 100}%`);
}

for (const [input, key, label] of [
  [intervalMinimum, 'dropIntervalMin', 'Minimum drop interval'],
  [intervalMaximum, 'dropIntervalMax', 'Maximum drop interval']
]) {
  input.type = 'range';
  input.min = .5;
  input.max = 15;
  input.step = .1;
  input.value = water.settings[key];
  input.setAttribute('aria-label', label);
  input.addEventListener('input', () => updateInterval(input));
  fields.set(key, { input, value: intervalValue, suffix: 's' });
}

intervalRange.append(intervalMinimum, intervalMaximum);
intervalField.append(document.createTextNode('Drop interval'), intervalValue, intervalRange);
grid.append(intervalField);
updateInterval();

for (const [key, label, min, max, step, suffix = ''] of controls) {
  const field = document.createElement('label');
  const value = document.createElement('output');
  const input = document.createElement('input');
  value.value = `${water.settings[key]}${suffix}`;
  input.type = 'range';
  input.min = min;
  input.max = max;
  input.step = step;
  input.value = water.settings[key];
  input.dataset.setting = key;
  input.addEventListener('input', () => {
    water.settings[key] = Number(input.value);
    value.value = `${input.value}${suffix}`;
  });
  field.append(document.createTextNode(label), value, input);
  grid.append(field);
  fields.set(key, { input, value, suffix });
}

const movementHeading = document.createElement('div');
movementHeading.className = 'water-controls__group-title';
movementHeading.textContent = 'Movement wake';
grid.append(movementHeading);

const movementOptions = document.createElement('div');
movementOptions.className = 'water-controls__movement water-controls__movement-options';
movementOptions.innerHTML = `
  <label class="water-controls__check">
    <input type="checkbox" data-control="auto-movement" />
    Simulate movement
  </label>
  <label class="water-controls__composite">Pointer preset
    <select data-control="movement-preset" aria-label="Movement preset">
      <option value="Observable base">Observable base</option>
      <option value="Ralph pointer 01" selected>Ralph pointer 01</option>
    </select>
  </label>
  <label class="water-controls__composite">Merge with drops
    <select data-control="composite" aria-label="Merge movement with drops">
      <option value="opaque">None · opaque</option>
      <option value="transparency">Transparency</option>
      <option value="multiply">Multiply</option>
      <option value="darken">Darken</option>
      <option value="color-burn">Color burn</option>
    </select>
  </label>
  <label class="water-controls__color">Overlay color
    <input type="color" data-control="movement-color" value="#06b6d4" />
  </label>
`;
grid.append(movementOptions);

const autoMovement = movementOptions.querySelector('[data-control="auto-movement"]');
const movementPreset = movementOptions.querySelector('[data-control="movement-preset"]');
const composite = movementOptions.querySelector('[data-control="composite"]');
const movementColor = movementOptions.querySelector('[data-control="movement-color"]');
autoMovement.checked = water.settings.wakeAutoInput;
composite.value = water.settings.wakeComposite;
movementColor.value = water.settings.wakeColor;
autoMovement.addEventListener('change', () => {
  water.settings.wakeAutoInput = autoMovement.checked;
  window.blueSignalsMovement.reset();
});
composite.addEventListener('change', () => {
  water.settings.wakeComposite = composite.value;
});
movementColor.addEventListener('input', () => {
  water.settings.wakeColor = movementColor.value;
});

for (const [key, label, min, max, step, suffix = ''] of movementControls) {
  const field = document.createElement('label');
  const value = document.createElement('output');
  const input = document.createElement('input');
  field.className = 'water-controls__movement';
  value.value = `${water.settings[key]}${suffix}`;
  input.type = 'range';
  input.min = min;
  input.max = max;
  input.step = step;
  input.value = water.settings[key];
  input.addEventListener('input', () => {
    water.settings[key] = Number(input.value);
    value.value = `${input.value}${suffix}`;
    if (key === 'wakeResolution') water.rebuild();
  });
  field.append(document.createTextNode(label), value, input);
  grid.append(field);
  fields.set(key, { input, value, suffix });
}

function restoreMovementPreset(name) {
  Object.assign(water.settings, movementPresets[name]);
  for (const [key, setting] of Object.entries(movementPresets[name])) {
    const field = fields.get(key);
    if (field) {
      field.input.value = setting;
      field.value.value = `${setting}${field.suffix}`;
    }
  }
  movementColor.value = water.settings.wakeColor;
  window.blueSignalsMovement.reset();
}

movementPreset.addEventListener('change', () => restoreMovementPreset(movementPreset.value));

function updatePointerControls() {
  const movement = water.settings.pointerMode === 'movement';
  movementHeading.hidden = !movement;
  for (const field of grid.querySelectorAll('.water-controls__movement')) field.hidden = !movement;
}

function restorePreset(name) {
  Object.assign(water.settings, presets[name]);
  for (const [key, { input, value, suffix }] of fields) {
    input.value = water.settings[key];
    value.value = `${water.settings[key]}${suffix}`;
  }
  updateInterval();
}

panel.querySelector('[data-control="preset"]').addEventListener('change', event => {
  restorePreset(event.target.value);
});

panel.querySelector('[data-control="pointer-mode"]').addEventListener('change', event => {
  water.settings.pointerMode = event.target.value;
  water.rebuild();
  window.blueSignalsMovement.reset();
  updatePointerControls();
});

restorePreset(panel.querySelector('[data-control="preset"]').value);
restoreMovementPreset(movementPreset.value);
updatePointerControls();

panel.addEventListener('click', event => {
  const action = event.target.closest('button')?.dataset.action;
  if (action === 'drop') water.drop();
  if (action === 'reset') {
    water.reset();
    window.blueSignalsMovement.reset();
  }
});

mount.append(panel);
