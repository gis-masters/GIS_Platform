import { action, computed, makeObservable, observable } from 'mobx';

import { type CrgProject } from '../services/gis/projects/projects.models';
import { patch } from '../services/util/patch';

class AllProjects {
  private static _instance: AllProjects;
  static get instance() {
    return this._instance || (this._instance = new this());
  }

  @observable list: CrgProject[] = [];
  @observable inited = false;

  @observable nameFilter = '';
  @observable sortBy: keyof CrgProject = 'createdAt';
  @observable sortAsc = true;

  private constructor() {
    makeObservable(this);
  }

  @computed
  private get projectsMap(): Map<number, CrgProject> {
    return new Map(this.list.map(project => [project.id, project]));
  }

  getById(id: number): CrgProject | undefined {
    return this.projectsMap.get(id);
  }

  @computed
  get withoutFolders(): CrgProject[] {
    return this.list.filter(project => !project.folder);
  }

  @action
  setList(list: CrgProject[]) {
    this.list = list;
    this.inited = true;
  }

  @action
  update(id: number, patchData: Partial<CrgProject>) {
    const project = this.getById(id);
    if (project) {
      patch(project, patchData);
    }
  }

  @action
  add(newProject: CrgProject) {
    const exists = this.projectsMap.has(newProject.id);
    if (!exists) {
      this.list.push(newProject);
    }
  }

  @action
  delete(id: number) {
    const index = this.list.findIndex(project => project.id === id);
    if (index !== -1) {
      this.list.splice(index, 1);
    }
  }
}

export const allProjects = AllProjects.instance;
