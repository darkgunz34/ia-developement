import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { PEOPLE } from '../../models/ticket.models';

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
  /** Person key (initials), or null when unassigned. */
  readonly assignee = input.required<string | null>();

  protected readonly person = computed(() => {
    const key = this.assignee();
    return key ? PEOPLE[key] ?? null : null;
  });

  protected readonly name = computed(() => this.person()?.name ?? 'Non assigné');
}
