import REGL from 'regl';
import type { Regl, Framebuffer2D, Texture2D } from 'regl';

/**
 * Port of @rreusser/dispersion-in-water-surface-waves (Observable, MIT)
 * as wired up by exploration/blue-signals-prototype/movement.js.
 * Solves the surface-gravity-wave dispersion relation ω² = g·k·tanh(k·h)
 * in the frequency domain on the GPU (forward FFT → phasor → inverse FFT).
 */

export interface WakeSettings {
	/** simulate a moving source when the pointer is idle */
	autoInput: boolean;
	/** water depth h */
	depth: number;
	/** gravity g */
	gravity: number;
	/** speed of the automated source */
	sourceSpeed: number;
	/** magnitude injected per input event */
	inputStrength: number;
	/** simulation time step Δt */
	timeStep: number;
	/** damping half-life (in dt units) */
	halfLife: number;
	/** simulation grid size n×n (power of two; requires rebuild) */
	resolution: number;
	/** pointer speed (px/s) required to inject input */
	mouseCutoff: number;
	/** extra wandering space beyond the canvas edges (fraction of canvas size) */
	sourceMargin: number;
	/** wake color, applied via feColorMatrix in the component */
	color: string;
	/** canvas opacity */
	opacity: number;
}

/** "Web cover" preset from the exploration controls. */
export const DEFAULT_WAKE_SETTINGS: WakeSettings = {
	autoInput: true,
	depth: 49.71,
	gravity: 0.5,
	sourceSpeed: 0.3,
	inputStrength: 10.2,
	timeStep: 1.05,
	halfLife: 151,
	resolution: 512,
	mouseCutoff: 40,
	sourceMargin: 0.25,
	color: '#009bb5',
	opacity: 0.29
};

const GLSL_WAVENUMBER = `
#ifndef TWOPI
#define TWOPI (3.14159265358979 * 2.0)
#endif

float wavenumber (float resolution, float dx) {
  float x = (gl_FragCoord.x - 0.5) * resolution;
  return ((x < 0.5) ? x : x - 1.0) * (TWOPI / dx);
}

vec2 wavenumber (vec2 resolution, vec2 dxy) {
  vec2 xy = (gl_FragCoord.xy - 0.5) * resolution;
  return vec2(
    (xy.x < 0.5) ? xy.x : xy.x - 1.0,
    (xy.y < 0.5) ? xy.y : xy.y - 1.0
  ) * TWOPI / dxy;
}
`;

const GLSL_DISPERSION = `
float omega (float k, float g, float h) {
  return sqrt(g * k * tanh(k * h));
}
`;

// d3.interpolateRgbBasis — cubic B-spline over channel values
function basis(t: number, v0: number, v1: number, v2: number, v3: number) {
	const t2 = t * t;
	const t3 = t2 * t;
	return (
		((1 - 3 * t + 3 * t2 - t3) * v0 +
			(4 - 6 * t2 + 3 * t3) * v1 +
			(1 + 3 * t + 3 * t2 - 3 * t3) * v2 +
			t3 * v3) /
		6
	);
}

function rgbBasis(colors: number[][]) {
	const n = colors.length - 1;
	return (t: number, channel: number) => {
		const i = t <= 0 ? 0 : t >= 1 ? n - 1 : Math.floor(t * n);
		const tt = t <= 0 ? 0 : t >= 1 ? 1 : t;
		const v1 = colors[i][channel];
		const v2 = colors[i + 1][channel];
		const v0 = i > 0 ? colors[i - 1][channel] : 2 * v1 - v2;
		const v3 = i < n - 1 ? colors[i + 2][channel] : 2 * v2 - v1;
		return basis((tt - i / n) * n, v0, v1, v2, v3);
	};
}

// d3-scale-chromatic Greys (9-class scheme, last entry)
const GREYS = [
	[255, 255, 255],
	[240, 240, 240],
	[217, 217, 217],
	[189, 189, 189],
	[150, 150, 150],
	[115, 115, 115],
	[82, 82, 82],
	[37, 37, 37],
	[0, 0, 0]
];

