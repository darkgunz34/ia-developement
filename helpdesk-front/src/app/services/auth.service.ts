import { Injectable, computed, signal } from '@angular/core';

import { PEOPLE, Person } from '../models/ticket.models';
import { User, colorForAcronym, normalizeAcronym } from '../models/user.model';

const STORAGE_KEY = 'hd_user';

/**
 * Holds the authenticated user and gates access to the board.
 *
 * The session is persisted to localStorage so a reload keeps the user logged in.
 * `resolvePerson` is the single place that turns an assignee key into a display
 * name/color — teammates come from PEOPLE, the current user is tagged "(moi)".
 */
@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly _user = signal<User | null>(this.restore());
  readonly user = this._user.asReadonly();
  readonly isAuthenticated = computed(() => this._user() !== null);

  /** Attempts a login; returns an error message on failure, or null on success. */
  login(name: string, acronym: string): string | null {
    const trimmed = name.trim();
    const acro = normalizeAcronym(acronym);
    if (!trimmed) return 'Renseignez un pseudo.';
    if (acro.length !== 2) return 'L’acronyme doit faire exactement 2 caractères.';

    const user: User = { name: trimmed, acro, color: colorForAcronym(acro) };
    this.persist(user);
    this._user.set(user);
    return null;
  }

  logout(): void {
    this.persist(null);
    this._user.set(null);
  }

  /**
   * Resolves a ticket assignee key to a display Person.
   * Known teammates come from PEOPLE; the current user's own acronym is tagged
   * "(moi)"; anything else falls back to a neutral grey chip.
   */
  resolvePerson(acro: string | null): Person | null {
    if (!acro) return null;
    const known = PEOPLE[acro];
    if (known) return known;
    const current = this._user();
    if (current && current.acro === acro) return { name: `${current.name} (moi)`, color: current.color };
    return { name: acro, color: '#667085' };
  }

  private restore(): User | null {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? (JSON.parse(raw) as User) : null;
    } catch {
      return null;
    }
  }

  private persist(user: User | null): void {
    try {
      if (user) localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
      else localStorage.removeItem(STORAGE_KEY);
    } catch {
      /* localStorage may be unavailable (private mode); ignore. */
    }
  }
}
