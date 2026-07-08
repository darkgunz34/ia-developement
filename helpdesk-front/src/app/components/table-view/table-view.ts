import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';

import { PEOPLE } from '../../models/ticket.models';
import { SortKey, TicketStore } from '../../services/ticket-store';
import { PriorityBadge } from '../priority-badge/priority-badge';
import { StatusPill } from '../status-pill/status-pill';
import { Avatar } from '../avatar/avatar';

/** Sortable table view of the filtered tickets. */
@Component({
  selector: 'app-table-view',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [PriorityBadge, StatusPill, Avatar],
  template: `
    <div class="wrap">
      <div class="card">
        <table>
          <thead>
            <tr>
              <th class="sortable" (click)="store.toggleSort('title')">
                Titre <span class="arrow">{{ arrow('title') }}</span>
              </th>
              <th class="sortable" (click)="store.toggleSort('id')">
                N° <span class="arrow">{{ arrow('id') }}</span>
              </th>
              <th class="sortable" (click)="store.toggleSort('priority')">
                Priorité <span class="arrow">{{ arrow('priority') }}</span>
              </th>
              <th class="sortable" (click)="store.toggleSort('status')">
                Statut <span class="arrow">{{ arrow('status') }}</span>
              </th>
              <th>Catégorie</th>
              <th>Assigné</th>
            </tr>
          </thead>
          <tbody>
            @for (ticket of store.tableRows(); track ticket.id) {
              <tr (click)="store.selectTicket(ticket.id)">
                <td class="title">{{ ticket.title }}</td>
                <td class="mono muted">#{{ ticket.id }}</td>
                <td><app-priority-badge [priority]="ticket.priority" /></td>
                <td><app-status-pill [status]="ticket.status" /></td>
                <td><span class="category-tag">{{ ticket.category }}</span></td>
                <td>
                  <span class="assignee">
                    <app-avatar [assignee]="ticket.assignee" />
                    <span>{{ name(ticket.assignee) }}</span>
                  </span>
                </td>
              </tr>
            }
          </tbody>
        </table>

        @if (store.noResults()) {
          <div class="no-results">Aucun ticket ne correspond aux filtres.</div>
        }
      </div>
    </div>
  `,
  styles: `
    .wrap {
      height: 100%;
      overflow: auto;
      padding: 16px 20px;
      box-sizing: border-box;
    }
    .card {
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: var(--radius-lg);
      overflow: hidden;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      font-size: 13px;
    }
    thead tr {
      background: #f7f8fa;
    }
    th {
      padding: 11px 16px;
      text-align: left;
      font-size: 11px;
      font-weight: 600;
      color: var(--muted);
      text-transform: uppercase;
      letter-spacing: 0.03em;
      white-space: nowrap;
      user-select: none;
    }
    th.sortable {
      cursor: pointer;
    }
    .arrow {
      color: var(--accent);
    }
    tbody tr {
      cursor: pointer;
      border-top: 1px solid var(--border-2);
    }
    tbody tr:hover {
      background: #f7f8fa;
    }
    td {
      padding: 10px 16px;
      color: var(--text-2);
      vertical-align: middle;
    }
    td.title {
      color: var(--text);
      font-weight: 500;
      min-width: 200px;
    }
    td.muted {
      color: var(--muted-2);
      font-size: 12px;
    }
    .assignee {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      color: var(--text-3);
    }
    .no-results {
      padding: 34px;
      text-align: center;
      font-size: 13px;
      color: var(--muted-2);
    }
  `,
})
export class TableView {
  protected readonly store = inject(TicketStore);

  private readonly sortState = computed(() => ({
    key: this.store.sortKey(),
    dir: this.store.sortDir(),
  }));

  protected arrow(key: SortKey): string {
    const { key: active, dir } = this.sortState();
    if (active !== key) return '';
    return dir === 'asc' ? '↑' : '↓';
  }

  protected name(assignee: string | null): string {
    return assignee ? PEOPLE[assignee]?.name ?? 'Non assigné' : 'Non assigné';
  }
}
