import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MaterialModule } from '../../material.module';

import {CrgStepperComponent} from '../crg-stepper/crg-stepper.component';
import { WorkspaceHeaderComponent } from './workspace-header@conv.component';

@NgModule({
  declarations: [
    WorkspaceHeaderComponent,
    CrgStepperComponent
  ],
  entryComponents: [
    WorkspaceHeaderComponent
  ],
  imports: [
    CommonModule,
    MaterialModule
  ],
})
export class WorkspaceHeaderModule {
  static rootEntry = WorkspaceHeaderComponent;
}
