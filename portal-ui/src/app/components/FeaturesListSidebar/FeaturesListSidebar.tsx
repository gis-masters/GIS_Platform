import React, { Component } from 'react';
import {} from 'mobx';
import { observer } from 'mobx-react';
import { IconButton } from '@material-ui/core';
import { Close } from '@material-ui/icons';
import { cn } from '@bem-react/classname';
import { boundMethod } from 'autobind-decorator';

import { sidebars } from '../../stores/Sidebars.store';
import { communicationService } from '../../services/communication.service';
import { FeaturesList } from '../FeaturesList/FeaturesList';

import '!style-loader!css-loader!sass-loader!./FeaturesListSidebar.scss';

const cnFeaturesListSidebar = cn('FeaturesListSidebar');

interface FeaturesListSidebarProps {}

@observer
export class FeaturesListSidebar extends Component<FeaturesListSidebarProps> {
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

          <FeaturesList />
        </div>
      </div>
    );
  }

  @boundMethod
  private close() {
    sidebars.closeFeatures();
  }
}
