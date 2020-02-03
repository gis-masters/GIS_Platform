import {Subject} from 'rxjs';
import {filter, takeUntil} from 'rxjs/operators';
import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {EventService, IEvent} from '../../services/event.service';
import {ActionType, SideBarManager, SidebarType} from '../../services/side-bar-manager.service';

@Component({
  selector: 'crg-info-sidebar',
  templateUrl: './info-sidebar.component.html',
  styleUrls: ['./info-sidebar.component.css']
})
export class InfoSidebarComponent implements OnInit, OnDestroy {

  @Input() isActive;

  events: IEvent[] = [];

  private unsubscribe$: Subject<void> = new Subject<void>();

  constructor(private eventService: EventService,
              private sideBarManager: SideBarManager) {

  }

  ngOnInit() {
    this.eventService.events$
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

  closeMe() {
    this.sideBarManager.do({target: SidebarType.INFO, action: ActionType.CLOSE});
  }
}
