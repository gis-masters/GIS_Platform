import React, { Component } from 'react';
import { action, computed, makeObservable, observable } from 'mobx';
import { observer } from 'mobx-react';
import { cn } from '@bem-react/classname';
import { boundMethod } from 'autobind-decorator';
import { AxiosError } from 'axios';

import { FilePlacementMode } from '../../services/data/file-placement/file-placement.models';
import { placeFileWithProjection } from '../../services/data/file-placement/file-placement.service';
import { FileInfo } from '../../services/data/files/files.models';
import { getFileInfo } from '../../services/data/files/files.service';
import {
  getFileBaseName,
  isDxfFile,
  isMidMifFile,
  isShpFile,
  isTabFile,
  isTifFile
} from '../../services/data/files/files.util';
import { Library, LibraryRecord } from '../../services/data/library/library.models';
import { getLibraryRecord } from '../../services/data/library/library.service';
import { isPlaceFileProcess } from '../../services/data/processes/processes.models';
import { awaitProcess } from '../../services/data/processes/processes.service';
import { Projection } from '../../services/data/projections/projections.models';
import { getProjectionCode } from '../../services/data/projections/projections.util';
import {
  ContentType,
  PropertySchema,
  PropertyType,
  Schema,
  ValueFormula
} from '../../services/data/schema/schema.models';
import { Dataset, VectorTable } from '../../services/data/vectorData/vectorData.models';
import { buildComplexName } from '../../services/geoserver/featureType/featureType.util';
import { CrgLayer, CrgLayerType } from '../../services/gis/layers/layers.models';
import { createLayer, getViewChoiceOptions } from '../../services/gis/layers/layers.service';
import {
  externalLayerDefaults,
  generateNextLayerId,
  vectorLayerDefaults
} from '../../services/gis/layers/layers.utils';
import { services } from '../../services/services';
import { FieldValidator, validateFormValue } from '../../services/util/form/formValidation.utils';
import { currentProject } from '../../stores/CurrentProject.store';
import { currentUser } from '../../stores/CurrentUser.store';
import { projectionsStore } from '../../stores/Projections.store';
import { getDefaultValues } from '../Form/Form.utils';
import { FormDialog } from '../FormDialog/FormDialog';
import { SelectFileInLibraryRecordControl } from '../SelectFileInLibraryRecordControl/SelectFileInLibraryRecordControl';
import { SelectProjectionControl } from '../SelectProjectionControl/SelectProjectionControl';
import { SelectVectorTableControl } from '../SelectVectorTableControl/SelectVectorTableControl';
import { Toast } from '../Toast/Toast';

const cnAddLayerDialog = cn('AddLayerDialog');

interface AddLayerDialogProps {
  open: boolean;
  onClose(): void;
  onAdd(layer: CrgLayer): void;
}

interface LayerFormValue extends CrgLayer {
  datasource?: Datasource;
  projection?: Projection;
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
  { title: 'Файловый слой', value: 'raster' },
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
  @observable private formValue: Partial<LayerFormValue> = getDefaultValues(this.fields);

