import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';

import { eventService, IEvent } from '../../services/event.service';
import { sidebars } from '../../stores/Sidebars.store';

@Component({
  selector: 'crg-info-sidebar',
  templateUrl: './info-sidebar.component.html',
  styleUrls: ['./info-sidebar.component.css']
})
export class InfoSidebarComponent implements OnInit, OnDestroy {
  @Input() isActive?: boolean;

  events: IEvent[] = [];

  private unsubscribe$: Subject<void> = new Subject<void>();

  ngOnInit() {
    eventService.events$
      .pipe(
        filter(value => !!value),
        takeUntil(this.unsubscribe$)
      )
      .subscribe((events: IEvent[]) => {
        this.events = events;
      });
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  closeMe(): void {
    sidebars.closeInfo();
  }

  clearAll(): void {
    eventService.update([]);
  }
}
