import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';

import { Ticket } from '../../models/ticket.models';
import { TicketStore } from '../../services/ticket-store';
import { PriorityBadge } from '../priority-badge/priority-badge';
import { Avatar } from '../avatar/avatar';

/** Draggable Kanban card. Clicking opens the detail drawer. */
@Component({
  selector: 'app-ticket-card',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [PriorityBadge, Avatar],
  template: `
    <div
      class="card"
      [class.dragging]="dragging()"
      draggable="true"
      (dragstart)="onDragStart($event)"
      (dragend)="store.endDrag()"
      (click)="store.selectTicket(ticket().id)"
    >
      <div class="row">
        <span class="mono id">#{{ ticket().id }}</span>
        <app-priority-badge [priority]="ticket().priority" />
      </div>
      <div class="title">{{ ticket().title }}</div>
      <div class="row">
        <span class="category-tag">{{ ticket().category }}</span>
        <app-avatar [assignee]="ticket().assignee" />
      </div>
    </div>
  `,
  styles: `
    .card {
      cursor: pointer;
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: var(--radius);
      padding: 11px 12px;
      transition: box-shadow 0.15s ease, border-color 0.15s ease;
    }
    .card:hover {
      border-color: #c3c8d0;
      box-shadow: 0 2px 8px rgba(16, 24, 40, 0.08);
    }
    .card.dragging {
      opacity: 0.4;
    }
    .row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 8px;
    }
    .id {
      font-size: 11px;
      color: var(--muted-2);
      font-weight: 500;
    }
    .title {
      font-size: 13px;
      font-weight: 500;
      line-height: 1.4;
      color: var(--text);
      margin: 7px 0 11px;
      text-wrap: pretty;
    }
  `,
})
export class TicketCard {
  protected readonly store = inject(TicketStore);

  readonly ticket = input.required<Ticket>();

  protected readonly dragging = computed(() => this.store.draggingId() === this.ticket().id);

  protected onDragStart(event: DragEvent): void {
    this.store.beginDrag(this.ticket().id);
    if (event.dataTransfer) {
      event.dataTransfer.effectAllowed = 'move';
      try {
        event.dataTransfer.setData('text/plain', String(this.ticket().id));
      } catch {
        /* some browsers restrict setData outside user gestures */
      }
    }
  }
}
