import { boundMethod } from 'autobind-decorator';
import { debounce, DebouncedFunc } from 'lodash';

import { http } from '../http.service';
import { Schema } from './schema.models';
import { BugObject } from './validation.service';
import { FeatureUtil } from '../util/FeatureUtil';
import { Toast } from '../../components/Toast/Toast';
import { getSchemaUrl } from '../server-urls.service';
import { convertOldToNewSchema } from './schema.utils';
import { CrgVectorLayer } from '../gis/projects.models';
import { ImportLayerItem } from '../geoserver/import/models';
import { communicationService } from '../communication.service';
import { OldSchema, OldPropertySchema, OldPropertySchemaChoice, ValueType } from './schemaOld.models';

class SchemaService {
  private static _instance: SchemaService;

  private schemas: { [key: string]: Promise<OldSchema> } = {};
  private schemasResolvers: { [key: string]: (value?: OldSchema) => void } = {};
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
  async getOldSchema(name: string): Promise<OldSchema> {
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

  async getAllSchemas(): Promise<Schema[]> {
    const oldSchemas = await this.getAllOldSchemas();

    return oldSchemas.map(convertOldToNewSchema);
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
    if (geometryName.includes('MultiLineString')) {
      if (!layerName.includes('_line')) {
        layerNameWithGeomType = layerName + '_line';
      }
    } else if (geometryName.includes('Point') && !layerName.includes('_point')) {
      layerNameWithGeomType = layerName + '_point';
    }

    return (await this.getBySimilarId(layerNameWithGeomType)) || (await this.getBySimilarId(layerName));
  }

  async getClassIdAlias(layer: CrgVectorLayer, bugObject: BugObject): Promise<string> {
    const schema = await this.getOldSchema(layer.schemaId);

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
   * @deprecated legacy, do not use
   * По наименованию фичи, попытаемся найти алиас в ее свойствах.
   * Если алиас найти не удалось просто вернем код.
   * @param layer Наименование фичи
   * @param propertyName код свойства
   */
  async getPropertyAlias(layer: CrgVectorLayer, propertyName: string): Promise<string> {
    const schema = await this.getOldSchema(layer.schemaId);

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
    const params = { schemaIds: payload.join(',') };
    const response = await http.get<(OldSchema | null)[]>(await getSchemaUrl(), { params });

    if (!response) {
      this.fetchingNow--;
      this.checkForsakenResolvers();
      throw new Error(`Getting schemas ${JSON.stringify(payload)} error`);
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
        delete this.schemas[schemaName];
        delete this.schemasResolvers[schemaName];
        delete this.schemasRejecters[schemaName];
        reject();
        throw new Error('Не найдена схема ' + schemaName);
      });
    }
  }

  async updateSchema(schema: OldSchema) {
    this.schemas = {};
    this.fetchingAllSchemas = null;
    await http.put<OldSchema>(await getSchemaUrl(), schema);

    communicationService.schemasUpdated.emit();
  }
}

export const schemaService = SchemaService.instance;
