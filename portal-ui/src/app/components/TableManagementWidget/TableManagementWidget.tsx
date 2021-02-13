import React, { Component } from 'react';
import { action, observable } from 'mobx';
import { observer } from 'mobx-react';
import { Skeleton } from '@material-ui/lab';
import { Dialog, DialogActions, DialogContent, DialogTitle, IconButton, Tooltip } from '@material-ui/core';
import { AddCircle, AddCircleOutlineOutlined } from '@material-ui/icons';
import { boundMethod } from 'autobind-decorator';
import { pluralize } from 'numeralize-ru';
import { cn } from '@bem-react/classname';

import { currentUser } from '../../stores/CurrentUser.store';
import { DataSet, DataTable, DataTableConnection, getDataTableConnections } from '../../services/data.service';
import { CrgLayerType, CrgProject } from '../../services/crg/projects.models';
import { createLayer } from '../../services/geoserver/layers.service';
import { PseudoLink } from '../PseudoLink/PseudoLink';
import { Button } from '../Button/Button';

import { TableManagementWidgetProjectItem } from './ProjectItem/TableManagementWidget-ProjectItem';
import { ExplorerItemData, ExplorerItemType } from '../Explorer/Explorer.models';
import { ExplorerProps } from '../Explorer/Explorer';

import '!style-loader!css-loader!sass-loader!./TableManagementWidget.scss';
import '!style-loader!css-loader!sass-loader!./CurrentProjectsDialog/TableManagementWidget-CurrentProjectsDialog.scss';

const cnTableManagementWidget = cn('TableManagementWidget');

interface TableManagementWidgetProps {
  dataTable: DataTable;
  dataSet: DataSet;
  Explorer: React.ComponentType<ExplorerProps>;
}

@observer
export class TableManagementWidget extends Component<TableManagementWidgetProps> {
  currentDataTableId = '';
  @observable private connections?: DataTableConnection[];
  @observable private currentProjectsDialogOpen = false;
  @observable private selectProjectDialogOpen = false;
  @observable private selectedProject?: CrgProject;

  async componentDidMount() {
    await this.fetchConnections();
  }

  componentDidUpdate(prevProps: TableManagementWidgetProps) {
    if (this.props.dataTable.identifier !== prevProps.dataTable.identifier) {
      this.dropConnections();
      this.fetchConnections();
    }
  }

  render() {
    const { Explorer } = this.props;
    const count = this.connections?.length || 0;
    const textProjects = `${count} ${pluralize(count, 'проект', 'проекта', 'проектов')}`;

    return (
      <>
        <div className={cnTableManagementWidget()}>
          {this.connections ? (
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
                PaperProps={{ className: cnTableManagementWidget('CurrentProjectsDialog') }}
              >
                <DialogTitle>Проекты</DialogTitle>
                <DialogContent>
                  {this.connections.map(({ project }) => (
                    <TableManagementWidgetProjectItem project={project} key={project.id} />
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
                    preset={ExplorerItemType.PROJECTS_ROOT}
                    onSelect={this.handleSelect}
                    onOpen={this.handleOpen}
                    disabledItems={this.connections.map(({ project }) => ({
                      type: ExplorerItemType.PROJECT,
                      payload: project
                    }))}
                    withoutTitle
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

  private async fetchConnections() {
    const { dataTable } = this.props;
    this.currentDataTableId = dataTable.identifier;
    const connections = await getDataTableConnections(dataTable.identifier);
    if (this.currentDataTableId === dataTable.identifier) {
      this.setConnections(connections);
    }
  }

  @action
  private setConnections(connections: DataTableConnection[]) {
    this.connections = connections;
  }

  @action
  private dropConnections() {
    this.connections = null;
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
    if (type === ExplorerItemType.PROJECT && !this.connections.some(({ project }) => project.id === payload.id)) {
      this.setSelectedProject(payload);
    } else {
      this.setSelectedProject(null);
    }
  }
  @boundMethod
  handleOpen(item: ExplorerItemData<CrgProject>) {
    if (item.type === ExplorerItemType.PROJECT) {
      this.handleSelect(item);
      this.submitProjectSelection();
    }
  }

  @boundMethod
  private async submitProjectSelection() {
    const { dataTable, dataSet } = this.props;
    this.closeSelectProjectDialog();
    await this.createLayer(dataTable, dataSet, this.selectedProject);
    this.setSelectedProject(null);
    await this.fetchConnections();
  }

  async createLayer(table: DataTable, dataSet: DataSet, project: CrgProject) {
    const dataStoreName = `scratch_database_${currentUser.orgId}`;
    const newLayer = {
      dataStoreName,
      dataset: dataSet.identifier,
      tableName: table.identifier,
      complexName: `${dataStoreName}:${table.identifier}`,
      title: table.title,
      enabled: true,
      nativeCRS: table.crs,
      schemaId: table.schemaId,
      position: -42,
      transparency: 70,
      styleName: table.schemaId,
      type: CrgLayerType.VECTOR
    };

    await createLayer(newLayer, project);
  }
}
