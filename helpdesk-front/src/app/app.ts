import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { TicketStore } from './services/ticket-store';
import { AuthService } from './services/auth.service';
import { Toolbar } from './components/toolbar/toolbar';
import { KanbanBoard } from './components/kanban-board/kanban-board';
import { TableView } from './components/table-view/table-view';
import { DetailDrawer } from './components/detail-drawer/detail-drawer';
import { CreateModal } from './components/create-modal/create-modal';
import { Login } from './components/login/login';

@Component({
  selector: 'app-root',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Toolbar, KanbanBoard, TableView, DetailDrawer, CreateModal, Login],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  protected readonly store = inject(TicketStore);
  protected readonly auth = inject(AuthService);
}
