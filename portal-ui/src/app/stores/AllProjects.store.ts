import { observable, computed, action } from 'mobx';

import { CrgProject } from '../services/crg/projects.models';
import { filterObjects } from '../services/util/filterObjects';
import { sortObjects } from '../services/util/sortObjects';

class AllProjects {
  private static _instance: AllProjects;
  @observable private _list?: CrgProject[];

  @observable nameFilter = '';
  @observable sortBy: keyof CrgProject = 'createdAt';
  @observable sortAsc = true;

  private constructor() {}

  static get instance() {
    return this._instance || (this._instance = new this());
  }

  @computed
  get list(): CrgProject[] {
    const filtered = filterObjects(this._list || [], { name: this.nameFilter });
    const sorted = sortObjects(filtered, this.sortBy, this.sortAsc, 'id');

    return sorted;
  }

  @computed
  get isLoaded(): boolean {
    return Boolean(this._list);
  }

  @action
  setList(list: CrgProject[]) {
    this._list = list;
  }

  @action
  delete(id: number) {
    const index = this._list.findIndex(project => project.id === id);

    this._list.splice(index, 1);
  }

  @action
  setNameFilter(titleFilter: string) {
    this.nameFilter = titleFilter;
  }

  @action
  setSortBy(fieldName: keyof CrgProject) {
    this.sortBy = fieldName;
  }

  @action
  setSortAsc(isAsc: boolean) {
    this.sortAsc = isAsc;
  }
}

export const allProjects = AllProjects.instance;
