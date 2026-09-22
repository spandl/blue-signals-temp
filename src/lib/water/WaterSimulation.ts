export interface WaterSettings {
	/** wave decay per step (0.96–0.999) */
	damping: number;
	/** autonomous drop force */
	dropStrength: number;
	/** autonomous drop radius (fraction of field) */
	dropRadius: number;
	/** seconds between autonomous drops */
	dropIntervalMin: number;
	dropIntervalMax: number;
	/** 'drops': pointer injects ripples · 'movement': wake layer handles pointer */
	pointerMode: 'drops' | 'movement';
	/** pointer drop force (pointerMode 'drops') */
	pointerStrength: number;
	/** baseline cyan tint (0.005–0.12) */
	baseTint: number;
	/** top→bottom tint increase */
	depthTint: number;
	/** wave edge contrast */
	waveContrast: number;
	/** specular highlight gain */
	highlight: number;
}

/** "Ralph study 02" preset from the exploration prototype. */
export const DEFAULT_SETTINGS: WaterSettings = {
	damping: 0.95,
	dropStrength: 0.25,
	dropRadius: 0.01,
	dropIntervalMin: 2,
	dropIntervalMax: 7,
	pointerMode: 'movement',
	pointerStrength: 0.05,
	baseTint: 0.04,
	depthTint: 0.25,
	waveContrast: 0.8,
	highlight: 30
};

const CYAN = [6, 182, 212] as const;
const SIMULATION_SCALE = 5;
const FRAME_INTERVAL = 1000 / 30;

export class WaterSimulation {
	settings: WaterSettings;

	private canvas: HTMLCanvasElement;
	private context: CanvasRenderingContext2D;
	private buffer = document.createElement('canvas');
	private bufferContext: CanvasRenderingContext2D;
	private reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
	private resizeObserver: ResizeObserver;
	private rafId = 0;

	private width = 0;
	private height = 0;
	private columns = 0;
	private rows = 0;
	private current!: Float32Array;
	private previous!: Float32Array;
	private image!: ImageData;
	private lastFrame = 0;
	private nextDrop = 0;
	private pointerX = -1;
	private pointerY = -1;
	private lastPointerDrop = 0;

	constructor(canvas: HTMLCanvasElement, settings: Partial<WaterSettings> = {}) {
		this.canvas = canvas;
		this.settings = { ...DEFAULT_SETTINGS, ...settings };
		this.context = canvas.getContext('2d', { alpha: false })!;
		this.bufferContext = this.buffer.getContext('2d', { alpha: false })!;

		canvas.addEventListener('pointermove', this.handlePointer, { passive: true });
		canvas.addEventListener('pointerleave', this.handlePointerLeave);
		this.resizeObserver = new ResizeObserver(this.resize);
		this.resizeObserver.observe(canvas);
		this.rafId = requestAnimationFrame(this.animate);
	}

	updateSettings(settings: Partial<WaterSettings>) {
		Object.assign(this.settings, settings);
	}

	drop() {
		this.disturb(
			0.1 + Math.random() * 0.8,
			0.1 + Math.random() * 0.7,
			this.settings.dropRadius,
			this.settings.dropStrength
		);
	}

	reset() {
		this.current?.fill(0);
		this.previous?.fill(0);
	}

	destroy() {
		cancelAnimationFrame(this.rafId);
		this.resizeObserver.disconnect();
		this.canvas.removeEventListener('pointermove', this.handlePointer);
		this.canvas.removeEventListener('pointerleave', this.handlePointerLeave);
	}

	private resize = () => {
		const bounds = this.canvas.getBoundingClientRect();
		const dpr = Math.min(devicePixelRatio || 1, 1.5);
		this.width = Math.max(1, Math.round(bounds.width * dpr));
		this.height = Math.max(1, Math.round(bounds.height * dpr));
		this.canvas.width = this.width;
		this.canvas.height = this.height;
		this.columns = Math.max(80, Math.round(this.width / SIMULATION_SCALE));
		this.rows = Math.max(64, Math.round(this.height / SIMULATION_SCALE));
		this.buffer.width = this.columns;
		this.buffer.height = this.rows;
		this.current = new Float32Array(this.columns * this.rows);
		this.previous = new Float32Array(this.columns * this.rows);
		this.image = this.bufferContext.createImageData(this.columns, this.rows);
		this.context.imageSmoothingEnabled = true;
		this.scheduleNextDrop(performance.now());
		this.render();
	};

