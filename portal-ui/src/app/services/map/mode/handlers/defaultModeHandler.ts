import { editFeatureStore } from '../../../../stores/EditFeature.store';
import { mapStore } from '../../../../stores/Map.store';
import { services } from '../../../services';
import { MapMode } from '../../map.models';
import { type MapModeHandler } from '../map-mode.models';

export const defaultModeHandler: MapModeHandler = {
  activate(): Promise<void> {
    services.logger.trace('DefaultModeImpl activate', editFeatureStore.editFeaturesData);
    mapStore.setMode(this.mode());

    return Promise.resolve();
  },

  deactivate(): Promise<void> {
    services.logger.trace('DefaultModeImpl deactivate');

    return Promise.resolve();
  },

  mode(): MapMode {
    return MapMode.NONE;
  },

  pristine(): boolean {
    return true;
  }
};
