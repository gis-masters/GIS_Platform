import { mapStore } from '../../../../stores/Map.store';
import { selectedFeaturesStore } from '../../../../stores/SelectedFeatures.store';
import { sidebars } from '../../../../stores/Sidebars.store';
import { services } from '../../../services';
import { sleep } from '../../../util/sleep';
import { MapMode, MapSelectionTypes } from '../../map.models';
import { type SelectedFeaturesData } from '../../selection/map-selection.models';
import { mapSelectionService } from '../../selection/map-selection.service';
import { type MapModeHandler, type ModeProps } from '../map-mode.models';

export const selectedFeaturesModeHandler: MapModeHandler = {
  async activate(props?: ModeProps): Promise<void> {
    services.logger.trace('SelectedFeaturesModeHandler activate', props);
    mapStore.setMode(this.mode());

    // Откладываем обновление состояния до следующего тика, чтобы избежать обновления несуществующих компонентов
    await sleep(0);

    if (props === undefined) {
      mapSelectionService.selectFeatures(selectedFeaturesStore.features, MapSelectionTypes.REPLACE);
      sidebars.openSelectedFeaturesSidebar();
    } else {
      const selectedFeaturesData = props?.payload as SelectedFeaturesData;
      mapSelectionService.selectFeatures(selectedFeaturesData.features, selectedFeaturesData.type);
      sidebars.openSelectedFeaturesSidebar();
    }
  },

  async deactivate(newMode: MapMode): Promise<void> {
    services.logger.trace('SelectedFeaturesModeHandler deactivate');

    // Откладываем обновление состояния до следующего тика, чтобы избежать обновления несуществующих компонентов
    await sleep(0);

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
  },

  mode(): MapMode {
    return MapMode.SELECTED_FEATURES;
  },

  pristine(): boolean {
    return true;
  }
};
