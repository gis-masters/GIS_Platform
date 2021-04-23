import { debounce } from 'lodash';

import { allPermissions } from '../../stores/AllPermissions.store';
import { getAllProjectsPermissions, getAllTablesAndDatasetsPermissions } from './permissions.client';
import { communicationService } from '../communication.service';
import { RoleAssignmentBody } from './permissions.models';
import { projectsService } from './projects.service';

export interface PermissionsListItem<T = unknown> {
  entity: T;
  permissions: RoleAssignmentBody[];
  broken?: boolean;
}

class AllPermissionsService {
  private static _instance: AllPermissionsService;
  private allPermissionsStoreInited = false;
  private fetchingOperationId?: Symbol;
  private debouncedFetchPermissionsListStore: () => Promise<void>;

  private constructor() {
    this.debouncedFetchPermissionsListStore = debounce(this.fetchPermissionsListStore, 300);

    communicationService.logout.on(() => {
      allPermissions.reset();
      this.allPermissionsStoreInited = false;
      delete this.fetchingOperationId;
    });
  }

  static get instance() {
    return this._instance || (this._instance = new this());
  }

  async initAllPermissionsStore() {
    if (this.allPermissionsStoreInited) {
      return;
    }

    this.allPermissionsStoreInited = true;

    communicationService.permissionsUpdated.on(() => {
      this.debouncedFetchPermissionsListStore();
    }, this);

    await this.fetchPermissionsListStore();
  }

  dropPermissionsListStore() {
    communicationService.permissionsUpdated.scopeOff(this);
    this.allPermissionsStoreInited = false;
  }

  private async fetchPermissionsListStore() {
    if (!this.allPermissionsStoreInited) {
      return;
    }

    const operationId = Symbol();
    this.fetchingOperationId = operationId;

    allPermissions.setFetching(true);

    await projectsService.initAllProjectsStore();
    const tablesPermissionsHeap = await getAllTablesAndDatasetsPermissions();
    const projectPermissionsHeap = await getAllProjectsPermissions();

    if (this.fetchingOperationId !== operationId) {
      return;
    }

    allPermissions.setProjectsPermissionsHeap(projectPermissionsHeap);
    allPermissions.setTablesAndDatasetsPermissionsHeap(tablesPermissionsHeap);
    allPermissions.setFetching(false);
  }
}

export const allPermissionsService = AllPermissionsService.instance;
