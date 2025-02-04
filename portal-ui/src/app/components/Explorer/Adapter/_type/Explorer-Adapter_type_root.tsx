import React, { ReactNode } from 'react';
import { HomeOutlined } from '@mui/icons-material';

import { staticImplements } from '../../../../services/util/staticImplements';
import { currentUser } from '../../../../stores/CurrentUser.store';
import { organizationSettings } from '../../../../stores/OrganizationSettings.store';
import { Adapter, ExplorerItemData, ExplorerItemType } from '../../Explorer.models';

function getChildren(): ExplorerItemData[] {
  let baseChildren: ExplorerItemData[] = [
    {
      type: ExplorerItemType.DATASET_ROOT,
      payload: null
    },
    {
      type: ExplorerItemType.BASEMAPS_ROOT,
      payload: null
    },
    {
      type: ExplorerItemType.PROJECTS_ROOT,
      payload: null
    }
  ];

  if (organizationSettings.viewDocumentLibrary) {
    const libraryRoot: ExplorerItemData = {
      type: ExplorerItemType.LIBRARY_ROOT,
      payload: null
    };

    baseChildren = [...baseChildren.slice(0, 1), libraryRoot, ...baseChildren.slice(1)];
  }

  if (organizationSettings.reestrs) {
    baseChildren.push({
      type: ExplorerItemType.MESSAGES_REGISTRIES_ROOT,
      payload: null
    });
  }

  if (organizationSettings.taskManagement) {
    baseChildren.push({
      type: ExplorerItemType.TASKS_ROOT,
      payload: null
    });
  }

  if (!currentUser.isAdmin) {
    return baseChildren;
  }

  return [
    ...baseChildren,
    {
      type: ExplorerItemType.SCHEMAS_ROOT,
      payload: null
    }
  ];
}

@staticImplements<Adapter>()
export class ExplorerAdapterTypeRoot {
  static getId(): string {
    return 'root';
  }

  static getTitle(): ReactNode {
    return <HomeOutlined />;
  }

  static getMeta(): string {
    return '';
  }

  static isFolder(): boolean {
    return true;
  }

  static getChildren(): [ExplorerItemData[], number] {
    return [getChildren(), 1];
  }

  static getChildrenWithParticularOne(): [ExplorerItemData[], number, number] {
    return [getChildren(), 1, 0];
  }

  static getChildById(item: ExplorerItemData, id: string): ExplorerItemData | undefined {
    if (id === 'datasetRoot') {
      return {
        type: ExplorerItemType.DATASET_ROOT,
        payload: null
      };
    }
    if (id === 'libraryRoot') {
      return {
        type: ExplorerItemType.LIBRARY_ROOT,
        payload: null
      };
    }
    if (id === 'basemapsRoot') {
      return {
        type: ExplorerItemType.BASEMAPS_ROOT,
        payload: null
      };
    }
    if (id === 'projectsRoot') {
      return {
        type: ExplorerItemType.PROJECTS_ROOT,
        payload: null
      };
    }
    if (id === 'schemasRoot') {
      return {
        type: ExplorerItemType.SCHEMAS_ROOT,
        payload: null
      };
    }
    if (id === 'messagesRegistries') {
      return {
        type: ExplorerItemType.MESSAGES_REGISTRIES_ROOT,
        payload: null
      };
    }
    if (id === 'tasksRoot') {
      return {
        type: ExplorerItemType.TASKS_ROOT,
        payload: null
      };
    }
  }

  static hasSearch(): boolean {
    return true;
  }
}