function greysLut(n = 256): number[][][] {
	const interp = rgbBasis(GREYS);
	const row: number[][] = [];
	for (let i = 0; i < n; i++) {
		const t = i / (n - 1);
		row.push([
			Math.round(interp(t, 0)),
			Math.round(interp(t, 1)),
			Math.round(interp(t, 2)),
			255
		]);
	}
	return [row];
}

interface FFTPass {
	input: Framebuffer2D;
	output: Framebuffer2D;
	horizontal: boolean;
	forward: boolean;
	resolution: [number, number];
	subtransformSize: number;
	normalization: number;
}

function isPowerOfTwo(n: number) {
	return n !== 0 && (n & (n - 1)) === 0;
}

// Port of planFFT from @rreusser/glsl-fft
function planFFT(opts: {
	width: number;
	height: number;
	input: Framebuffer2D;
	ping: Framebuffer2D;
	pong: Framebuffer2D;
	output: Framebuffer2D;
	forward?: boolean;
	splitNormalization?: boolean;
}): FFTPass[] {
	if (!isPowerOfTwo(opts.width) || !isPowerOfTwo(opts.height)) {
		throw new Error('FFT dimensions must be powers of two');
	}
	const forward = opts.forward ?? true;
	const splitNormalization = opts.splitNormalization ?? true;
	const width = opts.width;
	const height = opts.height;

	let ping = opts.ping;
	let pong = opts.pong;
	let tmp: Framebuffer2D;
	const swap = () => {
		tmp = ping;
		ping = pong;
		pong = tmp;
	};

	if (opts.input === pong) ping = opts.pong;
	pong = ping === opts.ping ? opts.pong : opts.ping;

	const xIterations = Math.round(Math.log2(width));
	const yIterations = Math.round(Math.log2(height));
	const iterations = xIterations + yIterations;

	if (opts.output === (iterations % 2 === 0 ? pong : ping)) swap();
	if (opts.input === pong) {
		throw new Error('not enough framebuffers to compute without copying data');
	}

	const passes: FFTPass[] = [];
	for (let i = 0; i < iterations; i++) {
		const horizontal = i < xIterations;
		const pass: FFTPass = {
			input: i === 0 ? opts.input : ping,
			output: i === iterations - 1 ? opts.output : pong,
			horizontal,
			forward,
			resolution: [1.0 / width, 1.0 / height],
			subtransformSize: Math.pow(2, (horizontal ? i : i - xIterations) + 1),
			normalization:
				i === 0 ? (splitNormalization ? 1.0 / Math.sqrt(width * height) : forward ? 1 : 1.0 / width / height) : 1
		};
		passes.push(pass);
		swap();
	}
	return passes;
}

export class WakeSimulation {
	settings: WakeSettings;

	private canvas: HTMLCanvasElement;
	private regl: Regl;
	private fFbo: Framebuffer2D[] = [];
	private colorscale!: Texture2D;
	private forwardFFT: FFTPass[] = [];
	private inverseFFT: FFTPass[] = [];
	private frame: { cancel: () => void } | null = null;
	private posQueue: [number, number][] = [];
	private resizeObserver: ResizeObserver;
	private queue: { position: [number, number]; magnitude: number }[] = [];
	private previousX = 0;
	private previousY = 0;
	private previousTime: number | undefined;
	private listenerTarget: HTMLElement;
	private dataType: 'float' | 'half float';

	private configureUniforms!: ReturnType<Regl>;
	private configureMap!: ReturnType<Regl>;
	private mouseInput!: ReturnType<Regl>;
	private computeTimestep!: ReturnType<Regl>;
	private performFFT!: ReturnType<Regl>;
	private drawToScreen!: ReturnType<Regl>;

	constructor(canvas: HTMLCanvasElement, settings: Partial<WakeSettings> = {}) {
		this.canvas = canvas;
		this.settings = { ...DEFAULT_WAKE_SETTINGS, ...settings };
		this.listenerTarget = (canvas.parentElement ?? canvas) as HTMLElement;

		this.regl = REGL({
			extensions: ['OES_texture_float', 'OES_texture_float_linear'],
			optionalExtensions: ['OES_texture_half_float', 'OES_texture_half_float_linear'],
			canvas,
			pixelRatio: 1,
			attributes: { antialias: true, preserveDrawingBuffer: false }
		});

		this.dataType = this.regl.hasExtension('oes_texture_float') ? 'float' : 'half float';
		this.buildCommands();
		this.rebuild();

		this.resizeObserver = new ResizeObserver(this.resize);
		this.resizeObserver.observe(canvas);
		this.listenerTarget.addEventListener('pointermove', this.onPointerMove, { passive: true });
		this.listenerTarget.addEventListener('pointerleave', this.onPointerLeave);
	}

