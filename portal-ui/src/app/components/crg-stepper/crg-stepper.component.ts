import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { communicationService } from '../../services/communication.service';
import { sideBarManager, ActionType, SidebarType } from '../../services/side-bar-manager.service';
import { route } from '../../stores/Route.store';
import { fromMobx } from '../../services/util/fromMobx';

@Component({
  selector: 'crg-crg-stepper',
  templateUrl: './crg-stepper.component.html',
  styleUrls: ['./crg-stepper.component.css']
})

export class CrgStepperComponent implements OnDestroy, OnInit {

  activeStep = 5;

  private unsubscribe$: Subject<void> = new Subject<void>();

  constructor(private router: Router,
              private route: ActivatedRoute) { }

  ngOnInit () {
    fromMobx<number>(() => route.data.step)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(step => this.activeStep = step);
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  doAction(selectedStep: number) {
    const { projectId } = this.route.snapshot.params;

    if (selectedStep <= this.activeStep || (selectedStep === 4 && this.activeStep === 3)) {
      if (selectedStep === 1) {
        this.router.navigate(['/projects']);
        sideBarManager.closeAll();
      }
      if (selectedStep === 2) {
        this.router.navigate([`/projects/${projectId}/import`]);
        sideBarManager.closeAll();
      }
      if (selectedStep === 3) {
        this.router.navigate([`/projects/${projectId}/map`]);
        sideBarManager.do({target: SidebarType.BUG_REPORT, action: ActionType.SWITCH});
      }
      if (selectedStep === 4) {
        this.router.navigate([`/projects/${projectId}/map`]);
        communicationService.gmlDialog.emit({action: ActionType.OPEN, layers: undefined});
      }
    }
  }
}
