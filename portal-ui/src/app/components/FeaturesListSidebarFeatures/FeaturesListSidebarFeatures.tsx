import React, { Component } from 'react';
import { IReactionDisposer, reaction } from 'mobx';
import { observer } from 'mobx-react';
import { ButtonGroup, Tooltip } from '@mui/material';
import { CancelOutlined, Close, SaveOutlined } from '@mui/icons-material';
import { cn } from '@bem-react/classname';
import { boundMethod } from 'autobind-decorator';

import { communicationService } from '../../services/communication.service';
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

  componentDidMount() {
    communicationService.featuresUpdated.on(this.close, this);
    this.reactionDisposer = reaction(
      () => {
        return mapStore.selectedFeatures.length;
      },
      selectedFeaturesLength => {
        if (!selectedFeaturesLength && !this.props.searchValue) {
          this.close();
        }
      }
    );
  }

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
                    <IconButton
                      color='primary'
                      onClick={this.saveVerticesModification}
                      disabled={
                        mapVerticesModificationStore.modifiedFeatures.length < 1 || mapVerticesModificationStore.saving
                      }
                      loading={mapVerticesModificationStore.saving}
                    >
                      <SaveOutlined />
                    </IconButton>
                  </Tooltip>

                  <Tooltip title='Отменить изменения'>
                    <IconButton
                      color='secondary'
                      onClick={this.cancelVerticesModification}
                      disabled={
                        mapVerticesModificationStore.modifiedFeatures.length < 1 || mapVerticesModificationStore.saving
                      }
                    >
                      <CancelOutlined />
                    </IconButton>
                  </Tooltip>
                </ButtonGroup>
              </div>
            )}

            <VerticesModificationIcon />

            <IconButton className={cnFeaturesListSidebarFeatures('Close')} onClick={this.close}>
              <Close />
            </IconButton>
          </div>
        )}
        {!searchValue && mapStore.selectedFeatures.length >= mapStore.selectingFeaturesLimit && (
          <div className={cnFeaturesListSidebarFeatures('Error')}>
            Максимальное количество выбираемых объектов — {mapStore.selectingFeaturesLimit}
          </div>
        )}
        {searchValue ? <SearchFeaturesList searchValue={searchValue} /> : <SelectedFeaturesList />}
      </div>
    );
  }

  @boundMethod
  private close() {
    if (this.props.searchValue) {
      sidebars.setSearchValue({});
    }

    if (this.props.singleTab || !sidebars.searchValue) {
      sidebars.closeFeaturesSidebar();
    }

    if (sidebars.memorizedViewFeatures?.length) {
      sidebars.setMemorizedFeatures([]);
    }
  }

  private saveVerticesModification() {
    void mapVerticesModificationService.save(mapVerticesModificationStore.modifiedFeatures);
  }

  private cancelVerticesModification() {
    mapVerticesModificationService.verticesModificationClear();
  }
}
