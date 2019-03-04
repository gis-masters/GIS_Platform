import {SimpleProperty} from '../gis/fgistp-rules.service';
import {CrgComparison} from '../properties-comparator.service';
import {AS_IS_TYPE, LayerAttribute, NOT_IMPORT} from '../geoserver/import/import.service';

/**
 * Первый и самый простой компаратор.
 * Приводит строки к одному регистру и сравнивает.
 */
export class DirectComparison implements CrgComparison {
  private comparison: CrgComparison;

  compare(source: LayerAttribute, properties: SimpleProperty[]): SimpleProperty {
    let result = null;
    properties.forEach((property: SimpleProperty) => {
      if (source.name.toLowerCase() === property.name.toLowerCase()) {
        result = property;
      }
    });

    if (result) {
      return result;
    } else {
      return this.comparison.compare(source, properties);
    }
  }

  setNext(comparison: CrgComparison) {
    this.comparison = comparison;
  }

}

/**
 * Определяет дефолтный маппинг геометрии.
 */
export class GeometryComparison implements CrgComparison {
  private comparison: CrgComparison;

  // TODO: Сопоставление геометрии
  compare(source: LayerAttribute, properties: SimpleProperty[]): SimpleProperty {
    let result = null;

    if (source.binding.includes('MultiPolygon') ||
        source.binding.includes('MultiLineString') ||
        source.binding.includes('LineString') ||
        source.binding.includes('PolySurface') ||
        source.binding.includes('Curve') ||
        source.binding.includes('Point')) {
      result = {
        name: 'shape',
        title: 'shape'
      } as SimpleProperty;
    }

    if (result) {
      return result;
    } else {
      return this.comparison.compare(source, properties);
    }
  }

  setNext(comparison: CrgComparison) {
    this.comparison = comparison;
  }

}

/**
 * Определяет дефолтный маппинг ObjectId.
 */
export class ObjectIdComparison implements CrgComparison {
  private comparison: CrgComparison;

  compare(source: LayerAttribute, properties: SimpleProperty[]): SimpleProperty {
    let result = null;

    if (source.name.toLowerCase().includes('objectid')) {
      result = {
        name: NOT_IMPORT.name,
        title: NOT_IMPORT.title
      };
    }

    if (result) {
      return result;
    } else {
      return this.comparison.compare(source, properties);
    }
  }

  setNext(comparison: CrgComparison) {
    this.comparison = comparison;
  }

}

/**
 * Последний компаратор в цепочке.
 * Посути определяет дефолтное значение если подобрать сопоставление не получилось.
 * Для него не задается "следующего" по цепочке.
 */
export class LastComparison implements CrgComparison {

  compare(source: LayerAttribute, properties: SimpleProperty[]): SimpleProperty {
    return {
      name: AS_IS_TYPE.name,
      title: AS_IS_TYPE.title
    };
  }

  setNext(comparison: CrgComparison) {
    throw Error('Wrong use last comparator');
  }

}
