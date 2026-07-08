/**
 * Domain model for the Helpdesk Kanban board.
 * These types mirror the shape returned by the (future) backend API.
 */

export type PriorityKey = 'urgente' | 'haute' | 'moyenne' | 'basse';
export type StatusKey = 'ouvert' | 'en_cours' | 'en_attente' | 'ferme';

/** A support ticket. `assignee` holds a person key (initials) or null when unassigned. */
export interface Ticket {
  id: number;
  title: string;
  priority: PriorityKey;
  status: StatusKey;
  category: string;
  assignee: string | null;
  /** Creation date, displayed as-is (e.g. "05/07"). */
  created: string;
  /** Free-text SLA indicator (e.g. "6 h restantes", "SLA dépassé"). */
  sla: string;
  overdue?: boolean;
  done?: boolean;
  desc: string;
}

export interface PriorityMeta {
  label: string;
  color: string;
  bg: string;
  dot: string;
  /** Sort rank — 0 is the most urgent. */
  rank: number;
}

export interface StatusMeta {
  label: string;
  color: string;
  dot: string;
  /** Column order on the board. */
  order: number;
}

export interface Person {
  name: string;
  color: string;
}

export const PRIORITIES: Record<PriorityKey, PriorityMeta> = {
  urgente: { label: 'Urgente', color: '#b42318', bg: '#fef3f2', dot: '#d92d20', rank: 0 },
  haute: { label: 'Haute', color: '#b54708', bg: '#fffaeb', dot: '#f79009', rank: 1 },
  moyenne: { label: 'Moyenne', color: '#175cd3', bg: '#eff8ff', dot: '#2e90fa', rank: 2 },
  basse: { label: 'Basse', color: '#475467', bg: '#f2f4f7', dot: '#98a2b3', rank: 3 },
};

export const STATUSES: Record<StatusKey, StatusMeta> = {
  ouvert: { label: 'Ouvert', color: '#175cd3', dot: '#2e90fa', order: 0 },
  en_cours: { label: 'En cours', color: '#5925dc', dot: '#7a5af8', order: 1 },
  en_attente: { label: 'En attente', color: '#b54708', dot: '#f79009', order: 2 },
  ferme: { label: 'Fermé', color: '#067647', dot: '#17b26a', order: 3 },
};

export const PEOPLE: Record<string, Person> = {
  CR: { name: 'Camille Roy', color: '#4b57d6' },
  YB: { name: 'Yanis Bouhala', color: '#0e9384' },
  LF: { name: 'Léa Fontaine', color: '#dc6803' },
  MP: { name: 'Marc Petit', color: '#1570ef' },
  SN: { name: 'Sofia Nguyen', color: '#d92d20' },
  TG: { name: 'Théo Girard', color: '#6938ef' },
};

/** Column order, left to right. */
export const STATUS_ORDER: StatusKey[] = ['ouvert', 'en_cours', 'en_attente', 'ferme'];

/** Priority order for filter dropdowns. */
export const PRIORITY_ORDER: PriorityKey[] = ['urgente', 'haute', 'moyenne', 'basse'];

/** Convenience accessors used across components. */
export function personOf(ticket: Ticket): Person | null {
  return ticket.assignee ? PEOPLE[ticket.assignee] ?? null : null;
}
