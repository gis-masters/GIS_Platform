import {WfsFeature} from '../../services/geoserver/wfs.service';
import {EditFeatureData, EditFeatureMode} from '../edit-feature/edit-feature.component';

export class Util {

  /**
   * Все фичи собираем в одну: одинаковые свойства - безопастны и могут быть изменены свободно
   * Те свойства, значение которых, разное хотябы в одной из фич, считаются небезопастными и для их редактирования
   * требуется явное указание пользователя.
   * Список небезопастных свойств положу в unsafeProperties
   *
   * Собственно задача метода сформировать {@link EditFeatureData} в которой будет заполнен массив unsafeProperties
   * а в единственной фиче будут только безопастыные значения свойств, небезопастные - undefined
   *
   * @param features Список фич переданных на редактирование.
   */
  static prepareFeatureForMultipleEdit(features: WfsFeature[]): EditFeatureData {
    const initFeature: WfsFeature = features[0];
    const unsafeProperties = {};
    const listOfFeaturesId = {};
    listOfFeaturesId[initFeature.id] = true;

    Object.keys(initFeature.properties).forEach(property => {
      features.forEach((feature: WfsFeature) => {
        if (initFeature.properties[property] !== feature.properties[property]) {
          initFeature.properties[property] = undefined;
          unsafeProperties[property] = true;
          listOfFeaturesId[feature.id] = true;
          return;
        }
      });
    });

    return {
      feature: initFeature,
      mode: EditFeatureMode.multipleEdit,
      unsafeProperties: unsafeProperties,
      featuresId: listOfFeaturesId
    } as EditFeatureData;
  }

}
