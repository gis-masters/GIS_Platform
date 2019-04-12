import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {ActionType, CommunicationService, SidebarType} from '../../services/communication.service';

@Component({
  selector: 'crg-crg-stepper',
  templateUrl: './crg-stepper.component.html',
  styleUrls: ['./crg-stepper.component.css']
})

export class CrgStepperComponent implements OnInit {

  activeStep = 1;

  constructor(private router: Router,
              private communicationService: CommunicationService) { }

  ngOnInit() {
  }

  nextStep() {
    this.activeStep += 1;
  }

  step(number) {
    if (number > this.activeStep) {
      return;
    }

    if (number <= this.activeStep) {
      this.activeStep = number;
    }
    if (this.activeStep === 1) {
      this.router.navigate(['/workspace/projects']);
    }
    if (this.activeStep === 2) {
      this.router.navigate(['/workspace/data_import']);
    }
    if (this.activeStep === 3) {
      this.router.navigate(['/workspace/map']);
      this.communicationService.sidebarManager.emit({action: ActionType.SWITCH, target: SidebarType.BUG_REPORT});
    }
  }
}
