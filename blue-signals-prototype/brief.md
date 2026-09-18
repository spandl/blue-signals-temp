# blue signals — Water Hero Brief

## Purpose

Create a restrained visual signature for **blue signals**: a nearly white field with a trace of cyan water. Rare falling drops and gentle pointer movement reveal that the field is alive. It should read first as calm, premium B2B design and only second as an animation.

The metaphor connects the product story directly to the interface: a large, quiet surface contains many possible events; a small genuine action creates a detectable signal that travels outward.

## First prototype

- Hero viewport: `100vw × 70vh`, with a practical minimum height of 420px (360px on small screens) and maximum height of 900px.
- Centered title: “blue signals”, SUSE Medium, 64px maximum, responsive down to 48px.
- Palette: white plus cyan 500 (`#06b6d4`), diluted heavily toward white.
- Motion: one autonomous impact roughly every 3.2–7.4 seconds; pointer movement creates lower-energy disturbances.
- Implementation: dependency-free Canvas 2D height-field simulation. This gives real wave propagation and interference while keeping the first iteration easy to tune.

## Visual specification

### Base field

- Dominant impression: white, open, quiet.
- Cyan coverage should be perceptual rather than literal: approximately 3–7% tint in undisturbed areas.
- A faint top-to-bottom density increase provides depth without becoming a visible gradient treatment.
- Highlights may approach white; shadows should remain pale cyan rather than grey or navy.
- No ocean horizon, obvious waves, bubbles, rain streaks, glass pane, photographic texture, or high-contrast caustics in this iteration.

### Ripples

- Rings should be soft-edged, broad, and low amplitude.
- A drop should become noticeable for a moment, then decay into the field rather than demand attention.
- Multiple disturbances should interfere naturally.
- Autonomous drops should vary slightly in position, radius, and strength, with no obvious loop.
- Pointer response should trail movement sparingly, not create a continuous liquid brush.
- Later directional emitters can inject disturbances from the top edge or any side without changing the simulation model.

### Typography and layering

- Title remains crisp DOM text above the canvas; it is not distorted in iteration one.
- Typeface: Google Fonts **SUSE**, weight 500.
- Desktop target: 64px; responsive rule: `clamp(48px, 5vw, 64px)`.
- Color: a cyan-forward blue close to cyan 500, adjusted after visual review if contrast feels too light.
- The animation must never impair legibility or become a competing focal point.

## Physics overview

### Height-field model

The water is represented as a 2D grid. Each cell stores surface height for the current and previous time steps. The next state is calculated from the four direct neighbours:

```text
next(x,y) = ((left + right + up + down) × 0.5 − previous(x,y)) × damping
```

This is the discrete wave equation in a compact Verlet-style update. The neighbour average propagates energy; subtraction of the previous state supplies inertia; damping removes energy over time. The prototype uses `damping = 0.988`.

A drop is a smooth radial impulse added to the current height field:

```text
d = distance(cell, impactCenter) / impactRadius
impulse = d < 1 ? (cos(πd) + 1) × 0.5 × strength : 0
```

The cosine profile avoids the hard edge and noisy high frequencies produced by a binary circle. Falling drops and pointer motion use the same impulse function with different radius and strength ranges.

### Surface appearance

Local height differences estimate the surface gradient:

```text
slopeX = height(x+1,y) − height(x−1,y)
slopeY = height(x,y+1) − height(x,y−1)
```

The gradient acts as an inexpensive normal approximation. It modulates the cyan tint and a tightly constrained white glint. This creates shallow refraction/light cues without a photograph, cubemap, or full ray tracer.

### Observable and prior-art takeaways

Observable examples point to three useful families of technique:

1. **Oscillation/ripple sketches**: radial phase and amplitude decay are sufficient for illustrative rings, but individual analytic rings become cumbersome when many impacts must interfere.
2. **Height-field ripple simulation**: a persistent grid naturally handles propagation, interference, pointer input, and future directional emitters. This is the best fit for “real” drops.
3. **Fluid simulation**: velocity/advection/pressure solvers produce swirling liquids, but are substantially heavier and visually more active than this brief requires.

The prototype therefore uses a damped height field rather than full Navier–Stokes fluid dynamics. A future GPU version can preserve the same equation with ping-pong textures: one render target contains the current height, another the previous height, and a fragment pass computes the next frame.

## Performance requirements

### Targets

- Smooth interaction on current desktop Chrome, Safari, Firefox, and Edge.
- 30 rendered simulation frames per second is sufficient because motion is intentionally slow; avoid spending power to chase 60fps invisibly.
- Main-thread animation work target: under 8ms per rendered frame on a typical laptop.
- No layout reads inside the simulation loop.
- No cumulative layout shift from canvas or font loading.
- Pause expensive updates when the tab is hidden.
- Respect `prefers-reduced-motion`: render the field but disable autonomous and interactive propagation.
- Cap backing resolution/device-pixel ratio rather than blindly rendering at full Retina density.

