import { reaction } from 'mobx';

import { mapStore } from '../stores/Map.store';
import { MapMode, ToolMode } from './map/map.models';

const crosshairCursor = 'global-crosshair-cursor';

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

    reaction(
      () => mapStore.toolMode,
      toolMode => {
        this.toolModeChanged(toolMode);
      }
    );
  }

  private mapModeChanged(newMode: MapMode) {
    document.body.classList.toggle(
      crosshairCursor,
      newMode === MapMode.DRAW_FEATURE || newMode === MapMode.VERTICES_MODIFICATION
    );
  }

  private toolModeChanged(toolMode: ToolMode) {
    document.body.classList.toggle(
      crosshairCursor,
      toolMode === ToolMode.SELECTION ||
        toolMode === ToolMode.ADDING_LABEL ||
        toolMode === ToolMode.MEASURE_LENGTH ||
        toolMode === ToolMode.MEASURE_AREA
    );
  }
}

export const cursorHandler = CursorHandler.instance;
