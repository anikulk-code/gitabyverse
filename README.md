# Gita by Verse — gitabyverse.com

Standalone site for browsing the Bhagavad Gita verse by verse with Swami Sarvapriyananda's YouTube lectures and talks from other teachers in the Ramakrishna Order.

Extracted from the Vedanta Answers frontend; this repo contains **only** the Gita experience.

## Routes

| URL | Page |
|-----|------|
| `/` | Chapter grid + keyword search |
| `/2` | Chapter 2 verse grid |
| `/2/47` | Chapter 2, verse 47 |
| `?teacher=sarvapriyananda` | Hide other teachers |

## Local development

```bash
npm install
npm start
```

Open [http://localhost:3000](http://localhost:3000).

## Regenerate lecture data

Requires the Codex source JSON files on your machine (paths in `scripts/build-gita-data.js`):

```bash
npm run build:gita-data
```

Commits `public/data/gita-map.json`.

## Production build

```bash
CI=true npm run build
```

Output is in `build/`.

## Deploy to Azure Static Web Apps

1. Create a new Static Web App in Azure (or link this repo).
2. Copy `.github/workflows/azure-static-web-apps-gitabyverse.yml` and set the secret `AZURE_STATIC_WEB_APPS_API_TOKEN_GITABYVERSE` from the Azure portal.
3. Point **gitabyverse.com** custom domain to the Static Web App in Azure → Custom domains.

`staticwebapp.config.json` includes SPA fallback and the YouTube embed referrer policy fix.

## Project layout

```
public/data/gita-map.json   # shipped lecture + verse data
scripts/build-gita-data.js  # build from Codex JSON sources
src/components/gita/        # Gita UI
src/context/                # data fetch context
src/hooks/                  # teacher filter (?teacher=)
src/utils/gitaSearch.js     # keyword search
```
