import {Layer} from '../geoserver/layers.service';

export class StringUtil {

  // Все свойства обьекта, в том месте где этот метод используется, indefined, хотя в консоле обьект полный.
  static getHrefFromBlyadskiyJson(layer: Layer): string {
    const layerAsString = JSON.stringify(layer);

    return layerAsString
      .split('resource')[1]
      .split('"href":"')[1]
      .split('"}')[0]
      .split('/featuretypes')[0];
  }

  // 'yypefc'
  static generateRandomId() {
    return Math.random().toString(36).substring(2, 8);
  }
}
