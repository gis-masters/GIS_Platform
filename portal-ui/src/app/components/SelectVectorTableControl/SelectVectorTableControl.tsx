import React, { Component } from 'react';
import { action, computed, makeObservable, observable } from 'mobx';
import { observer } from 'mobx-react';
import { ButtonBase, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import { cn } from '@bem-react/classname';
import { boundMethod } from 'autobind-decorator';

import { PropertyType } from '../../services/data/schema/schema.models';
import { Dataset, VectorTable } from '../../services/data/vectorData/vectorData.models';
import { getVectorTable } from '../../services/data/vectorData/vectorData.service';
import { CrgLayerType } from '../../services/gis/layers/layers.models';
import { isFeaturesUpdateAllowed } from '../../services/permissions/permissions.service';
import { currentProject } from '../../stores/CurrentProject.store';
import { Breadcrumbs, BreadcrumbsItemData } from '../Breadcrumbs/Breadcrumbs';
import { Button } from '../Button/Button';
import { Explorer } from '../Explorer/Explorer';
import { ExplorerItemData, ExplorerItemType, isCustomFilters } from '../Explorer/Explorer.models';
import { FormControlProps } from '../Form/Control/Form-Control';

import '!style-loader!css-loader!sass-loader!./SelectVectorTableControl.scss';

const cnSelectVectorTable = cn('SelectVectorTableControl');

export interface SelectedVectorTable extends Datasource {
  path?: ExplorerItemData[];
}

interface Datasource {
  dataset: Dataset;
  vectorTable: VectorTable;
}

@observer
export class SelectVectorTableControl extends Component<FormControlProps> {
  @observable private dialogOpen = false;
  @observable private usedVectorTables: VectorTable[] = [];
  @observable private selectedVectorTable?: VectorTable;

  private usedVectorTablesRequest?: Promise<VectorTable[]>;
  private selectedDataset?: Dataset;
  private path?: ExplorerItemData[];

  constructor(props: FormControlProps) {
    super(props);
    makeObservable(this);
  }

  async componentDidMount() {
    await this.checkUsedTables();
  }

  async componentDidUpdate() {
    await this.checkUsedTables();
  }

  render() {
    const { property, className, htmlId, fieldValue = {} } = this.props;
    const { vectorTable } = fieldValue as Datasource;

    if (property.propertyType !== PropertyType.CUSTOM) {
      throw new Error('Невозможный тип свойства');
    }

    const { startPath, customFilters } = property;
    const hasStartPath = Array.isArray(startPath);

    return (
      <>
        <ButtonBase
          focusRipple
          className={cnSelectVectorTable({ empty: !vectorTable }, [className])}
          id={htmlId}
          onClick={this.openDialog}
        >
          {vectorTable ? <Breadcrumbs items={this.breadcrumbsItems} itemsType='none' /> : 'Не выбрано'}
        </ButtonBase>
        <Dialog
          className={cnSelectVectorTable('Dialog')}
          open={this.dialogOpen}
          onClose={this.closeDialog}
          maxWidth='md'
        >
          <DialogTitle>Выберите источник данных</DialogTitle>
          <DialogContent>
            <Explorer
              explorerRole='SelectVectorTable'
              className={cnSelectVectorTable('Explorer')}
              preset={hasStartPath ? undefined : ExplorerItemType.DATASET_ROOT}
              path={hasStartPath ? startPath : undefined}
              onSelect={this.handleSelect}
              onOpen={this.handleOpen}
              disabledTester={this.testForDisabled}
              customFilters={isCustomFilters(customFilters) ? customFilters : undefined}
              adaptersOverride={{
                [ExplorerItemType.TABLE]: {
                  customOpenAction: () => {
                    this.submitDialog();
                  },
                  isFolder: () => false
                }
              }}
            />
          </DialogContent>
          <DialogActions>
            <Button color='primary' disabled={!this.selectedVectorTable} onClick={this.submitDialog}>
              Выбрать
            </Button>
            <Button onClick={this.closeDialog}>Отмена</Button>
          </DialogActions>
        </Dialog>
      </>
    );
  }

  @computed
  private get breadcrumbsItems(): BreadcrumbsItemData[] {
    const { fieldValue = {} } = this.props;
    const { dataset, vectorTable } = fieldValue as Datasource;

    return [
      { title: dataset.title, subtitle: dataset.identifier },
      { title: vectorTable.title, subtitle: vectorTable.identifier }
    ];
  }

  @boundMethod
  private handleSelect(item: ExplorerItemData, path: ExplorerItemData[]) {
    if (item.type === ExplorerItemType.TABLE && !this.testForDisabled(item)) {
      this.select(path[1].payload as Dataset, item.payload, path);
    } else {
      this.select();
    }
  }

  @action
  private select(dataset?: Dataset, table?: VectorTable, path?: ExplorerItemData[]) {
    this.selectedDataset = dataset;
    this.selectedVectorTable = table;
    if (path) {
      this.path = path;
    }
  }

  @boundMethod
  private handleOpen(item: ExplorerItemData, path: ExplorerItemData[]) {
    if (item.type === ExplorerItemType.TABLE) {
      this.handleSelect(item, path);
      this.submitDialog();
    }
  }

  @action.bound
  private openDialog() {
    this.dialogOpen = true;
  }

  @action.bound
  private closeDialog() {
    this.dialogOpen = false;
  }

  @action.bound
  private submitDialog() {
    const { property, onChange } = this.props;

    this.closeDialog();

    if (onChange) {
      onChange({
        value: { dataset: this.selectedDataset, vectorTable: this.selectedVectorTable, path: this.path },
        propertyName: property.name
      });
    }

    this.selectedDataset = undefined;
    this.selectedVectorTable = undefined;
  }

  @boundMethod
  private testForDisabled(item: ExplorerItemData): boolean {
    if (item.type === ExplorerItemType.TABLE) {
      const table = item.payload;

      const property = this.props.property;
      if (property.propertyType !== PropertyType.CUSTOM) {
        throw new Error('Невозможный тип свойства');
      }

      if (property.writableTablesOnly) {
        return !isFeaturesUpdateAllowed(table.dataset, table.identifier);
      }

      return Boolean(this.usedVectorTables?.some(({ id, dataset }) => id === table.id && dataset === table.dataset));
    }

    return false;
  }

  private async checkUsedTables(): Promise<void> {
    if (this.usedVectorTablesRequest) {
      await this.usedVectorTablesRequest;
      delete this.usedVectorTablesRequest;
      await this.checkUsedTables();

      return;
    }

    const alreadyUsedVectorTables = this.usedVectorTables.filter(table =>
      currentProject.layers.some(
        layer =>
          layer.type === CrgLayerType.VECTOR && table.dataset === layer.dataset && table.identifier === layer.tableName
      )
    );

    this.usedVectorTablesRequest = Promise.all(
      currentProject.vectorLayers
        .filter(
          layer =>
            !this.usedVectorTables.some(
              table => table.dataset === layer.dataset && table.identifier === layer.tableName
            )
        )
        .map(async layer => {
          const table = await getVectorTable(layer.dataset, layer.tableName);

          // с бэка тут временами приходит всякая хрень
          if (!table.dataset) {
            table.dataset = layer.dataset;
          }
          if (!table.identifier) {
            table.identifier = layer.tableName;
          }

          return table;
        })
    );

    const newUsedVectorTables = await this.usedVectorTablesRequest;
    delete this.usedVectorTablesRequest;

    if (alreadyUsedVectorTables.length !== this.usedVectorTables.length || newUsedVectorTables.length > 0) {
      this.setUsedVectorTables([...alreadyUsedVectorTables, ...newUsedVectorTables]);
    }
  }

  @action
  private setUsedVectorTables(vectorTables: VectorTable[]) {
    this.usedVectorTables = vectorTables;
  }
}
