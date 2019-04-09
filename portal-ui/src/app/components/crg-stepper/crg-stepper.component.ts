import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'crg-crg-stepper',
  templateUrl: './crg-stepper.component.html',
  styleUrls: ['./crg-stepper.component.css']
})
export class CrgStepperComponent implements OnInit {

  activeStep = 1;

  constructor() { }

  ngOnInit() {
  }

  nextStep() {
    if (this.activeStep === 4) {
      this.activeStep = 1;
    } else {
      this.activeStep += 1;
    }
  }

  step(number) {
    if (number <= this.activeStep) {
      this.activeStep = number;
    }
  }
}
