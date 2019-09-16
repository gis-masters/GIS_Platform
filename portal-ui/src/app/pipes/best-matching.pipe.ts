import * as _ from 'lodash';
import {Pipe, PipeTransform} from '@angular/core';
import {FeatureDescription} from '../services/crg/data-schema.service';
import {ImportLayerItem} from '../services/geoserver/import/models';

/**
 * На основе прочитанного значения отсортируем массив FeatureDescription[]
 */
@Pipe({
  name: 'bestMatching'
})
export class BestMatchingPipe implements PipeTransform {

  transform(featuresDescription: FeatureDescription[], importLayer?: ImportLayerItem): FeatureDescription[] {
    featuresDescription.forEach((fDescription: FeatureDescription) => {
      this.calculateAttributeCompatibility(importLayer, fDescription);
    });

    return _.sortBy(featuresDescription, ['matchingCounter']);
  }

  /**
   * Просто найдем совпадающие названия аттрибутов и их кол-во проставим в {@link FeatureDescription} в поле matchingCounter
   * Для удобства пользования сортировкой, меньшее значение - лучше.
   * @param feature       Импортированный нам слой
   * @param fDescription  Описание фичи
   */
  private calculateAttributeCompatibility(feature: ImportLayerItem, fDescription: FeatureDescription) {
    let counter = 0;
    feature.attributes.forEach(sourceAttribute => {
      fDescription.properties.forEach(attribute => {
        if (sourceAttribute.name.toLowerCase() === attribute.name.toLowerCase()) {
          counter--;
          return;
        }
      });
    });

    fDescription.matchingCounter = counter;
  }
}
