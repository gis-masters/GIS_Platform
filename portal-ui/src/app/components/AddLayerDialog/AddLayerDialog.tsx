import React, { Component } from 'react';
import { action, computed, observable } from 'mobx';
import { observer } from 'mobx-react';
import { Dialog, DialogActions, DialogContent, DialogTitle, ToggleButton, ToggleButtonGroup } from '@mui/material';
import { cn } from '@bem-react/classname';
import { boundMethod } from 'autobind-decorator';
import { cloneDeep } from 'lodash';

import { currentUser } from '../../stores/CurrentUser.store';
import { currentProject } from '../../stores/CurrentProject.store';
import { externalLayerDefaults, vectorLayerDefaults } from '../../services/NewLayerDefaults';
import { FieldErrors, validateFormValue } from '../../services/crg/formValidation.service';
import { PropertySchema, PropertyType } from '../../services/crg/schema.models';
import { CrgLayerType, NewCrgLayer } from '../../services/crg/projects.models';
import { Dataset, DataTable, getDataTable } from '../../services/data.service';
import { generateNextLayerId } from '../../services/geoserver/layers.service';
import { SelectDataTable } from '../SelectDataTable/SelectDataTable';
import { Button } from '../Button/Button';
import { Form } from '../Form/Form';

import '!style-loader!css-loader!sass-loader!./AddLayerDialog.scss';

const cnAddLayerDialog = cn('AddLayerDialog');

interface AddLayerDialogProps {
  open: boolean;
  onClose: () => void;
  onAdd: (layer: NewCrgLayer) => void;
}

const defaultValue: NewCrgLayer = {
  title: '',
  tableName: '',
  dataSourceUri: '',
  position: -42,
  transparency: 75,
  minZoom: 10,
  enabled: true,
  nativeCRS: 'EPSG:3857',
  type: CrgLayerType.VECTOR
};

interface FormValue extends NewCrgLayer {
  datasource?: Datasource;
}

interface Datasource {
  dataset: Dataset;
  dataTable: DataTable;
}

