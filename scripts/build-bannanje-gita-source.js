/**
 * Build bannanje-gita-lectures.json from the Gowri & Deepak Chebbi YouTube playlist.
 *
 * Usage:
 *   node scripts/build-bannanje-gita-source.js
 *
 * Optional env vars:
 *   BANANJE_PLAYLIST_ID
 *   BANANJE_OUTPUT_PATH
 */

const fs = require("fs");
const https = require("https");

const PLAYLIST_ID =
  process.env.BANANJE_PLAYLIST_ID || "PLC1MqI1sd10HL2sHZtFG7Qk6-35Y80gNQ";
const OUTPUT_PATH =
  process.env.BANANJE_OUTPUT_PATH ||
  "/Users/aniruddhakulkarni/Documents/CodexProjects/bannanje-gita-lectures.json";
const SWAMI = "Shri Bannanje Govindacharya";
const LANGUAGE = "Kannada";

function fetchPlaylistHtml(playlistId) {
  const url = `https://www.youtube.com/playlist?list=${playlistId}`;
  return new Promise((resolve, reject) => {
    https
      .get(
        url,
        {
          headers: {
            "User-Agent": "Mozilla/5.0",
          },
        },
        (res) => {
          let body = "";
          res.on("data", (chunk) => {
            body += chunk;
          });
          res.on("end", () => resolve(body));
        },
      )
      .on("error", reject);
  });
}

function expandVerseSpec(text) {
  let normalized = text.split("(")[0].trim();
  normalized = normalized.replace(/(\d+)\s*-?\s*and\s*(\d+)/gi, "$1,$2");
  normalized = normalized.replace(/(\d+)and(\d+)/gi, "$1,$2");
  normalized = normalized.replace(/(\d+)-to-?(\d+)/gi, "$1 to $2");

  const verses = new Set();
  const rangeRegex = /(\d+)\s*to\s*(\d+)/gi;
  let match;
  while ((match = rangeRegex.exec(normalized)) !== null) {
    const start = parseInt(match[1], 10);
    const end = parseInt(match[2], 10);
    for (let verse = Math.min(start, end); verse <= Math.max(start, end); verse++) {
      verses.add(verse);
    }
  }

  const remainder = normalized.replace(rangeRegex, ",");
  for (const token of remainder.split(/[,\s]+/)) {
    if (/^\d+$/.test(token)) {
      verses.add(parseInt(token, 10));
    }
  }

  return [...verses].sort((a, b) => a - b);
}

function parseBannanjeTitle(title) {
  if (title.trim() === "Bhagavad Gita Kannada by Sri Bannanje Govindacharya") {
    return null;
  }

  const normalized = title
    .replace(/^Bhagavad Gita Kannada\s+/i, "")
    .split(" by ")[0]
    .trim();
  const chapterMatch = normalized.match(/Ch[.\s-]*0*(\d+)/i);
  if (!chapterMatch) return null;

  const chapter = parseInt(chapterMatch[1], 10);
  const shlokaParts = normalized.split(/Shloka[.\s-]*/i);
  if (shlokaParts.length < 2) return null;

  const verses = expandVerseSpec(shlokaParts[1]);
  if (!verses.length) return null;

  return { chapter, verses };
}

function extractPlaylistVideos(html) {
  const chunks = html.split("lockupMetadataViewModel");
  const videos = [];
  const seen = new Set();

  for (const chunk of chunks.slice(1)) {
    const videoMatch = chunk.match(/"videoId":"([A-Za-z0-9_-]{11})"/);
    const titleMatch = chunk.match(/"content":"(Bhagavad Gita Kannada[^"]+)"/);
    if (!videoMatch || !titleMatch || seen.has(videoMatch[1])) continue;
    seen.add(videoMatch[1]);
    videos.push({
      videoId: videoMatch[1],
      title: titleMatch[1],
    });
  }

  return videos;
}

function buildSeries(videos) {
  const lectures = [];
  const verseToLectures = {};

  for (const video of videos) {
    const parsed = parseBannanjeTitle(video.title);
    const lecture = {
      videoId: video.videoId,
      title: video.title,
      url: `https://www.youtube.com/watch?v=${video.videoId}&list=${PLAYLIST_ID}`,
    };

    if (parsed) {
      lecture.covers = [
        {
          chapter: parsed.chapter,
          verseStart: parsed.verses[0],
          verseEnd: parsed.verses[parsed.verses.length - 1],
        },
      ];
      for (const verse of parsed.verses) {
        const key = `${parsed.chapter}.${verse}`;
        verseToLectures[key] ||= [];
        verseToLectures[key].push(video.videoId);
      }
    }

    lectures.push(lecture);
  }

  return {
    seriesId: "bannanje-govindacharya-gita-kannada",
    language: LANGUAGE,
    swami: SWAMI,
    affiliation: "Madhva tradition — Vidya Vachaspati, Padma Shri",
    channel: "Gowri & Deepak Chebbi",
    playlistId: PLAYLIST_ID,
    playlistUrl: `https://www.youtube.com/playlist?list=${PLAYLIST_ID}`,
    verseIndexSource: "playlist video titles (Ch NN Shloka NN patterns)",
    lectureCount: lectures.length,
    lecturesWithVerseIndex: lectures.filter((lecture) => lecture.covers).length,
    lectures,
    verseToLectures,
  };
}

async function main() {
  const html = await fetchPlaylistHtml(PLAYLIST_ID);
  const videos = extractPlaylistVideos(html);
  if (!videos.length) {
    throw new Error("No Bannanje playlist videos found in fetched HTML");
  }

  const output = {
    generatedAt: new Date().toISOString().slice(0, 10),
    description:
      "Verse-indexed Bhagavad Gita Kannada discourses by Shri Bannanje Govindacharya.",
    series: [buildSeries(videos)],
  };

  fs.mkdirSync(require("path").dirname(OUTPUT_PATH), { recursive: true });
  fs.writeFileSync(OUTPUT_PATH, `${JSON.stringify(output, null, 2)}\n`);

  const verseCount = Object.keys(output.series[0].verseToLectures).length;
  console.log(
    `Wrote ${OUTPUT_PATH} (${videos.length} lectures, ${verseCount} verse keys)`,
  );
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
