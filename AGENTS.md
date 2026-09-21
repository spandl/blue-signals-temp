# Teamfluence marketing site

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
