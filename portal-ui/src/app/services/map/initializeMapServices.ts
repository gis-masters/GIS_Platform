import { mapService } from './map.service';
import { mapModeService } from './mode/map-mode.service';

let initialized = false;

async function initMapService() {
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

async function initMapModeService() {
  await mapModeService.init();
}

export async function initializeMapServices(): Promise<void> {
  if (initialized) {
    return;
  }

  initialized = true;

  // Инициализируем сервисы в правильном порядке
  await initMapService();
  await initMapModeService();
}
