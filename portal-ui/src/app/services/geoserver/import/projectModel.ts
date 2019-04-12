import {CrgProject} from '../../gis/projects.service';

// Модель проекта на UI
export class ProjectModel {
  private _current: CrgProject;

  constructor(project: CrgProject) {
    this._current = project;
  }


  get current(): CrgProject {
    return this._current;
  }

  set current(value: CrgProject) {
    this._current = value;
  }
}
