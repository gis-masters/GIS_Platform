import React, { Component } from 'react';
import { action, makeObservable, observable } from 'mobx';
import { observer } from 'mobx-react';
import { cn } from '@bem-react/classname';
import { boundMethod } from 'autobind-decorator';
import { AxiosError } from 'axios';

import { NewCrgLayer } from '../../services/gis/layers/layers.models';
import {
  alertLayerOperationError,
  createLayer,
  deleteLayer,
  updateLayer
} from '../../services/gis/layers/layers.service';
import { generateNextLayerId } from '../../services/gis/layers/layers.utils';
import { projectsService } from '../../services/gis/projects/projects.service';
import { currentProject } from '../../stores/CurrentProject.store';
import { sidebars } from '../../stores/Sidebars.store';
import { LayersTree } from '../LayersTree/LayersTree';
import { Loading } from '../Loading/Loading';
import { LayersSidebarContent } from './Content/LayersSidebar-Content';
import { LayersSidebarInner } from './Inner/LayersSidebar-Inner';
import { LayersSidebarOpen } from './Open/LayersSidebar-Open';
import { LayersSidebarToolbar } from './Toolbar/LayersSidebar-Toolbar';

import '!style-loader!css-loader!sass-loader!./LayersSidebar.scss';

const cnLayersSidebar = cn('LayersSidebar');

@observer
export default class LayersSidebar extends Component {
  @observable private editMode = false;
  @observable private busy = false;
  @observable private queriedCount = 0;
  @observable private toolbarAbove = false;

  constructor(props: Record<string, never>) {
    super(props);
    makeObservable(this);
  }

  render() {
    return (
      <div className={cnLayersSidebar({ open: sidebars.layerSidebarOpen })}>
        <LayersSidebarOpen />
        <LayersSidebarInner>
          <LayersSidebarToolbar
            editMode={this.editMode}
            onChangeMode={this.setEditMode}
            onSave={this.save}
            above={this.toolbarAbove}
          />
          <LayersSidebarContent onScroll={this.handleContentScroll}>
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

    await this.groupCreation();
    await this.groupModification();
    await this.layerCreation();
    await this.layerModification();
    await this.layerDeletion();
    await this.groupDeletion();

    projectsService.clearCurrent();
    await projectsService.fetchCurrent();

    this.setBusy(false);
    this.setEditMode(false);
  }

  private async groupDeletion() {
    for (const groupId of currentProject.queriesQueue.groupsToDelete) {
      try {
        await projectsService.deleteGroup(groupId);
      } catch (error) {
        alertLayerOperationError(
          error as AxiosError<{ errors: Record<string, unknown>[]; message?: string }>,
          { id: groupId },
          'удалить группу',
          `id: ${groupId}`
        );
      }
      this.countQuery();
    }
  }

  private async layerDeletion() {
    for (const layerId of currentProject.queriesQueue.layersToDelete) {
      try {
        await deleteLayer(layerId);
      } catch (error) {
        alertLayerOperationError(
          error as AxiosError<{ errors: Record<string, unknown>[]; message?: string }>,
          { id: layerId },
          'удалить слой',
          `id: ${layerId}`
        );
      }
      this.countQuery();
    }
  }

  private async layerModification() {
    for (const [layerId, patch] of currentProject.queriesQueue.layersToPatch) {
      try {
        await updateLayer(layerId, patch);
      } catch (error) {
        alertLayerOperationError(
          error as AxiosError<{ errors: Record<string, unknown>[]; message?: string }>,
          patch,
          'изменить слой',
          `id: ${layerId}`
        );
      }
      this.countQuery();
    }
  }

  private async layerCreation() {
    for (const layer of currentProject.queriesQueue.layersToCreate) {
      const newLayer: NewCrgLayer = { ...layer, id: undefined, complexName: undefined };

      try {
        const createdLayer = await createLayer(newLayer, currentProject.id);
        if (layer.id !== createdLayer.id && currentProject.layers.some(({ id }) => id === createdLayer.id)) {
          currentProject.switchLayerId(createdLayer.id, generateNextLayerId());
        }
      } catch (error) {
        alertLayerOperationError(
          error as AxiosError<{ errors: Record<string, unknown>[]; message?: string }>,
          newLayer,
          'создать слой',
          layer.title
        );
      }
      this.countQuery();
    }
  }

  private async groupCreation() {
    for (const group of currentProject.queriesQueue.groupsToCreate) {
      try {
        const createdGroup = await projectsService.createGroup(group, currentProject.id);

        if (group.id !== createdGroup.id && currentProject.groups.some(({ id }) => id === createdGroup.id)) {
          currentProject.switchGroupId(createdGroup.id, projectsService.generateNextGroupId());
        }
        currentProject.switchGroupId(group.id, createdGroup.id);
      } catch (error) {
        alertLayerOperationError(
          error as AxiosError<{ errors: Record<string, unknown>[]; message?: string }>,
          group,
          'создать группу',
          group.title
        );
      }
      this.countQuery();
    }
  }

  private async groupModification() {
    for (const [groupId, patch] of currentProject.queriesQueue.groupsToPatch) {
      try {
        await projectsService.updateGroup(groupId, patch);
      } catch (error) {
        alertLayerOperationError(
          error as AxiosError<{ errors: Record<string, unknown>[]; message?: string }>,
          patch,
          'изменить группу',
          `id: ${groupId}`
        );
      }
      this.countQuery();
    }
  }

  @action.bound
  private handleContentScroll(e: React.UIEvent<HTMLDivElement, UIEvent>) {
    this.toolbarAbove = Boolean(e.currentTarget.scrollTop);
  }
}
