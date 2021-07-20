import { PropertySchema, ValueType } from '../crg/schema.models';
import { CrgComparison } from '../properties-comparator.service';
import { LayerAttribute } from '../geoserver/import/models';
import { AS_IS, NOT_IMPORT } from '../models';

/**
 * Первый и самый простой компаратор.
 * Приводит строки к одному регистру и сравнивает по первым 10 символам. (Длинна ограничения названия shp формата)
 */
export class DirectComparison implements CrgComparison {
  private comparison: CrgComparison;

  compare(source: LayerAttribute, properties: PropertySchema[]): PropertySchema {
    let result: PropertySchema;
    const shapeName = source.name.slice(0, 10).toLowerCase();
    properties.forEach((property: PropertySchema) => {
      const ourName = property.name.slice(0, 10).toLowerCase();
      if (shapeName === ourName) {
        result = property;
      }
    });

    return result || this.comparison.compare(source, properties);
  }

  setNext(comparison: CrgComparison): void {
    this.comparison = comparison;
  }
}

/**
 * Определяет дефолтный маппинг геометрии.
 */
export class GeometryComparison implements CrgComparison {
  private comparison: CrgComparison;

  // TODO: Сопоставление геометрии
  compare(source: LayerAttribute, properties: PropertySchema[]): PropertySchema {
    let result: PropertySchema;

    if (
      source.binding.includes('MultiPolygon') ||
      source.binding.includes('MultiLineString') ||
      source.binding.includes('LineString') ||
      source.binding.includes('PolySurface') ||
      source.binding.includes('Curve') ||
      source.binding.includes('Point')
    ) {
      result = {
        name: 'shape',
        title: 'shape',
        valueType: ValueType.STRING
      };
    }

    return result || this.comparison.compare(source, properties);
  }

  setNext(comparison: CrgComparison): void {
    this.comparison = comparison;
  }
}

/**
 * Определяет дефолтный маппинг ObjectId.
 */
export class ObjectIdComparison implements CrgComparison {
  private comparison: CrgComparison;

  compare(source: LayerAttribute, properties: PropertySchema[]): PropertySchema {
    let result: PropertySchema;

    if (source.name.toLowerCase().includes('objectid')) {
      result = {
        name: NOT_IMPORT.name,
        title: NOT_IMPORT.title,
        valueType: ValueType.STRING
      };
    }

    return result ? result : this.comparison.compare(source, properties);
  }

  setNext(comparison: CrgComparison): void {
    this.comparison = comparison;
  }
}

/**
 * Последний компаратор в цепочке.
 * По сути определяет дефолтное значение если подобрать сопоставление не получилось.
 * Для него не задается "следующего" по цепочке.
 */
export class LastComparison implements CrgComparison {
  compare(): PropertySchema {
    return {
      name: AS_IS.name,
      title: AS_IS.title,
      valueType: ValueType.STRING
    };
  }

  setNext(): void {
    throw new Error('Wrong use last comparator');
  }
}
