/**
 * Generate public/sitemap.xml from gita-map.json chapter verse counts.
 *
 * Usage:
 *   node scripts/generate-sitemap.js
 */

const fs = require("fs");
const path = require("path");

const SITE_URL = "https://www.gitabyverse.com";
const DEFAULT_DATA_PATH = path.join(
  __dirname,
  "..",
  "public",
  "data",
  "gita-map.json",
);
const OUTPUT_PATH = path.join(__dirname, "..", "public", "sitemap.xml");

function xmlEscape(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function urlEntry(loc, changefreq, priority) {
  return [
    "  <url>",
    `    <loc>${xmlEscape(loc)}</loc>`,
    `    <changefreq>${changefreq}</changefreq>`,
    `    <priority>${priority}</priority>`,
    "  </url>",
  ].join("\n");
}

function main() {
  const dataPath = process.env.GITA_DATA_PATH || DEFAULT_DATA_PATH;
  const data = JSON.parse(fs.readFileSync(dataPath, "utf8"));
  const chapterVerseCounts = data.chapterVerseCounts || {};
  const entries = [urlEntry(`${SITE_URL}/`, "weekly", "1.0")];

  for (let chapter = 1; chapter <= 18; chapter += 1) {
    const chapterKey = String(chapter);
    const verseCount = chapterVerseCounts[chapterKey];
    if (!verseCount) continue;

    entries.push(
      urlEntry(`${SITE_URL}/${chapter}`, "weekly", "0.8"),
    );

    for (let verse = 1; verse <= verseCount; verse += 1) {
      entries.push(
        urlEntry(`${SITE_URL}/${chapter}/${verse}`, "monthly", "0.6"),
      );
    }
  }

  const xml = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    entries.join("\n"),
    "</urlset>",
    "",
  ].join("\n");

  fs.writeFileSync(OUTPUT_PATH, xml);
  console.log(`Wrote ${OUTPUT_PATH} (${entries.length} URLs)`);
}

main();
