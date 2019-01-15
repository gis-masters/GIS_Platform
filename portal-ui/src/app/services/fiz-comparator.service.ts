import {Injectable} from '@angular/core';
import {LayerAttribute} from './geoserver/import.service';
import {ColumnProjection} from './geoserver/gis-db.service';
import {DirectComparison, GeometryComparison, LastComparison} from './util/CrgComparatorUtil';

@Injectable({
  providedIn: 'root'
})
export class FizComparatorService {

  private initialComparison: CrgComparison = new DirectComparison();

  constructor() {
    const geometryComparison = new GeometryComparison();
    const lastComparison = new LastComparison();

    // Задаем цепочку. Да неочень красиво, мне нравится юзать Builder - но лень.
    // Например: http://sh2533.blogspot.com/2012/03/chain-of-responsibility.html
    this.initialComparison.setNext(geometryComparison);
    geometryComparison.setNext(lastComparison);
  }

  /**
   * Ищем наиболее подходящий столбец для заданного исходного столбца.
   * @param source - Наименование исходного столбца.
   * @param columns - Рабочий список столбцов.
   */
  compare(source: LayerAttribute, columns: ColumnProjection[]): ColumnProjection {
    return this.initialComparison.compare(source, columns);
  }

}

/**
 * Простая реализация паттерна "цепочка обязанностей" используя setNext()
 */
export interface CrgComparison {

  /**
   * Задаем следующий метод в цепочке.
   * @param comparison Обработчик
   */
  setNext(comparison: CrgComparison);

  compare(source: LayerAttribute, columns: ColumnProjection[]): ColumnProjection;
}
