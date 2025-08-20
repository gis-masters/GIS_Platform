import React, { Component } from 'react';
import { action, makeObservable, observable } from 'mobx';
import { observer } from 'mobx-react';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  Tooltip
} from '@mui/material';
import { cn } from '@bem-react/classname';
import { boundMethod } from 'autobind-decorator';
import { AxiosError } from 'axios';
import { pluralize } from 'numeralize-ru';

import { Dataset, VectorTable } from '../../../services/data/vectorData/vectorData.models';
import { getAllVectorTablesInDataset } from '../../../services/data/vectorData/vectorData.service';
import { NewCrgLayer } from '../../../services/gis/layers/layers.models';
import { alertLayerOperationError, createLayer } from '../../../services/gis/layers/layers.service';
import { vectorLayerDefaults } from '../../../services/gis/layers/layers.utils';
import { CrgProject } from '../../../services/gis/projects/projects.models';
import { projectsService } from '../../../services/gis/projects/projects.service';
import { ActionsRight } from '../../ActionsRight/ActionsRight';
import { Button } from '../../Button/Button';
import { LayerAdd } from '../../Icons/LayerAdd';
import { LayerAddOutlined } from '../../Icons/LayerAddOutlined';
import { Loading } from '../../Loading/Loading';
import { SelectProjectsDialog } from '../../SelectProjectDialog/SelectProjectDialog';
import { Toast } from '../../Toast/Toast';

const cnDatasetActionsAddToProject = cn('DatasetActions', 'AddToProject');

interface DatasetActionsAddToProjectProps {
  dataset: Dataset;
}

@observer
export class DatasetActionsAddToProject extends Component<DatasetActionsAddToProjectProps> {
  @observable private vectorTablesLayers?: NewCrgLayer[];
  @observable private projectsListDialogOpen = false;
  @observable private dialogOpen = false;
  @observable private addedLayers = 0;
  @observable private projectId?: number;
  @observable private busy = false;

  constructor(props: DatasetActionsAddToProjectProps) {
    super(props);
    makeObservable(this);
  }

  async componentDidMount() {
    await projectsService.initAllProjectsStore();
  }

  render() {
    return (
      <>
        <Tooltip title='Добавить в проект'>
          <span>
            <IconButton className={cnDatasetActionsAddToProject()} onClick={this.openProjectsListDialog}>
              {this.projectsListDialogOpen ? <LayerAdd /> : <LayerAddOutlined />}
            </IconButton>
          </span>
        </Tooltip>

        <SelectProjectsDialog
          open={this.projectsListDialogOpen}
          onClose={this.closeProjectsListDialog}
          onSelect={this.onProjectSelected}
          actionButtonLabel='Добавить в выбранный проект'
        />

        <Dialog open={this.dialogOpen} onClose={this.closeDialog}>
          <DialogTitle>Добавление слоев завершено</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Добавлено {this.addedLayers} {pluralize(this.addedLayers, 'слой', 'слоя', 'слоев')}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <ActionsRight>
              <Button href={`/projects/${this.projectId}/map`} color='primary'>
                Перейти к проекту
              </Button>
              <Button onClick={this.closeDialog}>Закрыть</Button>
            </ActionsRight>
          </DialogActions>
        </Dialog>

        <Loading
          visible={this.busy}
          global
          value={this.vectorTablesLayers?.length && (this.addedLayers / this.vectorTablesLayers.length) * 100}
        />
      </>
    );
  }

  @boundMethod
  private async onProjectSelected([project]: CrgProject[]) {
    this.setAddedLayers(0);
    this.setProjectId(project.id);
    this.setBusy(true);
    const { dataset } = this.props;
    const group = await projectsService.createGroup(
      {
        enabled: true,
        expanded: true,
        position: -1,
        title: dataset.title,
        transparency: 100
      },
      project.id
    );

    let vectorTables: VectorTable[] = [];
    try {
      vectorTables = await getAllVectorTablesInDataset(dataset);
    } catch {
      Toast.error({
        message: `Ошибка получения таблиц в наборе "${dataset.title}" (${dataset.identifier})`
      });
    }

    const vectorDefaults = vectorLayerDefaults();

    const vectorTablesLayers = vectorTables.map((table, index) => ({
      ...vectorDefaults,
      parentId: group.id,
      enabled: false,
      dataset: dataset?.identifier,
      tableName: table?.identifier,
      title: table.title,
      position: index,
      nativeCRS: table.crs,
      schemaId: table.schema.name,
      styleName: table.schema.styleName || table.schema.name
    }));

    this.setVectorTablesLayers(vectorTablesLayers);

    for (const layer of vectorTablesLayers) {
      try {
        await createLayer(layer, project.id);
        this.setAddedLayers(this.addedLayers + 1);
      } catch (error) {
        const err = error as AxiosError<{ errors: Record<string, unknown>[]; message?: string }>;
        if (err?.response?.status === 409) {
          Toast.warn({ message: `Слой ${layer.title} уже существует в проекте` });
        } else {
          alertLayerOperationError(err, layer, 'создать слой', layer.title);
        }
      }
    }

    this.openDialog();
    this.closeProjectsListDialog();
    this.setBusy(false);
  }

  @action.bound
  private openProjectsListDialog() {
    this.projectsListDialogOpen = true;
  }

  @action.bound
  private closeProjectsListDialog() {
    this.projectsListDialogOpen = false;
  }

  @action.bound
  private openDialog() {
    this.dialogOpen = true;
  }

  @action.bound
  private closeDialog() {
    this.dialogOpen = false;
  }

  @action
  private setBusy(isBusy: boolean) {
    this.busy = isBusy;
  }

  @action
  private setAddedLayers(addedLayers: number) {
    this.addedLayers = addedLayers;
  }

  @action
  private setProjectId(projectId: number) {
    this.projectId = projectId;
  }

  @action
  private setVectorTablesLayers(vectorTablesLayers: NewCrgLayer[]) {
    this.vectorTablesLayers = vectorTablesLayers;
  }
}
