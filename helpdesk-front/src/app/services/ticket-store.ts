import { Injectable, computed, inject, signal } from '@angular/core';

import {
  PRIORITIES,
  STATUSES,
  STATUS_ORDER,
  PEOPLE,
  PriorityKey,
  StatusKey,
  StatusMeta,
  Ticket,
} from '../models/ticket.models';
import { TicketApiService } from './ticket-api.service';

export type BoardView = 'kanban' | 'table';
export type SortKey = 'title' | 'id' | 'priority' | 'status';
export type SortDir = 'asc' | 'desc';

/** A Kanban column with its resolved tickets. */
export interface ColumnView {
  key: StatusKey;
  meta: StatusMeta;
  tickets: Ticket[];
}

/**
 * Signal-based store: the single source of truth for board state.
 * UI state (filters, view, selection, drag, sort) lives here alongside the
 * ticket list; every derived view is a `computed`, so components stay dumb.
 */
@Injectable({ providedIn: 'root' })
export class TicketStore {
  private readonly api = inject(TicketApiService);

  // --- Raw data -------------------------------------------------------------
  private readonly _tickets = signal<Ticket[]>([]);
  readonly tickets = this._tickets.asReadonly();

  // --- UI state -------------------------------------------------------------
  readonly view = signal<BoardView>('kanban');
  readonly search = signal('');
  readonly statusFilter = signal<StatusKey | 'all'>('all');
  readonly priorityFilter = signal<PriorityKey | 'all'>('all');
  readonly selectedId = signal<number | null>(null);
  readonly draggingId = signal<number | null>(null);
  readonly dragOverColumn = signal<StatusKey | null>(null);
  readonly sortKey = signal<SortKey>('priority');
  readonly sortDir = signal<SortDir>('asc');

  constructor() {
    this.load();
  }

  load(): void {
    this.api.list().subscribe((tickets) => this._tickets.set(tickets));
  }

  // --- Derived views --------------------------------------------------------
  readonly filtered = computed<Ticket[]>(() => {
    const q = this.search().trim().toLowerCase();
    const status = this.statusFilter();
    const priority = this.priorityFilter();

    return this._tickets().filter((t) => {
      if (status !== 'all' && t.status !== status) return false;
      if (priority !== 'all' && t.priority !== priority) return false;
      if (q) {
        const person = t.assignee ? PEOPLE[t.assignee]?.name ?? '' : '';
        const haystack = `${t.title} #${t.id} ${t.category} ${person}`.toLowerCase();
        if (!haystack.includes(q)) return false;
      }
      return true;
    });
  });

  readonly columns = computed<ColumnView[]>(() => {
    const list = this.filtered();
    return STATUS_ORDER.map((key) => ({
      key,
      meta: STATUSES[key],
      tickets: list.filter((t) => t.status === key),
    }));
  });

  readonly tableRows = computed<Ticket[]>(() => {
    const rows = [...this.filtered()];
    const key = this.sortKey();
    const dir = this.sortDir() === 'asc' ? 1 : -1;

    rows.sort((a, b) => {
      let av: number | string;
      let bv: number | string;
      switch (key) {
        case 'priority':
          av = PRIORITIES[a.priority].rank;
          bv = PRIORITIES[b.priority].rank;
          break;
        case 'status':
          av = STATUSES[a.status].order;
          bv = STATUSES[b.status].order;
          break;
        case 'id':
          av = a.id;
          bv = b.id;
          break;
        default:
          av = a.title.toLowerCase();
          bv = b.title.toLowerCase();
      }
      if (av < bv) return -1 * dir;
      if (av > bv) return 1 * dir;
      return a.id - b.id;
    });
    return rows;
  });

  readonly selected = computed<Ticket | null>(() => {
    const id = this.selectedId();
    if (id == null) return null;
    return this._tickets().find((t) => t.id === id) ?? null;
  });

  readonly openCount = computed(() => this._tickets().filter((t) => t.status !== 'ferme').length);
  readonly totalCount = computed(() => this._tickets().length);
  readonly shownCount = computed(() => this.filtered().length);
  readonly noResults = computed(() => this.filtered().length === 0);
  readonly filtersActive = computed(
    () => this.search() !== '' || this.statusFilter() !== 'all' || this.priorityFilter() !== 'all',
  );

  // --- Actions --------------------------------------------------------------
  setView(view: BoardView): void {
    this.view.set(view);
  }

  setSearch(value: string): void {
    this.search.set(value);
  }

  setStatusFilter(value: StatusKey | 'all'): void {
    this.statusFilter.set(value);
  }

  setPriorityFilter(value: PriorityKey | 'all'): void {
    this.priorityFilter.set(value);
  }

  clearFilters(): void {
    this.search.set('');
    this.statusFilter.set('all');
    this.priorityFilter.set('all');
  }

  selectTicket(id: number): void {
    this.selectedId.set(id);
  }

  closePanel(): void {
    this.selectedId.set(null);
  }

  toggleSort(key: SortKey): void {
    if (this.sortKey() === key) {
      this.sortDir.update((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      this.sortKey.set(key);
      this.sortDir.set('asc');
    }
  }

  updateStatus(id: number, status: StatusKey): void {
    this.patch(id, { status });
  }

  updatePriority(id: number, priority: PriorityKey): void {
    this.patch(id, { priority });
  }

  // --- Drag & drop ----------------------------------------------------------
  beginDrag(id: number): void {
    this.draggingId.set(id);
  }

  endDrag(): void {
    this.draggingId.set(null);
    this.dragOverColumn.set(null);
  }

  setDragOver(column: StatusKey | null): void {
    if (this.dragOverColumn() !== column) this.dragOverColumn.set(column);
  }

  dropOn(column: StatusKey): void {
    const id = this.draggingId();
    if (id != null) this.patch(id, { status: column });
    this.endDrag();
  }

  /** Optimistic local update, then persist through the API seam. */
  private patch(id: number, changes: Partial<Ticket>): void {
    this._tickets.update((tickets) =>
      tickets.map((t) => (t.id === id ? { ...t, ...changes } : t)),
    );
    this.api.update(id, changes).subscribe();
  }
}
