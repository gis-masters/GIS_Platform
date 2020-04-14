import { observable, computed, action } from 'mobx';

import { Project } from '../services/crg/projects.models';

class ProjectsList {
  private static _instance: ProjectsList;
  @observable private _list?: Project[];
  @observable private deleted: number[] = [];

  private constructor() { }

  public static get instance() {
    return this._instance || (this._instance = new this());
  }

  @action
  setList(list: Project[]) {
    this._list = list;
  }

  @action
  considerDeleted(id: number) {
    this.deleted.push(id);
  }

  @computed
  get list(): Project[] {
    return (this._list || [])
      .filter(p => !this.deleted.includes(p.id))
      .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
  }

  @computed
  get isLoaded(): boolean {
    return Boolean(this._list);
  }
}

export const projectsList = ProjectsList.instance;
