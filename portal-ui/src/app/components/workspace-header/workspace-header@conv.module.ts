import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { MaterialModule } from '../../material.module';
import { CrgStepperComponent } from '../crg-stepper/crg-stepper.component';
import { HelpTogglerModule } from '../help-toggler/help-toggler.module';
import { SearchModule } from '../search/search.module';

import { WorkspaceHeaderComponent } from './workspace-header@conv.component';
import { OrgAdminButtonComponent } from '../org-admin-button/org-admin-button.component';

@NgModule({
  declarations: [
    WorkspaceHeaderComponent,
    CrgStepperComponent,
    OrgAdminButtonComponent
  ],
  entryComponents: [
    WorkspaceHeaderComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    HelpTogglerModule,
    SearchModule
  ],
})
export class WorkspaceHeaderModule {
  static rootEntry = WorkspaceHeaderComponent;
}
