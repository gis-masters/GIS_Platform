import React, { Component } from 'react';
import { observable, action, computed } from 'mobx';
import { observer } from 'mobx-react';
import { cn } from '@bem-react/classname';

import { sidebars } from '../../stores/Sidebars.store';
import { WfsFeature } from '../../services/geoserver/wfs.models';
import { openLayersService } from '../../services/open-layer/open-layers.service';
import { EditFeatureMode } from '../edit-feature/edit-feature.component';
import { FeaturesListItem } from '../FeaturesListItem/FeaturesListItem';

import { FeaturesListEmpty } from './Empty/FeaturesList-Empty';

import '!style-loader!css-loader!sass-loader!./FeaturesList.scss';

const cnFeaturesList = cn('FeaturesList');

@observer
export class FeaturesList extends Component {
  @observable private highlightedFeatureId: string | null = null;
  private highlightAllFeaturesTimeout: number;

  componentDidMount() {
    if (this.features.length > 1) {
      openLayersService.highlightFeatures(this.features);
    }
    if (this.features.length === 1) {
      sidebars.openEdit({ features: sidebars.viewFeatures, mode: EditFeatureMode.single });
    }
  }

  componentDidUpdate() {
    if (!this.highlightedFeatureId) {
      this.componentDidMount();
    }
  }

  componentWillUnmount() {
    openLayersService.clearDraft();
  }

  render() {
    return (
      <div className={cnFeaturesList(null, ['scroll'])}>
        {this.features.length ? (
          this.features.map(feature => (
            <FeaturesListItem
              feature={feature}
              highlighted={feature.id === this.highlightedFeatureId}
              onSelect={this.handleItemSelect}
              onHighlight={this.handleItemHighlight}
              key={feature.id}
            />
          ))
        ) : (
          <FeaturesListEmpty />
        )}
      </div>
    );
  }

  @computed
  private get features(): WfsFeature[] {
    return sidebars.viewFeatures ? sidebars.viewFeatures : [];
  }

  @action.bound
  private handleItemHighlight(feature: WfsFeature | null) {
    if (feature) {
      clearTimeout(this.highlightAllFeaturesTimeout);
      openLayersService.highlightFeatures([feature]);
    } else {
      openLayersService.highlightFeatures(this.features);
    }
    this.highlightedFeatureId = feature && feature.id;
  }

  @action.bound
  private handleItemSelect(feature: WfsFeature) {
    sidebars.openEdit({
      features: [feature],
      mode: EditFeatureMode.single,
      viewFeatures: sidebars.viewFeatures
    });
  }
}
