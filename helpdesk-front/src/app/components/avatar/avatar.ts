import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';

import { AuthService } from '../../services/auth.service';

/** Round assignee avatar showing initials, or a placeholder when unassigned. */
@Component({
  selector: 'app-avatar',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <span
      class="avatar"
      [class.empty]="!person()"
      [style.background]="person()?.color ?? null"
      [title]="name()"
    >
      {{ person() ? assignee() : '—' }}
    </span>
  `,
  styles: `
    .avatar {
      width: 24px;
      height: 24px;
      border-radius: 999px;
      color: #fff;
      font-size: 10px;
      font-weight: 600;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      flex: none;
    }
    .avatar.empty {
      background: var(--border-2);
      color: var(--muted-2);
    }
  `,
})
export class Avatar {
  private readonly auth = inject(AuthService);

  /** Person key (initials), or null when unassigned. */
  readonly assignee = input.required<string | null>();

  protected readonly person = computed(() => this.auth.resolvePerson(this.assignee()));

  protected readonly name = computed(() => this.person()?.name ?? 'Non assigné');
}
