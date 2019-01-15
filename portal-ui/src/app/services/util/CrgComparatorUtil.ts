import {CrgComparison} from '../fiz-comparator.service';
import {ColumnProjection} from '../geoserver/gis-db.service';
import {AS_IS_TYPE, LayerAttribute} from '../geoserver/import.service';

/**
 * Первый и самый простой компаратор.
 * Приводит строки к одному регистру и сравнивает.
 */
export class DirectComparison implements CrgComparison {
  private comparison: CrgComparison;

  compare(source: LayerAttribute, columns: ColumnProjection[]): ColumnProjection {
    let result = null;
    columns.forEach((column: ColumnProjection) => {
      if (source.name.toLowerCase() === column.name.toLowerCase()) {
        result = column;
      }
    });

    if (result) {
      return result;
    } else {
      return this.comparison.compare(source, columns);
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

  compare(source: LayerAttribute, columns: ColumnProjection[]): ColumnProjection {
    let result = null;

    if (source.binding.includes('MultiPolygon') ||
        source.binding.includes('MultiLineString') ||
        source.binding.includes('Point')) {
      result = columns.find((column: ColumnProjection) => column.type === 'geometry');
    }

    if (result) {
      return result;
    } else {
      return this.comparison.compare(source, columns);
    }
  }

  setNext(comparison: CrgComparison) {
    this.comparison = comparison;
  }

}

/**
 * Последний компаратор в цепочке.
 * Посути определяет дефолтное значение если подобрать сопостовление не получилось.
 * Для него не задается "следующего" по цепочке.
 */
export class LastComparison implements CrgComparison {

  compare(source: LayerAttribute, columns: ColumnProjection[]): ColumnProjection {
    return AS_IS_TYPE;
  }

  setNext(comparison: CrgComparison) {
    throw Error('Wrong use last comparator');
  }

}
