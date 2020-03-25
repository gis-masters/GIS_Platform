import {serverProperties} from '../server-properties.service';
import {CrgBaseMap, CrgProjectBaseMap} from './base-maps.models';
import {baseMapsStore} from '../../stores/BaseMaps.store';
import {services} from '../services';

class BaseMapsService {
  private static _instance: BaseMapsService;

  private constructor() {
  }

  public static get instance() {
    return this._instance || (this._instance = new this());
  }

  /**
   * Fetch all basemaps for project
   */
  async fetchAll(baseMaps: CrgProjectBaseMap[]) {
    await services.provided;

    const baseMapIds = baseMaps.map(value => value.baseMapId);
    const result = await services.httpq.post<CrgBaseMap[]>(await serverProperties.baseMapsUrl, baseMapIds);

    if (result) {
      this.modifyTitle(baseMaps, result);

      baseMapsStore.initBaseMaps(result);
    } else {
      baseMapsStore.initBaseMaps([]);
    }
  }

  private modifyTitle(projectBaseMaps: CrgProjectBaseMap[], baseMaps: CrgBaseMap[]) {
    projectBaseMaps.forEach(projectBaseMap => {
      if (projectBaseMap.title) {
        const crgBaseMap = baseMaps.find(value => value.id === projectBaseMap.id);
        if (crgBaseMap) {
          crgBaseMap.title = projectBaseMap.title;
        }
      }
    });
  }
}

export const baseMapsService = BaseMapsService.instance;
