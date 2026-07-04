export const CONTACT_EMAIL = 'aniruddhattu@gmail.com';

export function contactMailto() {
  return `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(
    'gitabyverse.com — Contact',
  )}`;
}

export function featureRequestMailto() {
  const subject = 'gitabyverse.com — Feature request';
  const body = `I'd like to suggest the following for gitabyverse.com:

[Describe your idea here]

(Optional) Which page or verse is this about?


`;
  return `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(
    subject,
  )}&body=${encodeURIComponent(body)}`;
}
