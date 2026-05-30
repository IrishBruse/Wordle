# Agent instructions

## Before finishing work

Run the full verification suite and fix any failures:

```bash
npm run verify
```

`verify` runs, in order:

1. `npm run check:src` - Biome lint and format on `src/` and `vite.config.ts`
2. `npm test` - Vitest unit tests
3. `npm run build` - Production build and static export

Do not mark a task complete until `npm verify` exits successfully.

## Other commands

| Command | Purpose |
|---------|---------|
| `npm dev` | Local dev server (port 3000) |
| `npm check` | Biome on all configured paths (includes `.vscode/`) |
| `npm format` | Apply Biome formatting |
