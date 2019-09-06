import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LoadingModule } from '../loading/loading.module';

import { ProjectsListComponent } from './projects-list@simf.component';

@NgModule({
  declarations: [
    ProjectsListComponent
  ],
  entryComponents: [
    ProjectsListComponent
  ],
  imports: [
    CommonModule,
    LoadingModule
  ],
})
export class ProjectsListModule {
  static rootEntry = ProjectsListComponent;
}
