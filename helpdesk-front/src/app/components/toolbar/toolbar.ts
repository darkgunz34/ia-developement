import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { PriorityKey, StatusKey } from '../../models/ticket.models';
import { TicketStore } from '../../services/ticket-store';
import { AuthService } from '../../services/auth.service';

/** Top header: branding, search, filters, view toggle, new-ticket action. */
@Component({
  selector: 'app-toolbar',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <header>
      <div class="brand">
        <div class="logo">HD</div>
        <div class="titles">
          <div class="app-title">Tickets · Helpdesk</div>
          <div class="counts">{{ store.openCount() }} ouverts · {{ store.totalCount() }} au total</div>
        </div>
      </div>

      <div class="search">
        <span class="icon">⌕</span>
        <input
          type="search"
          [value]="store.search()"
          (input)="store.setSearch($any($event.target).value)"
          placeholder="Rechercher un ticket, un n°…"
        />
      </div>

      <select
        class="select"
        [value]="store.statusFilter()"
        (change)="store.setStatusFilter($any($event.target).value)"
        aria-label="Filtrer par statut"
      >
        <option value="all">Tous statuts</option>
        <option value="ouvert">Ouvert</option>
        <option value="en_cours">En cours</option>
        <option value="en_attente">En attente</option>
        <option value="ferme">Fermé</option>
      </select>

      <select
        class="select"
        [value]="store.priorityFilter()"
        (change)="store.setPriorityFilter($any($event.target).value)"
        aria-label="Filtrer par priorité"
      >
        <option value="all">Toutes priorités</option>
        <option value="urgente">Urgente</option>
        <option value="haute">Haute</option>
        <option value="moyenne">Moyenne</option>
        <option value="basse">Basse</option>
      </select>

      <div class="segmented">
        <button [class.active]="store.view() === 'kanban'" (click)="store.setView('kanban')">Kanban</button>
        <button [class.active]="store.view() === 'table'" (click)="store.setView('table')">Tableau</button>
      </div>

      <button class="btn-primary" (click)="store.openCreate()">
        <span class="plus">+</span> Nouveau ticket
      </button>

      @if (auth.user(); as user) {
        <div class="user">
          <span class="avatar" [style.background]="user.color" [title]="user.name">{{ user.acro }}</span>
          <div class="who">
            <div class="name">{{ user.name }}</div>
            <button class="logout" (click)="auth.logout()">Déconnexion</button>
          </div>
        </div>
      }
    </header>
  `,
  styles: `
    header {
      display: flex;
      align-items: center;
      gap: 14px;
      flex-wrap: wrap;
      padding: 11px 20px;
      background: var(--surface);
      border-bottom: 1px solid var(--border);
      flex: none;
    }
    .brand {
      display: flex;
      align-items: center;
      gap: 11px;
      margin-right: auto;
    }
    .logo {
      width: 32px;
      height: 32px;
      border-radius: var(--radius);
      background: var(--text);
      color: #fff;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 700;
      font-size: 13px;
      letter-spacing: 0.02em;
      flex: none;
    }
    .titles {
      line-height: 1.2;
    }
    .app-title {
      font-size: 15px;
      font-weight: 600;
    }
    .counts {
      font-size: 12px;
      color: var(--muted);
    }
    .search {
      position: relative;
      flex: 1;
      min-width: 190px;
      max-width: 320px;
    }
    .search .icon {
      position: absolute;
      left: 11px;
      top: 50%;
      transform: translateY(-50%);
      color: var(--muted-2);
      font-size: 14px;
      pointer-events: none;
    }
    .search input {
      width: 100%;
      padding: 8px 12px 8px 30px;
      border: 1px solid var(--border-3);
      border-radius: var(--radius);
      font-size: 13px;
      font-family: inherit;
      background: #f7f8fa;
      color: var(--text);
      outline: none;
    }
    .search input:focus {
      border-color: var(--accent);
      background: var(--surface);
    }
    .segmented {
      display: inline-flex;
      background: #eef0f3;
      border-radius: var(--radius);
      padding: 2px;
      gap: 2px;
      flex: none;
    }
    .segmented button {
      padding: 6px 13px;
      border: none;
      border-radius: 6px;
      font-size: 12.5px;
      font-weight: 600;
      cursor: pointer;
      font-family: inherit;
      color: var(--muted);
      background: transparent;
    }
    .segmented button.active {
      color: var(--text);
      background: var(--surface);
      box-shadow: 0 1px 2px rgba(16, 24, 40, 0.12);
    }
    .plus {
      font-size: 15px;
      line-height: 1;
      margin-top: -1px;
    }
    .user {
      display: flex;
      align-items: center;
      gap: 8px;
      padding-left: 12px;
      margin-left: 2px;
      border-left: 1px solid var(--border);
      flex: none;
    }
    .user .avatar {
      width: 30px;
      height: 30px;
      border-radius: 999px;
      color: #fff;
      font-size: 11px;
      font-weight: 600;
      letter-spacing: 0.02em;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      flex: none;
    }
    .user .who {
      line-height: 1.15;
    }
    .user .name {
      font-size: 12.5px;
      font-weight: 600;
      color: var(--text);
      max-width: 120px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .user .logout {
      background: none;
      border: none;
      padding: 0;
      font-size: 11px;
      color: var(--muted);
      cursor: pointer;
      font-family: inherit;
    }
    .user .logout:hover {
      color: var(--text-2);
    }
  `,
})
export class Toolbar {
  protected readonly store = inject(TicketStore);
  protected readonly auth = inject(AuthService);

  // Kept for template type-safety of the option values.
  protected readonly statusKeys: readonly (StatusKey | 'all')[] = [
    'all',
    'ouvert',
    'en_cours',
    'en_attente',
    'ferme',
  ];
  protected readonly priorityKeys: readonly (PriorityKey | 'all')[] = [
    'all',
    'urgente',
    'haute',
    'moyenne',
    'basse',
  ];
}
