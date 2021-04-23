import { observable, action, computed } from 'mobx';

import { allProjects } from './AllProjects.store';
import { allDataEntitiesStore } from './AllDataEntitiesStore';
import { ResourcePermissions, RoleAssignmentBody } from '../services/crg/permissions.models';
import { PermissionsListItem } from '../services/crg/allPermissions.service';
import { CrgProject } from '../services/crg/projects.models';
import { DataEntityType, Dataset, DataTable } from '../services/data.service';

class AllPermissions {
  @observable fetching = false;
  @observable private tablesAndDatasetsPermissionsHeap: ResourcePermissions[] = [];
  @observable private projectsPermissionsHeap: { [projectId: string]: RoleAssignmentBody[] } = {};

  private static _instance: AllPermissions;

  static get instance() {
    return this._instance || (this._instance = new this());
  }

  private constructor() {}

  @computed
  get forProjects(): PermissionsListItem<CrgProject>[] {
    return allProjects.list.map(project => ({
      entity: project,
      permissions: this.projectsPermissionsHeap[String(project.id)] || []
    }));
  }

  @computed
  get forTables(): PermissionsListItem<DataTable>[] {
    return allDataEntitiesStore.dataTables.map(table => ({
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
