import { mapStore } from '../../../../stores/Map.store';
import { mapVerticesModificationStore } from '../../../../stores/MapVerticesModification.store';
import { selectedFeaturesStore } from '../../../../stores/SelectedFeatures.store';
import { services } from '../../../services';
import { mapDrawService } from '../../draw/map-draw.service';
import { MapMode } from '../../map.models';
import { getStyle, KnownStyleKey } from '../../styles/map-styles';
import { mapVerticesModificationService } from '../../vertices-modification/map-vertices-modification.service';
import { type MapModeHandler } from '../map-mode.models';

export const verticesModificationModeHandler: MapModeHandler = {
  async activate(): Promise<void> {
    services.logger.trace('VerticesModificationModeHandler activate');

    mapVerticesModificationService.verticesModificationOn();

    selectedFeaturesStore.clearActiveFeature();
    const features = await mapDrawService.getFeatures();
    features.forEach(feature => {
      feature.setStyle(getStyle(KnownStyleKey.SelectedFeaturesWithVertices));
    });

    mapStore.setMode(MapMode.VERTICES_MODIFICATION);
  },

  deactivate(): Promise<void> {
    services.logger.trace('VerticesModificationModeHandler deactivate');

    mapVerticesModificationService.verticesModificationOff();

    return Promise.resolve();
  },

  mode(): MapMode {
    return MapMode.VERTICES_MODIFICATION;
  },

  pristine(): boolean {
    return mapVerticesModificationStore.modifiedFeatures.length === 0;
  }
};
