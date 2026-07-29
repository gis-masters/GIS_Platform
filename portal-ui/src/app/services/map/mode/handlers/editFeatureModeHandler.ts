import { editFeatureStore } from '../../../../stores/EditFeature.store';
import { editFeatureHistoryStore } from '../../../../stores/EditFeatureHistory.store';
import { mapStore } from '../../../../stores/Map.store';
import { selectedFeaturesStore } from '../../../../stores/SelectedFeatures.store';
import { sidebars } from '../../../../stores/Sidebars.store';
import { MapMode, MapSelectionTypes } from '../../map.models';
import { mapSelectionService } from '../../selection/map-selection.service';
import { type EditFeaturesData, type MapModeHandler, type ModeProps } from '../map-mode.models';

export const editFeatureModeHandler: MapModeHandler = {
  activate(props?: ModeProps): Promise<void> {
    if (props === undefined) {
      return Promise.resolve();
    }

    mapStore.setMode(this.mode());

    editFeatureHistoryStore.clear();
    editFeatureStore.setEditFeaturesData(props?.payload as EditFeaturesData);

    sidebars.openEdit();
    sidebars.closeSelectedFeaturesSidebar();

    return Promise.resolve();
  },

  deactivate(newMode: MapMode): Promise<void> {
    // Если есть несохраненные изменения, откатываем их
    if (!editFeatureStore.pristine) {
      const originalGeometry = editFeatureHistoryStore.getOriginalGeometry();
      if (originalGeometry) {
        editFeatureStore.setGeometry(originalGeometry, false);
        if (editFeatureStore.firstFeature) {
          selectedFeaturesStore.updateFeature(editFeatureStore.firstFeature);
        }
      }
    }

    if (newMode === MapMode.NONE) {
      mapSelectionService.selectFeatures([], MapSelectionTypes.REPLACE);
      sidebars.closeSelectedFeaturesSidebar();
    }

    sidebars.closeEdit();

    return Promise.resolve();
  },

  mode(): MapMode {
    return MapMode.EDIT_FEATURE;
  },

  pristine(): boolean {
    return !editFeatureStore.dirty;
  }
};
