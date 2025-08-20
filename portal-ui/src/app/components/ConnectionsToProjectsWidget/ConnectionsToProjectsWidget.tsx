import React, { Component } from 'react';
import { action, computed, makeObservable, observable } from 'mobx';
import { observer } from 'mobx-react';
import { Dialog, DialogActions, DialogContent, DialogTitle, IconButton, Skeleton, Tooltip } from '@mui/material';
import { AddCircle, AddCircleOutlineOutlined } from '@mui/icons-material';
import { cn } from '@bem-react/classname';
import { IClassNameProps } from '@bem-react/core';
import { RegistryConsumer } from '@bem-react/di';
import { boundMethod } from 'autobind-decorator';
import { pluralize } from 'numeralize-ru';

import { FileConnection } from '../../services/data/files/files.models';
import { PropertyOption, PropertyType, Schema } from '../../services/data/schema/schema.models';
import { CommonDiRegistry } from '../../services/di-registry';
import { getViewChoiceOptions } from '../../services/gis/layers/layers.service';
import { CrgProject } from '../../services/gis/projects/projects.models';
import { Role } from '../../services/permissions/permissions.models';
import { isLayersManagementAllowed } from '../../services/permissions/permissions.service';
import { ActionsLeft } from '../ActionsLeft/ActionsLeft';
import { ActionsRight } from '../ActionsRight/ActionsRight';
import { Button } from '../Button/Button';
import { ConnectionsToProjects } from '../ConnectionsToProjects/ConnectionsToProjects';
import { ExplorerItemData, ExplorerItemType } from '../Explorer/Explorer.models';
import { Form } from '../Form/Form';
import { PseudoLink } from '../PseudoLink/PseudoLink';

import '!style-loader!css-loader!sass-loader!./ConnectionsToProjectsWidget.scss';
import '!style-loader!css-loader!sass-loader!./Dialog/ConnectionsToProjectsWidget-Dialog.scss';
import '!style-loader!css-loader!sass-loader!./Explorer/ConnectionsToProjectsWidget-Explorer.scss';
import '!style-loader!css-loader!sass-loader!./ViewSelector/ConnectionsToProjectsWidget-ViewSelector.scss';

const cnConnectionsToProjectsWidget = cn('ConnectionsToProjectsWidget');

interface ConnectionsToProjectsWidgetProps extends IClassNameProps {
  connections?: FileConnection[];
  loading: boolean;
  dialogTitle: string;
  schema?: Schema;
  showAsExtendList?: boolean;
  onConnect(project: CrgProject, view: string): void;
}

interface ViewFormValue extends Record<string, unknown> {
  view: string;
}

@observer
export class ConnectionsToProjectsWidget extends Component<ConnectionsToProjectsWidgetProps> {
  @observable private currentProjectsDialogOpen = false;
  @observable private selectProjectDialogOpen = false;
  @observable private selectedProject?: CrgProject;
  @observable private view = '';

  constructor(props: ConnectionsToProjectsWidgetProps) {
    super(props);
    makeObservable(this);
  }

  render() {
    const { connections, loading, dialogTitle, showAsExtendList } = this.props;
    const count = connections?.length || 0;
    const textProjects = `${count} ${pluralize(count, 'проект', 'проекта', 'проектов')}`;

    return (
      <>
        <div className={cnConnectionsToProjectsWidget()}>
          {loading ? (
            <Skeleton height={24} animation='wave' width='190px' />
          ) : (
            <>
              Подключено в{' '}
              {count ? <PseudoLink onClick={this.openCurrentProjectsDialog}>{textProjects}</PseudoLink> : textProjects}
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
                <DialogTitle>{dialogTitle}</DialogTitle>
                <DialogContent className='scroll'>
                  <ConnectionsToProjects type={showAsExtendList ? 'list' : 'text'} connections={connections} />
                </DialogContent>
                <DialogActions>
                  <Button onClick={this.closeCurrentProjectsDialog}>Закрыть</Button>
                </DialogActions>
              </Dialog>
              <Dialog
                open={this.selectProjectDialogOpen}
                className={cnConnectionsToProjectsWidget('Dialog')}
                onClose={this.closeSelectProjectDialog}
              >
                <DialogTitle>Выбор проекта</DialogTitle>
                <DialogContent>
                  <RegistryConsumer id='common'>
                    {({ Explorer }: CommonDiRegistry) => (
                      <Explorer
                        className={cnConnectionsToProjectsWidget('Explorer')}
                        explorerRole='ConnectionsToProjectsWidget'
                        preset={ExplorerItemType.PROJECTS_ROOT}
                        onSelect={this.handleSelect}
                        onOpen={this.handleOpen}
                        withoutTitle
                        disabledTester={this.testForDisabled}
                      />
                    )}
                  </RegistryConsumer>
                </DialogContent>
                <DialogActions>
                  {this.options.length > 1 && (
                    <ActionsLeft>
                      <Form<ViewFormValue>
                        className={cnConnectionsToProjectsWidget('ViewSelector')}
                        schema={{
                          properties: [
                            {
                              name: 'view',
                              title: 'Представление',
                              options: this.options,
                              defaultValue: '',
                              propertyType: PropertyType.CHOICE
                            }
                          ]
                        }}
                        value={{ view: this.view }}
                        onFormChange={this.handleChange}
                      />
                    </ActionsLeft>
                  )}
                  <ActionsRight>
                    <Button color='primary' disabled={!this.selectedProject} onClick={this.submitProjectSelection}>
                      Подключить
                    </Button>
                    <Button onClick={this.closeSelectProjectDialog}>Отмена</Button>
                  </ActionsRight>
                </DialogActions>
              </Dialog>
            </>
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
    this.view = '';
  }

  @action
  private setSelectedProject(project: CrgProject | undefined) {
    this.selectedProject = project;
  }

  @action.bound
  private handleChange(value: ViewFormValue) {
    this.view = value.view;
  }

  @boundMethod
  private handleSelect(explorerItem: ExplorerItemData) {
    if (
      explorerItem.type === ExplorerItemType.PROJECT &&
      !this.isAlreadyConnected(explorerItem.payload) &&
      isLayersManagementAllowed(explorerItem.payload)
    ) {
      this.setSelectedProject(explorerItem.payload);
    } else {
      this.setSelectedProject(undefined);
    }
  }

  @boundMethod
  private handleOpen(item: ExplorerItemData) {
    if (item.type === ExplorerItemType.PROJECT) {
      this.handleSelect(item);
      this.submitProjectSelection();
    }
  }

  @boundMethod
  private submitProjectSelection() {
    if (!this.selectedProject) {
      return;
    }

    this.props.onConnect(this.selectedProject, this.view);

    this.setSelectedProject(undefined);
    this.closeSelectProjectDialog();
  }

  @boundMethod
  private testForDisabled(item: ExplorerItemData): boolean {
    return (
      item.type !== ExplorerItemType.PROJECT ||
      item.payload.role !== Role.OWNER ||
      this.isAlreadyConnected(item.payload)
    );
  }

  private isAlreadyConnected(payload: CrgProject): boolean {
    return this.props.connections?.some(connection => connection.project.id === payload.id) || false;
  }

  @computed
  private get options(): PropertyOption[] {
    return this.props.schema ? getViewChoiceOptions(this.props.schema) : [];
  }
}
