import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { MaterialModule } from '../../material.module';
import { HelpTogglerModule } from '../help-toggler/help-toggler.module';
import { SearchModule } from '../search/search.module';

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
    HelpTogglerModule,
    SearchModule
  ],
})
export class WorkspaceHeaderModule {
  static rootEntry = WorkspaceHeaderComponent;
}
