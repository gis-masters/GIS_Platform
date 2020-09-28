import { debounce } from 'lodash';

import { permissionsList } from '../../stores/PermissionsList.store';
import { projectsList } from '../../stores/ProjectsList.store';
import { getPermissions, RoleAssignmentBody } from './permissions.service';
import { communicationService } from '../communication.service';
import { CrgProject, CrgLayer, CrgLayerType } from './projects.models';
import { projectsService } from './projects.service';
import { services } from '../services';
import { Toast } from '../../components/Toast/Toast';

export interface PermissionsListItem {
  project: CrgProject;
  layer?: CrgLayer;
  permissions: RoleAssignmentBody[];
  broken?: boolean;
}

class PermissionsListService {
  private static _instance: PermissionsListService;
  private groupsListStoreInited = false;
  private fetchingOperationId: Symbol;
  private debouncedFetchPermissionsListStore: () => Promise<void>;

  private constructor() {
    this.debouncedFetchPermissionsListStore = debounce(this.fetchPermissionsListStore, 300);
  }

  static get instance() {
    return this._instance || (this._instance = new this());
  }

  async initGroupsListStore() {
    if (this.groupsListStoreInited) {
      return;
    }

    this.groupsListStoreInited = true;

    communicationService.permissionsUpdated.on(() => {
      this.debouncedFetchPermissionsListStore();
    });

    await this.fetchPermissionsListStore();
  }

  private async fetchPermissionsListStore() {
    if (!this.groupsListStoreInited) {
      return;
    }

    const operationId = Symbol();
    this.fetchingOperationId = operationId;

    permissionsList.setFetching(true);

    if (!projectsList.isLoaded) {
      await projectsService.fetchProjects();
    }

    const permissions: PermissionsListItem[] = [];
    let itemCounter = 0;
    const items = [];

    for (let project of projectsList.list) {
      const layers = await projectsService.getProjectLayers(project.id);
      items.push([project]);
      items.concat(layers.filter(layer => layer.type === CrgLayerType.VECTOR).map(layer => [project, layer]));
    }

    for (let [project, layer] of items) {
      let broken = false;
      let layerPermissions: RoleAssignmentBody[] = [];

      try {
        // если слой не указан (undefined), вернёт результат для самого проекта
        layerPermissions = await getPermissions(project, layer);
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
      permissionsList.setFetchingProgress((itemCounter / items.length) * 100);

      permissions.push({
        project,
        layer,
        permissions: layerPermissions,
        broken
      });
    }

    permissionsList.setList(permissions);
    permissionsList.setFetching(false);
    permissionsList.setFetchingProgress(null);
  }
}

export const permissionsListService = PermissionsListService.instance;
