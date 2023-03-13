import { setWorldConstructor, World } from '@wdio/cucumber-framework';

import { CrgProject } from '../../../src/app/services/gis/projects.models';

export class ScenarioScope extends World {
  private _latestProject?: CrgProject;

  get latestProject(): CrgProject {
    return this.getEntityOrThrow<CrgProject>(this._latestProject, 'проект');
  }

  set latestProject(project: CrgProject) {
    this._latestProject = project;
  }

  private getEntityOrThrow<T>(obj: T | undefined, entity: string): T {
    if (!obj) {
      throw new Error(`${entity} не инициализирован. Убедитесь что вызывали шаг создающий ${entity}`);
    }

    return obj;
  }
}

setWorldConstructor(ScenarioScope);
