import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { MaterialModule } from '../../material.module';
import { HelpTogglerModule } from '../help-toggler/help-toggler.module';

import { WorkspaceHeaderComponent } from './workspace-header@simf.component';

@NgModule({
  declarations: [
    WorkspaceHeaderComponent
  ],
  entryComponents: [
    WorkspaceHeaderComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    RouterModule,
    HelpTogglerModule
  ],
})
export class WorkspaceHeaderModule {
  static rootEntry = WorkspaceHeaderComponent;
}
