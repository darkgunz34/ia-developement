/**
 * Auth domain model.
 * `acro` is the 2-letter monogram displayed as avatar; `color` is derived
 * deterministically from the acronym so the same person always gets the same
 * hue, even if they are not in the PEOPLE roster.
 */
export interface AuthUser {
  name: string;
  acro: string;
  color: string;
}

/** Palette used when the acronym is not one of the pre-defined PEOPLE. */
const AVATAR_PALETTE = [
  '#4b57d6',
  '#0e9384',
  '#dc6803',
  '#1570ef',
  '#d92d20',
  '#6938ef',
  '#2e90fa',
  '#7a5af8',
  '#f79009',
  '#17b26a',
];

export function colorForAcro(acro: string): string {
  const key = acro.trim().toUpperCase();
  if (!key) return AVATAR_PALETTE[0];
  let hash = 0;
  for (let i = 0; i < key.length; i++) hash = (hash * 31 + key.charCodeAt(i)) | 0;
  return AVATAR_PALETTE[Math.abs(hash) % AVATAR_PALETTE.length];
}