@observer
export class AddLayerDialog extends Component<AddLayerDialogProps> {
  @observable private usedDataTables: DataTable[] = [];
  @observable private usedDataTablesRequest?: Promise<DataTable[]>;
  @observable private formValue?: FormValue = cloneDeep(defaultValue);
  @observable private layerType?: CrgLayerType = CrgLayerType.VECTOR;
  @observable private formErrors?: FieldErrors[];

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
          <ToggleButtonGroup
            size='small'
            color='primary'
            value={this.layerType}
            exclusive
            onChange={this.handleLayerType}
          >
            <ToggleButton size='small' value='vector' className={cnAddLayerDialog('ToggleButton')}>
              Векторный слой
            </ToggleButton>
            <ToggleButton size='small' value='external' className={cnAddLayerDialog('ToggleButton')}>
              Внешний слой (веб-сервис ArcGis)
            </ToggleButton>
          </ToggleButtonGroup>
          <Form
            id='addLayerForm'
            onSubmit={this.add}
            fields={this.fields}
            value={this.formValue}
            onFormChange={this.handleFormChange}
            onFieldChange={this.formFieldChanged}
            errors={[...(this.formErrors || [])]}
            onFieldNeedValidate={this.formFieldValidateHandler}
          />
        </DialogContent>
        <DialogActions>
          <Button form='addLayerForm' type='submit' color='primary'>
            Добавить
          </Button>
          <Button onClick={this.close}>Отмена</Button>
        </DialogActions>
      </Dialog>
    );
  }

  @computed
  private get valid(): boolean {
    return !validateFormValue(this.formValue, this.fields).length;
  }

  @action.bound
  private close() {
    this.props.onClose();
    this.clearForm();
  }

  @action.bound
  private handleLayerType(event: React.MouseEvent<HTMLElement>, newAlignment: CrgLayerType) {
    this.layerType = newAlignment;
  }

  @action
  private setUsedDataTables(dataTables: DataTable[]) {
    this.usedDataTables = dataTables;
  }

  @action.bound
  private handleFormChange(layerInfo: NewCrgLayer) {
    this.formValue = layerInfo;
    const datasource = (layerInfo as FormValue).datasource;

    if (!this.formValue.title && datasource) {
      this.formValue.title = datasource.dataTable.title;
      this.formFieldChanged(this.formValue, 'title');
    }
  }

  @action.bound
  private clearForm() {
    this.formValue = cloneDeep(defaultValue);
    this.layerType = CrgLayerType.VECTOR;
    this.setErrors();
  }

  private validate() {
    this.setErrors(validateFormValue(this.formValue, this.fields));
  }

  private getDescription() {
    return (
      <>
        Скрывает слой для при отдалении карты, начиная указанного уровня:
        <br />
        10 - 1:250 000
        <br />
        12 - 1:100 000
        <br />
        15 - 1:10 000
        <br />
        20 - 1:500
        <br />
        25 - 1:10
      </>
    );
  }

  @computed
  private get fields(): PropertySchema<FormValue>[] {
    return this.layerType === CrgLayerType.VECTOR
      ? [
          {
            name: 'title',
            title: 'Имя слоя',
            required: true,
            minLength: 2,
            propertyType: PropertyType.STRING
          },
          {
            name: 'minZoom',
            title: 'Уровень масштабной детализации',
            propertyType: PropertyType.FLOAT,
            display: 'slider',
            description: this.getDescription(),
            step: 1,
            minValue: 0,
            maxValue: 25
          },
          {
            propertyType: PropertyType.CUSTOM,
            name: 'datasource',
            title: 'Источник данных',
            defaultValue: true,
            ControlComponent: props => <SelectDataTable {...props} usedDataTables={this.usedDataTables} />,
            customValidationFunction: value => {
              if (!value) {
                return ['Некорректное значение'];
              }
            }
          }
        ]
      : [
          {
            name: 'title',
            title: 'Имя слоя',
            required: true,
            minLength: 2,
            propertyType: PropertyType.STRING
          },
          {
            name: 'tableName',
            title: 'Системное название слоя',
            required: true,
            propertyType: PropertyType.STRING
          },
          {
            name: 'minZoom',
            title: 'Уровень масштабной детализации',
            propertyType: PropertyType.FLOAT,
            display: 'slider',
            description: this.getDescription(),
            step: 1,
            minValue: 0,
            maxValue: 25
          },
          {
            name: 'dataSourceUri',
            title: 'URL-адрес',
            required: true,
            wellKnownRegex: 'url',
            propertyType: PropertyType.STRING
          }
        ];
  }

  @boundMethod
  private add(e: React.FormEvent<HTMLFormElement>) {
    this.validate();
    const { datasource = {}, title, minZoom, dataSourceUri, tableName } = this.formValue;
    const { dataset, dataTable } = datasource as Datasource;

    e.preventDefault();
    const vectorDefaults = vectorLayerDefaults();
    const dataStoreName = `scratch_database_${currentUser.orgId}`;

    if (this.valid && this.layerType === CrgLayerType.VECTOR) {
      this.props.onAdd({
        ...vectorDefaults,
        id: generateNextLayerId(),
        dataset: dataset?.identifier,
        tableName: dataTable?.identifier,
        complexName: `${dataStoreName}:${dataTable?.identifier}`,
        title,
        nativeCRS: dataTable.crs,
        schemaId: dataTable.schemaId,
        minZoom,
        styleName: dataTable.schemaId
      });
      this.close();

      this.clearForm();
    }

    const externalDefaults = externalLayerDefaults();

    if (this.valid && this.layerType === CrgLayerType.EXTERNAL) {
      this.props.onAdd({
        ...externalDefaults,
        id: generateNextLayerId(),
        title,
        dataSourceUri: dataSourceUri,
        minZoom,
        tableName
      });
      this.close();

      this.clearForm();
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

  @boundMethod
  private formFieldChanged(value: unknown, fieldName: string) {
    this.filterFieldErrors(fieldName);
  }

  @boundMethod
  private formFieldValidateHandler(value: unknown, fieldName: string) {
    this.filterFieldErrors(fieldName);
    this.setErrors(validateFormValue(this.formValue, this.fields));
  }

  @action
  private setErrors(errors: FieldErrors[] = []) {
    this.formErrors = errors.filter(({ messages }) => messages?.length);
  }

  private filterFieldErrors(fieldName: string) {
    this.setErrors(this.formErrors?.filter(({ field }) => field !== fieldName));
  }
}
