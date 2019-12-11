import { observable, computed, action } from 'mobx';

import { ProcessStatus } from '../services/crg/models';

export interface Project {
  id: string;
  geoserverName: string;
  internalName: string;
  databaseName?: string;
  storeName?: string;
  href?: string;
  type?: string;
  layersCount?: number;
  status?: ProcessStatus;
}

class ProjectsList {
  @observable private _list?: Project[];
  @observable private deleted: string[] = [];

  @computed
  get list (): Project[] {
    return (this._list || []).filter(p => !this.deleted.includes(p.id));
  }

  @computed
  get isLoaded (): boolean {
    return Boolean(this._list);
  }

  @computed
  get isSomePending () {
    return this.list.some((p) => p.status === ProcessStatus.PENDING);
  }

  @action
  setList (list: Project[]) {
    this._list = list;
  }

  @action
  considerDeleted(id: string) {
    this.deleted.push(id);
  }

  private static _instance: ProjectsList;

  private constructor() { }

  public static get instance() {
    return this._instance || (this._instance = new this());
  }
}

export const projectsList = ProjectsList.instance;
