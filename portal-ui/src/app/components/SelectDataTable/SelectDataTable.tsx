import React, { Component } from 'react';
import { action, computed, observable } from 'mobx';
import { observer } from 'mobx-react';
import { cn } from '@bem-react/classname';
import { ButtonBase, Dialog, DialogActions, DialogContent, DialogTitle } from '@material-ui/core';
import { IClassNameProps } from '@bem-react/core';

import { DataSet, DataTable } from '../../services/data.service';
import { ExplorerItemData, ExplorerItemType } from '../Explorer/Explorer.models';
import { Explorer } from '../Explorer/Explorer';
import { Button } from '../Button/Button';

import '!style-loader!css-loader!sass-loader!./SelectDataTable.scss';
import { Breadcrumbs } from '../Breadcrumbs/Breadcrumbs';
import { BreadcrumbItemData } from '../Breadcrumbs/Item/Breadcrumbs-Item';

const cnSelectDataTable = cn('SelectDataTable');

interface SelectDataTableProps extends IClassNameProps {
  id: string;
  dataSet?: DataSet;
  dataTable?: DataTable;
  disabledTables?: DataTable[];
  onChange: (dataSet?: DataSet, dataTable?: DataTable) => void;
}

@observer
export class SelectDataTable extends Component<SelectDataTableProps> {
  @observable private dialogOpen = false;
  @observable private selectedDataSet?: DataSet;
  @observable private selectedDataTable?: DataTable;

  render() {
    const { className, dataTable, id, disabledTables } = this.props;

    return (
      <>
        <ButtonBase
          focusRipple
          className={cnSelectDataTable({ empty: !dataTable }, [className])}
          id={id}
          onClick={this.openDialog}
        >
          {dataTable ? <Breadcrumbs items={this.breadcrumbsItems} itemsType='none' /> : 'Не выбрано'}
        </ButtonBase>
        <Dialog open={this.dialogOpen} onClose={this.closeDialog}>
          <DialogTitle>Выберите источник данных</DialogTitle>
          <DialogContent>
            <Explorer
              preset={ExplorerItemType.DATA_SET_ROOT}
              onSelect={this.handleSelect}
              onOpen={this.handleOpen}
              disabledItems={
                disabledTables && disabledTables.map(table => ({ type: ExplorerItemType.TABLE, payload: table }))
              }
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
  private get breadcrumbsItems(): BreadcrumbItemData[] {
    const { dataSet, dataTable } = this.props;

    return [
      { title: dataSet.title, subtitle: dataSet.identifier },
      { title: dataTable.title, subtitle: dataTable.identifier }
    ];
  }

  @action.bound
  private handleSelect(item: ExplorerItemData, path: ExplorerItemData[]) {
    if (item.type === ExplorerItemType.TABLE && this.isDisabled(item.payload as DataTable)) {
      this.selectedDataSet = path[1].payload as DataSet;
      this.selectedDataTable = item.payload as DataTable;
    } else {
      this.selectedDataSet = null;
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
    this.closeDialog();
    this.props.onChange(this.selectedDataSet, this.selectedDataTable);
    this.selectedDataSet = null;
    this.selectedDataTable = null;
  }

  private isDisabled(dataTable: DataTable) {
    return !(this.props.disabledTables || []).some(
      ({ dataset, identifier }) => dataTable.dataset === dataset && dataTable.identifier === identifier
    );
  }
}
