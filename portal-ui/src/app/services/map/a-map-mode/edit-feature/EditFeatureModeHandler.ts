import { mapStore } from '../../../../stores/Map.store';
import { sidebars } from '../../../../stores/Sidebars.store';
import { services } from '../../../services';
import { MapMode, MapSelectionTypes } from '../../map.models';
import { IMapModeHandler, ModeProps } from '../models';
import { mapSelectionService } from '../selected-features/map-selection.service';
import { selectedFeaturesStore } from '../selected-features/SelectedFeatures.store';
import { EditFeaturesData } from './EditFeature.models';
import { editFeatureHistoryStore } from './EditFeatureHistoryStore';
import { editFeatureStore } from './EditFeatureStore';

class EditFeatureModeHandler implements IMapModeHandler {
  private static _instance: EditFeatureModeHandler;
  static get instance() {
    return this._instance || (this._instance = new this());
  }

  activate(props?: ModeProps): Promise<void> {
    if (props === undefined) {
      return Promise.resolve();
    }

    services.logger.trace('EditFeatureModeHandler activate', props);

    mapStore.setMode(this.mode());

    editFeatureHistoryStore.clear();
    editFeatureStore.setEditFeaturesData(props?.payload as EditFeaturesData);

    sidebars.openEdit();
    sidebars.closeSelectedFeaturesSidebar();

    return Promise.resolve();
  }

  deactivate(newMode: MapMode): Promise<void> {
    services.logger.trace('EditFeatureModeHandler deactivate');

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
  }

  mode(): MapMode {
    return MapMode.EDIT_FEATURE;
  }

  pristine(): boolean {
    return !editFeatureStore.dirty;
  }
}

export const editFeatureModeHandler = EditFeatureModeHandler.instance;
