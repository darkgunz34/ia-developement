import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { TicketStore } from '../../services/ticket-store';
import { KanbanColumn } from '../kanban-column/kanban-column';

/** Horizontal Kanban layout: one column per status. */
@Component({
  selector: 'app-kanban-board',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [KanbanColumn],
  template: `
    <div class="board">
      @for (column of store.columns(); track column.key) {
        <app-kanban-column [column]="column" />
      }
    </div>
  `,
  styles: `
    .board {
      height: 100%;
      display: flex;
      gap: 14px;
      padding: 16px 20px;
      overflow-x: auto;
      box-sizing: border-box;
    }
  `,
})
export class KanbanBoard {
  protected readonly store = inject(TicketStore);
}
