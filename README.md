# Construction Animation Studio

Premium cinematic construction-animation website built with Next.js App Router + TypeScript, Tailwind, Framer Motion, Canvas 2D, and Remotion.

## Stack

- Next.js App Router + TypeScript
- TailwindCSS
- Framer Motion
- Canvas 2D blend engine (`LayerStackCanvas`)
- Remotion video export pipeline (`/video`)
- Zod env validation + feature flags
- Mock-first data API with optional Supabase fallback

## Feature Flags

Configured in `lib/env.ts`:

- `NEXT_PUBLIC_MODE="mock"|"supabase"` (default: `mock`)
- `ENABLE_EXHIBITION=true` (default)
- `ENABLE_VIDEO_EXPORT=true` (default)

Create `.env.local`:

```bash
cp .env.example .env.local
```

No external keys are required for mock mode.

## One-Command Setup

```bash
npm run setup:local
```

Expected output includes:

- `Setup complete`
- `Manifest generated from placeholders` (or `Manifest generated from real assets`)

## Exact Commands

### 1) Install

```bash
npm install
```

Expected output contains:

- `added ... packages`
- `> art-site@0.1.0 postinstall`
- `Manifest generated from placeholders` (or from real assets)

### 2) Run in mock mode

```bash
npm run dev
```

Open:

- `http://127.0.0.1:3000/`
- `http://127.0.0.1:3000/gallery`
- `http://127.0.0.1:3000/exhibition`

Health check:

```bash
curl -s http://127.0.0.1:3000/api/health
```

Expected output shape:

```json
{"ok":true,"mode":"mock","featureFlags":{"exhibition":true,"videoExport":true},"timestamp":"..."}
```

### 3) Import real photos in one command

```bash
npm run assets:import -- "/absolute/or/relative/folder"
```

What it does:

- Copies `jpg/jpeg/png/webp` files into `public/assets`
- Detects final composite by filename containing `final|composite|merged`
- Falls back to largest image as final composite if no filename match
- Rebuilds `public/assets/manifest.json`
- Regenerates `data/photos.json` and `data/construction.json`

Expected output includes:

- `Imported <N> assets`
- `Manifest written with <N> sources`
- `Seed data updated: data/photos.json and data/construction.json`

### 4) Render video

Preview UI:

```bash
npm run video:preview
```

Render 1080p:

```bash
npm run video:render
```

Render 4k:

```bash
npm run video:render:4k
```

Expected output includes:

- `Composition: ConstructionSequence`
- Output file in `out/`

### 5) Deploy to Vercel (mock mode)

```bash
npm run build
```

Then deploy with Vercel defaults. Keep `NEXT_PUBLIC_MODE=mock` and no Supabase keys.

## Asset Pipeline

### Auto placeholder behavior

`npm run assets:manifest`:

- Scans `public/assets`
- If fewer than 2 real images exist (excluding `public/assets/placeholders/**`), it generates:
  - 10 placeholder sources
  - 1 fake final composite
  - `public/assets/manifest.json`

### Manifest format

`public/assets/manifest.json`:

```json
{
  "finalComposite": "final.png",
  "sources": [
    { "file": "source-1.jpg", "label": "Source 1", "depth": 0.15 }
  ],
  "generatedAt": "ISO_DATE"
}
```

## Available Scripts

```bash
npm run dev
npm run build
npm run start
npm run lint
npm run typecheck
npm run test
npm run test:e2e
npm run assets:generate
npm run assets:manifest
npm run assets:import -- "<path>"
npm run mock:ws
npm run mock:sse
npm run video:preview
npm run video:render
npm run video:render:4k
npm run setup:local
```

## Realtime Behavior

`subscribeToPhotos()` in `lib/db/client.ts`:

- Uses local websocket first: `ws://127.0.0.1:14567`
- Falls back automatically to SSE: `/api/events`

Run websocket mock server:

```bash
npm run mock:ws
```

## Tests and Quality Gates

```bash
npm run lint
npm run typecheck
npm run test
npm run test:e2e
```

## Project Structure

```text
app/
components/
lib/
data/
public/assets/
scripts/
video/
tests/
```
