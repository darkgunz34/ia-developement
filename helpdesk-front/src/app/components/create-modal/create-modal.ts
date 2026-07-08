import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';

import { CATEGORIES } from '../../models/ticket.models';
import { TicketDraft, TicketStore } from '../../services/ticket-store';

/** Modal form for creating a new ticket, bound to the store's draft. */
@Component({
  selector: 'app-create-modal',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="overlay" (click)="store.closeCreate()"></div>

    <div class="modal">
      <div class="head">
        <span class="title">Nouveau ticket</span>
        <button class="close" (click)="store.closeCreate()" aria-label="Fermer">✕</button>
      </div>

      <div class="body">
        <label class="label" for="draft-title">Titre</label>
        <input
          id="draft-title"
          class="control"
          [value]="draft().title"
          (input)="store.patchDraft({ title: $any($event.target).value })"
          placeholder="Décrire le problème en une phrase…"
          autofocus
        />

        <div class="grid">
          <div>
            <label class="label" for="draft-priority">Priorité</label>
            <select
              id="draft-priority"
              class="control select"
              [value]="draft().priority"
              (change)="store.patchDraft({ priority: $any($event.target).value })"
            >
              <option value="urgente">Urgente</option>
              <option value="haute">Haute</option>
              <option value="moyenne">Moyenne</option>
              <option value="basse">Basse</option>
            </select>
          </div>
          <div>
            <label class="label" for="draft-status">Statut</label>
            <select
              id="draft-status"
              class="control select"
              [value]="draft().status"
              (change)="store.patchDraft({ status: $any($event.target).value })"
            >
              <option value="ouvert">Ouvert</option>
              <option value="en_cours">En cours</option>
              <option value="en_attente">En attente</option>
              <option value="ferme">Fermé</option>
            </select>
          </div>
          <div>
            <label class="label" for="draft-category">Catégorie</label>
            <select
              id="draft-category"
              class="control select"
              [value]="draft().category"
              (change)="store.patchDraft({ category: $any($event.target).value })"
            >
              @for (category of categories; track category) {
                <option [value]="category">{{ category }}</option>
              }
            </select>
          </div>
          <div>
            <label class="label" for="draft-assignee">Assigné</label>
            <select
              id="draft-assignee"
              class="control select"
              [value]="draft().assignee"
              (change)="store.patchDraft({ assignee: $any($event.target).value })"
            >
              <option value="">Non assigné</option>
              <option value="CR">Camille Roy</option>
              <option value="YB">Yanis Bouhala</option>
              <option value="LF">Léa Fontaine</option>
              <option value="MP">Marc Petit</option>
              <option value="SN">Sofia Nguyen</option>
              <option value="TG">Théo Girard</option>
            </select>
          </div>
        </div>

        <label class="label desc-label" for="draft-desc">Description</label>
        <textarea
          id="draft-desc"
          class="control textarea"
          [value]="draft().desc"
          (input)="store.patchDraft({ desc: $any($event.target).value })"
          placeholder="Contexte, étapes de reproduction, impact…"
          rows="4"
        ></textarea>
      </div>

      <div class="foot">
        <button class="btn-ghost" (click)="store.closeCreate()">Annuler</button>
        <button class="btn-primary" [disabled]="!draft().title.trim()" (click)="store.saveDraft()">
          Créer le ticket
        </button>
      </div>
    </div>
  `,
  styleUrl: './create-modal.scss',
})
export class CreateModal {
  protected readonly store = inject(TicketStore);
  protected readonly categories = CATEGORIES;

  /** The active draft; the parent only renders this component when it exists. */
  readonly draft = input.required<TicketDraft>();
}
