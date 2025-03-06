import { mapStore } from '../../../stores/Map.store';
import { mapVerticesModificationStore } from '../../../stores/MapVerticesModification.store';
import { services } from '../../services';
import { wfsFeaturesToFeatures } from '../../util/open-layers.util';
import { mapDrawService } from '../draw/map-draw.service';
import { MapMode } from '../map.models';
import { mapVerticesModificationService } from '../vertices-modification/map-vertices-modification.service';
import { IMapModeHandler } from './models';
import { selectedFeaturesStore } from './selected-features/SelectedFeatures.store';

class VerticesModificationModeHandler implements IMapModeHandler {
  private static _instance: VerticesModificationModeHandler;
  static get instance() {
    return this._instance || (this._instance = new this());
  }

  activate(): Promise<void> {
    services.logger.trace('VerticesModificationModeHandler activate');

    mapDrawService.drawOff();

    mapVerticesModificationService.verticesModificationOn();
    mapDrawService.addFeatures(wfsFeaturesToFeatures(selectedFeaturesStore.features));

    mapStore.setMode(this.mode());

    return Promise.resolve();
  }

  deactivate(): Promise<void> {
    services.logger.trace('VerticesModificationModeHandler deactivate');

    mapVerticesModificationService.verticesModificationOff();
    mapStore.setMode(MapMode.NONE);

    return Promise.resolve();
  }

  mode(): MapMode {
    return MapMode.VERTICES_MODIFICATION;
  }

  pristine(): boolean {
    return mapVerticesModificationStore.modifiedFeatures.length === 0;
  }
}

export const verticesModificationModeHandler = VerticesModificationModeHandler.instance;
