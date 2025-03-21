import { mapStore } from '../../../stores/Map.store';
import { services } from '../../services';
import { MapMode } from '../map.models';
import { editFeatureStore } from './edit-feature/EditFeatureStore';
import { IMapModeHandler } from './models';

class DefaultModeHandler implements IMapModeHandler {
  private static _instance: DefaultModeHandler;
  static get instance() {
    return this._instance || (this._instance = new this());
  }

  activate(): Promise<void> {
    services.logger.trace('DefaultModeImpl activate', editFeatureStore.editFeaturesData);
    mapStore.setMode(this.mode());

    return Promise.resolve();
  }

  deactivate(): Promise<void> {
    services.logger.trace('DefaultModeImpl deactivate');

    return Promise.resolve();
  }

  mode(): MapMode {
    return MapMode.NONE;
  }

  pristine(): boolean {
    return true;
  }
}

export const defaultModeHandler = DefaultModeHandler.instance;
