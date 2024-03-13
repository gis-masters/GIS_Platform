import React, { Component } from 'react';
import { action, computed, observable, makeObservable } from 'mobx';
import { observer } from 'mobx-react';
import { cn } from '@bem-react/classname';
import { ButtonBase, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import { boundMethod } from 'autobind-decorator';

import { isFeaturesUpdateAllowed } from '../../services/data/permissions/permissions.service';
import { Dataset, VectorTable } from '../../services/data/vectorData/vectorData.models';
import { ExplorerItemData, ExplorerItemType } from '../Explorer/Explorer.models';
import { Breadcrumbs, BreadcrumbsItemData } from '../Breadcrumbs/Breadcrumbs';
import { FormControlProps } from '../Form/Control/Form-Control';
import { Explorer } from '../Explorer/Explorer';
import { Button } from '../Button/Button';

import '!style-loader!css-loader!sass-loader!./SelectVectorTableControl.scss';

const cnSelectVectorTable = cn('SelectVectorTableControl');

interface Datasource {
  dataset: Dataset;
  vectorTable: VectorTable;
}

interface SelectVectorTableControlProps extends FormControlProps {
  usedVectorTables?: VectorTable[];
  writableOnly?: boolean;
}

@observer
export class SelectVectorTableControl extends Component<SelectVectorTableControlProps> {
  @observable private dialogOpen = false;
  @observable private selectedDataset?: Dataset;
  @observable private selectedVectorTable?: VectorTable;

  constructor(props: SelectVectorTableControlProps) {
    super(props);
    makeObservable(this);
  }

  render() {
    const { className, htmlId, fieldValue = {} } = this.props;
    const { vectorTable } = fieldValue as Datasource;

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
              preset={ExplorerItemType.DATASET_ROOT}
              onSelect={this.handleSelect}
              onOpen={this.handleOpen}
              disabledTester={this.testForDisabled}
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
      this.select(path[1].payload as Dataset, item.payload as VectorTable);
    } else {
      this.select();
    }
  }

  @action
  private select(dataset?: Dataset, table?: VectorTable) {
    this.selectedDataset = dataset;
    this.selectedVectorTable = table;
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
        value: { dataset: this.selectedDataset, vectorTable: this.selectedVectorTable },
        propertyName: property.name
      });
    }

    this.selectedDataset = undefined;
    this.selectedVectorTable = undefined;
  }

  @boundMethod
  private testForDisabled(item: ExplorerItemData): boolean {
    if (item.type === ExplorerItemType.TABLE) {
      const table = item.payload as VectorTable;

      if (this.props.writableOnly) {
        return !isFeaturesUpdateAllowed(table.dataset, table.identifier);
      }

      return Boolean(
        this.props.usedVectorTables?.some(({ id, dataset }) => id === table.id && dataset === table.dataset)
      );
    }

    return false;
  }
}
