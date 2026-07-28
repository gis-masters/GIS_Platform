import { communicationService } from '../../communication.service';
import { type ImportLayerItem } from '../../geoserver/import/import.models';
import { type CrgVectorLayer } from '../../gis/layers/layers.models';
import { getLayerSchema } from '../../gis/layers/layers.service';
import { FeatureUtil } from '../../util/FeatureUtil';
import { schemaTemplateService } from '../schemaTemplate/schemaTemplate.service';
import { type BugObject } from '../validation/validation.models';
import { schemaClient } from './schema.client';
import { type PropertySchemaChoice, PropertyType, type Schema, type SchemaValidator } from './schema.models';
import { type OldPropertySchema, type OldSchema } from './schemaOld.models';
import { tablesSchemasCache } from './tablesSchemasCache';
import { convertNewToOldSchema } from './utils/convertNewToOldSchema';
import { convertOldToNewSchema } from './utils/convertOldToNewSchema';
import { printTemplatesExist } from './validators/printTemplatesExist';

class SchemaService {
  private static _instance: SchemaService;
  static get instance() {
    return this._instance || (this._instance = new this());
  }

  private readonly schemaWarningValidators: SchemaValidator[] = [printTemplatesExist];

  async fetchAndCacheTablesSchemas(tableIdentifiers: string[]): Promise<void> {
    const schemas = await schemaClient.getTableSchemas(tableIdentifiers);
    schemas.forEach((schemaDto, identifier) => {
      tablesSchemasCache.add(identifier, Promise.resolve(convertOldToNewSchema(schemaDto)));
    });
  }

  async getSchemaAtUrl(url: string): Promise<Schema> {
    return convertOldToNewSchema(await schemaClient.getSchemaAtUrl(url));
  }

  /**
   * @deprecated legacy, do not use
   */
  private async getBySimilarId(schemaId: string): Promise<OldSchema | undefined> {
    if (!schemaId) {
      return;
    }

    const templates = await schemaTemplateService.getSchemaTemplatesWithOldSchema();
    const schemas = templates.map(template => template.classRule);

    return (
      schemas.find(schema => schema.name.toLowerCase() === schemaId.toLowerCase()) ||
      schemas.find(schema => schema.name.toLowerCase().includes(schemaId.toLowerCase()))
    );
  }

  /**
   * @deprecated legacy, do not use
   * Возвращает, наиболее подходящую для слоя, схему.
   * Метод опирается на название и геометрию слоя.
   * @param layer Слой
   */
  async getSchemaByLayer(layer: ImportLayerItem): Promise<OldSchema | undefined> {
    const layerName = layer.originalName.toLowerCase();
    let layerNameWithGeomType: string;

    const geometryName = FeatureUtil.getLayerGeometry(layer);
    if (geometryName?.includes('MultiLineString')) {
      if (!layerName.includes('_line')) {
        layerNameWithGeomType = layerName + '_line';
      }
    } else if (geometryName?.includes('Point') && !layerName.includes('_point')) {
      layerNameWithGeomType = layerName + '_point';
    }

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment -- legacy
    // @ts-ignore
    return (await this.getBySimilarId(layerNameWithGeomType)) || (await this.getBySimilarId(layerName));
  }

  /**
   * @deprecated костыль, do not use
   */
  async getClassIdAlias(layer: CrgVectorLayer, bugObject: BugObject): Promise<string> {
    const schema = await getLayerSchema(layer);

    if (!schema) {
      return '';
    }

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment -- legacy
    // @ts-ignore
    return (
      schema.properties
        .filter(simpleProperty => simpleProperty.propertyType === PropertyType.CHOICE && simpleProperty.options)
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment -- legacy
        // @ts-ignore
        .reduce<string>((val: string, simpleProperty: PropertySchemaChoice) => {
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment -- legacy
          // @ts-ignore
          return simpleProperty.options.reduce<string>((title: string, item) => {
            return String(bugObject.classId) === item.value ? item.title : title;
          }, val);
        }, '')
    );
  }

  /**
   * @deprecated legacy, do not use
   * По наименованию фичи, попытаемся найти алиас в ее свойствах.
   * Если алиас найти не удалось просто вернем код.
   * @param layer Наименование фичи
   * @param propertyName код свойства
   */
  async getPropertyAlias(layer: CrgVectorLayer, propertyName: string): Promise<string> {
    const schema = await getLayerSchema(layer);

    if (schema) {
      const property = schema.properties.find(prop => prop.name.toLowerCase() === propertyName.toLowerCase());
      if (property) {
        return property.title;
      }
    }

    return propertyName;
  }

  /**
   * Ищем свойство, среди тех что есть в схеме.
   *
   * @param key Наименование свойства, полученное из "фичи" геосервера
   * @param propertySchemas Свойства полученные из схемы.
   */
  getPropertySchemaByName(key: string, propertySchemas: OldPropertySchema[]) {
    return propertySchemas.find(({ name }) => name.toLowerCase() === key.toLowerCase());
  }

  /**
   * @deprecated legacy, do not use
   * По присланному с сервера типу ошибки сформируем его короткое и неточное описание, выводимое пользователю,
   * в выпадающем списке в таблице с ошибками.
   * @param errorTypes Тип ошибки
   */
  getErrorsDescription(errorTypes: string[]): string[] {
    return errorTypes.map(error => {
      if (error === 'enumeration') {
        return 'Значение не соответствует справочному';
      } else if (error.toLowerCase().includes('notDoubleType'.toLowerCase())) {
        return 'Значение не является дробным числом';
      } else if (error.toLowerCase().includes('notLongType'.toLowerCase())) {
        return 'Значение не является целым числом';
      } else if (error.toLowerCase().includes('maxInclusive'.toLowerCase())) {
        return 'Значение превышает допустимый максимум';
      } else if (error.toLowerCase().includes('maxLength'.toLowerCase())) {
        return 'Строка превышает допустимую длину';
      } else if (error.toLowerCase().includes('minInclusive'.toLowerCase())) {
        return 'Значение менее допустимого';
      } else if (error.toLowerCase().includes('minLength'.toLowerCase())) {
        return 'Строка слишком короткая';
      } else if (error.toLowerCase().includes('pattern'.toLowerCase())) {
        return 'Строка не соответствует паттерну';
      } else if (error.toLowerCase().includes('required'.toLowerCase())) {
        return 'Параметр обязателен к заполнению';
      } else if (error.toLowerCase().includes('totalDigits'.toLowerCase())) {
        return 'Превышено допустимое кол-в знаков';
      }

      return error;
    });
  }

  async createSchema(schema: Schema) {
    schemaTemplateService.clearCache();
    await schemaClient.createSchema(convertNewToOldSchema(schema));
    communicationService.schemaUpdated.emit({ type: 'create', data: schema });
  }

  async updateSchema(schema: Schema) {
    schemaTemplateService.clearCache();
    await schemaClient.updateSchema(convertNewToOldSchema(schema));
    communicationService.schemaUpdated.emit({ type: 'update', data: schema });
  }

  async deleteSchema(schema: Schema) {
    schemaTemplateService.clearCache();
    await schemaClient.deleteSchema(schema.name);
    communicationService.schemaUpdated.emit({ type: 'delete', data: schema });
  }

  async getSchemaWarnings(schema: Schema): Promise<string[]> {
    const warnings: string[] = [];

    for (const validator of this.schemaWarningValidators) {
      const lines = await validator(schema);
      for (const line of lines) {
        warnings.push(line);
      }
    }

    return warnings;
  }
}

export const schemaService = SchemaService.instance;
