import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { cn } from '../../services/util/cn';
import { fromMobx } from '../../services/util/fromMobx';
import { sidebars } from '../../stores/Sidebars.store';

@Component({
  selector: 'crg-workspace',
  templateUrl: './workspace.component.html',
  styleUrls: ['./workspace.component.scss']
})
export class WorkspaceComponent implements OnDestroy, OnInit {
  @Input() fixed?: boolean;
  cn = cn('workspace');

  isInfoSidebarActive = false;

  private unsubscribe$: Subject<void> = new Subject<void>();

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    fromMobx(() => sidebars.infoOpen, true)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(infoOpen => {
        this.isInfoSidebarActive = !!infoOpen;
      });
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