	private disturb(x: number, y: number, radius: number, strength: number) {
		const centerX = Math.round(x * this.columns);
		const centerY = Math.round(y * this.rows);
		const radiusInCells = Math.max(2, radius * Math.min(this.columns, this.rows));
		const minX = Math.max(1, Math.floor(centerX - radiusInCells));
		const maxX = Math.min(this.columns - 2, Math.ceil(centerX + radiusInCells));
		const minY = Math.max(1, Math.floor(centerY - radiusInCells));
		const maxY = Math.min(this.rows - 2, Math.ceil(centerY + radiusInCells));

		for (let row = minY; row <= maxY; row += 1) {
			for (let column = minX; column <= maxX; column += 1) {
				const distance = Math.hypot(column - centerX, row - centerY) / radiusInCells;
				if (distance < 1)
					this.current[row * this.columns + column] +=
						((Math.cos(distance * Math.PI) + 1) * 0.5 * strength);
			}
		}
	}

	private step() {
		const next = this.previous;
		const coupling = 0.5;
		const damping = this.settings.damping;
		const { current, columns, rows } = this;
		for (let row = 1; row < rows - 1; row += 1) {
			const rowOffset = row * columns;
			for (let column = 1; column < columns - 1; column += 1) {
				const index = rowOffset + column;
				const laplacian =
					current[index - 1] +
					current[index + 1] +
					current[index - columns] +
					current[index + columns] -
					current[index] * 4;
				next[index] = (current[index] * 2 - next[index] + laplacian * coupling) * damping;
			}
		}
		this.previous = current;
		this.current = next;
	}

	private render() {
		if (!this.image || !this.current || !this.previous) return;
		const pixels = this.image.data;
		const { columns, rows, current, settings } = this;
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
				const amplitude = Math.abs(current[index]) * 0.14;
				const energy = Math.min(
					0.4,
					(amplitude + Math.hypot(slopeX, slopeY) * 1.8) * settings.waveContrast
				);
				const directional = Math.max(
					-0.14,
					Math.min(0.14, (slopeX - slopeY) * 0.28 * settings.waveContrast)
				);
				const tint = Math.max(
					0.005,
					settings.baseTint + vertical * settings.depthTint + energy + directional
				);
				const light = Math.max(0, -current[index]) * settings.highlight;

				pixels[pixel] = Math.min(255, 255 + (CYAN[0] - 255) * tint + light);
				pixels[pixel + 1] = Math.min(255, 255 + (CYAN[1] - 255) * tint + light);
				pixels[pixel + 2] = Math.min(255, 255 + (CYAN[2] - 255) * tint + light);
				pixels[pixel + 3] = 255;
			}
		}
		this.bufferContext.putImageData(this.image, 0, 0);
		this.context.drawImage(this.buffer, 0, 0, this.width, this.height);
	}

	private scheduleNextDrop(time: number) {
		const minimumDelay = Math.min(this.settings.dropIntervalMin, this.settings.dropIntervalMax);
		const maximumDelay = Math.max(this.settings.dropIntervalMin, this.settings.dropIntervalMax);
		this.nextDrop = time + (minimumDelay + Math.random() * (maximumDelay - minimumDelay)) * 1000;
	}

	private animate = (time: number) => {
		this.rafId = requestAnimationFrame(this.animate);
		if (document.hidden || time - this.lastFrame < FRAME_INTERVAL) return;
		this.lastFrame = time;
		if (!this.image || !this.current || !this.previous) return;

		if (!this.reducedMotion.matches) {
			if (time > this.nextDrop) {
				this.disturb(
					0.08 + Math.random() * 0.84,
					0.08 + Math.random() * 0.72,
					this.settings.dropRadius * (0.8 + Math.random() * 0.4),
					this.settings.dropStrength * (0.82 + Math.random() * 0.36)
				);
				this.scheduleNextDrop(time);
			}
			this.step();
		}

		this.render();
	};

	private handlePointer = (event: PointerEvent) => {
		const bounds = this.canvas.getBoundingClientRect();
		const x = (event.clientX - bounds.left) / bounds.width;
		const y = (event.clientY - bounds.top) / bounds.height;
		const distance = Math.hypot(x - this.pointerX, y - this.pointerY);
		const now = performance.now();

		if (
			!this.reducedMotion.matches &&
			this.settings.pointerMode === 'drops' &&
			this.pointerX >= 0 &&
			distance > 0.006 &&
			now - this.lastPointerDrop > 55
		) {
			this.disturb(
				x,
				y,
				this.settings.dropRadius * 0.82 + Math.min(distance, 0.028),
				Math.min(this.settings.pointerStrength * 1.3, this.settings.pointerStrength * 0.44 + distance * 5)
			);
			this.lastPointerDrop = now;
		}
		this.pointerX = x;
		this.pointerY = y;
	};

	private handlePointerLeave = () => {
		this.pointerX = -1;
		this.pointerY = -1;
	};
}
