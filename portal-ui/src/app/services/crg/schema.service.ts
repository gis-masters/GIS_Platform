import { boundMethod } from 'autobind-decorator';
import { debounce, DebouncedFunc } from 'lodash';
import moment from 'moment';

import { Toast } from '../../components/Toast/Toast';
import { currentProject } from '../../stores/CurrentProject.store';
import { ImportLayerItem } from '../geoserver/import/models';
import { CoordinateEdited, WfsFeature } from '../geoserver/wfs.models';
import { getEmptyGeometry } from '../geoserver/wfs.util';
import { http } from '../http.service';
import { getSchemaUrl } from '../server-urls.service';
import { services } from '../services';
import { FeatureUtil } from '../util/FeatureUtil';
import { CrgLayer } from './projects.models';
import {
  OldFeatureDescription,
  OldPropertySchema,
  OldPropertySchemaChoice,
  ValueType,
  PropertyEnumeration
} from './schemaOld.models';
import { BugObject } from './validation.service';

class SchemaService {
  private static _instance: SchemaService;

  private schemas: { [key: string]: Promise<OldFeatureDescription> } = {};
  private schemasResolvers: { [key: string]: (value?: OldFeatureDescription) => void } = {};
  private schemasRejecters: { [key: string]: () => void } = {};
  private fetchingPool: string[] = [];
  private fetchingAllSchemas?: Promise<void>;
  private fetchingNow = 0;
  private readonly debouncedFetch: DebouncedFunc<(fetchAll?: boolean) => Promise<void>>;

  private constructor() {
    this.debouncedFetch = debounce(this.fetch, 20);
  }

  static get instance() {
    return this._instance || (this._instance = new this());
  }

  @boundMethod
  async getSchema(name: string): Promise<OldFeatureDescription> {
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

  async getCurrentProjectSchemas(): Promise<OldFeatureDescription[]> {
    const names = currentProject.vectorLayers.map(layer => layer.schemaId);

    return Promise.all(names.map(this.getSchema));
  }

  async getAllSchemas(): Promise<OldFeatureDescription[]> {
    if (!this.fetchingAllSchemas) {
      this.fetchingAllSchemas = this.fetch(true);
    }

    await this.fetchingAllSchemas;

    return Promise.all(Object.values(this.schemas));
  }

  async getById(schemaId: string, global?: boolean): Promise<OldFeatureDescription | undefined> {
    if (!schemaId) {
      return;
    }

    const schemas = global ? await this.getAllSchemas() : await this.getCurrentProjectSchemas();

    return (
      schemas.find(schema => schema.name.toLowerCase() === schemaId.toLowerCase()) ||
      schemas.find(schema => schema.name.toLowerCase().includes(schemaId.toLowerCase()))
    );
  }

  /**
   * Возвращает, наиболее подходящую для слоя, схему.
   * Метод опирается на название и геометрию слоя.
   * @param layer Слой
   */
  async getSchemaByLayer(layer: ImportLayerItem): Promise<OldFeatureDescription | undefined> {
    const layerName = layer.originalName.toLowerCase();
    let layerNameWithGeomType: string;

    const geometryName = FeatureUtil.getLayerGeometry(layer);
    if (geometryName.includes('MultiLineString')) {
      if (!layerName.includes('_line')) {
        layerNameWithGeomType = layerName + '_line';
      }
    } else if (geometryName.includes('Point') && !layerName.includes('_point')) {
      layerNameWithGeomType = layerName + '_point';
    }

    return (await this.getById(layerNameWithGeomType, true)) || (await this.getById(layerName, true));
  }

  async getClassIdAlias(layer: CrgLayer, bugObject: BugObject): Promise<string> {
    const schema = await this.getSchema(layer.schemaId);

    if (!schema) {
      return '';
    }

    return schema.properties
      .filter(simpleProperty => simpleProperty.valueType === ValueType.CHOICE && simpleProperty.enumerations)
      .reduce<string>((val: string, simpleProperty: OldPropertySchemaChoice) => {
        return simpleProperty.enumerations.reduce<string>((title: string, item) => {
          return String(bugObject.classId) === item.value ? item.title : title;
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
  getPropertySchemaByName(key: string, propertySchemas: OldPropertySchema[]) {
    return propertySchemas.find(({ name }) => name.toLowerCase() === key.toLowerCase());
  }

  async getEmptyFeature(layer: CrgLayer): Promise<WfsFeature<CoordinateEdited>> {
    const { tableName, schemaId } = layer;
    const schema = await this.getSchema(schemaId);

    const properties = schema.properties.reduce((acc: { [key: string]: null }, propertySchema) => {
      acc[propertySchema.name.toLowerCase()] = null;

      return acc;
    }, {});

    return {
      type: 'Feature',
      id: tableName, // костыль для EditFeatureComponent, который берёт тип фичи из id (AAAAAAA!!!)
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

  async isReadOnly(schemaId: string): Promise<boolean> {
    try {
      return (await this.getSchema(schemaId)).readOnly;
    } catch {
      return true;
    }
  }

  /**
   * Свойства фичи заменяются на алиасы для сложных типов данных, таких как CHOICE например.
   *
   * @example
   * inputFeature {
   *   status: 314,
   *   reg_status: 1
   * }
   * outputFeature {
   *   status: 'Линии электропередач 10кВт',
   *   reg_status: 'Утверждено'
   * }
   *
   * @param schema
   * @param featureProperties
   */
  replaceRowDataToAliases(
    schema: OldFeatureDescription,
    featureProperties: Record<string, unknown>
  ): Record<string, unknown> {
    const resultObject: Record<string, unknown> = {};

    Object.keys(featureProperties).forEach(key => {
      const schemaProperty = schema.properties.find(prop => prop.name.toLowerCase() === key.toLowerCase());
      if (!schemaProperty) {
        return;
      }

      if (schemaProperty.valueType === ValueType.CHOICE) {
        const valueTitle = this.getValueTitle(featureProperties[key], schemaProperty.enumerations);
        if (valueTitle) {
          resultObject[key] = valueTitle;
        }
      } else if (schemaProperty.valueType === ValueType.DATETIME) {
        if (!schemaProperty.dateFormat) {
          if (featureProperties[key]) {
            resultObject[key] = new Date(String(featureProperties[key])).toLocaleDateString();
          }
        } else if (featureProperties[key]) {
          resultObject[key] = moment(featureProperties[key]).locale('ru').format(schemaProperty.dateFormat);
        }
      } else {
        resultObject[key] = featureProperties[key];
      }
    });

    return resultObject;
  }

  private getValueTitle(startValue: string | unknown, enumerations: PropertyEnumeration[]): string {
    return enumerations.reduce((acc, { value, title }) => {
      return String(startValue) === String(value) ? title : acc;
    }, String(startValue));
  }

  private async fetch(fetchAll?: boolean): Promise<void> {
    this.fetchingNow++;
    await services.provided;
    const payload = fetchAll ? [] : this.fetchingPool.splice(0);
    const params = { schemaIds: payload.join(',') };
    const response = await http.get<(OldFeatureDescription | null)[]>(await getSchemaUrl(), { params });

    if (!response) {
      this.fetchingNow--;
      this.checkForsakenResolvers();
      throw new Error(`Getting schemas ${JSON.stringify(payload)} error`);
    }

    response.forEach(schema => {
      if (!schema) {
        Toast.error('Возникла ошибка при загрузке схемы');
        services.logger.error('Failed schema', schema);

        return;
      }

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
