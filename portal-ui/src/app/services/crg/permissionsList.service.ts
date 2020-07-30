import { debounce } from 'lodash';

import { permissionsList } from '../../stores/PermissionsList.store';
import { projectsList } from '../../stores/ProjectsList.store';
import { getPermissions, RoleAssignmentBody } from './permissions.service';
import { communicationService } from '../communication.service';
import { Project, CrgLayer, CrgLayerType } from './projects.models';
import { projectsService } from './projects.service';
import { services } from '../services';
import { Toast } from '../../components/Toast/Toast';

export interface PermissionsListItem {
  project: Project;
  layer?: CrgLayer;
  permissions: RoleAssignmentBody[];
  broken?: boolean;
}

class PermissionsListService {
  private static _instance: PermissionsListService;
  private groupsListStoreInited = false;
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

    if (permissionsList.fetching) {
      this.debouncedFetchPermissionsListStore();
      return;
    }

    permissionsList.setFetching(true);

    await projectsService.fetchProjects();

    const permissions: PermissionsListItem[] = [];

    for (let project of projectsList.list) {
      //undefined - нужен для обозначения собственно проекта
      let layers = [undefined].concat(project.layers).filter(layer => !layer || layer.type === CrgLayerType.VECTOR);

      for (let layer of layers) {
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

        permissions.push({
          project,
          layer,
          permissions: layerPermissions,
          broken
        });
      }
    }

    permissionsList.setList(permissions);
    permissionsList.setFetching(false);
  }
}

export const permissionsListService = PermissionsListService.instance;
