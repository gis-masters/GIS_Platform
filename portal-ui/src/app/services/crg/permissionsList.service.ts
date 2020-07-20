import { debounce } from 'lodash';

import { permissionsList } from '../../stores/PermissionsList.store';
import { projectsList } from '../../stores/ProjectsList.store';
import { getPermissions, RoleAssignmentBody } from './permissions.service';
import { communicationService } from '../communication.service';
import { Project, CrgLayer } from './projects.models';
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

    const permissions = (
      await Promise.all(
        projectsList.list.map(async project => {
          return await Promise.all(
            [undefined].concat(project.layers).map(async layer => {
              let broken = false;
              let permissions: RoleAssignmentBody[] = [];

              try {
                permissions = await getPermissions(project, layer);
              } catch (e) {
                broken = true;
                const errText =
                  'Ошибка получения данных ' +
                  (layer
                    ? `для слоя "${layer.title}" в проекте "${project.name}" (${layer.complexName})`
                    : `для проекта "${project.name}"`);
                Toast.warn(errText);
                services.logger.error(errText, e);
              }

              return {
                project,
                layer,
                permissions,
                broken
              };
            })
          );
        })
      )
    ).flat();

    permissionsList.setList(permissions);
    permissionsList.setFetching(false);
  }
}

export const permissionsListService = PermissionsListService.instance;
