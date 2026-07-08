import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';

import { Ticket } from '../models/ticket.models';
import { MOCK_TICKETS } from '../data/mock-tickets';

/**
 * Data-access seam for tickets.
 *
 * Today it serves in-memory mock data so the UI is fully functional offline.
 * To connect a real backend, swap the `of(...)` bodies for `this.http` calls —
 * the method signatures already match a REST endpoint and the rest of the app
 * (the signal store) does not change.
 */
@Injectable({ providedIn: 'root' })
export class TicketApiService {
  // Injected and ready for the real implementation. Unused while mocking.
  private readonly http = inject(HttpClient);

  private readonly baseUrl = '/api/tickets';

  /** GET /api/tickets */
  list(): Observable<Ticket[]> {
    // return this.http.get<Ticket[]>(this.baseUrl);
    return of(structuredClone(MOCK_TICKETS));
  }

  /** PATCH /api/tickets/:id */
  update(id: number, patch: Partial<Ticket>): Observable<void> {
    // return this.http.patch<void>(`${this.baseUrl}/${id}`, patch);
    void id;
    void patch;
    return of(void 0);
  }
}
