import React, { Component } from 'react';
import {} from 'mobx';
import { observer } from 'mobx-react';
import { IconButton } from '@mui/material';
import { Close } from '@mui/icons-material';
import { cn } from '@bem-react/classname';
import { boundMethod } from 'autobind-decorator';

import { sidebars } from '../../stores/Sidebars.store';
import { communicationService } from '../../services/communication.service';
import { FeaturesList } from '../FeaturesList/FeaturesList';

import '!style-loader!css-loader!sass-loader!./FeaturesListSidebar.scss';
import { services } from '../../services/services';

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
          {sidebars.isFeaturesLimitReached && (
            <div className={cnFeaturesListSidebar('Error')}>
              Максимальное количество выбираемых объектов ограничено 100 объектами
            </div>
          )}
          <FeaturesList />
        </div>
      </div>
    );
  }

  @boundMethod
  private async close() {
    await services.provided;
    await services.router.navigate([location.pathname], {
      queryParams: {
        features: null,
        queryFilter: null,
        queryLayers: null
      },
      queryParamsHandling: 'merge'
    });
    sidebars.closeFeatures();
  }
}
