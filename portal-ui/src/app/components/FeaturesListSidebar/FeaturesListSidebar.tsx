import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { IconButton } from '@mui/material';
import { Close } from '@mui/icons-material';
import { cn } from '@bem-react/classname';
import { boundMethod } from 'autobind-decorator';

import { sidebars } from '../../stores/Sidebars.store';
import { mapStore, SELECTING_FEATURES_LIMIT } from '../../stores/Map.store';
import { communicationService } from '../../services/communication.service';
import { FeaturesList } from '../FeaturesList/FeaturesList';

import '!style-loader!css-loader!sass-loader!./FeaturesListSidebar.scss';

const cnFeaturesListSidebar = cn('FeaturesListSidebar');

@observer
export class FeaturesListSidebar extends Component {
  componentDidMount() {
    communicationService.featuresUpdated.on(this.close, this);
  }

  componentWillUnmount() {
    communicationService.off(this);
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
          {mapStore.selectedFeatures.length >= SELECTING_FEATURES_LIMIT && (
            <div className={cnFeaturesListSidebar('Error')}>
              Максимальное количество выбираемых объектов — {SELECTING_FEATURES_LIMIT}
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
