import { OldPropertySchema, ValueType } from '../data/schema/schemaOld.models';
import { LayerAttribute } from '../geoserver/import/import.models';
import { AS_IS, NOT_IMPORT } from '../models';
import { CrgComparison } from '../properties-comparator.service';

/**
 * Первый и самый простой компаратор.
 * Приводит строки к одному регистру и сравнивает по первым 10 символам. (Длинна ограничения названия shp формата)
 */
export class DirectComparison implements CrgComparison {
  private comparison?: CrgComparison;

  compare(source: LayerAttribute, properties: OldPropertySchema[]): OldPropertySchema {
    let result: OldPropertySchema | undefined;
    const shapeName = source.name.slice(0, 10).toLowerCase();
    properties.forEach((property: OldPropertySchema) => {
      const ourName = property.name.slice(0, 10).toLowerCase();
      if (shapeName === ourName) {
        result = property;
      }
    });

    const property = result || this.comparison?.compare(source, properties);

    if (!property) {
      throw new Error(`Не нашлось свойство "${source.name}"`);
    }

    return property;
  }

  setNext(comparison: CrgComparison): void {
    this.comparison = comparison;
  }
}

/**
 * Определяет дефолтный маппинг геометрии.
 */
export class GeometryComparison implements CrgComparison {
  private comparison?: CrgComparison;

  // TODO: Сопоставление геометрии
  compare(source: LayerAttribute, properties: OldPropertySchema[]): OldPropertySchema {
    let result: OldPropertySchema | undefined;

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

    const property = result || this.comparison?.compare(source, properties);

    if (!property) {
      throw new Error(`Не нашлось свойство "${source.name}"`);
    }

    return property;
  }

  setNext(comparison: CrgComparison): void {
    this.comparison = comparison;
  }
}

/**
 * Определяет дефолтный маппинг ObjectId.
 */
export class ObjectIdComparison implements CrgComparison {
  private comparison?: CrgComparison;

  compare(source: LayerAttribute, properties: OldPropertySchema[]): OldPropertySchema {
    let result: OldPropertySchema | undefined;

    if (source.name.toLowerCase().includes('objectid')) {
      result = {
        name: NOT_IMPORT.name,
        title: NOT_IMPORT.title,
        valueType: ValueType.STRING
      };
    }

    const property = result || this.comparison?.compare(source, properties);

    if (!property) {
      throw new Error(`Не нашлось свойство "${source.name}"`);
    }

    return property;
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
  compare(): OldPropertySchema {
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
