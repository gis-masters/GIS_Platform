import { SearchInfo } from '../../../components/SearchField/SearchField';
import { mapStore } from '../../../stores/Map.store';
import { sidebars } from '../../../stores/Sidebars.store';
import { services } from '../../services';
import { MapMode } from '../map.models';
import { IMapModeHandler, ModeProps } from './models';

class SearchInProjectModeHandler implements IMapModeHandler {
  private static _instance: SearchInProjectModeHandler;
  static get instance() {
    return this._instance || (this._instance = new this());
  }

  activate(props?: ModeProps): Promise<void> {
    services.logger.trace('SearchInProjectModeHandler activate');
    mapStore.setMode(this.mode());

    sidebars.setSearchValue(props?.payload as SearchInfo);
    sidebars.openSearchSidebar();

    return Promise.resolve();
  }

  deactivate(): Promise<void> {
    services.logger.trace('SearchInProjectModeHandler deactivate');

    return Promise.resolve();
  }

  mode(): MapMode {
    return MapMode.SEARCH_IN_PROJECT;
  }

  pristine(): boolean {
    return true;
  }
}

export const searchInProjectModeHandler = SearchInProjectModeHandler.instance;
