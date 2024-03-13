import React, { Component } from 'react';
import { action, computed, observable, makeObservable } from 'mobx';
import { observer } from 'mobx-react';
import { cn } from '@bem-react/classname';
import { boundMethod } from 'autobind-decorator';
import { AxiosError } from 'axios';

import { currentUser } from '../../stores/CurrentUser.store';
import { currentProject } from '../../stores/CurrentProject.store';
import {
  generateNextLayerId,
  externalLayerDefaults,
  rasterLayerDefaults,
  vectorLayerDefaults
} from '../../services/gis/layers/layers.utils';
import { getLibraryRecord } from '../../services/data/library/library.service';
import { Library, LibraryRecord } from '../../services/data/library/library.models';
import {
  ContentType,
  PropertySchema,
  PropertyType,
  Schema,
  ValueFormula
} from '../../services/data/schema/schema.models';
import { Dataset, VectorTable } from '../../services/data/vectorData/vectorData.models';
import { placeFile } from '../../services/data/file-placement/file-placement.service';
import { getVectorTable } from '../../services/data/vectorData/vectorData.service';
import { CrgLayerType, CrgLayer } from '../../services/gis/layers/layers.models';
import { getDefaultValues, getViewChoiceOptions } from '../Form/Form.utils';
import { FieldValidator, validateFormValue } from '../../services/util/form/formValidation.utils';
import { getFileBaseName } from '../../services/data/files/files.util';
import { getFile } from '../../services/data/files/files.service';
import { FileInfo } from '../../services/data/files/files.models';
import { services } from '../../services/services';
import { SelectFileInLibraryRecordControl } from '../SelectFileInLibraryRecordControl/SelectFileInLibraryRecordControl';
import { SelectVectorTableControl } from '../SelectVectorTableControl/SelectVectorTableControl';
import { FormDialog } from '../FormDialog/FormDialog';
import { Toast } from '../Toast/Toast';

const cnAddLayerDialog = cn('AddLayerDialog');

interface AddLayerDialogProps {
  open: boolean;
  onClose: () => void;
  onAdd: (layer: CrgLayer) => void;
}

interface FormValue extends CrgLayer {
  datasource?: Datasource;
  layerType?: string;
}

export interface Datasource {
  dataset?: Dataset;
  vectorTable?: VectorTable;
  libraryRecord?: LibraryRecord;
  library?: Library;
  file?: FileInfo;
}

const layerTypeOptions = [
  { title: 'Векторный слой', value: 'vector' },
  { title: 'Растровый слой', value: 'raster' },
  { title: 'Внешний слой (веб-сервис ArcGis)', value: 'external' }
];

const validateLayer: FieldValidator = value => {
  if (!value) {
    return ['Некорректное значение'];
  }
};

const minZoomTitle = 'Уровень масштабной детализации';

@observer
export class AddLayerDialog extends Component<AddLayerDialogProps> {
  @observable private usedVectorTables: VectorTable[] = [];
  private usedVectorTablesRequest?: Promise<VectorTable[]>;
  @observable private formValue: Partial<FormValue> = getDefaultValues(this.fields);

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
    const { open } = this.props;

