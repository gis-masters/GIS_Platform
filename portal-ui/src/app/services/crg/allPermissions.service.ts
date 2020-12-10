import { debounce } from 'lodash';

import { allProjects } from '../../stores/AllProjects.store';
import { allPermissions } from '../../stores/AllPermissions.store';
import { getProjectPermissions, getTablePermissions } from './permissions.client';
import { CrgProject, CrgLayer, CrgLayerType } from './projects.models';
import { communicationService } from '../communication.service';
import { RoleAssignmentBody } from './permissions.models';
import { projectsService } from './projects.service';
import { services } from '../services';
import { Toast } from '../../components/Toast/Toast';

export interface PermissionsListItem {
  project: CrgProject;
  layer?: CrgLayer;
  permissions: RoleAssignmentBody[];
  broken?: boolean;
}

class AllPermissionsService {
  private static _instance: AllPermissionsService;
  private allPermissionsStoreInited = false;
  private fetchingOperationId: Symbol;
  private debouncedFetchPermissionsListStore: () => Promise<void>;

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

    if (!allProjects.isLoaded) {
      await projectsService.fetchProjects();
    }

    const list: PermissionsListItem[] = [];
    let itemCounter = 0;
    const items: [CrgProject, CrgLayer?][] = [];

    for (const project of allProjects.list) {
      const layers = await projectsService.getProjectLayers(project.id);
      items.splice(
        items.length,
        0,
        [project],
        ...layers
          .filter(layer => layer.type === CrgLayerType.VECTOR)
          .map(layer => [project, layer] as [CrgProject, CrgLayer])
      );
    }

    for (const [project, layer] of items) {
      let broken = false;
      let permissions: RoleAssignmentBody[] = [];

      try {
        permissions = layer
          ? await getTablePermissions(layer.dataset, layer.internalName)
          : await getProjectPermissions(project);
      } catch (e) {
        broken = true;
        let errText =
          'Ошибка получения данных ' +
          (layer
            ? `для слоя "${layer.title}" в проекте "${project.name}" (${layer.complexName})`
            : `для проекта "${project.name}"`);
        Toast.warn(errText);
        services.logger.error(errText, e);
      }

      if (this.fetchingOperationId !== operationId) {
        return;
      }

      itemCounter++;
      allPermissions.setFetchingProgress((itemCounter / items.length) * 100);

      list.push({
        project,
        layer,
        permissions,
        broken
      });
    }

    allPermissions.setList(list);
    allPermissions.setFetching(false);
    allPermissions.setFetchingProgress(null);
  }
}

export const allPermissionsService = AllPermissionsService.instance;
