import React, { Component } from 'react';
import { observable, action, computed } from 'mobx';
import { observer } from 'mobx-react';
import { cn } from '@bem-react/classname';
import { Coordinate } from 'ol/coordinate';

import { MapSelectionTypes, sidebars } from '../../stores/Sidebars.store';
import { CoordinateEdited, WfsFeature } from '../../services/geoserver/wfs.models';
import { mapService } from '../../services/map/map.service';
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
      mapService.highlightFeatures(this.features);
    }
  }

  componentDidUpdate() {
    if (!this.highlightedFeatureId) {
      this.componentDidMount();
    }
  }

  componentWillUnmount() {
    mapService.clearDraft();
  }

  render() {
    return (
      <div className={cnFeaturesList(null, ['scroll'])}>
        {this.features.length ? (
          this.features.map((feature: WfsFeature) => (
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
  private get features(): WfsFeature<Coordinate | CoordinateEdited>[] {
    return sidebars.viewFeatures ? sidebars.viewFeatures : [];
  }

  @action.bound
  private handleItemHighlight(feature: WfsFeature | null) {
    if (feature) {
      clearTimeout(this.highlightAllFeaturesTimeout);
      mapService.highlightFeatures([feature]);
    } else {
      mapService.highlightFeatures(this.features);
    }
    this.highlightedFeatureId = feature && feature.id;
  }

  @action.bound
  private handleItemSelect(feature: WfsFeature) {
    sidebars.setMemorizedFeatures(sidebars.viewFeatures);
    sidebars.openFeatures([feature], MapSelectionTypes.REPLACE);
  }
}
