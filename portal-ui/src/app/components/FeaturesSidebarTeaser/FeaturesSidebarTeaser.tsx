import React, { Component } from 'react';
import { action, IReactionDisposer, observable, reaction, makeObservable } from 'mobx';
import { observer } from 'mobx-react';
import { Badge } from '@mui/material';
import { EditLocationOutlined, PinDropOutlined } from '@mui/icons-material';
import { cn } from '@bem-react/classname';

import { mapStore } from '../../stores/Map.store';
import { sidebars } from '../../stores/Sidebars.store';
import { getLayerByFeatureInCurrentProject } from '../../services/gis/layers.service';
import { isFeaturesUpdateAllowed } from '../../services/data/permissions.service';
import { IconButton } from '../IconButton/IconButton';
import { ViewLocation } from '../Icons/ViewLocation';

import '!style-loader!css-loader!sass-loader!./FeaturesSidebarTeaser.scss';

const cnFeaturesSidebarTeaser = cn('FeaturesSidebarTeaser');

@observer
export class FeaturesSidebarTeaser extends Component {
  private reactionDisposer: IReactionDisposer;
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
    this.reactionDisposer();
  }

  render() {
    const count = mapStore.selectedFeatures.length;
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
          <IconButton onClick={sidebars.openFeaturesSidebar}>
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

    const feature = mapStore.selectedFeatures[0];
    const operationId = Symbol();
    this.testingFeatureUpdateabilityOperationId = operationId;
    const layer = getLayerByFeatureInCurrentProject(feature);
    const updatingAllowed = await isFeaturesUpdateAllowed(layer.dataset, layer.tableName, layer.schemaId);

    if (this.testingFeatureUpdateabilityOperationId === operationId) {
      this.setFeatureUpdateability(updatingAllowed);
    }
  }

  @action
  private setFeatureUpdateability(updatable: boolean) {
    this.featureIsUpdatable = updatable;
  }
}
