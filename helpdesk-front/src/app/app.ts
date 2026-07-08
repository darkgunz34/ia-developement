import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { TicketStore } from './services/ticket-store';
import { Toolbar } from './components/toolbar/toolbar';
import { KanbanBoard } from './components/kanban-board/kanban-board';
import { TableView } from './components/table-view/table-view';
import { DetailDrawer } from './components/detail-drawer/detail-drawer';

@Component({
  selector: 'app-root',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Toolbar, KanbanBoard, TableView, DetailDrawer],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  protected readonly store = inject(TicketStore);
}