	private resize = () => {
		const bounds = this.canvas.getBoundingClientRect();
		this.canvas.width = Math.max(1, Math.round(bounds.width));
		this.canvas.height = Math.max(1, Math.round(bounds.height));
		// Resizing clears the drawing buffer to transparent black, which the
		// feColorMatrix filter maps to fully opaque — repaint immediately.
		if (this.fFbo.length && this.colorscale) {
			this.regl.poll();
			this.configureMap(() =>
				this.drawToScreen({ src: this.fFbo[0], colorscale: this.colorscale, power: true })
			);
		}
	};

	updateSettings(settings: Partial<WakeSettings>) {
		const needsRebuild =
			settings.resolution !== undefined && settings.resolution !== this.settings.resolution;
		Object.assign(this.settings, settings);
		if (needsRebuild) this.rebuild();
	}

	rebuild() {
		const n = this.settings.resolution;
		this.fFbo.forEach((fbo) => fbo.destroy());
		this.fFbo = [0, 1, 2, 3].map(() =>
			this.regl.framebuffer({
				color: this.regl.texture({
					width: n,
					height: n,
					mag: 'linear',
					min: 'linear',
					type: this.dataType
				})
			})
		);
		this.colorscale?.destroy();
		this.colorscale = this.regl.texture(greysLut());
		this.forwardFFT = planFFT({
			width: n,
			height: n,
			input: this.fFbo[0],
			ping: this.fFbo[1],
			pong: this.fFbo[2],
			output: this.fFbo[0],
			forward: true
		});
		this.inverseFFT = planFFT({
			width: n,
			height: n,
			input: this.fFbo[1],
			ping: this.fFbo[2],
			pong: this.fFbo[3],
			output: this.fFbo[0],
			forward: false
		});
		this.restart();
	}

	restart() {
		this.regl.poll();
		this.fFbo[0].use(() => this.regl.clear({ color: [0, 0, 0, 0] }));
	}

	start() {
		if (this.frame) return;
		this.frame = this.regl.frame(this.frameLoop);
	}

	stop() {
		this.frame?.cancel();
		this.frame = null;
	}

	destroy() {
		this.stop();
		this.resizeObserver.disconnect();
		this.listenerTarget.removeEventListener('pointermove', this.onPointerMove);
		this.listenerTarget.removeEventListener('pointerleave', this.onPointerLeave);
		this.fFbo.forEach((fbo) => fbo.destroy());
		this.colorscale?.destroy();
		this.regl.destroy();
	}

	private onPointerMove = (event: PointerEvent) => {
		const bounds = this.canvas.getBoundingClientRect();
		const position: [number, number] = [
			((event.clientX - bounds.left) / bounds.width) * this.canvas.width,
			((event.clientY - bounds.top) / bounds.height) * this.canvas.height
		];
		const now = performance.now();
		if (this.previousTime !== undefined) {
			const distance = Math.hypot(event.clientX - this.previousX, event.clientY - this.previousY);
			const speed = (distance / Math.max(1, now - this.previousTime)) * 1000;
			if (speed >= this.settings.mouseCutoff) this.queueInput(position);
		}
		this.previousX = event.clientX;
		this.previousY = event.clientY;
		this.previousTime = now;
	};

	private onPointerLeave = () => {
		this.previousTime = undefined;
	};

	private queueInput(position: [number, number]) {
		this.queue.push({ position, magnitude: this.settings.inputStrength });
	}

