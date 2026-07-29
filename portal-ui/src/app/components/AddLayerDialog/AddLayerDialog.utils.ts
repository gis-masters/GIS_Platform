import { createElement } from 'react';
import { ListItemIcon, Tooltip } from '@mui/material';
import { FilterAltOutlined } from '@mui/icons-material';

import { type FileInfo } from '../../services/data/files/files.models';
import { isDxfFile, isMidMifFile, isShpFile, isTabFile, isTifFile } from '../../services/data/files/files.util';
import {
  type PropertyOption,
  type PropertySchema,
  PropertyType,
  type Schema,
  type ValueFormula
} from '../../services/data/schema/schema.models';
import { type CrgLayer, CrgLayerType } from '../../services/gis/layers/layers.models';
import { getNspdKnownLayer, nspdKnownLayers } from '../../services/nspd/feature-info/nspd-feature-info.models';
import { type FieldValidator } from '../../services/util/form/formValidation.utils';
import { projectionsStore } from '../../stores/Projections.store';
import { SelectFileInLibraryRecordControl } from '../SelectFileInLibraryRecordControl/SelectFileInLibraryRecordControl';
import { SelectProjectionControl } from '../SelectProjectionControl/SelectProjectionControl';
import { SelectVectorTableControl } from '../SelectVectorTableControl/SelectVectorTableControl';
import { type LayerFormValue, layerTypeOptions } from './AddLayerDialog.models';
import { AddLayerDialogMinZoomDescription } from './MinZoomDescription/AddLayerDialog-MinZoomDescription';

export const validateLayer: FieldValidator = value => {
  if (!value) {
    return ['Некорректное значение'];
  }
};

export const minZoomTitle = 'Уровень масштабной детализации';

export const calculateTitle: ValueFormula = (value): string => {
  return (
    (value as LayerFormValue)?.title ||
    (value as LayerFormValue)?.datasource?.vectorTable?.title ||
    (value as LayerFormValue)?.datasource?.file?.title ||
    ''
  );
};

export const calculateNspdTitle: ValueFormula = (value): string => {
  const formValue = value as LayerFormValue;

  return formValue?.title || getNspdKnownLayer(formValue?.nspdLayer)?.title || '';
};

export function getViewChoiceOptions(schema: Schema): PropertyOption[] {
  const views = schema.views || [];

  return [
    { title: `${schema.title} (по-умолчанию)`, value: '' },
    ...(views.map(type => ({
      title: type.title || '',
      value: type.id,
      endIcon: type.definitionQuery
        ? createElement(Tooltip, {
            title: createElement(
              'span',
              {},
              'Для этого представления задан определяющий запрос (Definition Query). Будут отображены только объекты, удовлетворяющие условию запроса:',
              createElement('br'),
              createElement('code', { children: type.definitionQuery })
            ),
            children: createElement(ListItemIcon, {}, createElement(FilterAltOutlined, { fontSize: 'small' }))
          })
        : undefined
    })) || [])
  ];
}

const layerTypeField: PropertySchema = {
  name: 'layerType',
  title: 'Тип слоя',
  required: true,
  display: 'buttongroup',
  defaultValue: 'vector',
  options: layerTypeOptions,
  propertyType: PropertyType.CHOICE
};

const minZoomField: PropertySchema = {
  name: 'minZoom',
  title: minZoomTitle,
  propertyType: PropertyType.FLOAT,
  display: 'slider',
  description: createElement(AddLayerDialogMinZoomDescription),
  defaultValue: 10,
  step: 1,
  minValue: 0,
  maxValue: 25
};

const projectionField: PropertySchema = {
  propertyType: PropertyType.CUSTOM,
  name: 'projection',
  title: 'Система координат',
  defaultValue: projectionsStore.defaultProjection,
  ControlComponent: SelectProjectionControl
};

const vectorDatasourceField: PropertySchema = {
  propertyType: PropertyType.CUSTOM,
  name: 'datasource',
  title: 'Источник данных',
  defaultValue: true,
  ControlComponent: SelectVectorTableControl,
  validationFormula: validateLayer
};

