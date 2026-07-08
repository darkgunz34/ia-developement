import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';

import { PEOPLE, Ticket } from '../../models/ticket.models';
import { TicketStore } from '../../services/ticket-store';
import { PriorityBadge } from '../priority-badge/priority-badge';
import { Avatar } from '../avatar/avatar';

/** Right-hand slide-over showing full ticket detail with inline editing. */
@Component({
  selector: 'app-detail-drawer',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [PriorityBadge, Avatar],
  template: `
    <div class="overlay" (click)="store.closePanel()"></div>

    <aside class="panel">
      <div class="head">
        <span class="mono id">#{{ ticket().id }}</span>
        <app-priority-badge [priority]="ticket().priority" />
        <button class="close" (click)="store.closePanel()" aria-label="Fermer">✕</button>
      </div>

      <div class="body">
        <h2>{{ ticket().title }}</h2>

        <div class="meta">
          <span class="field-label">Statut</span>
          <select
            class="select full"
            [value]="ticket().status"
            (change)="store.updateStatus(ticket().id, $any($event.target).value)"
          >
            <option value="ouvert">Ouvert</option>
            <option value="en_cours">En cours</option>
            <option value="en_attente">En attente</option>
            <option value="ferme">Fermé</option>
          </select>

          <span class="field-label">Priorité</span>
          <select
            class="select full"
            [value]="ticket().priority"
            (change)="store.updatePriority(ticket().id, $any($event.target).value)"
          >
            <option value="urgente">Urgente</option>
            <option value="haute">Haute</option>
            <option value="moyenne">Moyenne</option>
            <option value="basse">Basse</option>
          </select>

          <span class="field-label">Assigné</span>
          <span class="assignee">
            <app-avatar [assignee]="ticket().assignee" />
            {{ assigneeName() }}
          </span>

          <span class="field-label">Catégorie</span>
          <span><span class="category-tag">{{ ticket().category }}</span></span>

          <span class="field-label">Ouvert le</span>
          <span class="value">{{ ticket().created }}</span>

          <span class="field-label">SLA</span>
          <span class="sla" [style.color]="slaColor()">{{ ticket().sla }}</span>
        </div>

        <div class="section-label desc-label">Description</div>
        <p class="desc">{{ ticket().desc }}</p>

        <div class="section-label">Activité</div>
        <div class="activity">
          <div class="event">
            <app-avatar [assignee]="ticket().assignee" />
            <div class="event-body">
              <strong>{{ assigneeName() }}</strong> a pris en charge le ticket.
              <div class="ago">il y a 2 h</div>
            </div>
          </div>
          <div class="event">
            <span class="sys">SY</span>
            <div class="event-body">
              Ticket créé automatiquement depuis l'email support.
              <div class="ago">{{ ticket().created }}</div>
            </div>
          </div>
        </div>
      </div>

      <div class="foot">
        <input placeholder="Ajouter un commentaire…" />
        <button class="btn-primary">Répondre</button>
      </div>
    </aside>
  `,
  styleUrl: './detail-drawer.scss',
})
export class DetailDrawer {
  protected readonly store = inject(TicketStore);

  readonly ticket = input.required<Ticket>();

  protected readonly assigneeName = computed(() => {
    const key = this.ticket().assignee;
    return key ? PEOPLE[key]?.name ?? 'Non assigné' : 'Non assigné';
  });

  protected readonly slaColor = computed(() => {
    const t = this.ticket();
    if (t.overdue) return '#d92d20';
    if (t.done) return '#067647';
    return '#344054';
  });
}
