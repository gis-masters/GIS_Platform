import React, { Component } from 'react';
import { action, observable, makeObservable, computed } from 'mobx';
import { observer } from 'mobx-react';
import { Skeleton, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, Tooltip } from '@mui/material';
import { AddCircle, AddCircleOutlineOutlined } from '@mui/icons-material';
import { boundMethod } from 'autobind-decorator';
import { IClassNameProps } from '@bem-react/core';
import { RegistryConsumer } from '@bem-react/di';
import { cn } from '@bem-react/classname';
import { pluralize } from 'numeralize-ru';

import { CommonDiRegistry } from '../../services/di-registry';
import { Role } from '../../services/data/permissions.models';
import { CrgProject } from '../../services/gis/projects.models';
import { FileConnection } from '../../services/data/files.service';
import { ExplorerItemData, ExplorerItemType } from '../Explorer/Explorer.models';
import { ConnectionsToProjects } from '../ConnectionsToProjects/ConnectionsToProjects';
import { PseudoLink } from '../PseudoLink/PseudoLink';
import { PropertyType, Schema } from '../../services/data/schema.models';
import { DialogActionsLeft } from '../DialogActionsLeft/DialogActionsLeft';
import { DialogActionsRight } from '../DialogActionsRight/DialogActionsRight';
import { getViewChoiceOptions } from '../Form/Form.utils';
import { Button } from '../Button/Button';
import { Form } from '../Form/Form';

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
  onConnect: (project: CrgProject, view: string) => void;
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
          {!loading ? (
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
              <Dialog open={this.selectProjectDialogOpen} onClose={this.closeSelectProjectDialog}>
                <DialogTitle>Выбор проекта</DialogTitle>
                <DialogContent>
                  <RegistryConsumer id='common'>
                    {({ Explorer }: CommonDiRegistry) => (
                      <Explorer
                        className={cnConnectionsToProjectsWidget('Explorer')}
                        id='ConnectionsToProjectsWidget'
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
                    <DialogActionsLeft>
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
                    </DialogActionsLeft>
                  )}
                  <DialogActionsRight>
                    <Button color='primary' disabled={!this.selectedProject} onClick={this.submitProjectSelection}>
                      Подключить
                    </Button>
                    <Button onClick={this.closeSelectProjectDialog}>Отмена</Button>
                  </DialogActionsRight>
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
    this.view = '';
  }

  @action
  private setSelectedProject(project: CrgProject | null) {
    this.selectedProject = project;
  }

  @action.bound
  private handleChange(value: ViewFormValue) {
    this.view = value.view;
  }

  @boundMethod
  private handleSelect({ type, payload }: ExplorerItemData<CrgProject>) {
    if (type === ExplorerItemType.PROJECT && !this.selectedItem(payload)) {
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
    onConnect(this.selectedProject, this.view);
    this.setSelectedProject(null);
    this.closeSelectProjectDialog();
  }

  // eslint-disable-next-line @typescript-eslint/require-await
  @boundMethod
  private async testForDisabled({ payload }: ExplorerItemData<CrgProject>): Promise<boolean> {
    return payload.role !== Role.OWNER || this.selectedItem(payload);
  }

  private selectedItem(payload: CrgProject): boolean {
    const { connections } = this.props;
    let selectedItem: boolean;

    if (connections) {
      selectedItem = connections.some(connection => connection.project.id === payload.id);
    }

    return selectedItem;
  }

  @computed
  private get options() {
    return getViewChoiceOptions(this.props.schema?.views);
  }
}
