import React, { Component } from 'react';
import { action, observable } from 'mobx';
import { observer } from 'mobx-react';
import { IconButton, Tooltip } from '@material-ui/core';
import { CancelOutlined, CreateNewFolder, CreateNewFolderOutlined, SaveOutlined } from '@material-ui/icons';
import { boundMethod } from 'autobind-decorator';
import { cn } from '@bem-react/classname';
import { cloneDeep } from 'lodash';

import { currentProject } from '../../../stores/CurrentProject.store';
import { NewCrgLayer, NewCrgLayersGroup } from '../../../services/crg/projects.models';
import { generateNextGroupId } from '../../../services/geoserver/layers.service';
import { LayersGroupEditDialog } from '../../LayersGroupEditDialog/LayersGroupEditDialog';
import { LayersSettingsOutline } from '../../Icons/LayersSettingsOutline';
import { AddLayerDialog } from '../../AddLayerDialog/AddLayerDialog';
import { LayerAddOutlined } from '../../Icons/LayerAddOutlined';
import { LayersSettings } from '../../Icons/LayersSettings';
import { LayerAdd } from '../../Icons/LayerAdd';

import { LayersSidebarToolbarLeft } from '../ToolbarLeft/LayersSidebar-ToolbarLeft';
import { LayersSidebarToolbarRight } from '../ToolbarRight/LayersSidebar-ToolbarRight';

import '!style-loader!css-loader!sass-loader!./LayersSidebar-Toolbar.scss';

const cnLayersSidebarToolbar = cn('LayersSidebar', 'Toolbar');

interface LayersSidebarToolbarProps {
  above: boolean;
  editMode: boolean;
  onChangeMode: (editMode: boolean) => void;
  onSave: () => void;
}

@observer
export class LayersSidebarToolbar extends Component<LayersSidebarToolbarProps> {
  @observable private createGroupDialogOpen = false;
  @observable private addLayerDialogOpen = false;

  render() {
    const { editMode, above } = this.props;

    return (
      <>
        <div className={cnLayersSidebarToolbar({ above })}>
          <LayersSidebarToolbarLeft>
            {editMode && currentProject.canBeEdited && (
              <Tooltip title='Сохранить для всех пользователей'>
                <span>
                  <IconButton onClick={this.save} disabled={!currentProject.queriesQueueLength} color='primary'>
                    <SaveOutlined />
                  </IconButton>
                </span>
              </Tooltip>
            )}

            {editMode && (
              <Tooltip title='Отменить изменения'>
                <span>
                  <IconButton onClick={this.cancel} color='secondary'>
                    <CancelOutlined />
                  </IconButton>
                </span>
              </Tooltip>
            )}
          </LayersSidebarToolbarLeft>
          <LayersSidebarToolbarRight>
            {editMode && (
              <Tooltip title='Подключить слой'>
                <IconButton onClick={this.openAddLayerDialog}>
                  {this.addLayerDialogOpen ? <LayerAdd /> : <LayerAddOutlined />}
                </IconButton>
              </Tooltip>
            )}

            {editMode && (
              <Tooltip title='Создать группу'>
                <IconButton onClick={this.openCreateGroupDialog}>
                  {this.createGroupDialogOpen ? <CreateNewFolder /> : <CreateNewFolderOutlined />}
                </IconButton>
              </Tooltip>
            )}

            <Tooltip title='Настроить слои проекта'>
              <IconButton onClick={this.handleEditModeClick}>
                {editMode ? <LayersSettings /> : <LayersSettingsOutline />}
              </IconButton>
            </Tooltip>
          </LayersSidebarToolbarRight>
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
  private addLayer(layer: NewCrgLayer) {
    currentProject.layers.splice(0, 0, layer);
  }

  @action.bound
  private createGroup(newGroupName: string) {
    const newGroup: NewCrgLayersGroup = {
      id: generateNextGroupId(),
      title: newGroupName,
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
