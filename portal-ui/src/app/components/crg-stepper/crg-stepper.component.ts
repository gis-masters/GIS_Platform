import {Subject} from 'rxjs';
import {NGXLogger} from 'ngx-logger';
import {Router} from '@angular/router';
import {takeUntil} from 'rxjs/operators';
import {Component, OnDestroy} from '@angular/core';
import {ProjectsService} from '../../services/gis/projects.service';
import {CommunicationService} from '../../services/communication.service';
import {ActionType, SideBarManager, SidebarType} from '../../services/side-bar-manager.service';

@Component({
  selector: 'crg-crg-stepper',
  templateUrl: './crg-stepper.component.html',
  styleUrls: ['./crg-stepper.component.css']
})

export class CrgStepperComponent implements OnDestroy {

  activeStep = 5;

  private unsubscribe$: Subject<void> = new Subject<void>();

  constructor(private router: Router,
              private logger: NGXLogger,
              private sideBarManager: SideBarManager,
              private communicationService: CommunicationService,
              private projectService: ProjectsService) {
    communicationService.stepperEvents
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(step => this.activeStep = step);
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  doAction(selectedStep) {
    if (selectedStep <= this.activeStep || (selectedStep === 4 && this.activeStep === 3)) {
      console.log('++++++', this.activeStep, selectedStep);

      // if (!(selectedStep === 4 && this.activeStep === 3)) {
      //   this.activeStep = selectedStep;
      // }

      if (selectedStep === 1) {
        this.projectService.changeProject();

        this.router.navigate(['/workspace/projects']);
        this.sideBarManager.closeAll();
      }
      if (selectedStep === 2) {
        this.router.navigate(['/workspace/data_import']);
        this.sideBarManager.closeAll();
      }
      if (selectedStep === 3) {
        this.router.navigate(['/workspace/map']);
        this.sideBarManager.do(SidebarType.BUG_REPORT, ActionType.SWITCH);
      }
      if (selectedStep === 4) {
        this.router.navigate(['/workspace/map']);
        this.communicationService.gmlDialog.emit({action: ActionType.OPEN, layers: undefined});
      }
    }
  }

}
