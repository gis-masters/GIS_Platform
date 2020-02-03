import { observable, computed, action } from 'mobx';

export interface Layer {
  id: string;
  title: string;
  internalName: string;
  order: number;
  geometryType: string;
}

export interface Project {
  id: string;
  name: string;
  internalName: string;
  bbox: string;
  order: number;
  organizationId: number;
  layers: Layer[];
  createdAt: string;
}

class ProjectsList {

  @computed
  get list (): Project[] {
    return (this._list || []).filter(p => !this.deleted.includes(p.id));
  }

  @computed
  get isLoaded (): boolean {
    return Boolean(this._list);
  }

  private constructor() { }

  public static get instance() {
    return this._instance || (this._instance = new this());
  }

  private static _instance: ProjectsList;
  @observable private _list?: Project[];
  @observable private deleted: string[] = [];

  @action
  setList (list: Project[]) {
    this._list = list;
  }

  @action
  considerDeleted(id: string) {
    this.deleted.push(id);
  }
}

export const projectsList = ProjectsList.instance;
