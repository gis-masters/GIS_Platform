import React, { Component } from 'react';
import { IReactionDisposer } from 'mobx';
import { observer } from 'mobx-react';
import { ButtonGroup, Tooltip } from '@mui/material';
import { CancelOutlined, Close, SaveOutlined } from '@mui/icons-material';
import { cn } from '@bem-react/classname';
import { boundMethod } from 'autobind-decorator';

import { communicationService } from '../../services/communication.service';
import { mapModeManager } from '../../services/map/a-map-mode/MapModeManager';
import { selectedFeaturesStore } from '../../services/map/a-map-mode/selected-features/SelectedFeatures.store';
import { MapMode } from '../../services/map/map.models';
import { mapVerticesModificationService } from '../../services/map/vertices-modification/map-vertices-modification.service';
import { mapStore } from '../../stores/Map.store';
import { mapVerticesModificationStore } from '../../stores/MapVerticesModification.store';
import { sidebars } from '../../stores/Sidebars.store';
import { IconButton } from '../IconButton/IconButton';
import { SearchFeaturesList } from '../SearchFeaturesList/SearchFeaturesList';
import { SearchInfo } from '../SearchField/SearchField';
import { SelectedFeaturesList } from '../SelectedFeaturesList/SelectedFeaturesList';
import { VerticesModificationIcon } from '../VerticesModificationIcon/VerticesModificationIcon';

import '!style-loader!css-loader!sass-loader!./FeaturesListSidebarFeatures.scss';

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

            {mapStore.mode === MapMode.VERTICES_MODIFICATION && (
              <div className={cnFeaturesListSidebarFeatures('Actions')}>
                <div className={cnFeaturesListSidebarFeatures('Fon')} />
                <ButtonGroup size='small' aria-label='vertices-mode-actions'>
                  <Tooltip title='Сохранить изменения'>
                    <span>
                      <IconButton
                        color='primary'
                        onClick={this.saveVerticesModification}
                        disabled={
                          mapVerticesModificationStore.modifiedFeatures.length < 1 ||
                          mapVerticesModificationStore.saving
                        }
                        loading={mapVerticesModificationStore.saving}
                      >
                        <SaveOutlined />
                      </IconButton>
                    </span>
                  </Tooltip>

                  <Tooltip title='Отменить изменения'>
                    <span>
                      <IconButton
                        color='secondary'
                        onClick={this.cancelVerticesModification}
                        disabled={
                          mapVerticesModificationStore.modifiedFeatures.length < 1 ||
                          mapVerticesModificationStore.saving
                        }
                      >
                        <CancelOutlined />
                      </IconButton>
                    </span>
                  </Tooltip>
                </ButtonGroup>
              </div>
            )}

            {!searchValue && <VerticesModificationIcon />}

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
      success = await mapModeManager.changeMode(MapMode.SELECTED_FEATURES, undefined, 'flc - 1');
      success = await mapModeManager.changeMode(MapMode.NONE, undefined, 'flc - 1.2');
    } else if (mapStore.mode === MapMode.SELECTED_FEATURES) {
      success = await mapModeManager.changeMode(MapMode.NONE, undefined, 'flc - 2');
    } else {
      success = await (selectedFeaturesStore.features.length > 0
        ? mapModeManager.changeMode(MapMode.SELECTED_FEATURES, undefined, 'flc - 3')
        : mapModeManager.changeMode(MapMode.NONE, undefined, 'flc - 4'));
    }

    if (success && this.props.searchValue) {
      sidebars.setSearchValue({});
    }
  }

  private saveVerticesModification() {
    void mapVerticesModificationService.save(mapVerticesModificationStore.modifiedFeatures);
  }

  private cancelVerticesModification() {
    void mapVerticesModificationService.verticesModificationClear();
  }
}
