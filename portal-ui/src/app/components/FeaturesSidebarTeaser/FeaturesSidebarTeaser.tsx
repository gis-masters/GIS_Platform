import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { Badge } from '@mui/material';
import { cn } from '@bem-react/classname';
import { EditLocationOutlined, PinDropOutlined } from '@mui/icons-material';
import { action, IReactionDisposer, observable, reaction, makeObservable } from 'mobx';

import { mapStore } from '../../stores/Map.store';
import { ViewLocation } from '../Icons/ViewLocation';
import { IconButton } from '../IconButton/IconButton';
import { sidebars } from '../../stores/Sidebars.store';
import { isUpdateAllowed } from '../../services/data/permissions/permissions.service';
import { getLayerByFeatureInCurrentProject } from '../../services/gis/layers/layers.utils';

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
      !sidebars.featuresSidebarOpen &&
      !sidebars.bugReportOpen &&
      !sidebars.editOpen && (
        <div
          className={cnFeaturesSidebarTeaser({ hidden: !count })}
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
      )
    );
  }

  private async testFeatureUpdateability() {
    if (mapStore.selectedFeatures.length !== 1) {
      this.setFeatureUpdateability(false);

      return;
    }

    let updatingAllowed: boolean = false;

    const feature = mapStore.selectedFeatures[0];
    const operationId = Symbol();
    this.testingFeatureUpdateabilityOperationId = operationId;

    const layer = getLayerByFeatureInCurrentProject(feature);
    if (layer) {
      updatingAllowed = await isUpdateAllowed(layer);
    }

    if (this.testingFeatureUpdateabilityOperationId === operationId) {
      this.setFeatureUpdateability(updatingAllowed);
    }
  }

  @action
  private setFeatureUpdateability(updatable: boolean) {
    this.featureIsUpdatable = updatable;
  }
}
