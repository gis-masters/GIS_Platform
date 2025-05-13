import { action, computed, makeObservable, observable } from 'mobx';

import { CrgProject } from '../services/gis/projects/projects.models';
import { filterObjects } from '../services/util/filters/filterObjects';
import { patch } from '../services/util/patch';
import { sortObjects } from '../services/util/sortObjects';

class AllProjects {
  private static _instance: AllProjects;
  static get instance() {
    return this._instance || (this._instance = new this());
  }

  @observable private _list?: CrgProject[];

  @observable nameFilter = '';
  @observable sortBy: keyof CrgProject = 'createdAt';
  @observable sortAsc = true;

  private constructor() {
    makeObservable(this);
  }

  @computed
  get list(): CrgProject[] {
    return [...(this._list || [])];
  }

  @computed
  get displayedList(): CrgProject[] {
    const filtered = filterObjects(this.list, { name: { $ilike: `%${this.nameFilter}%` } });

    return sortObjects(filtered, this.sortBy, this.sortAsc, 'id');
  }

  @computed
  get inited(): boolean {
    return Boolean(this._list);
  }

  @computed
  private get projectsMap(): Map<number, CrgProject> {
    return new Map(this._list?.map(project => [project.id, project]) || []);
  }

  getById(id: number): CrgProject {
    const project = this.projectsMap.get(id);

    if (!project) {
      throw new Error(`Проект с id ${id} не найден`);
    }

    return project;
  }

  @action
  setList(list?: CrgProject[]) {
    this._list = list;
  }

  @action
  update(id: number, patchData: Partial<CrgProject>) {
    if (this._list) {
      const project = this.getById(id);
      patch(project, patchData);
    }
  }

  @action
  addProject(newProject: CrgProject) {
    if (this._list && !this.projectsMap.has(newProject.id)) {
      this._list.push(newProject);
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
    this.setList();
    this.setNameFilter('');
  }
}

export const allProjects = AllProjects.instance;

// for autotests
Object.assign(window, { allProjects });
