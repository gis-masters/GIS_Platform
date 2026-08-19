import { describe, expect, test } from '@jest/globals';

import { GeometryType } from '../../../geoserver/wfs/wfs.models';
import { type PropertyOption, type PropertySchema, PropertyType } from '../schema.models';
import { appendIncomingGeometryTypeOption, ensureGeometryTypeOption } from './ensureGeometryTypeOption';

const defaultOptions: PropertyOption[] = [
  { title: 'Без геометрии', value: '' },
  { value: GeometryType.POINT, title: 'Точка' },
  { value: GeometryType.MULTI_LINE_STRING, title: 'Линия' },
  { value: GeometryType.MULTI_POLYGON, title: 'Полигон' }
];

const choiceProperty: PropertySchema = {
  name: 'geometryType',
  title: 'Тип геометрии',
  propertyType: PropertyType.CHOICE,
  options: defaultOptions
};

describe('appendIncomingGeometryTypeOption', () => {
  test('не меняет базовый список, если тип уже есть в options', () => {
    expect(appendIncomingGeometryTypeOption(defaultOptions, '')).toBe(defaultOptions);
    expect(appendIncomingGeometryTypeOption(defaultOptions, GeometryType.POINT)).toBe(defaultOptions);
  });

  test('добавляет LineString как Линия (одиночная)', () => {
    expect(appendIncomingGeometryTypeOption(defaultOptions, GeometryType.LINE_STRING)).toEqual([
      ...defaultOptions,
      { value: GeometryType.LINE_STRING, title: 'Линия (одиночная)' }
    ]);
  });

  test('добавляет Polygon как Полигон (одиночный)', () => {
    expect(appendIncomingGeometryTypeOption(defaultOptions, GeometryType.POLYGON)).toEqual([
      ...defaultOptions,
      { value: GeometryType.POLYGON, title: 'Полигон (одиночный)' }
    ]);
  });

  test('добавляет MultiPoint как Мультиточка', () => {
    expect(appendIncomingGeometryTypeOption(defaultOptions, GeometryType.MULTI_POINT)).toEqual([
      ...defaultOptions,
      { value: GeometryType.MULTI_POINT, title: 'Мультиточка' }
    ]);
  });

  test('не добавляет GeometryCollection, LinearRing и Circle', () => {
    expect(appendIncomingGeometryTypeOption(defaultOptions, GeometryType.GEOMETRY_COLLECTION)).toBe(defaultOptions);
    expect(appendIncomingGeometryTypeOption(defaultOptions, GeometryType.LINEAR_RING)).toBe(defaultOptions);
    expect(appendIncomingGeometryTypeOption(defaultOptions, GeometryType.CIRCLE)).toBe(defaultOptions);
  });
});

describe('ensureGeometryTypeOption', () => {
  test('дописывает options, если в данных приехал поддерживаемый тип вне списка', () => {
    expect(ensureGeometryTypeOption({ geometryType: GeometryType.LINE_STRING }, choiceProperty)).toEqual({
      options: [...defaultOptions, { value: GeometryType.LINE_STRING, title: 'Линия (одиночная)' }]
    });
  });

  test('не меняет свойство, если тип уже есть в options', () => {
    expect(ensureGeometryTypeOption({ geometryType: GeometryType.POINT }, choiceProperty)).toEqual({});
  });
});
