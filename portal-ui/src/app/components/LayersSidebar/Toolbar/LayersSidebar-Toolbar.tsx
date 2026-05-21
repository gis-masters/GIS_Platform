import React, { useCallback, useEffect, useRef } from 'react';
import { runInAction } from 'mobx';
import { observer, useLocalObservable } from 'mobx-react';
import { Tooltip } from '@mui/material';
import {
  CancelOutlined,
  CreateNewFolder,
  CreateNewFolderOutlined,
  FilterAltOutlined,
  SaveOutlined
} from '@mui/icons-material';
import { cn } from '@bem-react/classname';
import { cloneDeep } from 'lodash';

import { type CrgLayer, type CrgLayersGroup } from '../../../services/gis/layers/layers.models';
import { projectsService } from '../../../services/gis/projects/projects.service';
import { MapAction } from '../../../services/map/map.models';
import { focusToLayer } from '../../../services/sidebarActions.service';
import { currentProject } from '../../../stores/CurrentProject.store';
import { mapStore } from '../../../stores/Map.store';
import { organizationSettings } from '../../../stores/OrganizationSettings.store';
import { AddLayerDialog } from '../../AddLayerDialog/AddLayerDialog';
import { IconButton } from '../../IconButton/IconButton';
import { LayerAdd } from '../../Icons/LayerAdd';
import { LayerAddOutlined } from '../../Icons/LayerAddOutlined';
import { LayersSettings } from '../../Icons/LayersSettings';
import { LayersSettingsOutline } from '../../Icons/LayersSettingsOutline';
import { LayersFilter } from '../../LayersFilter/LayersFilter';
import { LayersGroupEditDialog } from '../../LayersGroupEditDialog/LayersGroupEditDialog';
import { LayersSidebarToolbarLeft } from '../ToolbarLeft/LayersSidebar-ToolbarLeft';
import { LayersSidebarToolbarRight } from '../ToolbarRight/LayersSidebar-ToolbarRight';

import './LayersSidebar-Toolbar.scss';

const cnLayersSidebarToolbar = cn('LayersSidebar', 'Toolbar');
const cnLayersSidebarEditBtn = cn('LayersSidebar', 'EditBtn');
const cnLayersSidebarAddLayerBtn = cn('LayersSidebar', 'AddLayerBtn');
const cnLayersSidebarSaveBtn = cn('LayersSidebar', 'SaveBtn');
const cnLayersSidebarCancelBtn = cn('LayersSidebar', 'CancelBtn');
const cnLayersSidebarFilterBtn = cn('LayersSidebar', 'FilterBtn');

interface LayersSidebarToolbarProps {
  above: boolean;
  editMode: boolean;
  onChangeMode(editMode: boolean): void;
  onSave(): void;
}

type LayersSidebarToolbarState = {
  createGroupDialogOpen: boolean;
  addLayerDialogOpen: boolean;
  layersFilterActive: boolean;
  openCreateGroupDialog(): void;
  closeCreateGroupDialog(): void;
  openAddLayerDialog(): void;
  closeAddLayerDialog(): void;
  turnOnLayersFilter(): void;
  turnOffLayersFilter(): void;
};

function getHasChangedLayersIgnoringEnabledAndExpanded(): boolean {
  const { groupsToCreate, groupsToDelete, groupsToPatch, layersToCreate, layersToDelete, layersToPatch } =
    currentProject.queriesQueue;

  if (groupsToCreate.length || groupsToDelete.length || layersToCreate.length || layersToDelete.length) {
    return true;
  }

  return (
    groupsToPatch.some(([, patch]) => Object.keys(patch).some(key => key !== 'enabled' && key !== 'expanded')) ||
    layersToPatch.some(([, patch]) => Object.keys(patch).some(key => key !== 'enabled'))
  );
}

