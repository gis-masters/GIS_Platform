import { doConfirm } from '../../answer-modals.service';
import { services } from '../../services';
import { MapMode } from '../map.models';
import { defaultModeHandler } from './handlers/defaultModeHandler';
import { drawFeatureModeHandler } from './handlers/drawFeatureModeHandler';
import { editFeatureModeHandler } from './handlers/editFeatureModeHandler';
import { searchInProjectModeHandler } from './handlers/searchInProjectModeHandler';
import { selectedFeaturesModeHandler } from './handlers/selectedFeaturesModeHandler';
import { verticesModificationModeHandler } from './handlers/verticesModificationModeHandler';
import { type MapModeHandler, type ModeProps } from './map-mode.models';

class MapModeService {
  private static _instance: MapModeService;
  static get instance() {
    return this._instance || (this._instance = new this());
  }

  private currentMode: MapModeHandler = defaultModeHandler;

  private readonly modeHandlers: Map<MapMode, MapModeHandler> = new Map<MapMode, MapModeHandler>([
    [MapMode.NONE, defaultModeHandler],
    [MapMode.DRAW_FEATURE, drawFeatureModeHandler],
    [MapMode.EDIT_FEATURE, editFeatureModeHandler],
    [MapMode.SEARCH_IN_PROJECT, searchInProjectModeHandler],
    [MapMode.SELECTED_FEATURES, selectedFeaturesModeHandler],
    [MapMode.VERTICES_MODIFICATION, verticesModificationModeHandler]
  ]);

  async init() {
    await this.currentMode.activate();
  }

  async changeMode(newMode: MapMode, props?: ModeProps, reason?: string): Promise<boolean> {
    services.logger.trace(`try change [${MapMode[this.currentMode.mode()]}->${MapMode[newMode]}] => [${reason}]`);
    let confirmed = true;
    if (!this.currentMode.pristine()) {
      confirmed = await doConfirm({
        message: 'Все несохраненные данные будут утеряны.',
        okText: 'Всё равно закрыть',
        cancelText: 'Не закрывать'
      });
    }

    if (!confirmed) {
      return false;
    }

    try {
      if (this.currentMode.mode() === newMode) {
        await this.currentMode.activate(props);

        return true;
      }

      await this.currentMode.deactivate(newMode);

      this.currentMode = this.getHandler(newMode);

      await this.currentMode.activate(props);

      return true;
    } catch (error) {
      services.logger.error('Не удалось сменить режим => ', error);

      return false;
    }
  }

  getHandler(mode: MapMode): MapModeHandler {
    const modeHandler = this.modeHandlers.get(mode);
    if (modeHandler === undefined) {
      throw new Error(`Не найден обработчик для режима: ${mode}`);
    }

    return modeHandler;
  }
}

export const mapModeService = MapModeService.instance;
