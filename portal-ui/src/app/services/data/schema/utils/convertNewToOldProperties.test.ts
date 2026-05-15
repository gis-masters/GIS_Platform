import { PropertyType } from '../schema.models';
import { convertNewToOldProperties } from './convertNewToOldProperties';

describe('утилита конвертации свойств схемы из нового формата в старый', () => {
  test('если openIn не указан то он конвертируется в displayMode и принимает значение undefined', () => {
    const newProperties = convertNewToOldProperties([
      {
        name: 'urlField',
        title: 'поле url',
        propertyType: PropertyType.URL
      }
    ]);
    expect(newProperties).toStrictEqual([
      {
        name: 'urlField',
        title: 'поле url',
        valueType: 'URL',
        displayMode: undefined
      }
    ]);
  });

  test('если openIn: popup то он то он конвертируется в displayMode и принимает значение in_popup', () => {
    const newProperties = convertNewToOldProperties([
      {
        name: 'urlField',
        title: 'поле url',
        openIn: 'popup',
        propertyType: PropertyType.URL
      }
    ]);
    expect(newProperties).toStrictEqual([
      {
        name: 'urlField',
        title: 'поле url',
        valueType: 'URL',
        displayMode: 'in_popup'
      }
    ]);
  });

  test('если openIn: newTab то он то он конвертируется в displayMode и принимает значение newTab', () => {
    const newProperties = convertNewToOldProperties([
      {
        name: 'urlField',
        title: 'поле url',
        openIn: 'newTab',
        propertyType: PropertyType.URL
      }
    ]);
    expect(newProperties).toStrictEqual([
      {
        name: 'urlField',
        title: 'поле url',
        valueType: 'URL',
        displayMode: 'newTab'
      }
    ]);
  });
});
