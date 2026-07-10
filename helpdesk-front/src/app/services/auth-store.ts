import { Injectable, computed, signal } from '@angular/core';

import { PEOPLE } from '../models/ticket.models';
import { AuthUser, colorForAcro } from '../models/auth.models';

const STORAGE_KEY = 'helpdesk.auth.user';

/**
 * Signal-based auth store. Holds the connected user (or null) and persists it
 * in localStorage so a page reload keeps the session. No backend today —
 * `login()` accepts any pseudo + 2-letter acronym.
 */
@Injectable({ providedIn: 'root' })
export class AuthStore {
  private readonly _user = signal<AuthUser | null>(readFromStorage());

  readonly user = this._user.asReadonly();
  readonly isAuthed = computed(() => this._user() !== null);

  login(name: string, acro: string): { ok: true } | { ok: false; error: string } {
    const trimmedName = name.trim();
    const cleanAcro = acro.trim().toUpperCase();

    if (!trimmedName) return { ok: false, error: 'Merci de renseigner un pseudo.' };
    if (cleanAcro.length !== 2) {
      return { ok: false, error: 'L’acronyme doit contenir exactement 2 caractères.' };
    }
    if (!/^[A-Z]{2}$/.test(cleanAcro)) {
      return { ok: false, error: 'L’acronyme ne doit contenir que des lettres.' };
    }

    const known = PEOPLE[cleanAcro];
    const user: AuthUser = {
      name: known?.name ?? trimmedName,
      acro: cleanAcro,
      color: known?.color ?? colorForAcro(cleanAcro),
    };
    this._user.set(user);
    writeToStorage(user);
    return { ok: true };
  }

  logout(): void {
    this._user.set(null);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      /* ignore — storage may be unavailable in private mode */
    }
  }
}

function readFromStorage(): AuthUser | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as AuthUser;
    if (parsed && typeof parsed.name === 'string' && typeof parsed.acro === 'string') {
      return parsed;
    }
    return null;
  } catch {
    return null;
  }
}

function writeToStorage(user: AuthUser): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
  } catch {
    /* ignore */
  }
}
