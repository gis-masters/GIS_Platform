import { mapStore } from '../../../../stores/Map.store';
import { sidebars } from '../../../../stores/Sidebars.store';
import { services } from '../../../services';
import { MapMode, MapSelectionTypes } from '../../map.models';
import { type IMapModeHandler, type ModeProps } from '../models';
import { mapSelectionService } from './map-selection.service';
import { type SelectedFeaturesData } from './selectedFeatures.models';
import { selectedFeaturesStore } from './SelectedFeatures.store';

class SelectedFeaturesModeHandler implements IMapModeHandler {
  private static _instance: SelectedFeaturesModeHandler;
  static get instance() {
    return this._instance || (this._instance = new this());
  }

  activate(props?: ModeProps): Promise<void> {
    services.logger.trace('SelectedFeaturesModeHandler activate', props);
    mapStore.setMode(this.mode());

    // Откладываем обновление состояния до следующего тика, чтобы избежать обновления несуществующих компонентов
    setTimeout(() => {
      if (props === undefined) {
        mapSelectionService.selectFeatures(selectedFeaturesStore.features, MapSelectionTypes.REPLACE);
        sidebars.openSelectedFeaturesSidebar();
      } else {
        const selectedFeaturesData = props?.payload as SelectedFeaturesData;
        mapSelectionService.selectFeatures(selectedFeaturesData.features, selectedFeaturesData.type);
        sidebars.openSelectedFeaturesSidebar();
      }
    }, 0);

    return Promise.resolve();
  }

  deactivate(newMode: MapMode): Promise<void> {
    services.logger.trace('SelectedFeaturesModeHandler deactivate');

    // Откладываем обновление состояния до следующего тика, чтобы избежать обновления несуществующих компонентов
    setTimeout(() => {
      // Close the sidebar if the mode is not VERTICES_MODIFICATION
      if (newMode !== MapMode.VERTICES_MODIFICATION) {
        sidebars.closeSelectedFeaturesSidebar();
      }

      // Clear selected features if the mode is not DRAW_FEATURE, EDIT_FEATURE or VERTICES_MODIFICATION
      if (
        newMode !== MapMode.DRAW_FEATURE &&
        newMode !== MapMode.EDIT_FEATURE &&
        newMode !== MapMode.VERTICES_MODIFICATION
      ) {
        mapSelectionService.selectFeatures([], MapSelectionTypes.REPLACE);
      }
    }, 0);

    return Promise.resolve();
  }

  mode(): MapMode {
    return MapMode.SELECTED_FEATURES;
  }

  pristine(): boolean {
    return true;
  }
}

export const selectedFeaturesModeHandler = SelectedFeaturesModeHandler.instance;
