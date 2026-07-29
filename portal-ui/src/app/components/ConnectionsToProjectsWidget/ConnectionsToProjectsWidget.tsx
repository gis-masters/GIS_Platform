import React, { Component } from 'react';
import { action, computed, makeObservable, observable } from 'mobx';
import { observer } from 'mobx-react';
import { Dialog, DialogActions, DialogContent, DialogTitle, Skeleton, Tooltip } from '@mui/material';
import { AddCircle, AddCircleOutlineOutlined } from '@mui/icons-material';
import { cn } from '@bem-react/classname';
import { type IClassNameProps } from '@bem-react/core';
import { boundMethod } from 'autobind-decorator';
import { pluralize } from 'numeralize-ru';

import { type FileConnection } from '../../services/data/files/files.models';
import { type PropertyOption, PropertyType, type Schema } from '../../services/data/schema/schema.models';
import { type CrgProject } from '../../services/gis/projects/projects.models';
import { Role } from '../../services/permissions/permissions.models';
import { isLayersManagementAllowed } from '../../services/permissions/permissions.service';
import { getViewChoiceOptions } from '../AddLayerDialog/AddLayerDialog.utils';
import { Button } from '../Button/Button';
import { ConnectionsToProjects } from '../ConnectionsToProjects/ConnectionsToProjects';
import { type ExplorerItemData, ExplorerItemType } from '../Explorer/Explorer.models';
import { Form } from '../Form/Form';
import { IconButton } from '../IconButton/IconButton';
import { PseudoLink } from '../PseudoLink/PseudoLink';
import { SelectProjectDialog } from '../SelectProjectDialog/SelectProjectDialog';

import './ConnectionsToProjectsWidget.scss';
import './Dialog/ConnectionsToProjectsWidget-Dialog.scss';
import './Explorer/ConnectionsToProjectsWidget-Explorer.scss';
import './ViewSelector/ConnectionsToProjectsWidget-ViewSelector.scss';

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
                slotProps={{ paper: { className: cnConnectionsToProjectsWidget('Dialog') } }}
              >
                <DialogTitle>{dialogTitle}</DialogTitle>
                <DialogContent className='scroll'>
                  <ConnectionsToProjects type={showAsExtendList ? 'list' : 'text'} connections={connections} />
                </DialogContent>
                <DialogActions>
                  <Button onClick={this.closeCurrentProjectsDialog}>Закрыть</Button>
                </DialogActions>
              </Dialog>
              <SelectProjectDialog
                className={cnConnectionsToProjectsWidget('SelectProjectDialog')}
                open={this.selectProjectDialogOpen}
                onClose={this.closeSelectProjectDialog}
                onSubmit={this.handleProjectSelectionSubmit}
                additionalActions={
                  this.options.length > 1 && (
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
                  )
                }
                actionButtonProps={{ children: 'Выбрать' }}
                disabledTester={this.testForDisabled}
              />
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

  @action.bound
  private handleChange(value: ViewFormValue) {
    this.view = value.view;
  }

  @boundMethod
  private handleProjectSelectionSubmit(project?: CrgProject) {
    if (!project || this.isAlreadyConnected(project) || !isLayersManagementAllowed(project)) {
      return;
    }

    this.props.onConnect(project, this.view);
  }

  @boundMethod
  private testForDisabled(item: ExplorerItemData): boolean {
    if (item.type === ExplorerItemType.PROJECT_FOLDER) {
      return false;
    }

    if (item.type === ExplorerItemType.PROJECT) {
      return item.payload.role !== Role.OWNER || this.isAlreadyConnected(item.payload);
    }

    return false;
  }

  private isAlreadyConnected(payload: CrgProject): boolean {
    return this.props.connections?.some(connection => connection.project.id === payload.id) || false;
  }

  @computed
  private get options(): PropertyOption[] {
    return this.props.schema ? getViewChoiceOptions(this.props.schema) : [];
  }
}