	private autoInputPosition(time: number): [number, number] {
		const t = time * this.settings.sourceSpeed;
		const xExcursion = Math.max(0, Math.sin(t * 0.19 + 0.7)) ** 8;
		const yExcursion = Math.max(0, Math.sin(t * 0.17 + 2.4)) ** 8;
		const xAmplitude = (0.42 + 0.36 * xExcursion) * (1 + this.settings.sourceMargin);
		const yAmplitude = (0.42 + 0.36 * yExcursion) * (1 + this.settings.sourceMargin);
		return [
			this.canvas.width * (0.5 + xAmplitude * Math.cos(0.5 * (t + 0.3 * Math.cos(t * Math.sqrt(2))))),
			this.canvas.height * (0.5 + yAmplitude * Math.sin(Math.E * 0.4 * (t + 0.3 * Math.sin(t))))
		];
	}

	private frameLoop = () => {
		const s = this.settings;
		this.configureUniforms({ dt: s.timeStep, h: s.depth, g: s.gravity }, () => {
			this.configureMap(() => {
				while (this.posQueue.length > 20) this.posQueue.shift();
				if (s.autoInput) {
					const newPos = this.autoInputPosition(performance.now() / 1000);
					this.posQueue.push(newPos);
					this.queueInput(newPos);
				}
				if (this.queue.length) {
					this.fFbo[0].use(() => {
						this.mouseInput(this.queue);
					});
					this.queue.length = 0;
				}
				for (const pass of this.forwardFFT) this.performFFT(pass);
				this.fFbo[1].use(() => this.computeTimestep({ src: this.fFbo[0] }));
				for (const pass of this.inverseFFT) this.performFFT(pass);
				this.drawToScreen({
					src: this.fFbo[0],
					colorscale: this.colorscale,
					power: true
				});
			});
		});
	};