const rasterDatasourceField: PropertySchema = {
  propertyType: PropertyType.CUSTOM,
  name: 'datasource',
  title: 'Документ',
  defaultValue: true,
  ControlComponent: SelectFileInLibraryRecordControl,
  validationFormula: validateLayer
};

function createTitleField(withCalculatedFormula: boolean): PropertySchema {
  return {
    name: 'title',
    title: 'Имя слоя',
    required: true,
    minLength: 2,
    ...(withCalculatedFormula ? { calculatedValueFormula: calculateTitle } : {}),
    propertyType: PropertyType.STRING
  };
}

function createViewField(formValue: Partial<LayerFormValue>, options: PropertyOption[]): PropertySchema {
  return {
    name: 'view',
    title: 'Представление',
    hidden: !formValue?.datasource || options.length <= 1,
    options,
    defaultValue: '',
    propertyType: PropertyType.CHOICE
  };
}

function buildVectorFields(formValue: Partial<LayerFormValue>): PropertySchema[] {
  const schema = formValue?.datasource?.vectorTable?.schema;
  const options = schema ? getViewChoiceOptions(schema) : [];

  return [
    layerTypeField,
    createTitleField(true),
    minZoomField,
    vectorDatasourceField,
    projectionField,
    createViewField(formValue, options)
  ];
}

function buildRasterFields(): PropertySchema[] {
  return [layerTypeField, createTitleField(true), minZoomField, rasterDatasourceField, projectionField];
}

function buildExternalFields(): PropertySchema[] {
  return [
    layerTypeField,
    createTitleField(false),
    {
      name: 'resourceId',
      title: 'Системное название слоя',
      required: true,
      propertyType: PropertyType.STRING
    },
    minZoomField,
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

function buildNspdFields(): PropertySchema[] {
  return [
    layerTypeField,
    {
      name: 'nspdLayer',
      title: 'Слой НСПД',
      required: true,
      options: nspdKnownLayers.map(({ title, resourceId }) => ({ title, value: resourceId })),
      propertyType: PropertyType.CHOICE
    },
    {
      name: 'title',
      title: 'Имя слоя',
      required: true,
      minLength: 2,
      calculatedValueFormula: calculateNspdTitle,
      dynamicPropertyFormula: (obj: unknown) => ({ hidden: !(obj as LayerFormValue)?.nspdLayer }),
      propertyType: PropertyType.STRING
    },
    minZoomField
  ];
}

export function buildFields(formValue: Partial<LayerFormValue>): PropertySchema[] {
  const layerType = formValue?.layerType;

  if (!layerType || layerType === CrgLayerType.VECTOR) {
    return buildVectorFields(formValue);
  }
  if (layerType === CrgLayerType.RASTER) {
    return buildRasterFields();
  }
  if (layerType === CrgLayerType.EXTERNAL) {
    return buildExternalFields();
  }
  if (layerType === CrgLayerType.EXTERNAL_NSPD) {
    return buildNspdFields();
  }

  throw new Error('Неизвестный тип слоя');
}

export function buildFileCrgLayer(
  file: FileInfo,
  path: string,
  generalCrgLayerProps: Omit<CrgLayer, 'type' | 'styleName' | 'dataSourceUri'>
): CrgLayer | undefined {
  if (isMidMifFile(file)) {
    return { ...generalCrgLayerProps, type: CrgLayerType.MID, styleName: 'generic' };
  }

  if (isDxfFile(file)) {
    return { ...generalCrgLayerProps, type: CrgLayerType.DXF, styleName: 'dxf_style' };
  }

  if (isShpFile(file)) {
    return { ...generalCrgLayerProps, type: CrgLayerType.SHP, styleName: 'generic' };
  }

  if (isTabFile(file)) {
    return { ...generalCrgLayerProps, type: CrgLayerType.TAB, styleName: 'generic' };
  }

  if (isTifFile(file)) {
    return {
      ...generalCrgLayerProps,
      type: CrgLayerType.RASTER,
      dataSourceUri: `file://${path}`
    };
  }
}
