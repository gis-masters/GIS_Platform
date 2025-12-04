import { action, computed, makeObservable, observable } from 'mobx';

import { type CrgProject } from '../../services/gis/projects/projects.models';
import { filterObjects } from '../../services/util/filters/filterObjects';
import { patch } from '../../services/util/patch';
import { sortObjects } from '../../services/util/sortObjects';

export class ProjectsStore {
  @observable busy = false;
  @observable projects: CrgProject[] = [];
  @observable nameFilter = '';
  @observable sortBy: keyof CrgProject = 'createdAt';
  @observable sortAsc = true;
  @observable inited = false;

  constructor() {
    makeObservable(this);
  }

  @action.bound
  setBusy(busy: boolean): void {
    this.busy = busy;
  }

  @action.bound
  setProjects(projects: CrgProject[]): void {
    this.projects = projects;
    this.inited = true;
  }

  @action.bound
  setNameFilter(nameFilter: string): void {
    this.nameFilter = nameFilter;
  }

  @action.bound
  setSortBy(sortBy: keyof CrgProject): void {
    this.sortBy = sortBy;
  }

  @action.bound
  setSortAsc(sortAsc: boolean): void {
    this.sortAsc = sortAsc;
  }

  @action
  addProject(newProject: CrgProject): void {
    const exists = this.projects.some(p => p.id === newProject.id);
    if (!exists) {
      this.projects.push(newProject);
    }
  }

  @action
  updateProject(id: number, patchData: Partial<CrgProject>): void {
    const project = this.projects.find(p => p.id === id);
    if (project) {
      patch(project, patchData);
    }
  }

  @action
  deleteProject(id: number): void {
    const index = this.projects.findIndex(p => p.id === id);
    if (index !== -1) {
      this.projects.splice(index, 1);
    }
  }

  @computed
  get displayedList(): CrgProject[] {
    const filtered = filterObjects(this.projects, { name: { $ilike: `%${this.nameFilter}%` } });

    return sortObjects(filtered, this.sortBy, this.sortAsc, 'id');
  }
}