	private buildCommands() {
		const regl = this.regl;
		const s = this.settings;

		this.configureUniforms = regl({
			uniforms: {
				resolution: (ctx) => [ctx.viewportWidth, ctx.viewportHeight],
				dx: [1, 1],
				dxInv: [1, 1],
				dt: regl.prop<any, any>('dt' as never),
				decay: (_ctx, props: { dt: number }) =>
					Math.exp((-Math.log(2) / s.halfLife) * props.dt),
				h: regl.prop<any, any>('h' as never),
				g: regl.prop<any, any>('g' as never)
			}
		});

		this.configureMap = regl({
			vert: `
				precision highp float;
				attribute vec2 aXY;
				varying vec2 vUV;
				void main () {
					vUV = aXY * 0.5 + 0.5;
					gl_Position = vec4(aXY, 0, 1);
				}`,
			attributes: { aXY: [-4, -4, 4, -4, 0, 4] },
			depth: { enable: false },
			primitive: 'triangles',
			count: 3
		});

		this.mouseInput = regl({
			vert: `
				precision highp float;
				attribute float dummy;
				uniform vec2 position, resolution;
				void main () {
					gl_Position = vec4(vec2(1, -1) * (position / resolution * 2.0 - 1.0), 0, 1) + 0.0 * dummy;
					gl_PointSize = 5.0;
				}`,
			frag: `
				precision highp float;
				uniform float magnitude;
				void main () {
					float mag = max(0.0, 1.0 - 4.0 * dot(gl_PointCoord.xy - 0.5, gl_PointCoord.xy - 0.5));
					gl_FragColor = vec4(mag * mag * magnitude * 0.25, 0, 0, 1);
				}`,
			uniforms: {
				position: regl.prop<any, any>('position' as never),
				magnitude: regl.prop<any, any>('magnitude' as never)
			},
			depth: { enable: false },
			attributes: { dummy: regl.buffer([0]) },
			primitive: 'points',
			count: 1,
			blend: {
				enable: true,
				func: { srcRGB: 1, srcAlpha: 1, dstRGB: 1, dstAlpha: 1 },
				equation: { rgb: 'add', alpha: 'add' }
			}
		});

		this.computeTimestep = regl({
			frag: `
				precision highp float;
				varying vec2 vUV;
				uniform sampler2D uSrc;
				uniform vec2 uResolution, dx;
				uniform float dt, decay, h, g;

				float tanh (float x) {
					if (abs(x) > 10.0) return sign(x) * (1.0 - 2.0 * exp(-2.0 * x));
					float e2x = exp(x);
					return (e2x - 1.0) / (e2x + 1.0);
				}

				vec2 cexp(vec2 z) {
					return vec2(cos(z.y), sin(z.y)) * exp(z.x);
				}

				vec2 cmul (vec2 a, vec2 b) {
					return vec2(a.x * b.x - a.y * b. y,a.y * b.x + a.x * b.y);
				}

				${GLSL_WAVENUMBER}
				${GLSL_DISPERSION}

				void main () {
					vec2 yfft = texture2D(uSrc, vUV).xy;
					vec2 kxy = wavenumber(uResolution, dx);
					float kx2ky2 = dot(kxy, kxy);
					float k = sqrt(kx2ky2);
					float w = omega(k, g, h);
					vec2 phasor = cexp(cmul(vec2(0, 1), vec2(dt * w, 0)));
					gl_FragColor.xy = cmul(yfft, phasor) * decay;
				}`,
			uniforms: {
				uSrc: regl.prop<any, any>('src' as never),
				uResolution: () => [1 / this.settings.resolution, 1 / this.settings.resolution]
			}
		});

		this.performFFT = regl({
			frag: `
				precision highp float;

				uniform sampler2D uSrc;
				uniform vec2 uResolution;
				uniform float uSubtransformSize, uNormalization;
				uniform bool uHorizontal, uForward;

				const float TWOPI = 6.283185307179586;

				vec4 fft (
					sampler2D src,
					vec2 resolution,
					float subtransformSize,
					bool horizontal,
					bool forward,
					float normalization
				) {
					vec2 evenPos, oddPos, twiddle, outputA, outputB;
					vec4 even, odd;
					float index, evenIndex, twiddleArgument;

					index = (horizontal ? gl_FragCoord.x : gl_FragCoord.y) - 0.5;

					evenIndex = floor(index / subtransformSize) *
						(subtransformSize * 0.5) +
						mod(index, subtransformSize * 0.5) +
						0.5;

					if (horizontal) {
						evenPos = vec2(evenIndex, gl_FragCoord.y);
						oddPos = vec2(evenIndex, gl_FragCoord.y);
					} else {
						evenPos = vec2(gl_FragCoord.x, evenIndex);
						oddPos = vec2(gl_FragCoord.x, evenIndex);
					}

					evenPos *= resolution;
					oddPos *= resolution;

					if (horizontal) {
						oddPos.x += 0.5;
					} else {
						oddPos.y += 0.5;
					}

					even = texture2D(src, evenPos);
					odd = texture2D(src, oddPos);

					twiddleArgument = (forward ? TWOPI : -TWOPI) * (index / subtransformSize);
					twiddle = vec2(cos(twiddleArgument), sin(twiddleArgument));

					return (even.rgba + vec4(
						twiddle.x * odd.xz - twiddle.y * odd.yw,
						twiddle.y * odd.xz + twiddle.x * odd.yw
					).xzyw) * normalization;
				}

				void main () {
					gl_FragColor = fft(uSrc, uResolution, uSubtransformSize, uHorizontal, uForward, uNormalization);
				}`,
			uniforms: {
				uSrc: regl.prop<any, any>('input' as never),
				uResolution: regl.prop<any, any>('resolution' as never),
				uSubtransformSize: regl.prop<any, any>('subtransformSize' as never),
				uHorizontal: regl.prop<any, any>('horizontal' as never),
				uForward: regl.prop<any, any>('forward' as never),
				uNormalization: regl.prop<any, any>('normalization' as never)
			},
			framebuffer: regl.prop<any, any>('output' as never)
		});

		this.drawToScreen = regl({
			frag: `
				precision highp float;
				varying vec2 vUV;
				uniform float uGamma;
				uniform sampler2D uSrc, colorscale;
				uniform bool power;
				void main () {
					float value = texture2D(uSrc, vUV).r;
					vec3 color = texture2D(colorscale, vec2(power ? (value * value) : 0.5 + value, 0.5)).rgb;
					gl_FragColor = vec4(color, 1);
				}`,
			uniforms: {
				uGamma: 1,
				uSrc: regl.prop<any, any>('src' as never),
				colorscale: regl.prop<any, any>('colorscale' as never),
				power: regl.prop<any, any>('power' as never)
			}
		});
	}
}