### Current prototype budget

- Simulation is approximately one cell per 5 device pixels, bounded by the hero dimensions.
- Typed arrays hold two scalar height buffers.
- A low-resolution image is scaled into the display canvas with smoothing.
- Rendering is throttled to 30fps.
- Resize recreates the field deliberately; future production work can debounce resizing or resample state if preserving waves during resize matters.

### Production upgrade path

If profiling shows CPU or upload cost on large displays, move the exact simulation to WebGL2:

- 256² or 512² half-float ping-pong textures.
- One update pass and one shading pass per frame.
- DPR capped at 1.5–2; simulation resolution independent from display resolution.
- Adaptive quality based on frame time, device memory, and reduced-motion/data preferences.
- Static CSS gradient fallback when Canvas/WebGL initialization fails.

## Accessibility and resilience

- Heading is semantic HTML and remains available if scripts or canvas fail.
- Canvas is decorative and hidden from assistive technology.
- Interaction requires no click and communicates no required information.
- Reduced-motion mode removes wave evolution.
- The white/cyan canvas has a CSS background fallback.
- Google font failure falls back to sans-serif without blocking content.

## Visual reference library

### Direct references supplied

- [Shadertoy XlSBRW](https://www.shadertoy.com/view/XlSBRW) — compelling physical droplet behavior; useful impact realism reference, but likely too representational for the final background.
- [Shadertoy llK3Dy](https://www.shadertoy.com/view/llK3Dy) — useful surface texture reference; color and speed need substantial reduction.

### Physics and interaction

- [Evan Wallace — WebGL Water](https://madebyevan.com/webgl-water/) — canonical height-field water with interactive ripples, reflection, refraction, caustics, and normal-based lighting.
- [jquery.ripples](https://github.com/sirxemic/jquery.ripples) — practical background-oriented WebGL ripples with configurable resolution, radius, perturbance, and programmatic drops.
- [DCtheTall/webgl-ripple](https://github.com/DCtheTall/webgl-ripple) — Verlet integration using recent height-map states, followed by normal/refraction shading.
- [alexfigliolia/ripples](https://github.com/alexfigliolia/ripples) — modern TypeScript continuation of background ripple effects, with dynamic device resolution.
- [Observable: Oscillations & Water Ripples](https://observablehq.com/@sxywu/04-oscillations-water-ripples) — approachable radial-wave construction.
- [Observable: 3D Ripple Simulator](https://observablehq.com/@analyzer2004/ripple-simulator) — surface displacement and ripple form reference.
- [Observable: WebGL Fluid Simulation](https://observablehq.com/@jashkenas/webgl-fluid-simulation) — useful contrast between wave and full fluid simulation.
- [Observable: Gerstner Water Shader](https://observablehq.com/@jonji/gerstner-water-shader) — directional wave construction; potentially relevant when disturbances later enter from multiple directions.

### Surface, caustic, and composition

- [Originkit Reflect Background](https://www.originkit.dev/components/reflect-background) — pale/full-bleed caustic treatment, aspect-correct pointer falloff, capped DPR, and softened compositing.
- [Originkit Elemental Water](https://www.originkit.dev/components/elemental-water) — damped ping-pong wave simulation, random drops, gradient normals, and restrained refraction.
- [Codrops RainEffect](https://github.com/codrops/RainEffect) — drop-map channels driving refraction, shine, and shadow compositing.
- [Waterdroplet WebGL Shader](https://gist.github.com/califat/f3049174d4a3589d9017b0a8618cfc0d) — texture-based droplet refraction structure.
- [Heartfelt shader source mirror](https://github.com/sanxincao/shadertoy/blob/master/heartfelt.glsl) — procedural static drops, moving drops, trails, fog clearing, and multi-layer compositing.
- [Water Ripple Headline](https://crazygl.com/hero/water-ripple-headline) — typography/water hierarchy reference; much more cinematic and contrast-heavy than the desired direction.
- [Water with primitive caustics](https://godotshaders.com/shader/water-with-primitive-caustics/) — compact multi-texture distortion and highlight method.
- [Seascape shader source](https://github.com/tdmaav/shadertoy/blob/master/Seascape.shader) — Fresnel, reflected/refracted color, and specular fundamentals; not a direct visual target.

## Iteration checklist

1. Tune first impression: more white vs. more cyan.
2. Tune ripple visibility at rest and during pointer movement.
3. Decide whether title should remain optically untouched or receive extremely slight refraction.
4. Test drop cadence and whether impacts should originate visibly above the plane.
5. Test mobile touch behavior before enabling touch-generated wakes.
6. Profile representative low-power hardware, then decide whether Canvas 2D remains sufficient or WebGL2 is warranted.
