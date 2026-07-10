import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { TicketStore } from './services/ticket-store';
import { AuthStore } from './services/auth-store';
import { Toolbar } from './components/toolbar/toolbar';
import { KanbanBoard } from './components/kanban-board/kanban-board';
import { TableView } from './components/table-view/table-view';
import { DetailDrawer } from './components/detail-drawer/detail-drawer';
import { LoginPage } from './components/login-page/login-page';

@Component({
  selector: 'app-root',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Toolbar, KanbanBoard, TableView, DetailDrawer, LoginPage],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  protected readonly store = inject(TicketStore);
  protected readonly auth = inject(AuthStore);
}
