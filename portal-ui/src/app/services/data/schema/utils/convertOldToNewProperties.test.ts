import { type PropertySchema, PropertyType } from '../schema.models';
import { type OldPropertySchema, ValueType } from '../schemaOld.models';
import { convertOldToNewProperties } from './convertOldToNewProperties';

describe('утилита конвертации свойств схемы из старого формата в новый', () => {
  test('если в свойстве старой схемы не содержится "asTitle", то в новой схеме оно тоже не будет содержаться', () => {
    const oldProperty: OldPropertySchema = {
      name: 'title',
      title: 'Наименование',
      valueType: ValueType.STRING
    };
    const newProperty: PropertySchema = {
      name: 'title',
      title: 'Наименование',
      propertyType: PropertyType.STRING
    };

    expect(convertOldToNewProperties([oldProperty])).toStrictEqual([newProperty]);
  });

  test('если displayMode не указан то он не появится после конвертации', () => {
    const newProperties = convertOldToNewProperties([
      {
        name: 'urlField',
        title: 'поле url',
        valueType: ValueType.URL
      }
    ]);

    expect(newProperties).toStrictEqual([
      {
        name: 'urlField',
        title: 'поле url',
        propertyType: 'url'
      }
    ]);
  });

  test('если openIn: in_popup то он то он конвертируется в displayMode и принимает значение popup', () => {
    const newProperties = convertOldToNewProperties([
      {
        name: 'urlField',
        title: 'поле url',
        displayMode: 'in_popup',
        valueType: ValueType.URL
      }
    ]);
    expect(newProperties).toStrictEqual([
      {
        name: 'urlField',
        title: 'поле url',
        openIn: 'popup',
        propertyType: 'url'
      }
    ]);
  });

  test('если openIn: newTab то он то он конвертируется в displayMode и принимает значение newTab', () => {
    const newProperties = convertOldToNewProperties([
      {
        name: 'urlField',
        title: 'поле url',
        displayMode: 'newTab',
        valueType: ValueType.URL
      }
    ]);
    expect(newProperties).toStrictEqual([
      {
        name: 'urlField',
        title: 'поле url',
        openIn: 'newTab',
        propertyType: 'url'
      }
    ]);
  });
});
