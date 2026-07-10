import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';

import { AuthStore } from '../../services/auth-store';
import { colorForAcro } from '../../models/auth.models';

/** Full-screen login card. Matches the "authentification" mockup pixel-for-pixel. */
@Component({
  selector: 'app-login-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="wrap">
      <form (submit)="submit($event)">
        <div class="brand-logo">HD</div>
        <div class="title">Connexion au helpdesk</div>
        <div class="subtitle">Identifiez-vous pour accéder aux tickets.</div>

        <div class="preview" [style.background]="previewColor()">
          {{ previewText() }}
        </div>

        <div class="field">
          <label for="login-name">Pseudo</label>
          <input
            id="login-name"
            type="text"
            [value]="name()"
            (input)="onName($any($event.target).value)"
            placeholder="Ex. Camille Roy"
            autocomplete="off"
            autofocus
          />
        </div>

        <div class="field">
          <label for="login-acro">
            Acronyme <span class="hint">— 2 caractères</span>
          </label>
          <input
            id="login-acro"
            class="mono acro"
            type="text"
            [value]="acro()"
            (input)="onAcro($any($event.target).value)"
            placeholder="CR"
            maxlength="2"
            autocomplete="off"
          />
        </div>

        @if (error(); as e) {
          <div class="error">{{ e }}</div>
        }

        <button type="submit" class="btn-primary submit">Se connecter</button>
      </form>
    </div>
  `,
  styles: `
    .wrap {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 24px;
      background: var(--bg);
      min-height: 100vh;
    }
    form {
      width: 340px;
      max-width: 100%;
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: 14px;
      box-shadow: 0 8px 30px rgba(16, 24, 40, 0.08);
      padding: 28px 26px;
      text-align: center;
    }
    .brand-logo {
      width: 36px;
      height: 36px;
      border-radius: 9px;
      background: var(--text);
      color: #fff;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 700;
      font-size: 14px;
      margin: 0 auto 14px;
    }
    .title {
      font-size: 17px;
      font-weight: 600;
      margin-bottom: 4px;
    }
    .subtitle {
      font-size: 12.5px;
      color: var(--muted);
      margin-bottom: 22px;
    }
    .preview {
      width: 48px;
      height: 48px;
      border-radius: 999px;
      color: #fff;
      font-size: 14px;
      font-weight: 700;
      letter-spacing: 0.05em;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto;
      font-family: var(--font-mono);
      transition: background 0.15s ease;
    }
    .field {
      text-align: left;
      margin-top: 16px;
    }
    .field + .field {
      margin-top: 14px;
    }
    label {
      display: block;
      font-size: 12px;
      font-weight: 600;
      color: var(--muted);
      margin-bottom: 6px;
    }
    label .hint {
      font-weight: 400;
      color: var(--muted-2);
    }
    input {
      width: 100%;
      padding: 9px 12px;
      border: 1px solid var(--border-3);
      border-radius: var(--radius);
      font-size: 13px;
      font-family: inherit;
      color: var(--text);
      outline: none;
      box-sizing: border-box;
      background: var(--surface);
    }
    input:focus {
      border-color: var(--accent);
    }
    input.acro {
      font-family: var(--font-mono);
      letter-spacing: 0.15em;
      text-transform: uppercase;
    }
    .error {
      margin-top: 12px;
      font-size: 12px;
      color: #b42318;
      text-align: left;
    }
    .submit {
      width: 100%;
      justify-content: center;
      margin-top: 20px;
      padding: 10px;
    }
  `,
})
export class LoginPage {
  private readonly auth = inject(AuthStore);

  protected readonly name = signal('');
  protected readonly acro = signal('');
  protected readonly error = signal<string | null>(null);

  protected readonly previewText = computed(() => {
    const a = this.acro().toUpperCase();
    if (a) return a;
    const initials = this.name()
      .trim()
      .split(/\s+/)
      .map((w) => w[0])
      .join('')
      .slice(0, 2)
      .toUpperCase();
    return initials || '··';
  });

  protected readonly previewColor = computed(() => {
    const a = this.acro().toUpperCase();
    return a ? colorForAcro(a) : '#c3c8d0';
  });

  onName(v: string): void {
    this.name.set(v);
    if (this.error()) this.error.set(null);
  }

  onAcro(v: string): void {
    this.acro.set(v.toUpperCase().replace(/[^A-Z]/g, '').slice(0, 2));
    if (this.error()) this.error.set(null);
  }

  submit(ev: Event): void {
    ev.preventDefault();
    const result = this.auth.login(this.name(), this.acro());
    if (!result.ok) this.error.set(result.error);
  }
}
