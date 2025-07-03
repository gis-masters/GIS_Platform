import React, { Component } from 'react';
import { action, IReactionDisposer, makeObservable, observable, reaction } from 'mobx';
import { observer } from 'mobx-react';
import { Badge } from '@mui/material';
import { ChevronRight, EditLocationOutlined, PinDropOutlined } from '@mui/icons-material';
import { cn } from '@bem-react/classname';
import { boundMethod } from 'autobind-decorator';

import { getLayerByFeatureInCurrentProject } from '../../services/gis/layers/layers.utils';
import { editFeatureStore } from '../../services/map/a-map-mode/edit-feature/EditFeatureStore';
import { selectedFeaturesStore } from '../../services/map/a-map-mode/selected-features/SelectedFeatures.store';
import { MapMode } from '../../services/map/map.models';
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
      () => [...selectedFeaturesStore.features],
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
      selectedFeaturesStore.features.length ||
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
            <IconButton onClick={this.showSidebar}>
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
          <div className={cnFeaturesSidebarTeaser({ chevron: true })}>
            <ChevronRight onClick={this.hideSidebar} color={this.canBeHidden() ? 'primary' : 'disabled'} />
          </div>
        )}
      </>
    );
  }

  @boundMethod
  private showSidebar() {
    if (mapStore.mode === MapMode.SELECTED_FEATURES) {
      sidebars.openSelectedFeaturesSidebar();
    } else if (mapStore.mode === MapMode.EDIT_FEATURE) {
      sidebars.openEdit();
    }
  }

  @boundMethod
  private hideSidebar() {
    if (mapStore.mode === MapMode.SELECTED_FEATURES && this.canBeHidden()) {
      sidebars.closeSelectedFeaturesSidebar();
    } else if (mapStore.mode === MapMode.EDIT_FEATURE && this.canBeHidden()) {
      sidebars.closeEdit('hideFeatureSidebar');
    }
  }

  private canBeHidden() {
    if (mapStore.mode === MapMode.SELECTED_FEATURES) {
      return true;
    } else if (mapStore.mode === MapMode.EDIT_FEATURE) {
      return !editFeatureStore.dirty;
    }
  }

  private get isBadgeMode(): boolean {
    return !sidebars.selectedFeaturesSidebarOpen && !sidebars.editFeatureOpen;
  }

  @action
  private setFeatureUpdateability(updatable: boolean) {
    this.featureIsUpdatable = updatable;
  }

  private async testFeatureUpdateability() {
    if (selectedFeaturesStore.features.length !== 1) {
      this.setFeatureUpdateability(false);

      return;
    }

    let updatingAllowed: boolean = false;

    const operationId = Symbol();
    this.testingFeatureUpdateabilityOperationId = operationId;

    const firstFeature = selectedFeaturesStore.features[0];
    const layer = getLayerByFeatureInCurrentProject(firstFeature);
    if (layer) {
      updatingAllowed = await isUpdateAllowed(layer);
    }

    if (this.testingFeatureUpdateabilityOperationId === operationId) {
      this.setFeatureUpdateability(updatingAllowed);
    }
  }
}
