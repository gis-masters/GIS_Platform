import { Injectable } from '@angular/core';

import { OldPropertySchema } from './data/schema/schemaOld.models';
import { LayerAttribute } from './geoserver/import/import.models';
import { DirectComparison, GeometryComparison, LastComparison, ObjectIdComparison } from './util/CrgComparatorUtil';

@Injectable({
  providedIn: 'root'
})
export class PropertiesComparatorService {
  private initialComparison: CrgComparison = new DirectComparison();

  constructor() {
    const geometryComparison = new GeometryComparison();
    const objectIdComparison = new ObjectIdComparison();
    const lastComparison = new LastComparison();

    // Задаем цепочку. Да не очень красиво, мне нравится юзать Builder - но лень.
    // Например: http://sh2533.blogspot.com/2012/03/chain-of-responsibility.html

    this.initialComparison.setNext(geometryComparison);
    geometryComparison.setNext(objectIdComparison);
    objectIdComparison.setNext(lastComparison);
  }

  /**
   * Ищем наиболее подходящий столбец для заданного исходного столбца.
   * @param source - Наименование исходного столбца.
   * @param columns - Рабочий список столбцов.
   */
  compare(source: LayerAttribute, columns: OldPropertySchema[]): OldPropertySchema {
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
  setNext(comparison: CrgComparison): void;

  compare(source: LayerAttribute, columns: OldPropertySchema[]): OldPropertySchema;
}
