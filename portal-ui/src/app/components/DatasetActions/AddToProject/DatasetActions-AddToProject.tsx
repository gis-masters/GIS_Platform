import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { cn } from '@bem-react/classname';
import { pluralize } from 'numeralize-ru';
import { action, computed, observable } from 'mobx';
import { AxiosError } from 'axios';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  Tooltip
} from '@mui/material';
import { boundMethod } from 'autobind-decorator';

import { alertLayerOperationError, createLayer, createLayersGroup } from '../../../services/geoserver/layers.service';
import { Dataset, DataTable, getAllDatasetTables } from '../../../services/data.service';
import { ChooseXTableDialog } from '../../ChooseXTableDialog/ChooseXTableDialog';
import { DialogActionsRight } from '../../DialogActionsRight/DialogActionsRight';
import { CrgProject, NewCrgLayer } from '../../../services/crg/projects.models';
import { projectsService } from '../../../services/crg/projects.service';
import { vectorLayerDefaults } from '../../../services/NewLayerDefaults';
import { SortParams } from '../../../services/util/sortObjects';
import { allProjects } from '../../../stores/AllProjects.store';
import { LayerAddOutlined } from '../../Icons/LayerAddOutlined';
import { Role } from '../../../services/crg/permissions.models';
import { XTableColumn } from '../../XTable/XTable';
import { LayerAdd } from '../../Icons/LayerAdd';
import { Loading } from '../../Loading/Loading';
import { Button } from '../../Button/Button';
import { Toast } from '../../Toast/Toast';

const cnDatasetActionsAddToProject = cn('DatasetActions', 'AddToProject');

interface DatasetActionsAddToProjectProps {
  dataset: Dataset;
}

@observer
export class DatasetActionsAddToProject extends Component<DatasetActionsAddToProjectProps> {
  @observable private dataTablesLayers: NewCrgLayer[];
  @observable private projectsListDialogOpen = false;
  @observable private dialogOpen = false;
  @observable private addedLayers = 0;
  @observable private projectId: number;
  @observable private busy = false;

  private sortParams: SortParams<CrgProject> = { asc: true, field: 'name' };
  private cols: XTableColumn<CrgProject>[] = [
    {
      field: 'name',
      title: 'Название проекта',
      filterable: true,
      sortable: true
    }
  ];

  async componentDidMount() {
    await projectsService.initAllProjectsStore();
  }

  render() {
    return (
      <>
        <Tooltip title='Добавить в проект'>
          <IconButton className={cnDatasetActionsAddToProject()} onClick={this.openProjectsListDialog}>
            {this.projectsListDialogOpen ? <LayerAdd /> : <LayerAddOutlined />}
          </IconButton>
        </Tooltip>

        <ChooseXTableDialog<CrgProject>
          title='Выбор проекта'
          data={this.projects}
          cols={this.cols}
          defaultSort={this.sortParams}
          secondarySortField='createdAt'
          open={this.projectsListDialogOpen}
          onClose={this.closeProjectsListDialog}
          onSelect={this.onProjectSelected}
          getRowId={this.getItemId}
          single
          actionButtonProps={{
            children: 'Добавить в выбранный проект'
          }}
        />

        <Dialog open={this.dialogOpen} onClose={this.closeDialog}>
          <DialogTitle>Добавление слоев завершено</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Добавлено {this.addedLayers} {pluralize(this.addedLayers, 'слой', 'слоя', 'слоев')}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <DialogActionsRight>
              <Button href={`/projects/${this.projectId}/map`} color='primary'>
                Перейти к проекту
              </Button>
              <Button onClick={this.closeDialog}>Закрыть</Button>
            </DialogActionsRight>
          </DialogActions>
        </Dialog>

        <Loading visible={this.busy} global value={(this.addedLayers / this.dataTablesLayers?.length) * 100} />
      </>
    );
  }

  @computed
  private get projects(): CrgProject[] {
    return allProjects.list.filter(({ role }) => role === Role.OWNER);
  }

  @boundMethod
  private async onProjectSelected([project]: CrgProject[]) {
    this.setAddedLayers(0);
    this.setProjectId(project.id);
    this.setBusy(true);
    const { dataset } = this.props;
    const group = await createLayersGroup(
      {
        enabled: true,
        expanded: true,
        id: undefined,
        position: -1,
        title: dataset.title,
        transparency: 100
      },
      project.id
    );

    let dataTables: DataTable[];
    try {
      dataTables = await getAllDatasetTables(dataset);
    } catch {
      Toast.error({
        message: `Ошибка получения таблиц в наборе "${dataset.title}" (${dataset.identifier})`
      });
    }

    const vectorDefaults = vectorLayerDefaults();

    this.setDataTablesLayers(
      dataTables.map((table, index) => {
        return {
          ...vectorDefaults,
          parentId: group.id,
          enabled: false,
          dataset: dataset?.identifier,
          tableName: table?.identifier,
          title: table.title,
          position: index,
          nativeCRS: table.crs,
          schemaId: table.schemaId,
          styleName: table.schemaId
        };
      })
    );

    for (const layer of this.dataTablesLayers) {
      try {
        await createLayer(layer, project.id);
        this.setAddedLayers(this.addedLayers + 1);
      } catch (error) {
        const err = error as AxiosError<{ errors: Record<string, unknown>[]; message?: string }>;
        if (err.response.status === 409) {
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
  private setDataTablesLayers(dataTablesLayers: NewCrgLayer[]) {
    this.dataTablesLayers = dataTablesLayers;
  }

  private getItemId({ id }: CrgProject): string {
    return String(id);
  }
}
