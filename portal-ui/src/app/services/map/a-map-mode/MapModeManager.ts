import { services } from '../../services';
import { konfirmieren } from '../../utility-dialogs.service';
import { MapMode } from '../map.models';
import { defaultModeHandler } from './DefaultModeHandler';
import { drawFeatureModeHandler } from './DrawFeatureModeHandler';
import { editFeatureModeHandler } from './edit-feature/attributes/EditFeatureModeHandler';
import { IMapModeHandler, ModeProps } from './models';
import { searchInProjectModeHandler } from './SearchInProjectModeHandler';
import { selectedFeaturesModeHandler } from './selected-features/SelectedFeaturesModeHandler';
import { verticesModificationModeHandler } from './VerticesModificationModeHandler';

class MapModeManager {
  private static _instance: MapModeManager;
  static get instance() {
    return this._instance || (this._instance = new this());
  }

  private currentMode: IMapModeHandler = defaultModeHandler;

  private readonly modeHandlers: Map<MapMode, IMapModeHandler> = new Map<MapMode, IMapModeHandler>([
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
      confirmed = await konfirmieren({
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
        services.logger.trace('Режим тот же - деактивация не нужна');

        await this.currentMode.activate(props);

        return true;
      }

      await this.currentMode.deactivate(newMode);
      services.logger.trace('correctly deactivated');

      this.currentMode = this.getHandler(newMode);

      await this.currentMode.activate(props);

      return true;
    } catch (error) {
      services.logger.error('Не удалось сменить режим => ', error);

      return false;
    }
  }

  getHandler(mode: MapMode): IMapModeHandler {
    const modeHandler = this.modeHandlers.get(mode);
    if (modeHandler === undefined) {
      throw new Error(`Не найден обработчик для режима: ${mode}`);
    }

    return modeHandler;
  }
}

export const mapModeManager = MapModeManager.instance;