    return (
      <FormDialog
        className={cnAddLayerDialog()}
        open={open}
        schema={{ properties: this.fields }}
        actionFunction={this.add}
        onFormChange={this.handleFormChange}
        actionButtonProps={{ children: 'Добавить' }}
        onClose={this.close}
        value={this.formValue}
        title='Добавить слой'
      />
    );
  }

  @computed
  private get valid(): boolean {
    return !validateFormValue(this.formValue, this.fields).length;
  }

  @computed
  private get schema(): Schema | undefined {
    return this.formValue?.datasource?.vectorTable?.schema;
  }

  @computed
  private get views(): ContentType[] {
    return this.schema?.views || [];
  }

  @action.bound
  private close() {
    this.clearForm();
    this.props.onClose();
  }

  @action
  private setUsedVectorTables(vectorTables: VectorTable[]) {
    this.usedVectorTables = vectorTables;
  }

  @action.bound
  private handleFormChange(formValue: FormValue) {
    this.formValue = formValue;
  }

  @action.bound
  private clearForm() {
    this.formValue = getDefaultValues(this.fields);
  }

  private getDescription() {
    return (
      <>
        Скрывает слой при отдалении карты, начиная указанного уровня:
        <br />
        10 — 1:250 000
        <br />
        12 — 1:100 000
        <br />
        15 — 1:10 000
        <br />
        20 — 1:500
        <br />
        25 — 1:10
      </>
    );
  }

  @computed
  private get fields(): PropertySchema[] {
    if (!this.formValue?.layerType || this.formValue?.layerType === CrgLayerType.VECTOR) {
      const options = getViewChoiceOptions(this.views) || [];

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
          calculatedValueFormula: this.calculateTitle,
          propertyType: PropertyType.STRING
        },
        {
          name: 'minZoom',
          title: minZoomTitle,
          propertyType: PropertyType.FLOAT,
          display: 'slider',
          description: this.getDescription(),
          defaultValue: 10,
          step: 1,
          minValue: 0,
          maxValue: 25
        },
        {
          propertyType: PropertyType.CUSTOM,
          name: 'datasource',
          title: 'Источник данных',
          defaultValue: true,
          ControlComponent: props => <SelectVectorTableControl {...props} usedVectorTables={this.usedVectorTables} />,
          validationFormula: validateLayer
        },
        {
          name: 'view',
          title: 'Представление',
          hidden: !this.formValue?.datasource || options.length <= 1,
          options,
          defaultValue: '',
          propertyType: PropertyType.CHOICE
        }
      ];
    } else if (this.formValue?.layerType === CrgLayerType.RASTER) {
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
          defaultValue: 10,
          step: 1,
          minValue: 0,
          maxValue: 25
        },
        {
          propertyType: PropertyType.CUSTOM,
          name: 'datasource',
          title: 'Документ',
          defaultValue: true,
          ControlComponent: SelectFileInLibraryRecordControl,
          validationFormula: validateLayer
        }
      ];
    } else if (this.formValue?.layerType === CrgLayerType.EXTERNAL) {
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
          defaultValue: 10,
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
        },
        {
          name: 'errorText',
          title: 'Сообщение об ошибке',
          description: 'Сообщение, которое отображается, когда внешний слой не работает',
          propertyType: PropertyType.STRING
        }
      ];
    }

    throw new Error('Неизвестный тип слоя');
  }

  @boundMethod
  private async add() {
    const {
      datasource = {},
      title = '',
      minZoom,
      dataSourceUri,
      tableName,
      layerType,
      view,
      errorText
    } = this.formValue;
    const { dataset, vectorTable, library } = datasource;
    const dataStoreName = currentUser.workspaceName;

    if (!this.schema) {
      throw new Error('Отсутствует схема');
    }

    if (this.valid && (!layerType || layerType === CrgLayerType.VECTOR)) {
      if (!dataset || !vectorTable) {
        throw new Error('Не указаны обязательные параметры');
      }

      const styleName = this.views.find(({ id }) => id === view)?.styleName;

      this.props.onAdd({
        ...vectorLayerDefaults(),
        id: generateNextLayerId(),
        dataset: dataset?.identifier,
        tableName: vectorTable?.identifier,
        complexName: `${dataStoreName}:${vectorTable?.identifier}`,
        title,
        nativeCRS: vectorTable.crs,
        minZoom,
        styleName: styleName || this.schema.styleName || this.schema.name,
        view
      });
      this.clearForm();

      this.close();
    }

    const externalDefaults = externalLayerDefaults();
    const rasterDefaults = rasterLayerDefaults();

    if (this.valid && layerType === CrgLayerType.RASTER && this.formValue.datasource) {
      const { libraryRecord, file } = this.formValue.datasource;

      try {
        if (!libraryRecord || !file || !library) {
          throw new Error('Не указаны обязательные параметры');
        }

        const record = await getLibraryRecord(library.table_name, libraryRecord.id);
        const { path } = await getFile(file.id);
        const fileTableName = `${record.libraryTableName}_${record.id}__${file.id}`;

        await placeFile(file, { crs: 'EPSG:3857', mode: 'geoserver' }, currentProject, record);

        this.props.onAdd({
          ...rasterDefaults,
          id: generateNextLayerId(),
          title: title || getFileBaseName(file.title),
          dataStoreName,
          tableName: fileTableName, // name слоя не геосервере
          complexName: `${dataStoreName}:${fileTableName}`,
          dataSourceUri: 'file://' + path,
          libraryId: record.libraryTableName,
          recordId: record.id
        });
      } catch (error) {
        Toast.error('Не удалось подключить слой');
        services.logger.error('Не удалось удалить файл: ', (error as AxiosError).message);

        return;
      }

      this.clearForm();

      this.close();
    }

    if (this.valid && layerType === CrgLayerType.EXTERNAL) {
      this.props.onAdd({
        ...externalDefaults,
        id: generateNextLayerId(),
        title,
        dataSourceUri: dataSourceUri,
        minZoom,
        tableName,
        errorText: errorText
      });
      this.clearForm();

      this.close();
    }
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

  private calculateTitle: ValueFormula = (value): string => {
    return (
      (value as FormValue)?.title ||
      (value as FormValue)?.datasource?.vectorTable?.title ||
      (value as FormValue)?.datasource?.file?.title ||
      ''
    );
  };
}
