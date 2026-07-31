import React, { Component } from 'react';
import { type IReactionDisposer } from 'mobx';
import { observer } from 'mobx-react';
import { Tooltip } from '@mui/material';
import { Close } from '@mui/icons-material';
import { cn } from '@bem-react/classname';
import { boundMethod } from 'autobind-decorator';

import { communicationService } from '../../services/communication.service';
import { MapMode } from '../../services/map/map.models';
import { mapModeService } from '../../services/map/mode/map-mode.service';
import { mapStore } from '../../stores/Map.store';
import { selectedFeaturesStore } from '../../stores/SelectedFeatures.store';
import { sidebars } from '../../stores/Sidebars.store';
import { IconButton } from '../IconButton/IconButton';
import { SearchFeaturesList } from '../SearchFeaturesList/SearchFeaturesList';
import { type SearchInfo } from '../SearchField/SearchField';
import { SelectedFeaturesList } from '../SelectedFeaturesList/SelectedFeaturesList';
import { VerticesModification } from '../VerticesModification/VerticesModification';

import './FeaturesListSidebarFeatures.scss';

const cnFeaturesListSidebarFeatures = cn('FeaturesListSidebarFeatures');

interface FeaturesListSidebarFeaturesProps {
  singleTab?: boolean;
  searchValue?: SearchInfo;
}

@observer
export default class FeaturesListSidebarFeatures extends Component<FeaturesListSidebarFeaturesProps> {
  private reactionDisposer?: IReactionDisposer;

  componentWillUnmount() {
    communicationService.off(this);
    this.reactionDisposer?.();
  }

  render() {
    const { searchValue, singleTab } = this.props;

    return (
      <div className={cnFeaturesListSidebarFeatures('Inner', { multiTab: !singleTab })}>
        {singleTab && (
          <div className={cnFeaturesListSidebarFeatures('Header')}>
            {searchValue ? 'Результаты поиска' : 'Выделенные объекты'}

            <VerticesModification showButton={!searchValue} />

            <Tooltip title='Снять выделение со всех объектов (Esc, Esc)'>
              <IconButton className={cnFeaturesListSidebarFeatures('Close')} onClick={this.close}>
                <Close />
              </IconButton>
            </Tooltip>
          </div>
        )}
        {!searchValue && selectedFeaturesStore.features.length >= selectedFeaturesStore.limit && (
          <div className={cnFeaturesListSidebarFeatures('Error')}>
            Максимальное количество выбираемых объектов — {selectedFeaturesStore.limit}
          </div>
        )}
        {searchValue ? <SearchFeaturesList searchValue={searchValue} /> : <SelectedFeaturesList />}
      </div>
    );
  }

  @boundMethod
  private async close() {
    let success: boolean;
    if (mapStore.mode === MapMode.VERTICES_MODIFICATION) {
      success =
        (await mapModeService.changeMode(MapMode.SELECTED_FEATURES, undefined, 'flc - 1')) &&
        (await mapModeService.changeMode(MapMode.NONE, undefined, 'flc - 1.2'));
    } else if (mapStore.mode === MapMode.SELECTED_FEATURES) {
      success = await mapModeService.changeMode(MapMode.NONE, undefined, 'flc - 2');
    } else {
      success = await (selectedFeaturesStore.features.length > 0
        ? mapModeService.changeMode(MapMode.SELECTED_FEATURES, undefined, 'flc - 3')
        : mapModeService.changeMode(MapMode.NONE, undefined, 'flc - 4'));
    }

    if (success && this.props.searchValue) {
      sidebars.setSearchValue({});
    }
  }
}
