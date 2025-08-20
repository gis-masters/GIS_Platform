import { mapStore } from '../../../stores/Map.store';
import { sidebars } from '../../../stores/Sidebars.store';
import { extractFeatureId } from '../../geoserver/featureType/featureType.util';
import { WfsFeature } from '../../geoserver/wfs/wfs.models';
import { services } from '../../services';
import { mapDrawService } from '../draw/map-draw.service';
import { toDrawGeometry } from '../draw/map-draw.util';
import { MapMode, MapSelectionTypes } from '../map.models';
import { EditFeaturesData } from './edit-feature/EditFeature.models';
import { editFeatureStore } from './edit-feature/EditFeatureStore';
import { IMapModeHandler, ModeProps } from './models';
import { mapSelectionService } from './selected-features/map-selection.service';
import { selectedFeaturesStore } from './selected-features/SelectedFeatures.store';

class DrawFeatureModeHandler implements IMapModeHandler {
  private static _instance: DrawFeatureModeHandler;
  static get instance() {
    return this._instance || (this._instance = new this());
  }

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
  }

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
  }

  mode(): MapMode {
    return MapMode.DRAW_FEATURE;
  }

  pristine(): boolean {
    return !editFeatureStore.dirty;
  }
}

export const drawFeatureModeHandler = DrawFeatureModeHandler.instance;
