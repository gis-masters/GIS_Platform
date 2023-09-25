import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { IconButton } from '@mui/material';
import { Close } from '@mui/icons-material';
import { cn } from '@bem-react/classname';
import { boundMethod } from 'autobind-decorator';
import { IReactionDisposer, reaction } from 'mobx';

import { sidebars } from '../../stores/Sidebars.store';
import { mapStore } from '../../stores/Map.store';
import { communicationService } from '../../services/communication.service';
import { FeaturesList } from '../FeaturesList/FeaturesList';

import '!style-loader!css-loader!sass-loader!./FeaturesListSidebar.scss';

const cnFeaturesListSidebar = cn('FeaturesListSidebar');

@observer
export default class FeaturesListSidebar extends Component {
  private reactionDisposer?: IReactionDisposer;

  componentDidMount() {
    communicationService.featuresUpdated.on(this.close, this);
    this.reactionDisposer = reaction(
      () => {
        return mapStore.selectedFeatures.length;
      },
      selectedFeaturesLength => {
        if (!selectedFeaturesLength) {
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
    return (
      <div className={cnFeaturesListSidebar()}>
        <div className={cnFeaturesListSidebar('Inner')}>
          <div className={cnFeaturesListSidebar('Header')}>
            Объекты
            <IconButton className={cnFeaturesListSidebar('Close')} onClick={this.close}>
              <Close />
            </IconButton>
          </div>
          {mapStore.selectedFeatures.length >= mapStore.selectingFeaturesLimit && (
            <div className={cnFeaturesListSidebar('Error')}>
              Максимальное количество выбираемых объектов — {mapStore.selectingFeaturesLimit}
            </div>
          )}
          <FeaturesList />
        </div>
      </div>
    );
  }

  @boundMethod
  private close() {
    sidebars.closeFeaturesSidebar();
  }
}
