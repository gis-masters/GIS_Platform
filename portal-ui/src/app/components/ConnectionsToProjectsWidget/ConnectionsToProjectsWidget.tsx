import React, { Component } from 'react';
import { action, observable } from 'mobx';
import { observer } from 'mobx-react';
import { Skeleton, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, Tooltip } from '@mui/material';
import { AddCircle, AddCircleOutlineOutlined } from '@mui/icons-material';
import { IClassNameProps } from '@bem-react/core';
import { boundMethod } from 'autobind-decorator';
import { pluralize } from 'numeralize-ru';
import { cn } from '@bem-react/classname';

import { Role } from '../../services/crg/permissions.models';
import { CrgProject } from '../../services/crg/projects.models';
import { ExplorerItemData, ExplorerItemType } from '../Explorer/Explorer.models';
import { PseudoLink } from '../PseudoLink/PseudoLink';
import { ExplorerProps } from '../Explorer/Explorer';
import { Button } from '../Button/Button';

import { TableManagementWidgetItem } from './Item/ConnectionsToProjectsWidget-Item';

import '!style-loader!css-loader!sass-loader!./ConnectionsToProjectsWidget.scss';
import '!style-loader!css-loader!sass-loader!./Dialog/ConnectionsToProjectsWidget-Dialog.scss';
import '!style-loader!css-loader!sass-loader!./Explorer/ConnectionsToProjectsWidget-Explorer.scss';

const cnConnectionsToProjectsWidget = cn('ConnectionsToProjectsWidget');

interface ConnectionsToProjectsWidgetProps extends IClassNameProps {
  Explorer: React.ComponentType<ExplorerProps>;
  connectedProjects: CrgProject[];
  loading: boolean;
  onConnect: (project: CrgProject) => void;
}

@observer
export class ConnectionsToProjectsWidget extends Component<ConnectionsToProjectsWidgetProps> {
  @observable private currentProjectsDialogOpen = false;
  @observable private selectProjectDialogOpen = false;
  @observable private selectedProject?: CrgProject;

  render() {
    const { Explorer, connectedProjects, loading } = this.props;
    const count = connectedProjects?.length || 0;
    const textProjects = `${count} ${pluralize(count, 'проект', 'проекта', 'проектов')}`;

    return (
      <>
        <div className={cnConnectionsToProjectsWidget()}>
          {!loading ? (
            <>
              Подключено в{' '}
              {count ? <PseudoLink onClick={this.openCurrentProjectsDialog}>{textProjects}</PseudoLink> : textProjects}{' '}
              <Tooltip title='Подключить в проект'>
                <IconButton color='primary' size='small' onClick={this.openSelectProjectDialog}>
                  {this.selectProjectDialogOpen ? <AddCircle /> : <AddCircleOutlineOutlined />}
                </IconButton>
              </Tooltip>
              <Dialog
                open={this.currentProjectsDialogOpen}
                onClose={this.closeCurrentProjectsDialog}
                PaperProps={{ className: cnConnectionsToProjectsWidget('Dialog') }}
              >
                <DialogTitle>Проекты</DialogTitle>
                <DialogContent>
                  {connectedProjects?.map(project => (
                    <TableManagementWidgetItem project={project} key={project.id} />
                  ))}
                </DialogContent>
                <DialogActions>
                  <Button onClick={this.closeCurrentProjectsDialog}>Закрыть</Button>
                </DialogActions>
              </Dialog>
              <Dialog open={this.selectProjectDialogOpen} onClose={this.closeSelectProjectDialog}>
                <DialogTitle>Выбор проекта</DialogTitle>
                <DialogContent>
                  <Explorer
                    className={cnConnectionsToProjectsWidget('Explorer')}
                    appRole='ConnectionsToProjectsWidget'
                    preset={ExplorerItemType.PROJECTS_ROOT}
                    onSelect={this.handleSelect}
                    onOpen={this.handleOpen}
                    withoutTitle
                    disabledTester={this.testForDisabled}
                  />
                </DialogContent>
                <DialogActions>
                  <Button color='primary' disabled={!this.selectedProject} onClick={this.submitProjectSelection}>
                    Подключить
                  </Button>
                  <Button onClick={this.closeSelectProjectDialog}>Отмена</Button>
                </DialogActions>
              </Dialog>
            </>
          ) : (
            <Skeleton height={24} animation='wave' width='190px' />
          )}
        </div>
      </>
    );
  }

  @action.bound
  private openCurrentProjectsDialog() {
    this.currentProjectsDialogOpen = true;
  }

  @action.bound
  private closeCurrentProjectsDialog() {
    this.currentProjectsDialogOpen = false;
  }

  @action.bound
  private openSelectProjectDialog() {
    this.selectProjectDialogOpen = true;
  }

  @action.bound
  private closeSelectProjectDialog() {
    this.selectProjectDialogOpen = false;
  }

  @action
  private setSelectedProject(project: CrgProject | null) {
    this.selectedProject = project;
  }

  @boundMethod
  private handleSelect({ type, payload }: ExplorerItemData<CrgProject>) {
    const { connectedProjects } = this.props;

    if (type === ExplorerItemType.PROJECT && !connectedProjects.some(project => project.id === payload.id)) {
      this.setSelectedProject(payload);
    } else {
      this.setSelectedProject(null);
    }
  }

  @boundMethod
  private handleOpen(item: ExplorerItemData<CrgProject>) {
    if (item.type === ExplorerItemType.PROJECT) {
      this.handleSelect(item);
      this.submitProjectSelection();
    }
  }

  @boundMethod
  private submitProjectSelection() {
    const { onConnect } = this.props;
    this.closeSelectProjectDialog();
    onConnect(this.selectedProject);
    this.setSelectedProject(null);
  }

  @boundMethod
  private testForDisabled({ payload }: ExplorerItemData<CrgProject>): boolean {
    return payload.role !== Role.OWNER || this.props.connectedProjects.some(project => project.id === payload.id);
  }
}
