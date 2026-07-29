jest.mock('@mui/material', () => ({
  ListItemIcon: 'ListItemIcon',
  Tooltip: 'Tooltip'
}));

jest.mock('@mui/icons-material', () => ({
  FilterAltOutlined: 'FilterAltOutlined'
}));

jest.mock('../SelectVectorTableControl/SelectVectorTableControl', () => ({
  SelectVectorTableControl: 'SelectVectorTableControl'
}));

jest.mock('../SelectFileInLibraryRecordControl/SelectFileInLibraryRecordControl', () => ({
  SelectFileInLibraryRecordControl: 'SelectFileInLibraryRecordControl'
}));

jest.mock('../SelectProjectionControl/SelectProjectionControl', () => ({
  SelectProjectionControl: 'SelectProjectionControl'
}));

jest.mock('./MinZoomDescription/AddLayerDialog-MinZoomDescription', () => ({
  AddLayerDialogMinZoomDescription: 'AddLayerDialogMinZoomDescription'
}));

jest.mock('../../stores/Projections.store', () => ({
  projectionsStore: { defaultProjection: undefined }
}));

import { describe, expect, jest, test } from '@jest/globals';

import {
  type PropertySchema,
  type PropertySchemaChoice,
  type PropertySchemaCustom,
  type PropertySchemaString,
  PropertyType,
  type Schema
} from '../../services/data/schema/schema.models';
import { type VectorTable } from '../../services/data/vectorData/vectorData.models';
import { CrgLayerType } from '../../services/gis/layers/layers.models';
import { computeDynamicProperties } from '../Form/Form.utils';
import { SelectFileInLibraryRecordControl } from '../SelectFileInLibraryRecordControl/SelectFileInLibraryRecordControl';
import { SelectVectorTableControl } from '../SelectVectorTableControl/SelectVectorTableControl';
import { type LayerFormValue } from './AddLayerDialog.models';
import { buildFields, calculateNspdTitle, calculateTitle, validateLayer } from './AddLayerDialog.utils';

function getField(fields: PropertySchema[], name: string): PropertySchema | undefined {
  return fields.find(field => field.name === name);
}

function getFieldNames(fields: PropertySchema[]): string[] {
  return fields.map(field => field.name).filter(Boolean);
}

function getChoiceField(fields: PropertySchema[], name: string): PropertySchemaChoice | undefined {
  const field = getField(fields, name);

  return field?.propertyType === PropertyType.CHOICE ? field : undefined;
}

function getCustomField(fields: PropertySchema[], name: string): PropertySchemaCustom | undefined {
  const field = getField(fields, name);

  return field?.propertyType === PropertyType.CUSTOM ? field : undefined;
}

function getStringField(fields: PropertySchema[], name: string): PropertySchemaString | undefined {
  const field = getField(fields, name);

  return field?.propertyType === PropertyType.STRING ? field : undefined;
}

const schemaWithoutViews: Schema = {
  name: 'test',
  title: 'Test Schema',
  properties: []
};

const schemaWithViews: Schema = {
  ...schemaWithoutViews,
  views: [{ id: 'view1', type: 'default', title: 'View 1', properties: [] }]
};

const vectorTableWithSchema = (schema: Schema): VectorTable => ({ schema }) as VectorTable;

