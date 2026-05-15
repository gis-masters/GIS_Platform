import { PropertyType, type Schema } from '../schema.models';
import { type OldSchema, ValueType } from '../schemaOld.models';
import { convertOldToNewSchema } from './convertOldToNewSchema';

const oldSchemaWithLegacyFormulas: OldSchema = {
  name: 'with_legacy_formulas',
  tableName: 'with_legacy_formulas',
  title: 'С устаревшими формулами',
  properties: [
    { name: 'STATUS', title: 'Статус', valueType: ValueType.INT },
    { name: 'REG_STATUS', title: 'Значение', valueType: ValueType.STRING }
  ],
  customRuleFunction:
    "return (obj.status == '3' && !obj.reg_status) ? [{attribute: 'reg_status', error: 'Обязательно'}] : []",
  calcFiledFunction: 'if (!obj.status) obj.status = 0; return obj;'
};

const newSchemaWithLegacyFormulas: Schema = {
  name: 'with_legacy_formulas',
  title: 'С устаревшими формулами',
  tableName: 'with_legacy_formulas',
  properties: [
    { name: 'STATUS', title: 'Статус', propertyType: PropertyType.INT },
    { name: 'REG_STATUS', title: 'Значение', propertyType: PropertyType.STRING }
  ],
  customRuleFunction:
    "return (obj.status == '3' && !obj.reg_status) ? [{attribute: 'reg_status', error: 'Обязательно'}] : []",
  calcFiledFunction: 'if (!obj.status) obj.status = 0; return obj;'
};

describe('утилита конвертации схемы из старого формата в новый', () => {
  test('при конвертации схемы не теряются устаревшие формулы', () => {
    expect(convertOldToNewSchema(oldSchemaWithLegacyFormulas)).toStrictEqual(newSchemaWithLegacyFormulas);
  });
});
