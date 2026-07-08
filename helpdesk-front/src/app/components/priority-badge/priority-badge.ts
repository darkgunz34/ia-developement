import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { PRIORITIES, PriorityKey } from '../../models/ticket.models';

/** Coloured pill showing a ticket's priority. */
@Component({
  selector: 'app-priority-badge',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <span class="badge" [style.color]="meta().color" [style.background]="meta().bg">
      <span class="dot" [style.background]="meta().dot"></span>
      {{ meta().label }}
    </span>
  `,
  styles: `
    .badge {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      padding: 2px 7px;
      border-radius: 999px;
      font-size: 11px;
      font-weight: 600;
      white-space: nowrap;
    }
    .dot {
      width: 6px;
      height: 6px;
      border-radius: 999px;
      flex: none;
    }
  `,
})
export class PriorityBadge {
  readonly priority = input.required<PriorityKey>();
  protected readonly meta = computed(() => PRIORITIES[this.priority()]);
}
