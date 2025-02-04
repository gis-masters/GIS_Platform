import { reaction } from 'mobx';

import { mapStore } from '../stores/Map.store';
import { MapMode } from './map/map.models';

class CursorHandler {
  private static _instance: CursorHandler;
  static get instance() {
    return this._instance || (this._instance = new this());
  }

  init() {
    reaction(
      () => mapStore.mode,
      mapMode => {
        this.mapModeChanged(mapMode);
      }
    );
  }

  private mapModeChanged(newMode: MapMode) {
    if (newMode === MapMode.DEFAULT) {
      document.body.classList.remove('global-crosshair-cursor');
    } else {
      document.body.classList.add('global-crosshair-cursor');
    }
  }
}

export const cursorHandler = CursorHandler.instance;
