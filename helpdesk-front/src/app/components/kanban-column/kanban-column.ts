import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';

import { ColumnView, TicketStore } from '../../services/ticket-store';
import { TicketCard } from '../ticket-card/ticket-card';

/** One Kanban column: header + scrollable list of cards, and a drop target. */
@Component({
  selector: 'app-kanban-column',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TicketCard],
  template: `
    <div
      class="column"
      [class.drag-over]="dragOver()"
      (dragover)="onDragOver($event)"
      (dragenter)="onDragEnter($event)"
      (drop)="onDrop($event)"
    >
      <div class="header">
        <span class="dot" [style.background]="column().meta.dot"></span>
        <span class="label">{{ column().meta.label }}</span>
        <span class="count">{{ column().tickets.length }}</span>
      </div>

      <div class="list">
        @for (ticket of column().tickets; track ticket.id) {
          <app-ticket-card [ticket]="ticket" />
        } @empty {
          <div class="empty">Aucun ticket</div>
        }
      </div>
    </div>
  `,
  styles: `
    .column {
      width: 300px;
      flex: none;
      display: flex;
      flex-direction: column;
      max-height: 100%;
      background: var(--column-bg);
      border-radius: var(--radius-lg);
      padding: 10px;
      box-sizing: border-box;
      border: 1.5px solid transparent;
      transition: border-color 0.12s ease, background 0.12s ease;
    }
    .column.drag-over {
      border-color: var(--accent);
      border-style: dashed;
    }
    .header {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 2px 4px 11px;
      flex: none;
    }
    .dot {
      width: 8px;
      height: 8px;
      border-radius: 999px;
      flex: none;
    }
    .label {
      font-size: 13px;
      font-weight: 600;
      color: var(--text-2);
    }
    .count {
      margin-left: auto;
      font-size: 12px;
      font-weight: 600;
      color: var(--muted);
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: 6px;
      padding: 0 7px;
      line-height: 20px;
    }
    .list {
      display: flex;
      flex-direction: column;
      gap: 9px;
      overflow-y: auto;
      flex: 1;
      padding-right: 2px;
      min-height: 40px;
    }
    .empty {
      padding: 14px;
      text-align: center;
      font-size: 12px;
      color: var(--muted-2);
      border: 1px dashed var(--border-3);
      border-radius: var(--radius);
    }
  `,
})
export class KanbanColumn {
  protected readonly store = inject(TicketStore);

  readonly column = input.required<ColumnView>();

  protected readonly dragOver = computed(
    () => this.store.dragOverColumn() === this.column().key,
  );

  protected onDragOver(event: DragEvent): void {
    event.preventDefault();
    if (event.dataTransfer) event.dataTransfer.dropEffect = 'move';
  }

  protected onDragEnter(event: DragEvent): void {
    event.preventDefault();
    this.store.setDragOver(this.column().key);
  }

  protected onDrop(event: DragEvent): void {
    event.preventDefault();
    this.store.dropOn(this.column().key);
  }
}
