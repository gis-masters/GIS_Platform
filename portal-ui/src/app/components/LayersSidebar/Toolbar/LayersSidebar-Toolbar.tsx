import React, { Component } from 'react';
import { action, computed, makeObservable, observable } from 'mobx';
import { observer } from 'mobx-react';
import { Tooltip } from '@mui/material';
import {
  CancelOutlined,
  CreateNewFolder,
  CreateNewFolderOutlined,
  FilterAltOutlined,
  SaveOutlined
} from '@mui/icons-material';
import { cn } from '@bem-react/classname';
import { boundMethod } from 'autobind-decorator';
import { cloneDeep } from 'lodash';

import { CrgLayer, CrgLayersGroup } from '../../../services/gis/layers/layers.models';
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

import '!style-loader!css-loader!sass-loader!./LayersSidebar-Toolbar.scss';

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

@observer
export class LayersSidebarToolbar extends Component<LayersSidebarToolbarProps> {
  @observable private createGroupDialogOpen = false;
  @observable private addLayerDialogOpen = false;
  @observable private isLayersFilterActive = false;

  constructor(props: LayersSidebarToolbarProps) {
    super(props);
    makeObservable(this);
  }

  componentDidMount(): void {
    currentProject.setFilter('');
  }

  render() {
    const { editMode, above } = this.props;
    const hasChangedLayers: boolean = currentProject.canBeEdited
      ? Boolean(currentProject.queriesQueueLength)
      : this.hasChangedLayersIgnoringEnabledAndExpanded;

    return (
      <>
        <div className={cnLayersSidebarToolbar({ above })}>
          {hasChangedLayers && !this.isLayersFilterActive && (
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
                    onClick={this.save}
                    disabled={
                      !currentProject.canBeEdited ||
                      !mapStore.allowedActions.includes(MapAction.LAYER_SIDEBAR_LEFT_TOOLS)
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
                    onClick={this.cancel}
                    color='secondary'
                    disabled={!mapStore.allowedActions.includes(MapAction.LAYER_SIDEBAR_LEFT_TOOLS)}
                  >
                    <CancelOutlined />
                  </IconButton>
                </span>
              </Tooltip>
            </LayersSidebarToolbarLeft>
          )}

          {this.isLayersFilterActive && <LayersFilter turnOffLayersFilter={this.turnOffLayersFilter} />}

          {!this.isLayersFilterActive && (
            <LayersSidebarToolbarRight>
              <Tooltip title='Фильтрация слоёв'>
                <IconButton
                  className={cnLayersSidebarFilterBtn()}
                  onClick={this.turnOnLayersFilter}
                  disabled={!mapStore.allowedActions.includes(MapAction.LAYER_FILTRATION)}
                >
                  <FilterAltOutlined />
                </IconButton>
              </Tooltip>

              {editMode && (
                <Tooltip title='Создать группу'>
                  <IconButton
                    onClick={this.openCreateGroupDialog}
                    disabled={!mapStore.allowedActions.includes(MapAction.CREATE_LAYER_GROUP)}
                  >
                    {this.createGroupDialogOpen ? <CreateNewFolder /> : <CreateNewFolderOutlined />}
                  </IconButton>
                </Tooltip>
              )}

              <Tooltip title='Подключить слой'>
                <IconButton
                  className={cnLayersSidebarAddLayerBtn()}
                  onClick={this.openAddLayerDialog}
                  disabled={!mapStore.allowedActions.includes(MapAction.ADD_LAYER)}
                >
                  {this.addLayerDialogOpen ? <LayerAdd /> : <LayerAddOutlined />}
                </IconButton>
              </Tooltip>

              {organizationSettings.editProjectLayer && (
                <Tooltip title='Настроить слои проекта'>
                  <IconButton
                    className={cnLayersSidebarEditBtn()}
                    onClick={this.handleEditModeClick}
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
          open={this.createGroupDialogOpen}
          onClose={this.closeCreateGroupDialog}
          onEdit={this.createGroup}
          create
        />

        <AddLayerDialog open={this.addLayerDialogOpen} onClose={this.closeAddLayerDialog} onAdd={this.addLayer} />
      </>
    );
  }

  @computed
  private get hasChangedLayersIgnoringEnabledAndExpanded(): boolean {
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

  @action.bound
  private turnOnLayersFilter() {
    this.isLayersFilterActive = true;
    this.props.onChangeMode(false);
  }

  @action.bound
  private turnOffLayersFilter() {
    this.isLayersFilterActive = false;
    currentProject.setFilter('');
  }

  @action.bound
  private openCreateGroupDialog() {
    this.createGroupDialogOpen = true;
  }

  @action.bound
  private closeCreateGroupDialog() {
    this.createGroupDialogOpen = false;
  }

  @action.bound
  private openAddLayerDialog() {
    this.addLayerDialogOpen = true;
  }

  @action.bound
  private closeAddLayerDialog() {
    this.addLayerDialogOpen = false;
  }

  @action.bound
  private async addLayer(layer: CrgLayer) {
    currentProject.layers.splice(0, 0, layer);

    await focusToLayer(layer);
  }

  @action.bound
  private createGroup(title: string) {
    const newGroup: CrgLayersGroup = {
      id: projectsService.generateNextGroupId(),
      title: title,
      enabled: true,
      expanded: true,
      transparency: 100,
      position: -1
    };

    currentProject.groups.splice(0, 0, newGroup);

    this.closeCreateGroupDialog();
  }

  @boundMethod
  private handleEditModeClick() {
    const { editMode, onChangeMode } = this.props;
    onChangeMode(!editMode);
  }

  @boundMethod
  private save() {
    this.props.onSave();
  }

  @action.bound
  private cancel() {
    if (currentProject.queriesQueueLength) {
      currentProject.groups = cloneDeep(currentProject.primalGroups);
      currentProject.layers = cloneDeep(currentProject.primalLayers);
    }

    this.props.onChangeMode(false);
  }
}
