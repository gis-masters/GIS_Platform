import { mapModeManager } from './a-map-mode/MapModeManager';
import { mapService } from './map.service';

class ServiceInitializer {
  private static _instance: ServiceInitializer;
  static get instance() {
    return this._instance || (this._instance = new this());
  }

  private initialized = false;

  async initialize() {
    if (this.initialized) {
      return;
    }

    this.initialized = true;

    // Инициализируем сервисы в правильном порядке
    await this.initMapService();
    await this.initMapModeManager();
  }

  private async initMapService() {
    // Ждем пока mapService будет готов
    await new Promise<void>(resolve => {
      if (mapService.mapInited) {
        resolve();
      } else {
        mapService.mapCreated.once(() => {
          resolve();
        });
      }
    });
  }

  private async initMapModeManager() {
    await mapModeManager.init();
  }
}

export const serviceInitializer = ServiceInitializer.instance;
