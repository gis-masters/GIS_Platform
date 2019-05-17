import {NGXLogger} from 'ngx-logger';
import {Router} from '@angular/router';
import {Component} from '@angular/core';
import {ProjectsService} from '../../services/gis/projects.service';
import {LayersService} from '../../services/geoserver/layers.service';
import {ActionType, CommunicationService, SidebarType} from '../../services/communication.service';

@Component({
  selector: 'crg-crg-stepper',
  templateUrl: './crg-stepper.component.html',
  styleUrls: ['./crg-stepper.component.css']
})

export class CrgStepperComponent {

  activeStep = 5;

  constructor(private router: Router,
              private logger: NGXLogger,
              private communicationService: CommunicationService,
              private layersService: LayersService,
              private projectService: ProjectsService) {
    communicationService.stepperEvents.subscribe(step => this.activeStep = step);
  }

  doAction(selectedStep) {
    if (selectedStep > this.activeStep) {
      return;
    }

    if (selectedStep <= this.activeStep) {
      this.activeStep = selectedStep;
    }
    if (this.activeStep === 1) {
      this.projectService.changeProject();

      this.router.navigate(['/workspace/projects']);
      this.communicationService.sidebarManager.emit({action: ActionType.CLOSE_ALL, target: null});
    }
    if (this.activeStep === 2) {
      this.router.navigate(['/workspace/data_import']);
      this.communicationService.sidebarManager.emit({action: ActionType.CLOSE_ALL, target: null});
    }
    if (this.activeStep === 3) {
      this.router.navigate(['/workspace/map']);
      this.communicationService.sidebarManager.emit({action: ActionType.SWITCH, target: SidebarType.BUG_REPORT});
    }
    if (this.activeStep === 4) {
      this.router.navigate(['/workspace/map']);
      const copyOfLayers = Object.assign([], this.layersService.getCurrent());
      this.communicationService.gmlDialog.emit({action: ActionType.OPEN, layers: copyOfLayers});
    }
  }
}
