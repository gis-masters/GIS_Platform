import { editFeatureStore } from '../../../../stores/EditFeature.store';
import { mapStore } from '../../../../stores/Map.store';
import { selectedFeaturesStore } from '../../../../stores/SelectedFeatures.store';
import { sidebars } from '../../../../stores/Sidebars.store';
import { extractFeatureId } from '../../../geoserver/featureType/featureType.util';
import { type WfsFeature } from '../../../geoserver/wfs/wfs.models';
import { services } from '../../../services';
import { mapDrawService } from '../../draw/map-draw.service';
import { toDrawGeometry } from '../../draw/map-draw.util';
import { MapMode, MapSelectionTypes } from '../../map.models';
import { mapSelectionService } from '../../selection/map-selection.service';
import { type EditFeaturesData, type MapModeHandler, type ModeProps } from '../map-mode.models';

export const drawFeatureModeHandler: MapModeHandler = {
  activate(props?: ModeProps): Promise<void> {
    services.logger.trace('DrawFeatureModeHandler activate');
    if (props === undefined) {
      services.logger.trace('Не удалось активировать режим DRAW_FEATURE - не корректные входные данные', props);

      return Promise.resolve();
    }

    mapStore.setMode(this.mode());

    const data = props?.payload as EditFeaturesData;

    editFeatureStore.setEditFeaturesData(data);
    sidebars.openEdit();
    sidebars.closeSelectedFeaturesSidebar();

    void mapDrawService.drawOn(toDrawGeometry(data.features[0].geometry?.type));

    return Promise.resolve();
  },

  deactivate(newMode: MapMode): Promise<void> {
    services.logger.trace('DrawFeatureModeHandler deactivate');

    sidebars.closeEdit('DRAW_FEATURE deactivate');

    if (newMode === MapMode.NONE) {
      mapSelectionService.selectFeatures([], MapSelectionTypes.REPLACE);
      sidebars.closeSelectedFeaturesSidebar();
    }

    if (newMode === MapMode.SELECTED_FEATURES) {
      const newFeature: WfsFeature | undefined = selectedFeaturesStore.features.find(
        feature => extractFeatureId(feature.id) === 0
      );

      if (newFeature) {
        mapSelectionService.selectFeatures([newFeature], MapSelectionTypes.REMOVE);
      }
    }

    mapDrawService.drawOff();

    return Promise.resolve();
  },

  mode(): MapMode {
    return MapMode.DRAW_FEATURE;
  },

  pristine(): boolean {
    return !editFeatureStore.dirty;
  }
};
