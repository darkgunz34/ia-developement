import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';

import { AuthService } from '../../services/auth.service';
import { colorForAcronym, normalizeAcronym } from '../../models/user.model';

/** Full-screen login gate: pseudo + 2-char acronym, with a live avatar preview. */
@Component({
  selector: 'app-login',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="wrap">
      <form class="card" (submit)="submit($event)">
        <div class="logo">HD</div>
        <div class="title">Connexion au helpdesk</div>
        <div class="subtitle">Identifiez-vous pour accéder aux tickets.</div>

        <div class="preview" [style.background]="previewColor()">{{ previewText() }}</div>

        <label class="field">
          <span class="label">Pseudo</span>
          <input
            class="input"
            [value]="name()"
            (input)="onName($any($event.target).value)"
            placeholder="Ex. Camille Roy"
            autofocus
          />
        </label>

        <label class="field">
          <span class="label">Acronyme <span class="hint">— 2 caractères</span></span>
          <input
            class="input mono acro"
            [value]="acro()"
            (input)="onAcro($any($event.target).value)"
            placeholder="CR"
            maxlength="2"
          />
        </label>

        @if (error(); as message) {
          <div class="error">{{ message }}</div>
        }

        <button type="submit" class="btn-primary submit">Se connecter</button>
      </form>
    </div>
  `,
  styleUrl: './login.scss',
})
export class Login {
  private readonly auth = inject(AuthService);

  protected readonly name = signal('');
  protected readonly acro = signal('');
  protected readonly error = signal('');

  protected readonly previewText = computed(() => this.acro() || '—');
  protected readonly previewColor = computed(() =>
    this.acro().length === 2 ? colorForAcronym(this.acro()) : '#c3c8d0',
  );

  protected onName(value: string): void {
    this.name.set(value);
    this.error.set('');
  }

  protected onAcro(value: string): void {
    this.acro.set(normalizeAcronym(value));
    this.error.set('');
  }

  protected submit(event: Event): void {
    event.preventDefault();
    const message = this.auth.login(this.name(), this.acro());
    if (message) this.error.set(message);
  }
}
