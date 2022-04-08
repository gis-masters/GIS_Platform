import React, { Component } from 'react';
import { action, computed, observable } from 'mobx';
import { observer } from 'mobx-react';
import { Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import { cn } from '@bem-react/classname';
import { boundMethod } from 'autobind-decorator';
import { cloneDeep, isUndefined } from 'lodash';
import { AxiosError } from 'axios';

import { DocumentLibrary, getLibraryRecord, LibraryRecord } from '../../services/crg/doc-library.service';
import { awaitProcess, ProcessDataModel, createProcess } from '../../services/crg/processes.service';
import { externalLayerDefaults, vectorLayerDefaults } from '../../services/NewLayerDefaults';
import { FieldErrors, validateFormValue } from '../../services/crg/formValidation.service';
import { SelectLibraryRecord } from '../SelectLibraryRecord/SelectLibraryRecord';
import { PropertySchema, PropertyType } from '../../services/crg/schema.models';
import { CrgLayerType, CrgLayer } from '../../services/crg/projects.models';
import { Dataset, DataTable, getDataTable } from '../../services/data.service';
import { generateNextLayerId } from '../../services/geoserver/layers.service';
import { SelectDataTable } from '../SelectDataTable/SelectDataTable';
import { getProcessUrl } from '../../services/server-urls.service';
import { currentProject } from '../../stores/CurrentProject.store';
import { currentUser } from '../../stores/CurrentUser.store';
import { wsService } from '../../services/ws.service';
import { services } from '../../services/services';
import { Button } from '../Button/Button';
import { Toast } from '../Toast/Toast';
import { Form } from '../Form/Form';

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
  dataTable?: DataTable;
  libraryRecord?: LibraryRecord;
  library?: DocumentLibrary;
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
  @observable private usedDataTables: DataTable[] = [];
  @observable private usedDataTablesRequest?: Promise<DataTable[]>;
  @observable private usedLibraryRecords: LibraryRecord[] = [];
  @observable private usedLibraryRecordsRequest?: Promise<LibraryRecord[]>;
  @observable private formValue?: FormValue = cloneDeep(defaultValue);
  @observable private formErrors?: FieldErrors[];
  @observable private loading = false;

  async componentDidMount() {
    await this.checkUsedTables();
    await this.checkUsedLibraryRecords();
  }

  async componentDidUpdate() {
    await this.checkUsedTables();
    await this.checkUsedLibraryRecords();
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
            fields={this.fields}
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
  private setUsedDataTables(dataTables: DataTable[]) {
    this.usedDataTables = dataTables;
  }

  @action
  private setUsedLibraryRecords(libraryRecords: LibraryRecord[]) {
    this.usedLibraryRecords = libraryRecords;
  }

  @action.bound
  private handleFormChange(formValue: FormValue) {
    this.formValue = formValue;

    if (!this.formValue.title && formValue.datasource) {
      const datasource = formValue.datasource;

      this.formValue.title = datasource.dataTable?.title || datasource.libraryRecord?.title;
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
          ControlComponent: props => <SelectDataTable {...props} usedDataTables={this.usedDataTables} />,
          customValidationFunction: validateLayer
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
          ControlComponent: props => <SelectLibraryRecord {...props} usedLibraryRecords={this.usedLibraryRecords} />,
          customValidationFunction: validateLayer
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
    const { dataset, dataTable } = datasource;
    const vectorDefaults = vectorLayerDefaults();

    e.preventDefault();
    const dataStoreName = `scratch_database_${currentUser.orgId}`;
    if (this.valid && (!layerType || layerType === CrgLayerType.VECTOR)) {
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
      } as CrgLayer);
      this.close();

      this.clearForm();
    }

    const externalDefaults = externalLayerDefaults();

    if (this.valid && layerType === CrgLayerType.RASTER) {
      const { libraryRecord } = this.formValue.datasource;

      try {
        const payload: ProcessDataModel = {
          wsUiId: wsService.getId(),
          source: {
            libraryId: libraryRecord.libraryId,
            objectId: Number(libraryRecord.id)
          },
          target: {
            projectId: currentProject.id,
            projectName: currentProject.name,
            projectIsNew: false,
            mode: 'geoserver'
          }
        };

        this.setLoading(true);
        const process = await createProcess(payload);
        const processUrl = process._links.process.href.split('/');
        await awaitProcess(await getProcessUrl(Number(processUrl[processUrl.length - 1])));
        this.setLoading(false);
      } catch (error) {
        Toast.error('Не удалось подключить слой');
        services.logger.error('Не удалось удалить файл: ', (error as AxiosError).message);
        this.setLoading(false);

        return;
      }
      const innerPath = libraryRecord.inner_path.split('/');
      const tableName = innerPath[innerPath.length - 1].split('.')[0];

      this.props.onAdd({
        id: generateNextLayerId(),
        title,
        dataStoreName,
        tableName,
        complexName: `${dataStoreName}:${tableName}`,
        enabled: true,
        nativeCRS: 'EPSG:3857',
        position: -42,
        transparency: 75,
        minZoom,
        maxZoom: 40,
        libraryId: libraryRecord.libraryId,
        recordId: libraryRecord.id,
        mode: 'gis-service',
        type: CrgLayerType.RASTER
      });

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

  private async checkUsedTables(): Promise<DataTable> {
    if (this.usedDataTablesRequest) {
      await this.usedDataTablesRequest;
      this.usedDataTablesRequest = null;
      await this.checkUsedTables();

      return;
    }

    const alreadyUsedDataTables = this.usedDataTables.filter(table =>
      currentProject.layers.some(
        layer =>
          layer.type === CrgLayerType.VECTOR && table.dataset === layer.dataset && table.identifier === layer.tableName
      )
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

  private async checkUsedLibraryRecords(): Promise<LibraryRecord> {
    if (this.usedLibraryRecordsRequest) {
      await this.usedLibraryRecordsRequest;
      this.usedLibraryRecordsRequest = null;
      await this.checkUsedLibraryRecords();

      return;
    }

    const alreadyUsedLibraryRecords = this.usedLibraryRecords.filter(libraryRecord =>
      currentProject.rasterLayers.some(
        ({ libraryId, recordId }) => libraryRecord.libraryId === libraryId && libraryRecord.id === recordId
      )
    );

    this.usedLibraryRecordsRequest = Promise.all(
      currentProject.rasterLayers
        .filter(
          layer =>
            !this.usedLibraryRecords.some(
              libraryRecord => libraryRecord.libraryId === layer.libraryId && libraryRecord.id === layer.recordId
            )
        )
        .map(async layer => {
          const { libraryId, recordId } = layer;
          if (libraryId && recordId) {
            return await getLibraryRecord(libraryId, recordId);
          }
        })
    );

    let newUsedLibraryRecords = await this.usedLibraryRecordsRequest;
    newUsedLibraryRecords = newUsedLibraryRecords.filter(item => !isUndefined(item));
    this.usedLibraryRecordsRequest = null;

    if (alreadyUsedLibraryRecords.length !== this.usedDataTables.length || newUsedLibraryRecords.length > 0) {
      this.setUsedLibraryRecords([...alreadyUsedLibraryRecords, ...newUsedLibraryRecords]);
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
