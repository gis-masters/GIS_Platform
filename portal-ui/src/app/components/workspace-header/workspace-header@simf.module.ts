import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { WorkspaceHeaderComponent } from './workspace-header@simf.component';

@NgModule({
  declarations: [WorkspaceHeaderComponent],
  entryComponents: [WorkspaceHeaderComponent],
  imports: [CommonModule],
})
export class WorkspaceHeaderModule {
  static rootEntry = WorkspaceHeaderComponent;
}
