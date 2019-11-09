import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MaterialModule } from '../../material.module';

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
    MaterialModule
  ],
})
export class WorkspaceHeaderModule {
  static rootEntry = WorkspaceHeaderComponent;
}
