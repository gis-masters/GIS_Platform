import { debounce, Cancelable } from 'lodash';
import { boundMethod } from 'autobind-decorator';

import { serverProperties } from '../server-properties.service';
import { FeatureUtil } from '../util/FeatureUtil';
import { getEmptyGeometry } from '../geoserver/wfs.service';
import { WfsFeature, CoordinateEdited, SupportedGeometryType } from '../geoserver/wfs-models';
import { ImportLayerItem } from '../geoserver/import/models';
import { BugObject } from './validation.service';
import { CrgLayer } from '../crg/projects.models';
import { services } from '../services';
import { currentProject } from '../../stores/CurrentProject.store';

export interface FeatureDescription {
  name: string;
  title: string;
  description: string;
  properties: PropertySchema[];
  tableName: string;
  geometryType: SupportedGeometryType;
  customRuleFunction?: any;
  matchingCounter?: number;
  calcFiledFunction?: string;
  readOnly?: boolean;
}

export type PropertyEnumerations = { value: string; title: string }[];

export interface PropertySchema {
  name: string;
  title: string;
  description?: string;

  required?: boolean;
  mustBeEmpty?: boolean;
  hidden?: boolean;
  isMultiple?: boolean;

  objectIdentityOnUi?: boolean;

  updateability?: Updateability;
  choice?: any;
  valueType?: any;
  foreignKeyType?: string;

  length?: number;
  minLength?: number;
  maxLength?: number;
  pattern?: string;
  patternDescription?: string;
  minInclusive?: number;
  maxInclusive?: number;
  totalDigits?: number;
  fractionDigits?: number;
  allowedValues?: string[];
  enumerations?: PropertyEnumerations;
  dateFormat?: string;
  displayMode?: 'in_popup';
}

export enum Updateability {
  CREATE_ONLY = 'CREATE_ONLY',
  CREATE_WRITE = 'CREATE_WRITE',
  READ_ONLY = 'READ_ONLY'
}

export enum FieldType {
  URL = 'url'
}

export interface EditFeatureItem {
  name: string;
  value: string;
  property: PropertySchema;
  isFgistpProperty: boolean;
}

class SchemaService {
  private static _instance: SchemaService;
  private schemas: { [key: string]: Promise<FeatureDescription> } = {};
  private schemasResolvers: { [key: string]: (value?: FeatureDescription) => void } = {};
  private schemasRejecters: { [key: string]: () => void } = {};
  private fetchingPool: string[] = [];
  private fetchingAllSchemas?: Promise<void>;
  private fetchingNow = 0;
  private readonly debouncedFetch: ((fetchAll?: boolean) => Promise<void>) & Cancelable;

  private constructor() {
    this.debouncedFetch = debounce(this.fetch, 20);
  }

  static get instance() {
    return this._instance || (this._instance = new this());
  }

  @boundMethod
  async getSchema(name: string): Promise<FeatureDescription> {
    if (!this.schemas[name]) {
      this.schemas[name] = new Promise((resolve, reject) => {
        this.schemasResolvers[name] = resolve;
        this.schemasRejecters[name] = reject;
      });
      this.fetchingPool.push(name);
      await this.debouncedFetch();
    }

    return this.schemas[name];
  }

  async getCurrentProjectSchemas(): Promise<FeatureDescription[]> {
    const names = currentProject.vectorLayers.map(layer => layer.schemaId);

    return Promise.all(names.map(this.getSchema));
  }

  async getAllSchemas(): Promise<FeatureDescription[]> {
    if (!this.fetchingAllSchemas) {
      this.fetchingAllSchemas = this.fetch(true);
    }

    await this.fetchingAllSchemas;

    return Promise.all(Object.values(this.schemas));
  }

  /**
   * Возвращает описание фичи.
   * @param layerName Название слоя
   */
  async getSchemaByLayerName(layerName: string, global?: boolean): Promise<FeatureDescription | undefined> {
    if (!layerName) {
      return;
    }

    const schemas = global ? await this.getAllSchemas() : await this.getCurrentProjectSchemas();

    return (
      schemas.find(schema => schema.name.toLowerCase() === layerName.toLowerCase()) ||
      schemas.find(schema => schema.name.toLowerCase().includes(layerName.toLowerCase()))
    );
  }

