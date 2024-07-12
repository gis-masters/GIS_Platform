import { cloneDeep, sortBy } from 'lodash';

import { OldPropertySchema, OldSchema, ValueType } from '../data/schema/schemaOld.models';
import { ImportLayerItem, LayerAttribute } from '../geoserver/import/import.models';
import { AS_IS, NOT_IMPORT } from '../models';
import { CrgRootGeometry, GeometryItem } from './crg-root-geometry';

export class FeatureUtil {
  static getLayerGeometry(importLayer: ImportLayerItem): string | undefined {
    return importLayer.attributes.find((attr: LayerAttribute) => attr.name === 'the_geom')?.binding;
  }

  // layer = Point, MultiLineString, MultiPolygon
  // feature = Point, LineString, Polygon, Curve
  static isFeatureGeometryCompatible(layerGeometryTypeName: string, featureDescription: OldSchema): boolean {
    const split = layerGeometryTypeName.split('.');
    const layerGeometryName = split.at(-1);

    if (!layerGeometryName) {
      return false;
    }

    const allowedGeometry: string[] = this.fillAllowedGeometry(new CrgRootGeometry(), layerGeometryName);
    const featureGeometry = this.getFeatureGeometry(featureDescription);
    let result = false;
    featureGeometry.forEach(value => {
      if (allowedGeometry.includes(value)) {
        result = true;
      }
    });

    return result;
  }

  static getFeatureGeometry(featureDescription: OldSchema): string[] {
    const geometryProperty = featureDescription.properties.find(property => property.valueType === ValueType.GEOMETRY);

    return geometryProperty?.allowedValues || [];
  }

  static filterByGeometry(fDescription: OldSchema[], layer?: ImportLayerItem): OldSchema[] {
    if (!layer) {
      return [];
    }

    const geometryName = FeatureUtil.getLayerGeometry(layer);

    return fDescription.filter((featureDescription: OldSchema) => {
      return geometryName && FeatureUtil.isFeatureGeometryCompatible(geometryName, featureDescription);
    });
  }

  static sortByBestCompatibility(fDescription: OldSchema[], layer?: ImportLayerItem): OldSchema[] {
    if (!layer) {
      return [];
    }

    fDescription.forEach((description: OldSchema) => {
      this.calculateAttributeCompatibility(layer, description);
    });

    return sortBy(fDescription, ['matchingCounter']);
  }

  static preparePropertySchema(targetFeatureType: OldSchema): OldPropertySchema[] {
    const propertySchemas: OldPropertySchema[] = [
      { name: NOT_IMPORT.name, title: NOT_IMPORT.title, valueType: ValueType.STRING },
      { name: AS_IS.name, title: AS_IS.title, valueType: ValueType.STRING }
    ];

    targetFeatureType.properties.forEach((property: OldPropertySchema) => {
      propertySchemas.push(property);
    });

    return propertySchemas;
  }

  static calculateByFunction<T>(featureObject: T, calcFunction: string): Partial<T> {
    let result = {};

    try {
      // eslint-disable-next-line @typescript-eslint/no-implied-eval
      const cFunction = new Function('obj', calcFunction);
      result = (cFunction(cloneDeep(featureObject)) || result) as Partial<T>;
    } catch (error) {
      throw new Error(`Ошибка при попытке просчитать атрибуты: ${String(error)}`);
    }

    return result;
  }

  /**
   * Метод возвращает список допустимых типов геометрии исходя из переданного названия исходной геометрии.
   * @param geometryDefinition root
   * @param geometryName Название геометрии
   */
  private static fillAllowedGeometry(geometryDefinition: GeometryItem, geometryName: string): string[] {
    const allowedGeometry: string[] = [];
    geometryDefinition.child.forEach((geometryItem: GeometryItem) => {
      if (geometryItem.name === geometryName) {
        allowedGeometry.push(geometryName);
        this.collectAll(geometryItem, allowedGeometry, geometryName);
      } else {
        allowedGeometry.push(...this.fillAllowedGeometry(geometryItem, geometryName));
      }
    });

    return allowedGeometry;
  }

  private static collectAll(rootGeometry: GeometryItem, allowedGeometry: string[], name: string) {
    rootGeometry.child.forEach((geometryItem: GeometryItem) => {
      allowedGeometry.push(geometryItem.name);
      this.collectAll(geometryItem, allowedGeometry, name);
    });
  }

  /**
   * Подбор наиболее совместимого слоя по кол-ву совпадающих названий атрибутов.
   * Для удобства пользования сортировкой, меньшее значение - лучше.
   * @param feature       Импортированный нам слой
   * @param fDescription  Описание фичи
   */
  private static calculateAttributeCompatibility(feature: ImportLayerItem, fDescription: OldSchema) {
    let counter = 0;
    feature.attributes.forEach(sourceAttribute => {
      fDescription.properties.forEach(attribute => {
        if (sourceAttribute.name.toLowerCase() === attribute.name.toLowerCase()) {
          counter--;
        }
      });
    });

    fDescription.matchingCounter = counter;
  }
}
