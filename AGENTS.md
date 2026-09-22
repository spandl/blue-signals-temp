# Blue Signals marketing site

SvelteKit (TypeScript) + Tailwind CSS v4, `adapter-static` + `prerender`. App lives in `src/`.

## Commands

- `npm run dev` — dev server
- `npm run build` — static build to `build/`
- `npm run check` — svelte-check typecheck

## Figma MCP (Framelink figma-developer-mcp)

- Registered in `.devin/mcp_config.json` at `http://localhost:3333/mcp`.
- Requires `FIGMA_API_KEY` in `.env` (gitignored — never commit).
- Start: `npx figma-developer-mcp` (background, from repo root).
- Health check: `curl -s -o /dev/null -w "%{http_code}" http://localhost:3333/mcp` → `405` = running, connection refused = down.

## Layout

- `planning/` — marketing copy and product docs (source of truth for copy).
- `exploration/` — prototypes; do not modify.

## Next steps (planned)

- Animate the content stacks (ContentSection/main visual + FeatureRow — bubble scrolls in centered, then slides to its side revealing copy; `FeatureRow.svelte` already has `.bubble` wrapper as transform target)
- Breakpoint layouts (Figma is 1680px desktop-only)
- Finalize footer (design + implementation — currently a teal stub)
- Contact sales CTA (design + implementation)
- Deploy to GitHub + Vercel for preview
- Menu: figure out behavior/look (design + implementation — button is a stub in `Header.svelte`)

## Component map (Storybook = source of truth)

- `Header/*` — Header (water + wake canvases, menu button, slotted overlay), Logo, LogoTagline, WaterCanvas
- `Components/*` — Button (primary/secondary CTA), Logo
- `Content/*` — Intro, ContentSection, FeatureRow
- `Layout/*` — Footer
- `Pages/Home` — full page assembly
- `src/lib/wake/WakeSimulation.ts` — local regl port of the Observable dispersion notebook; `src/lib/water/WaterSimulation.ts` — canvas-2D drops sim
- New story files need a Storybook restart to be indexed
