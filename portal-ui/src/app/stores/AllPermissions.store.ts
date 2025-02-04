import { action, computed, makeObservable, observable } from 'mobx';

import { DataEntityType, Dataset, VectorTable } from '../services/data/vectorData/vectorData.models';
import { CrgProject } from '../services/gis/projects/projects.models';
import {
  PermissionsListItem,
  ResourcePermissions,
  RoleAssignmentBody
} from '../services/permissions/permissions.models';
import { allDataEntitiesStore } from './AllDataEntities.store';
import { allProjects } from './AllProjects.store';

class AllPermissions {
  private static _instance: AllPermissions;
  static get instance() {
    return this._instance || (this._instance = new this());
  }

  @observable fetching = false;
  @observable private tablesAndDatasetsPermissionsHeap: ResourcePermissions[] = [];
  @observable private projectsPermissionsHeap: { [projectId: string]: RoleAssignmentBody[] } = {};

  private constructor() {
    makeObservable(this);
  }

  @computed
  get forProjects(): PermissionsListItem<CrgProject>[] {
    return allProjects.list.map(project => ({
      entity: project,
      permissions: this.projectsPermissionsHeap[String(project.id)] || []
    }));
  }

  @computed
  get forTables(): PermissionsListItem<VectorTable>[] {
    return allDataEntitiesStore.vectorTables.map(table => ({
      entity: table,
      permissions:
        this.tablesAndDatasetsPermissionsHeap.find(
          ({ identifier, type }) =>
            type === DataEntityType.TABLE && identifier === `${table.dataset}.${table.identifier}`
        )?.permissions || []
    }));
  }

  @computed
  get forDatasets(): PermissionsListItem<Dataset>[] {
    return allDataEntitiesStore.datasets.map(dataset => ({
      entity: dataset,
      permissions:
        this.tablesAndDatasetsPermissionsHeap.find(
          ({ identifier, type }) => type === DataEntityType.DATASET && identifier === `${dataset.identifier}`
        )?.permissions || []
    }));
  }

  @action
  setTablesAndDatasetsPermissionsHeap(heap: ResourcePermissions[]) {
    this.tablesAndDatasetsPermissionsHeap = heap;
  }

  @action
  setProjectsPermissionsHeap(heap: { [projectId: string]: RoleAssignmentBody[] }) {
    this.projectsPermissionsHeap = heap;
  }

  @action setFetching(fetching: boolean) {
    this.fetching = fetching;
  }

  reset() {
    this.setProjectsPermissionsHeap({});
    this.setTablesAndDatasetsPermissionsHeap([]);
    this.setFetching(false);
  }
}

export const allPermissions = AllPermissions.instance;
