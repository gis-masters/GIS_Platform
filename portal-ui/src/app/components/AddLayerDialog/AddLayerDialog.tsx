import React, { Component } from 'react';
import { action, computed, observable, makeObservable } from 'mobx';
import { observer } from 'mobx-react';
import { Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import { cn } from '@bem-react/classname';
import { boundMethod } from 'autobind-decorator';
import { cloneDeep } from 'lodash';
import { AxiosError } from 'axios';

import { DocumentLibrary, getLibraryRecord, LibraryRecord } from '../../services/data/doc-library.service';
import { SelectFileInLibraryRecord } from '../SelectFileInLibraryRecord/SelectFileInLibraryRecord';
import { externalLayerDefaults, vectorLayerDefaults } from '../../services/gis/layers.utils';
import { Dataset, VectorTable, getVectorTable } from '../../services/data/data.service';
import { FieldErrors, validateFormValue } from '../../services/formValidation.service';
import { PropertySchema, PropertyType } from '../../services/data/schema.models';
import { CrgLayerType, CrgLayer } from '../../services/gis/projects.models';
import { SelectVectorTable } from '../SelectVectorTable/SelectVectorTable';
import { generateNextLayerId } from '../../services/gis/layers.service';
import { placeFile } from '../../services/gis/files-placement.service';
import { FileInfo, getFile } from '../../services/data/files.service';
import { currentProject } from '../../stores/CurrentProject.store';
import { getFileBaseName } from '../../services/data/files.util';
import { currentUser } from '../../stores/CurrentUser.store';
import { services } from '../../services/services';
import { Button } from '../Button/Button';
import { Toast } from '../Toast/Toast';
import { Form } from '../Form/Form';
import { schemaService } from '../../services/data/schema.service';

const cnAddLayerDialog = cn('AddLayerDialog');

interface AddLayerDialogProps {
  open: boolean;
  onClose: () => void;
  onAdd: (layer: CrgLayer) => void;
}

const defaultValue: FormValue = {
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

interface FormValue extends CrgLayer, Record<string, unknown> {
  datasource?: Datasource;
  layerType?: string;
}

export interface Datasource {
  dataset?: Dataset;
  vectorTable?: VectorTable;
  libraryRecord?: LibraryRecord;
  library?: DocumentLibrary;
  file?: FileInfo;
}

const layerTypeOptions = [
  { title: 'Векторный слой', value: 'vector' },
  { title: 'Растровый слой', value: 'raster' },
  { title: 'Внешний слой (веб-сервис ArcGis)', value: 'external' }
];

const validateLayer = value => {
  if (!value) {
    return ['Некорректное значение'];
  }
};

const minZoomTitle = 'Уровень масштабной детализации';

@observer
export class AddLayerDialog extends Component<AddLayerDialogProps> {
  @observable private usedVectorTables: VectorTable[] = [];
  @observable private usedVectorTablesRequest?: Promise<VectorTable[]>;
  @observable private formValue?: FormValue = cloneDeep(defaultValue);
  @observable private formErrors?: FieldErrors[];
  @observable private loading = false;

  constructor(props: AddLayerDialogProps) {
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
    const { open, onClose } = this.props;

    return (
      <Dialog open={open} onClose={onClose} maxWidth='md' fullWidth PaperProps={{ className: cnAddLayerDialog() }}>
        <DialogTitle>Добавить слой</DialogTitle>
        <DialogContent>
          <Form
            id='addLayerForm'
            onSubmit={this.add}
            schema={{ properties: this.fields }}
            value={this.formValue}
            onFormChange={this.handleFormChange}
            onFieldChange={this.formFieldChanged}
            errors={[...(this.formErrors || [])]}
            onFieldNeedValidate={this.formFieldValidateHandler}
          />
        </DialogContent>
        <DialogActions>
          <Button loading={this.loading} form='addLayerForm' type='submit' color='primary'>
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

  @action
  private setUsedVectorTables(vectorTables: VectorTable[]) {
    this.usedVectorTables = vectorTables;
  }

  @action.bound
  private handleFormChange(formValue: FormValue) {
    this.formValue = formValue;

    if (!this.formValue.title && formValue.datasource) {
      const datasource = formValue.datasource;

      this.formValue.title = datasource.vectorTable?.title || datasource.file?.title;
      this.formFieldChanged(this.formValue, 'title');
    }
  }

  @action.bound
  private clearForm() {
    this.formValue = cloneDeep(defaultValue);
    this.setErrors();
  }

  private validate() {
    this.setErrors(validateFormValue(this.formValue, this.fields));
  }

  private getDescription() {
    return (
      <>
        Скрывает слой при отдалении карты, начиная указанного уровня:
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
    if (!this.formValue.layerType || this.formValue.layerType === CrgLayerType.VECTOR) {
      return [
        {
          name: 'layerType',
          title: 'Тип слоя',
          display: 'buttongroup',
          defaultValue: 'vector',
          options: layerTypeOptions,
          propertyType: PropertyType.CHOICE
        },
        {
          name: 'title',
          title: 'Имя слоя',
          required: true,
          minLength: 2,
          propertyType: PropertyType.STRING
        },
        {
          name: 'minZoom',
          title: minZoomTitle,
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
          ControlComponent: props => <SelectVectorTable {...props} usedVectorTables={this.usedVectorTables} />,
          validationFormula: validateLayer
        }
      ];
    }

    if (this.formValue.layerType === CrgLayerType.RASTER) {
      return [
        {
          name: 'layerType',
          title: 'Тип слоя',
          display: 'buttongroup',
          defaultValue: 'vector',
          options: layerTypeOptions,
          propertyType: PropertyType.CHOICE
        },
        {
          name: 'title',
          title: 'Имя слоя',
          required: true,
          minLength: 2,
          propertyType: PropertyType.STRING
        },
        {
          name: 'minZoom',
          title: minZoomTitle,
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
          title: 'Документ',
          defaultValue: true,
          ControlComponent: SelectFileInLibraryRecord,
          validationFormula: validateLayer
        }
      ];
    }

    if (this.formValue.layerType === CrgLayerType.EXTERNAL) {
      return [
        {
          name: 'layerType',
          title: 'Тип слоя',
          display: 'buttongroup',
          defaultValue: 'vector',
          options: layerTypeOptions,
          propertyType: PropertyType.CHOICE
        },
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
          title: minZoomTitle,
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
  }

  @boundMethod
  private async add(e: React.FormEvent<HTMLFormElement>) {
    this.validate();
    const { datasource = {}, title, minZoom, dataSourceUri, tableName, layerType } = this.formValue;
    const { dataset, vectorTable, library } = datasource;
    const vectorDefaults = vectorLayerDefaults();
    const schema = await schemaService.getSchema(vectorTable.schemaId);

    e.preventDefault();
    const dataStoreName = currentUser.workspaceName;
    if (this.valid && (!layerType || layerType === CrgLayerType.VECTOR)) {
      this.props.onAdd({
        ...vectorDefaults,
        id: generateNextLayerId(),
        dataset: dataset?.identifier,
        tableName: vectorTable?.identifier,
        complexName: `${dataStoreName}:${vectorTable?.identifier}`,
        title,
        nativeCRS: vectorTable.crs,
        schemaId: vectorTable.schemaId,
        minZoom,
        styleName: /* contentType.styleName || */ schema.styleName || vectorTable.schemaId
      } as CrgLayer);
      this.close();

      this.clearForm();
    }

    const externalDefaults = externalLayerDefaults();

    if (this.valid && layerType === CrgLayerType.RASTER) {
      const { libraryRecord, file } = this.formValue.datasource;
      this.setLoading(true);

      try {
        const record = await getLibraryRecord(library.identifier, libraryRecord.id);
        const { path } = await getFile(file.id);
        const fileTableName = `${record.libraryId}_${record.id}__${file.id}`;

        await placeFile(file, { crs: 'EPSG:3857', mode: 'geoserver' }, currentProject, record);

        this.props.onAdd({
          id: generateNextLayerId(),
          title: title || getFileBaseName(file.title),
          dataStoreName,
          tableName: fileTableName, // name слоя не геосервере
          complexName: `${dataStoreName}:${fileTableName}`,
          enabled: true,
          nativeCRS: 'EPSG:3857',
          dataSourceUri: 'file://' + path,
          libraryId: record.libraryId,
          recordId: record.id,
          mode: 'gis-service',
          type: CrgLayerType.RASTER
        });
      } catch (error) {
        Toast.error('Не удалось подключить слой');
        services.logger.error('Не удалось удалить файл: ', (error as AxiosError).message);
        this.setLoading(false);

        return;
      }
      this.setLoading(false);

      this.close();

      this.clearForm();
    }

    if (this.valid && layerType === CrgLayerType.EXTERNAL) {
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

  private async checkUsedTables(): Promise<VectorTable> {
    if (this.usedVectorTablesRequest) {
      await this.usedVectorTablesRequest;
      this.usedVectorTablesRequest = null;
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
    this.usedVectorTablesRequest = null;

    if (alreadyUsedVectorTables.length !== this.usedVectorTables.length || newUsedVectorTables.length > 0) {
      this.setUsedVectorTables([...alreadyUsedVectorTables, ...newUsedVectorTables]);
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

  @action
  private setLoading(loading: boolean) {
    this.loading = loading;
  }

  private filterFieldErrors(fieldName: string) {
    this.setErrors(this.formErrors?.filter(({ field }) => field !== fieldName));
  }
}
