import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { action, observable } from 'mobx';
import { boundMethod } from 'autobind-decorator';
import { cn } from '@bem-react/classname';

import { sidebars } from '../../stores/Sidebars.store';
import { currentProject } from '../../stores/CurrentProject.store';
import { projectsService } from '../../services/crg/projects.service';
import {
  createLayersGroup,
  deleteLayer,
  deleteLayersGroup,
  generateNextGroupId,
  updateLayer,
  updateLayersGroup
} from '../../services/geoserver/layers.service';
import { LayersTree } from '../LayersTree/LayersTree';
import { Loading } from '../Loading/Loading';

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

  render() {
    return (
      <div className={cnLayersSidebar({ open: sidebars.leftOpen })}>
        <LayersSidebarOpen />
        <LayersSidebarInner>
          <LayersSidebarContent>
            <LayersSidebarToolbar editMode={this.editMode} onChangeMode={this.setEditMode} onSave={this.save} />
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
      const createdGroup = await createLayersGroup({ ...group, id: undefined });
      if (group.id !== createdGroup.id && currentProject.groups.some(({ id }) => id === createdGroup.id)) {
        currentProject.switchGroupId(createdGroup.id, generateNextGroupId());
      }
      this.countQuery();
    }

    for (const [groupId, patch] of currentProject.queriesQueue.groupsToPatch) {
      await updateLayersGroup(groupId, patch);
      this.countQuery();
    }

    for (const [layerId, patch] of currentProject.queriesQueue.layersToPatch) {
      await updateLayer(layerId, patch);
      this.countQuery();
    }

    for (const layerId of currentProject.queriesQueue.layersToDelete) {
      await deleteLayer(layerId);
      this.countQuery();
    }

    for (const groupId of currentProject.queriesQueue.groupsToDelete) {
      await deleteLayersGroup(groupId);
      this.countQuery();
    }

    projectsService.clearCurrent();
    await projectsService.fetchCurrent();

    this.setBusy(false);
    this.setEditMode(false);
  }
}
