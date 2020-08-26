import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { localStorageService } from '../../services/local-storage.service';
import { cn } from '../../services/util/cn';
import { fromMobx } from '../../services/util/fromMobx';
import { sidebars } from '../../stores/Sidebars.store';

@Component({
  selector: 'crg-workspace',
  templateUrl: './workspace.component.html',
  styleUrls: ['./workspace.component.scss']
})
export class WorkspaceComponent implements OnDestroy, OnInit {
  cn = cn('workspace');

  isInfoSidebarActive = false;

  private unsubscribe$: Subject<void> = new Subject<void>();

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.data.pipe(takeUntil(this.unsubscribe$)).subscribe(data => {
      const userModel = data['orgInfo'];
      if (userModel) {
        localStorageService.saveUserModel(userModel);
      }
    });

    fromMobx(() => sidebars.infoOpen, true)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(infoOpen => {
        this.isInfoSidebarActive = infoOpen;
      });
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
