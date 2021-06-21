import React, { Component } from 'react';
import { action, computed, observable } from 'mobx';
import { observer } from 'mobx-react';
import { Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@material-ui/core';
import { cn } from '@bem-react/classname';
import { boundMethod } from 'autobind-decorator';

import { currentUser } from '../../stores/CurrentUser.store';
import { currentProject } from '../../stores/CurrentProject.store';
import { CrgLayerType, NewCrgLayer } from '../../services/crg/projects.models';
import { generateNextLayerId } from '../../services/geoserver/layers.service';
import { Dataset, DataTable, getDataTable } from '../../services/data.service';
import { Form, FormControl, FormField, FormLabel } from '../Form/Form';
import { SelectDataTable } from '../SelectDataTable/SelectDataTable';
import { Button } from '../Button/Button';

import '!style-loader!css-loader!sass-loader!./AddLayerDialog.scss';

const cnAddLayerDialog = cn('AddLayerDialog');

interface AddLayerDialogProps {
  open: boolean;
  onClose: () => void;
  onAdd: (layer: NewCrgLayer) => void;
}

@observer
export class AddLayerDialog extends Component<AddLayerDialogProps> {
  @observable private title = '';
  @observable private dataset?: Dataset;
  @observable private dataTable?: DataTable;
  @observable private usedDataTables: DataTable[] = [];
  @observable private usedDataTablesRequest?: Promise<DataTable[]>;

  async componentDidMount() {
    await this.checkUsedTables();
  }

  async componentDidUpdate() {
    await this.checkUsedTables();
  }

  render() {
    const { open, onClose } = this.props;

    return (
      <Dialog open={open} onClose={onClose} maxWidth='xl' PaperProps={{ className: cnAddLayerDialog() }}>
        <DialogTitle>Добавить слой</DialogTitle>
        <DialogContent>
          <Form id='addLayerForm' onSubmit={this.add}>
            <FormField>
              <FormLabel htmlFor='addLayerDataTable'>Источник данных</FormLabel>
              <FormControl>
                <SelectDataTable
                  id='addLayerDataTable'
                  dataset={this.dataset}
                  dataTable={this.dataTable}
                  onChange={this.handleDataTableChange}
                  disabledTables={this.usedDataTables}
                />
              </FormControl>
            </FormField>
            <FormField>
              <FormLabel htmlFor='addLayerTitle'>Название</FormLabel>
              <FormControl>
                <TextField id='addLayerTitle' value={this.title} onChange={this.handleTitleChange} fullWidth />
              </FormControl>
            </FormField>
          </Form>
        </DialogContent>
        <DialogActions>
          <Button form='addLayerForm' type='submit' color='primary' disabled={!this.valid}>
            Добавить
          </Button>
          <Button onClick={this.close}>Отмена</Button>
        </DialogActions>
      </Dialog>
    );
  }

  @computed
  private get valid(): boolean {
    return Boolean(this.dataTable && this.title);
  }

  @action.bound
  private close() {
    this.dataset = null;
    this.dataTable = null;
    this.title = '';
    this.props.onClose();
  }

  @action.bound
  private handleDataTableChange(dataset: Dataset, dataTable: DataTable) {
    this.dataset = dataset;
    this.dataTable = dataTable;
    if (this.dataTable) {
      this.title = dataTable.title;
    }
  }

  @action.bound
  private handleTitleChange(e: React.ChangeEvent<HTMLInputElement>) {
    this.title = e.target.value;
  }

  @action
  private setUsedDataTables(dataTables: DataTable[]) {
    this.usedDataTables = dataTables;
  }

  @boundMethod
  private add(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const dataStoreName = `scratch_database_${currentUser.orgId}`;

    if (this.valid) {
      this.props.onAdd({
        id: generateNextLayerId(),
        dataStoreName,
        dataset: this.dataset.identifier,
        tableName: this.dataTable.identifier,
        complexName: `${dataStoreName}:${this.dataTable.identifier}`,
        title: this.title,
        enabled: true,
        nativeCRS: this.dataTable.crs,
        schemaId: this.dataTable.schemaId,
        position: -42,
        transparency: 75,
        styleName: this.dataTable.schemaId,
        type: CrgLayerType.VECTOR
      });
      this.close();
    }
  }

  private async checkUsedTables(): Promise<DataTable> {
    if (this.usedDataTablesRequest) {
      await this.usedDataTablesRequest;
      this.usedDataTablesRequest = null;
      await this.checkUsedTables();

      return;
    }

    const alreadyUsedDataTables = this.usedDataTables.filter(table =>
      currentProject.layers.some(layer => table.dataset === layer.dataset && table.identifier === layer.tableName)
    );

    this.usedDataTablesRequest = Promise.all(
      currentProject.vectorLayers
        .filter(
          layer =>
            !this.usedDataTables.some(table => table.dataset === layer.dataset && table.identifier === layer.tableName)
        )
        .map(async layer => {
          const table = await getDataTable(layer.dataset, layer.tableName);

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

    const newUsedDataTables = await this.usedDataTablesRequest;
    this.usedDataTablesRequest = null;

    if (alreadyUsedDataTables.length !== this.usedDataTables.length || newUsedDataTables.length > 0) {
      this.setUsedDataTables([...alreadyUsedDataTables, ...newUsedDataTables]);
    }
  }
}