export const LayersSidebarToolbar = observer(function LayersSidebarToolbar({
  above,
  editMode,
  onChangeMode,
  onSave
}: LayersSidebarToolbarProps) {
  const onChangeModeRef = useRef(onChangeMode);
  onChangeModeRef.current = onChangeMode;

  const state = useLocalObservable<LayersSidebarToolbarState>(() => ({
    createGroupDialogOpen: false,
    addLayerDialogOpen: false,
    layersFilterActive: false,

    openCreateGroupDialog() {
      this.createGroupDialogOpen = true;
    },

    closeCreateGroupDialog() {
      this.createGroupDialogOpen = false;
    },

    openAddLayerDialog() {
      this.addLayerDialogOpen = true;
    },

    closeAddLayerDialog() {
      this.addLayerDialogOpen = false;
    },

    turnOnLayersFilter() {
      this.layersFilterActive = true;
      onChangeModeRef.current(false);
    },

    turnOffLayersFilter() {
      this.layersFilterActive = false;
      currentProject.setFilter('');
    }
  }));

  const handleEditModeClick = useCallback(() => {
    onChangeMode(!editMode);
  }, [editMode, onChangeMode]);

  const save = useCallback(() => {
    onSave();
  }, [onSave]);

  const cancel = useCallback(() => {
    runInAction(() => {
      if (currentProject.queriesQueueLength) {
        currentProject.groups = cloneDeep(currentProject.primalGroups);
        currentProject.layers = cloneDeep(currentProject.primalLayers);
      }

      onChangeMode(false);
    });
  }, [onChangeMode]);

  const addLayer = useCallback(async (layer: CrgLayer) => {
    runInAction(() => {
      currentProject.layers.splice(0, 0, layer);
    });

    await focusToLayer(layer);
  }, []);

  const createGroup = useCallback(
    (title: string) => {
      runInAction(() => {
        const newGroup: CrgLayersGroup = {
          id: projectsService.generateNextGroupId(),
          title,
          enabled: true,
          expanded: true,
          transparency: 100,
          position: -1
        };

        currentProject.groups.splice(0, 0, newGroup);
      });

      state.closeCreateGroupDialog();
    },
    [state]
  );

  useEffect(() => {
    currentProject.setFilter('');
  }, []);

  const hasChangedLayers: boolean = currentProject.canBeEdited
    ? Boolean(currentProject.queriesQueueLength)
    : getHasChangedLayersIgnoringEnabledAndExpanded();

  return (
    <>
      <div className={cnLayersSidebarToolbar({ above })}>
        {hasChangedLayers && !state.layersFilterActive && (
          <LayersSidebarToolbarLeft>
            <Tooltip
              title={
                'Сохранить список слоёв для всех пользователей' +
                (currentProject.canBeEdited ? '' : ' (недостаточно прав)')
              }
            >
              <span>
                <IconButton
                  className={cnLayersSidebarSaveBtn()}
                  onClick={save}
                  disabled={
                    !currentProject.canBeEdited || !mapStore.allowedActions.includes(MapAction.LAYER_SIDEBAR_LEFT_TOOLS)
                  }
                  color='primary'
                >
                  <SaveOutlined />
                </IconButton>
              </span>
            </Tooltip>

            <Tooltip title='Отменить изменения'>
              <span>
                <IconButton
                  className={cnLayersSidebarCancelBtn()}
                  onClick={cancel}
                  color='secondary'
                  disabled={!mapStore.allowedActions.includes(MapAction.LAYER_SIDEBAR_LEFT_TOOLS)}
                >
                  <CancelOutlined />
                </IconButton>
              </span>
            </Tooltip>
          </LayersSidebarToolbarLeft>
        )}

        {state.layersFilterActive && <LayersFilter turnOffLayersFilter={state.turnOffLayersFilter} />}

        {!state.layersFilterActive && (
          <LayersSidebarToolbarRight>
            <Tooltip title='Фильтрация слоёв'>
              <IconButton
                className={cnLayersSidebarFilterBtn()}
                onClick={state.turnOnLayersFilter}
                disabled={!mapStore.allowedActions.includes(MapAction.LAYER_FILTRATION)}
              >
                <FilterAltOutlined />
              </IconButton>
            </Tooltip>

            {editMode && (
              <Tooltip title='Создать группу'>
                <IconButton
                  onClick={state.openCreateGroupDialog}
                  disabled={!mapStore.allowedActions.includes(MapAction.CREATE_LAYER_GROUP)}
                >
                  {state.createGroupDialogOpen ? <CreateNewFolder /> : <CreateNewFolderOutlined />}
                </IconButton>
              </Tooltip>
            )}

            <Tooltip title='Подключить слой'>
              <IconButton
                className={cnLayersSidebarAddLayerBtn()}
                onClick={state.openAddLayerDialog}
                disabled={!mapStore.allowedActions.includes(MapAction.ADD_LAYER)}
              >
                {state.addLayerDialogOpen ? <LayerAdd /> : <LayerAddOutlined />}
              </IconButton>
            </Tooltip>

            {organizationSettings.editProjectLayer && (
              <Tooltip title='Настроить слои проекта'>
                <IconButton
                  className={cnLayersSidebarEditBtn()}
                  onClick={handleEditModeClick}
                  disabled={!mapStore.allowedActions.includes(MapAction.EDIT_PROJECT_LAYER)}
                >
                  {editMode ? <LayersSettings /> : <LayersSettingsOutline />}
                </IconButton>
              </Tooltip>
            )}
          </LayersSidebarToolbarRight>
        )}
      </div>

      <LayersGroupEditDialog
        open={state.createGroupDialogOpen}
        onClose={state.closeCreateGroupDialog}
        onEdit={createGroup}
        create
      />

      <AddLayerDialog open={state.addLayerDialogOpen} onClose={state.closeAddLayerDialog} onAdd={addLayer} />
    </>
  );
});