describe('buildFields', () => {
  describe('векторная ветка', () => {
    test('для пустого formValue возвращает 6 полей векторной формы', () => {
      const fields = buildFields({});

      expect(getFieldNames(fields)).toEqual(['layerType', 'title', 'minZoom', 'datasource', 'projection', 'view']);
    });

    test('для layerType vector возвращает тот же набор полей', () => {
      const fields = buildFields({ layerType: CrgLayerType.VECTOR });

      expect(getFieldNames(fields)).toEqual(['layerType', 'title', 'minZoom', 'datasource', 'projection', 'view']);
    });

    test('скрывает поле view без datasource', () => {
      const viewField = getChoiceField(buildFields({}), 'view');

      expect(viewField?.hidden).toBe(true);
      expect(viewField?.options).toEqual([]);
    });

    test('скрывает поле view если у schema нет дополнительных представлений', () => {
      const formValue: Partial<LayerFormValue> = {
        layerType: CrgLayerType.VECTOR,
        datasource: { vectorTable: vectorTableWithSchema(schemaWithoutViews) }
      };

      const viewField = getChoiceField(buildFields(formValue), 'view');

      expect(viewField?.hidden).toBe(true);
      expect(viewField?.options).toEqual([{ title: 'Test Schema (по-умолчанию)', value: '' }]);
    });

    test('показывает поле view если у schema есть представления', () => {
      const formValue: Partial<LayerFormValue> = {
        layerType: CrgLayerType.VECTOR,
        datasource: { vectorTable: vectorTableWithSchema(schemaWithViews) }
      };

      const viewField = getChoiceField(buildFields(formValue), 'view');

      expect(viewField?.hidden).toBe(false);
      expect(viewField?.options).toEqual([
        { title: 'Test Schema (по-умолчанию)', value: '' },
        { title: 'View 1', value: 'view1', endIcon: undefined }
      ]);
    });

    test('настраивает поле datasource для векторного слоя', () => {
      const datasourceField = getCustomField(buildFields({}), 'datasource');

      expect(datasourceField?.title).toBe('Источник данных');
      expect(datasourceField?.ControlComponent).toBe(SelectVectorTableControl);
      expect(datasourceField?.validationFormula).toBe(validateLayer);
    });

    test('настраивает поле title с calculatedValueFormula', () => {
      const titleField = getField(buildFields({}), 'title');

      expect(titleField?.required).toBe(true);
      expect(titleField?.calculatedValueFormula).toBe(calculateTitle);
    });
  });

  describe('растровая ветка', () => {
    test('для layerType raster возвращает 5 полей без view', () => {
      const fields = buildFields({ layerType: CrgLayerType.RASTER });

      expect(getFieldNames(fields)).toEqual(['layerType', 'title', 'minZoom', 'datasource', 'projection']);
    });

    test('настраивает поле datasource для растрового слоя', () => {
      const datasourceField = getCustomField(buildFields({ layerType: CrgLayerType.RASTER }), 'datasource');

      expect(datasourceField?.title).toBe('Документ');
      expect(datasourceField?.ControlComponent).toBe(SelectFileInLibraryRecordControl);
      expect(datasourceField?.validationFormula).toBe(validateLayer);
    });
  });

  describe('внешний слой', () => {
    test('для layerType external возвращает поля внешнего слоя', () => {
      const fields = buildFields({ layerType: CrgLayerType.EXTERNAL });

      expect(getFieldNames(fields)).toEqual([
        'layerType',
        'title',
        'resourceId',
        'minZoom',
        'dataSourceUri',
        'errorText'
      ]);
    });

    test('не добавляет calculatedValueFormula для title', () => {
      const titleField = getField(buildFields({ layerType: CrgLayerType.EXTERNAL }), 'title');

      expect(titleField?.required).toBe(true);
      expect(titleField?.calculatedValueFormula).toBeUndefined();
    });

    test('делает resourceId и dataSourceUri обязательными', () => {
      const fields = buildFields({ layerType: CrgLayerType.EXTERNAL });

      expect(getField(fields, 'resourceId')?.required).toBe(true);
      expect(getField(fields, 'dataSourceUri')?.required).toBe(true);
      expect(getStringField(fields, 'dataSourceUri')?.wellKnownRegex).toBe('url');
    });
  });

  describe('слой НСПД', () => {
    test('для layerType external_nspd возвращает поля формы НСПД', () => {
      const fields = buildFields({ layerType: CrgLayerType.EXTERNAL_NSPD });

      expect(getFieldNames(fields)).toEqual(['layerType', 'nspdLayer', 'title', 'minZoom']);
    });

    test('делает nspdLayer обязательным', () => {
      const nspdLayerField = getChoiceField(buildFields({ layerType: CrgLayerType.EXTERNAL_NSPD }), 'nspdLayer');

      expect(nspdLayerField?.required).toBe(true);
      expect(nspdLayerField?.options).toHaveLength(17);
    });

    test('скрывает поле title без выбранного nspdLayer', () => {
      const fields = buildFields({ layerType: CrgLayerType.EXTERNAL_NSPD });
      const titleField = computeDynamicProperties({}, { properties: fields }).properties.find(
        field => field.name === 'title'
      );

      expect(titleField?.hidden).toBe(true);
    });

    test('показывает поле title после выбора nspdLayer', () => {
      const formValue: Partial<LayerFormValue> = {
        layerType: CrgLayerType.EXTERNAL_NSPD,
        nspdLayer: 'nspd_land_parcels'
      };
      const fields = buildFields(formValue);
      const titleField = computeDynamicProperties(formValue, { properties: fields }).properties.find(
        field => field.name === 'title'
      );

      expect(titleField?.hidden).toBe(false);
    });

    test('настраивает поле title с calculatedValueFormula', () => {
      const titleField = getField(buildFields({ layerType: CrgLayerType.EXTERNAL_NSPD }), 'title');

      expect(titleField?.required).toBe(true);
      expect(titleField?.calculatedValueFormula).toBe(calculateNspdTitle);
    });
  });

  test('бросает ошибку для неизвестного типа слоя', () => {
    expect(() => buildFields({ layerType: 'unknown' })).toThrow('Неизвестный тип слоя');
  });
});
