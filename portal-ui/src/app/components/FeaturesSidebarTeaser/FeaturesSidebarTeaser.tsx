import React, { Component } from 'react';
import { action, IReactionDisposer, makeObservable, observable, reaction } from 'mobx';
import { observer } from 'mobx-react';
import { Badge } from '@mui/material';
import { ChevronRight, EditLocationOutlined, PinDropOutlined } from '@mui/icons-material';
import { cn } from '@bem-react/classname';
import { boundMethod } from 'autobind-decorator';

import { getLayerByFeatureInCurrentProject } from '../../services/gis/layers/layers.utils';
import { isUpdateAllowed } from '../../services/permissions/permissions.service';
import { mapStore } from '../../stores/Map.store';
import { sidebars } from '../../stores/Sidebars.store';
import { IconButton } from '../IconButton/IconButton';
import { ViewLocation } from '../Icons/ViewLocation';

import '!style-loader!css-loader!sass-loader!./FeaturesSidebarTeaser.scss';

const cnFeaturesSidebarTeaser = cn('FeaturesSidebarTeaser');

@observer
export class FeaturesSidebarTeaser extends Component {
  private reactionDisposer?: IReactionDisposer;
  private testingFeatureUpdateabilityOperationId?: symbol;

  @observable private featureIsUpdatable = false;

  constructor(props: Record<string, never>) {
    super(props);
    makeObservable(this);
  }

  componentDidMount() {
    this.reactionDisposer = reaction(
      () => [...mapStore.selectedFeatures],
      async () => {
        await this.testFeatureUpdateability();
      },
      { fireImmediately: true }
    );
  }

  componentWillUnmount() {
    this.reactionDisposer?.();
  }

  render() {
    const count =
      mapStore.selectedFeatures.length ||
      sidebars.deletedFeatures?.length ||
      sidebars.featuresWithNoAccess?.length ||
      sidebars.deletedLayers?.length;
    let Icon = PinDropOutlined;

    if (count === 1) {
      Icon = this.featureIsUpdatable ? EditLocationOutlined : ViewLocation;
    }

    return (
      <>
        {this.isBadgeMode ? (
          <div
            className={cnFeaturesSidebarTeaser({ badge: true, hidden: !count })}
            style={{ '--FeaturesSidebarTeaserBadgeDigits': Math.min(String(count).length, 5) }}
          >
            <IconButton onClick={sidebars.openSelectedFeaturesSidebar}>
              <Badge
                badgeContent={count}
                anchorOrigin={{ horizontal: 'left', vertical: 'top' }}
                color='primary'
                max={9999}
              >
                <Icon />
              </Badge>
            </IconButton>
          </div>
        ) : (
          <div>
            <div className={cnFeaturesSidebarTeaser({ chevron: true })}>
              <ChevronRight onClick={this.hideFeatureSidebar} />
            </div>
          </div>
        )}
      </>
    );
  }

  @boundMethod
  private hideFeatureSidebar() {
    sidebars.closeFeaturesSidebar();
    sidebars.closeEdit();
  }

  private get isBadgeMode(): boolean {
    return !sidebars.featuresSidebarOpen && !sidebars.editOpen;
  }

  @action
  private setFeatureUpdateability(updatable: boolean) {
    this.featureIsUpdatable = updatable;
  }

  private async testFeatureUpdateability() {
    if (mapStore.selectedFeatures.length !== 1) {
      this.setFeatureUpdateability(false);

      return;
    }

    let updatingAllowed: boolean = false;

    const operationId = Symbol();
    this.testingFeatureUpdateabilityOperationId = operationId;

    const firstFeature = mapStore.selectedFeatures[0];
    const layer = getLayerByFeatureInCurrentProject(firstFeature);
    if (layer) {
      updatingAllowed = await isUpdateAllowed(layer);
    }

    if (this.testingFeatureUpdateabilityOperationId === operationId) {
      this.setFeatureUpdateability(updatingAllowed);
    }
  }
}
