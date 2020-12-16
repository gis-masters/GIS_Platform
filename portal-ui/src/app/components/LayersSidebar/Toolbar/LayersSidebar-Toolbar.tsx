import React, { Component, createRef } from 'react';
import { action, observable } from 'mobx';
import { observer } from 'mobx-react';
import { IconButton, Tooltip } from '@material-ui/core';
import { CancelOutlined, CreateNewFolder, CreateNewFolderOutlined, SaveOutlined } from '@material-ui/icons';
import { boundMethod } from 'autobind-decorator';
import { cn } from '@bem-react/classname';
import { cloneDeep } from 'lodash';

import { currentUser } from '../../../stores/CurrentUser.store';
import { currentProject } from '../../../stores/CurrentProject.store';
import { generateNextGroupId } from '../../../services/geoserver/layers.service';
import { NewCrgLayersGroup } from '../../../services/crg/projects.models';
import { usersService } from '../../../services/crg/users.service';
import { LayersGroupEditDialog } from '../../LayersGroupEditDialog/LayersGroupEditDialog';
import { LayersSettingsOutline } from '../../Icons/LayersSettingsOutline';
import { LayersSettings } from '../../Icons/LayersSettings';

import { LayersSidebarToolbarLeft } from '../ToolbarLeft/LayersSidebar-ToolbarLeft';
import { LayersSidebarToolbarRight } from '../ToolbarRight/LayersSidebar-ToolbarRight';

import '!style-loader!css-loader!sass-loader!./LayersSidebar-Toolbar.scss';

const cnLayersSidebarToolbar = cn('LayersSidebar', 'Toolbar');

interface LayersSidebarToolbarProps {
  editMode: boolean;
  onChangeMode: (editMode: boolean) => void;
  onSave: () => void;
}

@observer
export class LayersSidebarToolbar extends Component<LayersSidebarToolbarProps> {
  private ref = createRef<HTMLDivElement>();
  private intersectionObserver: IntersectionObserver;
  @observable private createGroupDialogOpen = false;
  @observable private stuck = false;
  @observable private projectContributionAllowed = false;

  constructor(props: LayersSidebarToolbarProps) {
    super(props);

    this.intersectionObserver = new IntersectionObserver(
      ([e]) => {
        this.setStuck(e.intersectionRatio < 1);
      },
      { threshold: [1] }
    );
  }

  async componentDidMount() {
    this.intersectionObserver.observe(this.ref.current);
    // this.setProjectContributionAllowness(await isLayersManagementAllowed(currentProject));
    await usersService.fetchCurrentUser();
    this.setProjectContributionAllowness(currentUser.isAdmin);
  }

  componentWillUnmount() {
    this.intersectionObserver.disconnect();
  }

  render() {
    const { editMode } = this.props;

    return (
      <>
        <div className={cnLayersSidebarToolbar({ stuck: this.stuck })} ref={this.ref}>
          <LayersSidebarToolbarLeft>
            {editMode && this.projectContributionAllowed && (
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
                  <IconButton onClick={this.cansel} color='secondary'>
                    <CancelOutlined />
                  </IconButton>
                </span>
              </Tooltip>
            )}
          </LayersSidebarToolbarLeft>
          <LayersSidebarToolbarRight>
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

  @action
  private setStuck(stuck: boolean) {
    this.stuck = stuck;
  }

  @action
  private setProjectContributionAllowness(allowed: boolean) {
    this.projectContributionAllowed = allowed;
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
  private cansel() {
    if (currentProject.queriesQueueLength) {
      currentProject.groups = cloneDeep(currentProject.primalGroups);
      currentProject.layers = cloneDeep(currentProject.primalLayers);
    }
    this.props.onChangeMode(false);
  }
}
