import { DebouncedFunc, debounce } from 'lodash';

import { allPermissions } from '../../../stores/AllPermissions.store';
import { communicationService } from '../../communication.service';
import { projectsService } from '../../gis/projects/projects.service';

import { RoleAssignmentBody } from './permissions.models';
import { permissionsClient } from './permissions.client';

export interface PermissionsListItem<T = unknown> {
  entity: T;
  permissions: RoleAssignmentBody[];
  broken?: boolean;
}

class AllPermissionsService {
  private static _instance: AllPermissionsService;
  private allPermissionsStoreInited = false;
  private fetchingOperationId?: symbol;
  private debouncedFetchPermissionsListStore: DebouncedFunc<() => Promise<void>>;

  private constructor() {
    this.debouncedFetchPermissionsListStore = debounce(this.fetchPermissionsListStore, 300);
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
      void this.debouncedFetchPermissionsListStore();
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

    try {
      const response = await permissionsClient.getAllTablesAndDatasetsPermissions();
      const tablesPermissionsHeap = response.filter(({ permissions }) => permissions?.length);
      allPermissions.setTablesAndDatasetsPermissionsHeap(tablesPermissionsHeap);
    } catch {
      throw new Error('Ошибка получения прав для списка таблиц');
    }

    try {
      const projectPermissionsHeap = await permissionsClient.getAllProjectsPermissions();
      allPermissions.setProjectsPermissionsHeap(projectPermissionsHeap);
    } catch {
      throw new Error('Ошибка получения прав для списка проектов');
    }

    if (this.fetchingOperationId !== operationId) {
      return;
    }

    allPermissions.setFetching(false);
  }
}

export const allPermissionsService = AllPermissionsService.instance;
