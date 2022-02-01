import React, { Component } from 'react';
import { action, observable } from 'mobx';
import { observer } from 'mobx-react';
import { AxiosError } from 'axios';
import { cn } from '@bem-react/classname';
import { boundMethod } from 'autobind-decorator';

import { sidebars } from '../../stores/Sidebars.store';
import { currentProject } from '../../stores/CurrentProject.store';
import { projectsService } from '../../services/crg/projects.service';
import {
  createLayer,
  createLayersGroup,
  deleteLayer,
  deleteLayersGroup,
  generateNextGroupId,
  generateNextLayerId,
  updateLayer,
  updateLayersGroup
} from '../../services/geoserver/layers.service';
import { services } from '../../services/services';
import { LayersTree } from '../LayersTree/LayersTree';
import { Loading } from '../Loading/Loading';
import { Toast } from '../Toast/Toast';

import { LayersSidebarOpen } from './Open/LayersSidebar-Open';
import { LayersSidebarInner } from './Inner/LayersSidebar-Inner';
import { LayersSidebarToolbar } from './Toolbar/LayersSidebar-Toolbar';
import { LayersSidebarContent } from './Content/LayersSidebar-Content';

import '!style-loader!css-loader!sass-loader!./LayersSidebar.scss';

const cnLayersSidebar = cn('LayersSidebar');

@observer
export class LayersSidebar extends Component {
  @observable private editMode = false;
  @observable private busy = false;
  @observable private queriedCount = 0;
  @observable private toolbarAbove = false;

  render() {
    return (
      <div className={cnLayersSidebar({ open: sidebars.leftOpen })}>
        <LayersSidebarOpen />
        <LayersSidebarInner>
          <LayersSidebarToolbar
            editMode={this.editMode}
            onChangeMode={this.setEditMode}
            onSave={this.save}
            above={this.toolbarAbove}
          />
          <LayersSidebarContent onScroll={this.contentScrollHandler}>
            <LayersTree editMode={this.editMode} />
          </LayersSidebarContent>
        </LayersSidebarInner>
        <Loading visible={this.busy} value={(this.queriedCount / currentProject.queriesQueueLength) * 100} />
      </div>
    );
  }

  @action.bound
  private setEditMode(editMode: boolean) {
    this.editMode = editMode;
  }

  @action
  private setBusy(busy: boolean) {
    this.busy = busy;
  }

  @action
  private countQuery() {
    this.queriedCount++;
  }

  @boundMethod
  private async save() {
    this.setBusy(true);

    for (const group of currentProject.queriesQueue.groupsToCreate) {
      const payload = { ...group, id: undefined };
      try {
        const createdGroup = await createLayersGroup(payload);
        if (group.id !== createdGroup.id && currentProject.groups.some(({ id }) => id === createdGroup.id)) {
          currentProject.switchGroupId(createdGroup.id, generateNextGroupId());
        }
        currentProject.switchGroupId(group.id, createdGroup.id);
      } catch (error) {
        this.alertError(error, payload, 'создать группу', group.title);
      }
      this.countQuery();
    }

    for (const [groupId, patch] of currentProject.queriesQueue.groupsToPatch) {
      try {
        await updateLayersGroup(groupId, patch);
      } catch (error) {
        this.alertError(error, patch, 'изменить группу', `id: ${groupId}`);
      }
      this.countQuery();
    }

    for (const layer of currentProject.queriesQueue.layersToCreate) {
      const payload = { ...layer, id: undefined, complexName: undefined };
      try {
        const createdLayer = await createLayer(payload);
        if (layer.id !== createdLayer.id && currentProject.layers.some(({ id }) => id === createdLayer.id)) {
          currentProject.switchLayerId(createdLayer.id, generateNextLayerId());
        }
      } catch (error) {
        this.alertError(error, payload, 'создать слой', layer.title);
      }
      this.countQuery();
    }

    for (const [layerId, patch] of currentProject.queriesQueue.layersToPatch) {
      try {
        await updateLayer(layerId, patch);
      } catch (error) {
        this.alertError(error, patch, 'изменить слой', `id: ${layerId}`);
      }
      this.countQuery();
    }

    for (const layerId of currentProject.queriesQueue.layersToDelete) {
      try {
        await deleteLayer(layerId);
      } catch (error) {
        this.alertError(error, { id: layerId }, 'удалить слой', `id: ${layerId}`);
      }
      this.countQuery();
    }

    for (const groupId of currentProject.queriesQueue.groupsToDelete) {
      try {
        await deleteLayersGroup(groupId);
      } catch (error) {
        this.alertError(error, { id: groupId }, 'удалить группу', `id: ${groupId}`);
      }
      this.countQuery();
    }

    projectsService.clearCurrent();
    await projectsService.fetchCurrent();

    this.setBusy(false);
    this.setEditMode(false);
  }

  @action.bound
  private contentScrollHandler(e: React.UIEvent<HTMLDivElement, UIEvent>) {
    this.toolbarAbove = Boolean(e.currentTarget.scrollTop);
  }

  private alertError(
    e: AxiosError<{ errors: Record<string, unknown>[]; message?: string }>,
    payload: Record<string, unknown>,
    actionText: string,
    actionName: string
  ) {
    const payloadDetails = JSON.stringify(payload, null, 2);
    let responseDetails = '-';
    if (e.response) {
      const responseData = JSON.stringify(
        {
          ...e.response,
          request: undefined,
          config: undefined,
          headers: undefined
        },
        null,
        2
      );
      responseDetails = `${e.response.config?.url} \n${responseData}`;
    }

    const message = `Не удалось ${actionText} "${actionName}"`;

    const details = e.response?.data?.message
      ? e.response.data.message
      : `Запрос: \n${responseDetails} \n\nДанные: \n${payloadDetails}`;

    Toast.error({ message, details });
    services.logger.error(message, e);
  }
}
