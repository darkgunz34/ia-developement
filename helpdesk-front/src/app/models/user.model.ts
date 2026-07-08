/**
 * Authenticated user of the helpdesk.
 * The acronym is a 2-character handle also used to color the avatar.
 */
export interface User {
  name: string;
  acro: string;
  color: string;
}

/** Palette used to color a user's avatar deterministically from their acronym. */
export const ACCENTS: readonly string[] = [
  '#4b57d6',
  '#0e9384',
  '#dc6803',
  '#1570ef',
  '#d92d20',
  '#6938ef',
  '#067647',
  '#5925dc',
];

/** Keep only A–Z/0–9, uppercase, at most 2 chars — mirrors the login field constraint. */
export function normalizeAcronym(input: string): string {
  return input.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 2);
}

/** Deterministic accent color for an acronym (same acronym → same color). */
export function colorForAcronym(acro: string): string {
  let hash = 0;
  for (let i = 0; i < acro.length; i++) hash = (hash * 31 + acro.charCodeAt(i)) >>> 0;
  return ACCENTS[hash % ACCENTS.length];
}
