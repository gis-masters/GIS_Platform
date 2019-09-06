import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProjectCardModule } from '../project-card/project-card.module';
import { ProjectsListComponent } from './projects-list@conv.component';

@NgModule({
  declarations: [
    ProjectsListComponent
  ],
  entryComponents: [
    ProjectsListComponent
  ],
  imports: [
    CommonModule,
    ProjectCardModule
  ],
})
export class ProjectsListModule {
  static rootEntry = ProjectsListComponent;
}
