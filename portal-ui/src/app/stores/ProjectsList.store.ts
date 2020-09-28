import { observable, computed, action } from 'mobx';

import { CrgProject } from '../services/crg/projects.models';

class ProjectsList {
  private static _instance: ProjectsList;
  @observable private _list?: CrgProject[];
  @observable private deleted: number[] = [];

  private constructor() { }

  static get instance() {
    return this._instance || (this._instance = new this());
  }

  @action
  setList(list: CrgProject[]) {
    this._list = list;
  }

  @action
  considerDeleted(id: number) {
    this.deleted.push(id);
  }

  @computed
  get list(): CrgProject[] {
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
