jcalc is a webapp similar to Soulver. It's a natural language notepad calculator. For example, you can have a session that looks like:

```
rate = $5/hour
work time = 10 hours
total cost = rate * work time
```

And the sidebar output for each line would be:

```
$5/hour
10 hours
$50
```

# Project structure

This directory (`webapp`) contains the application logic. The sibling directory `CodeFlask` is a fork of [CodeFlask](https://github.com/kazzkiq/CodeFlask) that adds a `rightSidebar` option, used here to render each line's computed result next to the editor. `webapp`'s `package.json` depends on it via a `file:../CodeFlask` reference, so the two directories must stay side by side.

# Implementation

The calculator is built on [math.js](https://mathjs.org/), configured to use `BigNumber` for precision. Each line typed into the editor is preprocessed (`src/line.ts`) before being handed to math.js, so it can support notation math.js doesn't natively understand:

- Multi-word variable names (`total cost = rate * hours`) are rewritten to snake_case identifiers, with special-casing around `to` (unit conversion syntax, e.g. `total cost to $/year`).
- Comma-separated numbers (`1,234`) have their commas stripped.
- Prefix currency symbols (`$5`) are rewritten as suffix units (`5$`) to match math.js unit syntax.
- Lines starting with `//` or `#`, and trailing `//` comments, are treated as comments/headers and stripped.

`src/units.ts` registers a custom `USD` unit (aliases: `$`, `usd`, `dollar`, `dollars`) and patches `math.Unit.isValidAlpha` so `$` is accepted in unit expressions, enabling arithmetic across currency and other units.

Each evaluated line's raw math.js result (a `BigNumber`, `Unit`, etc.) is turned into a display string by `formatOutput` (`src/output.ts`) before being fed back into CodeFlask's right sidebar via `onUpdate`, one line at a time. Formatting is centralized there intentionally, as the intended home for future output-formatting improvements — e.g. rendering `Unit` results with a prefix currency symbol (`$50`) instead of math.js's default suffix style (`50 $`).

`src/units.ts`'s unit list also drives `scripts/generate-unit-regex.ts`, a benchmarking script exploring regex strategies for matching unit names/prefixes (not currently wired into the app).

## Persistence

There's no backend. The editor's contents are compressed and stored in the URL hash (`src/compress.ts`), which tries three encodings (base64, LZ-string, URL-encoding) and keeps whichever is shortest. Saving is manual via the Save button, or automatic if the Autosave checkbox is enabled (preference persisted in `localStorage`). An unsaved-changes indicator warns before navigating away with unsaved edits.

# Development

- `npm run dev` — build in watch mode and serve `public/` locally
- `npm test` — run Jest unit tests
- `npm run test:e2e` — build the app and run headless-browser tests (`e2e/`, via Playwright) against it
- `npm run lint` / `npm run fmt` — ESLint / Prettier

Rollup bundles `src/main.ts` (and `src/debug.ts`, a scratch entry point for manual testing) into `public/module/`, with mathjs and codeflask split into separate vendor chunks.
