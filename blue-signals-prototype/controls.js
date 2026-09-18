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
    dropStrength: .15,
    dropRadius: .02,
    dropIntervalMin: 1,
    dropIntervalMax: 5,
    pointerStrength: .05,
    baseTint: .04,
    depthTint: .15,
    waveContrast: 0.75,
    highlight: 30
  }
};

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
      <label class="water-controls__preset">Preset
        <select aria-label="Water preset">
          <option value="Original study">Original study</option>
          <option value="Ralph study 01" selected>Ralph study 01</option>
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

function restorePreset(name) {
  Object.assign(water.settings, presets[name]);
  for (const [key, { input, value, suffix }] of fields) {
    input.value = water.settings[key];
    value.value = `${water.settings[key]}${suffix}`;
  }
  updateInterval();
}

panel.querySelector('select').addEventListener('change', event => {
  restorePreset(event.target.value);
});

panel.addEventListener('click', event => {
  const action = event.target.closest('button')?.dataset.action;
  if (action === 'drop') water.drop();
  if (action === 'reset') water.reset();
});

mount.append(panel);
