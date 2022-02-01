import React, { Component } from 'react';
import { action, computed, observable } from 'mobx';
import { observer } from 'mobx-react';
import { cn } from '@bem-react/classname';
import { ButtonBase, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import { boundMethod } from 'autobind-decorator';

import { Dataset, DataTable } from '../../services/data.service';
import { ExplorerItemData, ExplorerItemType } from '../Explorer/Explorer.models';
import { BreadcrumbsItemData } from '../Breadcrumbs/Item/Breadcrumbs-Item';
import { FormControlProps } from '../Form/Control/Form-Control';
import { Breadcrumbs } from '../Breadcrumbs/Breadcrumbs';
import { Explorer } from '../Explorer/Explorer';
import { Button } from '../Button/Button';

import '!style-loader!css-loader!sass-loader!./SelectDataTable.scss';

const cnSelectDataTable = cn('SelectDataTable');

interface Datasource {
  dataset: Dataset;
  dataTable: DataTable;
}

interface SelectDataTableProps extends FormControlProps {
  usedDataTables: DataTable[];
}

@observer
export class SelectDataTable extends Component<SelectDataTableProps> {
  @observable private dialogOpen = false;
  @observable private selectedDataset?: Dataset;
  @observable private selectedDataTable?: DataTable;

  render() {
    const { className, htmlId, fieldValue = {} } = this.props;
    const { dataTable } = fieldValue as Datasource;

    return (
      <>
        <ButtonBase
          focusRipple
          className={cnSelectDataTable({ empty: !dataTable }, [className])}
          id={htmlId}
          onClick={this.openDialog}
        >
          {dataTable ? <Breadcrumbs items={this.breadcrumbsItems} itemsType='none' /> : 'Не выбрано'}
        </ButtonBase>
        <Dialog open={this.dialogOpen} onClose={this.closeDialog}>
          <DialogTitle>Выберите источник данных</DialogTitle>
          <DialogContent>
            <Explorer
              appRole='SelectDataTable'
              className={cnSelectDataTable('Explorer')}
              preset={ExplorerItemType.DATASET_ROOT}
              onSelect={this.handleSelect}
              onOpen={this.handleOpen}
              disabledTester={this.testForDisabled}
            />
          </DialogContent>
          <DialogActions>
            <Button color='primary' disabled={!this.selectedDataTable} onClick={this.submitDialog}>
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
    const { dataset, dataTable } = fieldValue as Datasource;

    return [
      { title: dataset.title, subtitle: dataset.identifier },
      { title: dataTable.title, subtitle: dataTable.identifier }
    ];
  }

  @action.bound
  private handleSelect(item: ExplorerItemData, path: ExplorerItemData[]) {
    if (item.type === ExplorerItemType.TABLE && this.isDisabled(item.payload as DataTable)) {
      this.selectedDataset = path[1].payload as Dataset;
      this.selectedDataTable = item.payload as DataTable;
    } else {
      this.selectedDataset = null;
      this.selectedDataTable = null;
    }
  }

  @action.bound
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
    const { property } = this.props;

    this.closeDialog();
    this.props.onChange({
      value: { dataset: this.selectedDataset, dataTable: this.selectedDataTable },
      propertyName: property.name
    });

    this.selectedDataset = null;
    this.selectedDataTable = null;
  }

  private isDisabled(dataTable: DataTable) {
    return !(this.props.usedDataTables || []).some(
      ({ dataset, identifier }) => dataTable.dataset === dataset && dataTable.identifier === identifier
    );
  }

  @boundMethod
  private testForDisabled({ payload }: ExplorerItemData<DataTable>) {
    return this.props.usedDataTables.some(table => table.id === payload.id);
  }
}
