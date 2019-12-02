import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MaterialModule } from '../../material.module';
import { HelpTogglerModule } from '../help-toggler/help-toggler.module';
import { CrgStepperComponent } from '../crg-stepper/crg-stepper.component';

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
    MaterialModule,
    HelpTogglerModule
  ],
})
export class WorkspaceHeaderModule {
  static rootEntry = WorkspaceHeaderComponent;
}
