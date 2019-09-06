import {Project} from '../../crg/projects.service';

// Модель проекта на UI
export class ProjectModel {
  crgProject: Project;

  constructor(project: Project) {
    this.crgProject = project;
  }

}