  constructor(props: AddLayerDialogProps) {
    super(props);
    makeObservable(this);
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

  @action.bound
  private handleFormChange(formValue: LayerFormValue) {
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
      const options = this.schema ? getViewChoiceOptions(this.schema) : [];

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
          ControlComponent: props => <SelectVectorTableControl {...props} />,
          validationFormula: validateLayer
        },
        {
          propertyType: PropertyType.CUSTOM,
          name: 'projection',
          title: 'Система координат',
          defaultValue: projectionsStore.defaultProjection,
          ControlComponent: SelectProjectionControl
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
          title: 'Документ',
          defaultValue: true,
          ControlComponent: SelectFileInLibraryRecordControl,
          validationFormula: validateLayer
        },
        {
          propertyType: PropertyType.CUSTOM,
          name: 'projection',
          title: 'Система координат',
          defaultValue: projectionsStore.defaultProjection,
          ControlComponent: SelectProjectionControl
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
      projection,
      layerType,
      view,
      errorText
    } = this.formValue;

    const { dataset, vectorTable, library } = datasource;
    const workspace = currentUser.workspaceName;
    const crs = projection ? getProjectionCode(projection) : '';

    if (this.valid && (!layerType || layerType === CrgLayerType.VECTOR)) {
      if (!dataset || !vectorTable) {
        throw new Error('Не указаны обязательные параметры');
      }

      const styleName = this.views.find(({ id }) => id === view)?.styleName;

      const newCrgLayer: CrgLayer = {
        ...vectorLayerDefaults(),
        id: generateNextLayerId(),
        dataset: dataset?.identifier,
        tableName: vectorTable?.identifier,
        complexName: buildComplexName(workspace, vectorTable?.identifier, crs),
        title,
        nativeCRS: crs,
        minZoom,
        styleName: styleName || this.schema?.styleName || this.schema?.name,
        view
      };

      newCrgLayer.mode = FilePlacementMode.GEOSERVER;
      await createLayer(newCrgLayer, currentProject.id);

      newCrgLayer.mode = FilePlacementMode.FULL;
      this.props.onAdd(newCrgLayer);

      this.clearForm();
      this.close();
    }

    const externalDefaults = externalLayerDefaults(dataSourceUri);

    if (this.valid && layerType === CrgLayerType.RASTER && this.formValue.datasource) {
      const { libraryRecord, file } = this.formValue.datasource;

      try {
        if (!libraryRecord || !file || !library) {
          throw new Error('Не указаны обязательные параметры');
        }

        const record = await getLibraryRecord(library.table_name, libraryRecord.id);
        const { path } = await getFileInfo(file.id);
        const fileTableName = `${record.libraryTableName}_${record.id}__${file.id}`;

        let crgLayer: CrgLayer | undefined;

        const generalCrgLayerProps = {
          title: title || getFileBaseName(file.title),
          tableName: fileTableName,
          libraryId: record.libraryTableName,
          recordId: record.id,
          dataStoreName: workspace,
          complexName: buildComplexName(workspace, fileTableName, crs),
          id: generateNextLayerId(),
          enabled: true,
          nativeCRS: crs,
          mode: FilePlacementMode.GIS
        };

        if (isMidMifFile(file)) {
          crgLayer = {
            ...generalCrgLayerProps,
            type: CrgLayerType.MID,
            styleName: 'generic'
          };
        }

        if (isDxfFile(file)) {
          crgLayer = {
            ...generalCrgLayerProps,
            type: CrgLayerType.DXF,
            styleName: 'dxf_style'
          };
        }

        if (isShpFile(file)) {
          crgLayer = {
            ...generalCrgLayerProps,
            type: CrgLayerType.SHP,
            styleName: 'generic'
          };
        }

        if (isTabFile(file)) {
          crgLayer = {
            ...generalCrgLayerProps,
            type: CrgLayerType.TAB,
            styleName: 'generic'
          };
        }

        if (isTifFile(file)) {
          crgLayer = {
            ...generalCrgLayerProps,
            type: CrgLayerType.RASTER,
            dataSourceUri: `file://${path}`
          };
        }

        if (!crgLayer) {
          throw new Error('Не удалось подключить слой');
        }

        const process = await placeFileWithProjection(file, currentProject.id, crs, FilePlacementMode.GEOSERVER);
        const processResult = await awaitProcess(Number(process._links.process.href.split('/').at(-1)));

        if (processResult && isPlaceFileProcess(processResult.details)) {
          const details = processResult.details;

          crgLayer = {
            ...crgLayer,
            dataset: details.geoserverPublicationData.storeName,
            nativeName: details.geoserverPublicationData.nativeName
          };
        }

        this.props.onAdd(crgLayer);
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

  private calculateTitle: ValueFormula = (value): string => {
    return (
      (value as LayerFormValue)?.title ||
      (value as LayerFormValue)?.datasource?.vectorTable?.title ||
      (value as LayerFormValue)?.datasource?.file?.title ||
      ''
    );
  };
}
