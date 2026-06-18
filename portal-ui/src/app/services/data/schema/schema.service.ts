import { boundMethod } from 'autobind-decorator';
import { debounce, type DebouncedFunc } from 'lodash';

import { Toast } from '../../../components/Toast/Toast';
import { communicationService } from '../../communication.service';
import { type ImportLayerItem } from '../../geoserver/import/import.models';
import { type CrgVectorLayer } from '../../gis/layers/layers.models';
import { getLayerSchema } from '../../gis/layers/layers.service';
import { FeatureUtil } from '../../util/FeatureUtil';
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

  private schemas: { [key: string]: Promise<OldSchema> } = {};
  private schemasResolvers: { [key: string]: (value: OldSchema | PromiseLike<OldSchema>) => void } = {};
  private schemasRejecters: { [key: string]: (reason?: unknown) => void } = {};
  private fetchingPool: string[] = [];
  private fetchingAllSchemas?: Promise<void>;
  private fetchingNow = 0;
  private readonly debouncedFetch: DebouncedFunc<(fetchAll?: boolean) => Promise<void>>;

  private readonly schemaWarningValidators: SchemaValidator[] = [printTemplatesExist];

  private constructor() {
    // fetch запускается из таймера debounce вне контекста вызывающего кода,
    // поэтому его ошибку гасим здесь: ожидающим она уже доставлена через reject()
    // в checkForsakenResolvers, а необработанный reject таймера дал бы глобальную ошибку.
    this.debouncedFetch = debounce(async (fetchAll?: boolean) => {
      try {
        await this.fetch(fetchAll);
      } catch {
        // ошибка доставлена ожидающим промисам в checkForsakenResolvers
      }
    }, 20);
  }

  @boundMethod
  async getOldSchema(name: string): Promise<OldSchema> {
    if (!this.schemas[name]) {
      const schemaPromise = new Promise<OldSchema>((resolve, reject) => {
        this.schemasResolvers[name] = resolve;
        this.schemasRejecters[name] = reject;
      });
      this.schemas[name] = schemaPromise;
      this.fetchingPool.push(name);
      // debounce возвращает управление до реального fetch, поэтому отклонять схему здесь нельзя.
      // Резолв/реджект придёт из fetch -> checkForsakenResolvers после ответа сервера.
      void this.debouncedFetch();

      return schemaPromise;
    }

    return this.schemas[name];
  }

  @boundMethod
  async getSchema(name: string): Promise<Schema> {
    return convertOldToNewSchema(await this.getOldSchema(name));
  }

  async getAllOldSchemas(): Promise<OldSchema[]> {
    if (!this.fetchingAllSchemas) {
      this.fetchingAllSchemas = this.fetch(true);
    }

    await this.fetchingAllSchemas;

    return Promise.all(Object.values(this.schemas));
  }

  async fetchAndCacheTablesSchemas(tableIdentifiers: string[]): Promise<void> {
    const schemas = await schemaClient.getTableSchemas(tableIdentifiers);
    schemas.forEach((schemaDto, identifier) => {
      tablesSchemasCache.add(identifier, Promise.resolve(convertOldToNewSchema(schemaDto)));
    });
  }

  async getAllSchemas(): Promise<Schema[]> {
    const oldSchemas = await this.getAllOldSchemas();

    return oldSchemas.map(convertOldToNewSchema);
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

    const schemas = await this.getAllOldSchemas();

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

  private async fetch(fetchAll?: boolean): Promise<void> {
    this.fetchingNow++;
    const payload = fetchAll ? [] : this.fetchingPool.splice(0);
    const response = await schemaClient.getSchema(payload);

    if (!response) {
      const fetchError = new Error(`Getting schemas ${JSON.stringify(payload)} error`);
      this.fetchingNow--;
      this.checkForsakenResolvers(fetchError);
      throw fetchError;
    }

    response.forEach(schema => {
      if (!schema) {
        Toast.error('Возникла ошибка при загрузке схемы');

        return;
      }

      const { name } = schema;
      if (this.schemasResolvers[name]) {
        this.schemasResolvers[name](schema);
        delete this.schemasResolvers[name];
        delete this.schemasRejecters[name];
      } else if (!this.schemas[name]) {
        this.schemas[name] = Promise.resolve(schema);
      }
    });

    this.fetchingNow--;
    this.checkForsakenResolvers();
  }

  private rejectForsakenSchema(schemaName: string, error: Error): void {
    const reject = this.schemasRejecters[schemaName];
    if (!reject) {
      return;
    }

    reject(error);
    delete this.schemas[schemaName];
    delete this.schemasResolvers[schemaName];
    delete this.schemasRejecters[schemaName];
  }

  private checkForsakenResolvers(fetchError?: Error) {
    if (!this.fetchingPool.length && !this.fetchingNow) {
      for (const [schemaName] of Object.entries(this.schemasRejecters)) {
        this.rejectForsakenSchema(schemaName, fetchError ?? new Error('Не найдена схема ' + schemaName));
      }
    }
  }

  async createSchema(schema: Schema) {
    this.schemas = {};
    this.fetchingAllSchemas = undefined;
    await schemaClient.createSchema(convertNewToOldSchema(schema));
    communicationService.schemaUpdated.emit({ type: 'create', data: schema });
  }

  async updateSchema(schema: Schema) {
    this.schemas = {};
    this.fetchingAllSchemas = undefined;
    await schemaClient.updateSchema(convertNewToOldSchema(schema));
    communicationService.schemaUpdated.emit({ type: 'update', data: schema });
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
