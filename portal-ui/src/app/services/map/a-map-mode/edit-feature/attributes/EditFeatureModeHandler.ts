import { mapStore } from '../../../../../stores/Map.store';
import { sidebars } from '../../../../../stores/Sidebars.store';
import { services } from '../../../../services';
import { MapMode, MapSelectionTypes } from '../../../map.models';
import { IMapModeHandler, ModeProps } from '../../models';
import { mapSelectionService } from '../../selected-features/map-selection.service';
import { EditFeaturesData } from '../EditFeature.models';
import { editFeatureStore } from '../EditFeatureStore';

class EditFeatureModeHandler implements IMapModeHandler {
  private static _instance: EditFeatureModeHandler;
  static get instance() {
    return this._instance || (this._instance = new this());
  }

  activate(props?: ModeProps): Promise<void> {
    services.logger.trace('EditFeatureModeHandler activate', props);
    if (props === undefined) {
      services.logger.trace('Не удалось активировать режим EDIT_FEATURE - не корректные входные данные', props);

      return Promise.resolve();
    }

    mapStore.setMode(this.mode());

    editFeatureStore.setEditFeaturesData(props?.payload as EditFeaturesData);

    sidebars.openEdit();
    sidebars.closeSelectedFeaturesSidebar();

    return Promise.resolve();
  }

  deactivate(newMode: MapMode): Promise<void> {
    services.logger.trace('EditFeatureModeHandler deactivate: ', MapMode[newMode]);

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
