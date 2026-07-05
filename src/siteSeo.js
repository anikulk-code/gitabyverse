export const SITE_URL = 'https://www.gitabyverse.com';
export const SITE_NAME = 'Gita by Verse';

const DEFAULT_DESCRIPTION =
  'Browse the Bhagavad Gita verse by verse with Swami Sarvapriyananda\'s lectures and talks from other teachers in the Ramakrishna Order.';

function upsertMeta(attribute, key, content) {
  if (!content) return;
  let element = document.querySelector(`meta[${attribute}="${key}"]`);
  if (!element) {
    element = document.createElement('meta');
    element.setAttribute(attribute, key);
    document.head.appendChild(element);
  }
  element.setAttribute('content', content);
}

function upsertLink(rel, href) {
  let element = document.querySelector(`link[rel="${rel}"]`);
  if (!element) {
    element = document.createElement('link');
    element.setAttribute('rel', rel);
    document.head.appendChild(element);
  }
  element.setAttribute('href', href);
}

export function truncateDescription(text, maxLength = 155) {
  const normalized = String(text || '')
    .replace(/\s+/g, ' ')
    .trim();
  if (!normalized) return DEFAULT_DESCRIPTION;
  if (normalized.length <= maxLength) return normalized;
  return `${normalized.slice(0, maxLength - 1).trim()}…`;
}

export function absoluteUrl(path = '/') {
  if (!path || path === '/') return `${SITE_URL}/`;
  return `${SITE_URL}${path.startsWith('/') ? path : `/${path}`}`;
}

export function setPageSeo({ title, description, path = '/' }) {
  const pageTitle = title.includes(SITE_NAME) ? title : `${title} | ${SITE_NAME}`;
  const pageDescription = truncateDescription(description);
  const canonicalUrl = absoluteUrl(path);

  document.title = pageTitle;
  upsertMeta('name', 'description', pageDescription);
  upsertLink('canonical', canonicalUrl);

  upsertMeta('property', 'og:title', pageTitle);
  upsertMeta('property', 'og:description', pageDescription);
  upsertMeta('property', 'og:url', canonicalUrl);
  upsertMeta('property', 'og:type', 'website');
  upsertMeta('property', 'og:site_name', SITE_NAME);

  upsertMeta('name', 'twitter:card', 'summary');
  upsertMeta('name', 'twitter:title', pageTitle);
  upsertMeta('name', 'twitter:description', pageDescription);
}

export function landingPageSeo() {
  setPageSeo({
    title: 'Bhagavad Gita lectures mapped verse by verse',
    description:
      'Explore all 18 chapters of the Bhagavad Gita with verse-by-verse lectures from Swami Sarvapriyananda and other teachers.',
    path: '/',
  });
}

export function chapterPageSeo(chapter, chapterName, verseCount) {
  setPageSeo({
    title: `Bhagavad Gita Chapter ${chapter} — ${chapterName}`,
    description: `Browse all ${verseCount} verses in Bhagavad Gita chapter ${chapter}: ${chapterName}. Open any verse for Swami Sarvapriyananda's lecture and talks from other teachers.`,
    path: `/${chapter}`,
  });
}

export function versePageSeo({
  chapter,
  verse,
  chapterName,
  translationText,
  mapped,
}) {
  const base = `Bhagavad Gita ${chapter}.${verse}`;
  const title = mapped
    ? `${base} — lecture & translation`
    : `${base} — verse page`;

  const description = mapped
    ? `${base} (${chapterName}). ${translationText || ''} Watch Swami Sarvapriyananda's lecture and other teachers on this verse.`
    : `${base} in ${chapterName}. Verse page on gitabyverse.com — lecture mapping coming soon.`;

  setPageSeo({
    title,
    description,
    path: `/${chapter}/${verse}`,
  });
}
