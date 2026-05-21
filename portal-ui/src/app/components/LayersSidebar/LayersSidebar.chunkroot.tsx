import React, { useCallback, useEffect } from 'react';
import { observer, useLocalObservable } from 'mobx-react';
import { cn } from '@bem-react/classname';

import { communicationService } from '../../services/communication.service';
import { type NewCrgLayer } from '../../services/gis/layers/layers.models';
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

import './LayersSidebar.scss';

const cnLayersSidebar = cn('LayersSidebar');

type LayersSidebarState = {
  editMode: boolean;
  busy: boolean;
  queriedCount: number;
  toolbarAbove: boolean;
  setEditMode(editMode: boolean): void;
  setBusy(busy: boolean): void;
  incrementQueriedCount(): void;
  setToolbarAbove(above: boolean): void;
};

async function runGroupDeletion(state: LayersSidebarState): Promise<void> {
  for (const groupId of currentProject.queriesQueue.groupsToDelete) {
    try {
      await projectsService.deleteGroup(groupId);
    } catch (error) {
      alertLayerOperationError(error, { id: groupId }, 'удалить группу', `id: ${groupId}`);
    }
    state.incrementQueriedCount();
  }
}

async function runLayerDeletion(state: LayersSidebarState): Promise<void> {
  for (const layerId of currentProject.queriesQueue.layersToDelete) {
    try {
      await deleteLayer(layerId);
    } catch (error) {
      alertLayerOperationError(error, { id: layerId }, 'удалить слой', `id: ${layerId}`);
    }
    state.incrementQueriedCount();
  }
}

async function runLayerModification(state: LayersSidebarState): Promise<void> {
  for (const [layerId, patch] of currentProject.queriesQueue.layersToPatch) {
    try {
      await updateLayer(layerId, patch);
    } catch (error) {
      alertLayerOperationError(error, patch, 'изменить слой', `id: ${layerId}`);
    }
    state.incrementQueriedCount();
  }
}

async function runLayerCreation(state: LayersSidebarState): Promise<void> {
  for (const layer of currentProject.queriesQueue.layersToCreate) {
    const newLayer: NewCrgLayer = { ...layer, id: undefined, complexName: undefined };

    try {
      const createdLayer = await createLayer(newLayer, currentProject.id);
      if (layer.id !== createdLayer.id && currentProject.layers.some(({ id }) => id === createdLayer.id)) {
        currentProject.switchLayerId(createdLayer.id, generateNextLayerId());
      }
    } catch (error) {
      alertLayerOperationError(error, newLayer, 'создать слой', layer.title);
    }
    state.incrementQueriedCount();
  }
}

async function runGroupCreation(state: LayersSidebarState): Promise<void> {
  for (const group of currentProject.queriesQueue.groupsToCreate) {
    try {
      const createdGroup = await projectsService.createGroup(group, currentProject.id);

      if (group.id !== createdGroup.id && currentProject.groups.some(({ id }) => id === createdGroup.id)) {
        currentProject.switchGroupId(createdGroup.id, projectsService.generateNextGroupId());
      }
      currentProject.switchGroupId(group.id, createdGroup.id);
    } catch (error) {
      alertLayerOperationError(error, group, 'создать группу', group.title);
    }
    state.incrementQueriedCount();
  }
}

async function runGroupModification(state: LayersSidebarState): Promise<void> {
  for (const [groupId, patch] of currentProject.queriesQueue.groupsToPatch) {
    try {
      await projectsService.updateGroup(groupId, patch);
    } catch (error) {
      alertLayerOperationError(error, patch, 'изменить группу', `id: ${groupId}`);
    }
    state.incrementQueriedCount();
  }
}

async function saveLayersSidebarChanges(state: LayersSidebarState): Promise<void> {
  state.setBusy(true);

  await runGroupCreation(state);
  await runGroupModification(state);
  await runLayerCreation(state);
  await runLayerModification(state);
  await runLayerDeletion(state);
  await runGroupDeletion(state);

  projectsService.clearCurrent();
  await projectsService.fetchCurrent();

  state.setBusy(false);
  state.setEditMode(false);
}

const LayersSidebar = observer(function LayersSidebar() {
  const state = useLocalObservable<LayersSidebarState>(() => ({
    editMode: false,
    busy: false,
    queriedCount: 0,
    toolbarAbove: false,

    setEditMode(editMode) {
      this.editMode = editMode;
    },

    setBusy(busy) {
      this.busy = busy;
    },

    incrementQueriedCount() {
      this.queriedCount++;
    },

    setToolbarAbove(above) {
      this.toolbarAbove = above;
    }
  }));

  const handleContentScroll = useCallback(
    (e: React.UIEvent<HTMLDivElement>) => {
      state.setToolbarAbove(Boolean(e.currentTarget.scrollTop));
    },
    [state]
  );

  const save = useCallback(async () => {
    await saveLayersSidebarChanges(state);
  }, [state]);

  useEffect(() => {
    const scope = {};
    communicationService.fileConnectionsUpdated.on(async () => {
      projectsService.clearCurrent();
      await projectsService.fetchCurrent();
    }, scope);

    return () => {
      communicationService.off(scope);
    };
  }, []);

  return (
    <div className={cnLayersSidebar({ open: sidebars.layerSidebarOpen })}>
      <LayersSidebarOpen />
      <LayersSidebarInner>
        <LayersSidebarToolbar
          editMode={state.editMode}
          onChangeMode={state.setEditMode}
          onSave={save}
          above={state.toolbarAbove}
        />
        <LayersSidebarContent onScroll={handleContentScroll}>
          <LayersTree editMode={state.editMode} />
        </LayersSidebarContent>
      </LayersSidebarInner>
      <Loading visible={state.busy} value={(state.queriedCount / currentProject.queriesQueueLength) * 100} />
    </div>
  );
});

export default LayersSidebar;
