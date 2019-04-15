import {CrgProject} from '../../gis/projects.service';

// Модель проекта на UI
export class ProjectModel {
  crgProject: CrgProject;

  constructor(project: CrgProject) {
    this.crgProject = project;
  }

}
