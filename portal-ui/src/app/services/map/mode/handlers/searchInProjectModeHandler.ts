import { type SearchInfo } from '../../../../components/SearchField/SearchField';
import { mapStore } from '../../../../stores/Map.store';
import { sidebars } from '../../../../stores/Sidebars.store';
import { services } from '../../../services';
import { MapMode } from '../../map.models';
import { type MapModeHandler, type ModeProps } from '../map-mode.models';

export const searchInProjectModeHandler: MapModeHandler = {
  activate(props?: ModeProps): Promise<void> {
    services.logger.trace('SearchInProjectModeHandler activate');
    mapStore.setMode(this.mode());

    sidebars.setSearchValue(props?.payload as SearchInfo);
    sidebars.openSearchSidebar();

    return Promise.resolve();
  },

  deactivate(): Promise<void> {
    services.logger.trace('SearchInProjectModeHandler deactivate');

    return Promise.resolve();
  },

  mode(): MapMode {
    return MapMode.SEARCH_IN_PROJECT;
  },

  pristine(): boolean {
    return true;
  }
};
