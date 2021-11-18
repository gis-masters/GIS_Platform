import { observable, computed, action } from 'mobx';

import { CrgProject } from '../services/crg/projects.models';
import { filterObjects } from '../services/util/filterObjects';
import { patch } from '../services/util/patch';
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
    return [...(this._list || [])];
  }

  @computed
  get displayedList(): CrgProject[] {
    const filtered = filterObjects(this.list, { name: this.nameFilter });

    return sortObjects(filtered, this.sortBy, this.sortAsc, 'id');
  }

  @computed
  get inited(): boolean {
    return Boolean(this._list);
  }

  @action
  setList(list?: CrgProject[]) {
    this._list = list;
  }

  @action
  update(id: number, patchData: Partial<CrgProject>) {
    if (this._list) {
      const project = this._list.find(project => project.id === id);
      patch(project, patchData);
    }
  }

  @action
  delete(id: number) {
    if (this._list) {
      const index = this._list.findIndex(project => project.id === id);
      this._list.splice(index, 1);
    }
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

  reset() {
    this.setList(null);
    this.setNameFilter('');
  }
}

export const allProjects = AllProjects.instance;
