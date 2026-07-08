import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { STATUSES, StatusKey } from '../../models/ticket.models';

/** Dot + label showing a ticket's status. */
@Component({
  selector: 'app-status-pill',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <span class="pill" [style.color]="meta().color">
      <span class="dot" [style.background]="meta().dot"></span>
      {{ meta().label }}
    </span>
  `,
  styles: `
    .pill {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      font-size: 12.5px;
      font-weight: 500;
      white-space: nowrap;
    }
    .dot {
      width: 7px;
      height: 7px;
      border-radius: 999px;
      flex: none;
    }
  `,
})
export class StatusPill {
  readonly status = input.required<StatusKey>();
  protected readonly meta = computed(() => STATUSES[this.status()]);
}