  /**
   * Возвращает, наиболее подходящую для слоя, схему.
   * Метод опирается на название и геометрию слоя.
   * @param layer Слой
   */
  async getSchemaByLayer(layer: ImportLayerItem): Promise<FeatureDescription | undefined> {
    const layerName = layer.originalName.toLowerCase();
    let layerNameWithGeomType: string;

    const geometryName = FeatureUtil.getLayerGeometry(layer);
    if (geometryName.includes('MultiLineString')) {
      if (!layerName.includes('_line')) {
        layerNameWithGeomType = layerName + '_line';
      }
    } else if (geometryName.includes('Point')) {
      if (!layerName.includes('_point')) {
        layerNameWithGeomType = layerName + '_point';
      }
    }

    return (
      (await this.getSchemaByLayerName(layerNameWithGeomType, true)) ||
      (await this.getSchemaByLayerName(layerName, true))
    );
  }

  async getClassIdAlias(layer: CrgLayer, bugObject: BugObject): Promise<string> {
    const schema = await this.getSchema(layer.schemaId);

    if (!schema) {
      return '';
    }

    return schema.properties
      .filter((simpleProperty: PropertySchema) => simpleProperty.enumerations)
      .reduce((val: string, simpleProperty: PropertySchema) => {
        return simpleProperty.enumerations.reduce((title: string, item) => {
          if (String(bugObject.classId) === item.value || String(bugObject.classId) === item.value) {
            return item.title;
          } else {
            return title;
          }
        }, val);
      }, '');
  }

  /**
   * По наименованию фичи, попытаемся найти алиас в ее свойствах.
   * Если алиас найти не удалось просто вернем код.
   * @param layer Наименование фичи
   * @param propertyName код свойства
   */
  async getPropertyAlias(layer: CrgLayer, propertyName: string): Promise<string> {
    const schema = await this.getSchema(layer.schemaId);

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
  getPropertySchemaByName(key: string, propertySchemas: PropertySchema[]) {
    return propertySchemas.find(({ name }) => name.toLowerCase() === key.toLowerCase());
  }

  async getEmptyFeature(layer: CrgLayer): Promise<WfsFeature<CoordinateEdited>> {
    const { internalName, schemaId } = layer;
    const schema = await this.getSchema(schemaId);

    const properties = schema.properties.reduce((acc: { [key: string]: null }, propertySchema) => {
      acc[propertySchema.name.toLowerCase()] = null;
      return acc;
    }, {});

    return {
      type: 'Feature',
      id: internalName, // костыль для EditFeatureComponent, который берёт тип фичи из id (AAAAAAA!!!)
      geometry: getEmptyGeometry(schema.geometryType),
      geometry_name: 'shape', // TODO нужно добавить в схему и брать оттуда
      properties
    };
  }

  /**
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
        return 'Строка превышает допустимую длинну';
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
      } else {
        return error;
      }
    });
  }

  private async fetch(fetchAll?: boolean): Promise<void> {
    this.fetchingNow++;
    const payload = fetchAll ? [] : this.fetchingPool.splice(0);
    await services.provided;
    const url = await serverProperties.schemaUrl;
    const response = await services.httpq.post<FeatureDescription[]>(url, payload);

    if (!response) {
      throw new Error(`Getting schemas ${JSON.stringify(payload)} error`);
      this.fetchingNow--;
      this.checkForsakenResolvers();
      return;
    }

    response.forEach(schema => {
      const { name } = schema;
      if (this.schemasResolvers[name]) {
        this.schemasResolvers[name](schema);
        delete this.schemasResolvers[name];
        delete this.schemasRejecters[name];
      } else if (!this.schemas[name]) {
        this.schemas[name] = new Promise(resolve => {
          resolve(schema);
        });
      }
    });

    this.fetchingNow--;
    this.checkForsakenResolvers();
  }

  private checkForsakenResolvers() {
    if (!this.fetchingPool.length && !this.fetchingNow) {
      Object.entries(this.schemasRejecters).forEach(([schemaName, reject]) => {
        reject();
        throw new Error('Не найдена схема ' + schemaName);
      });
    }
  }
}

export const schemaService = SchemaService.instance;
