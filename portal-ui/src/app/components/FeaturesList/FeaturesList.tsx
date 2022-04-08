import React, { Component } from 'react';
import { observable, action, computed } from 'mobx';
import { observer } from 'mobx-react';
import { cn } from '@bem-react/classname';

import { EditFeatureMode, sidebars } from '../../stores/Sidebars.store';
import { WfsFeature } from '../../services/geoserver/wfs.models';
import { mapService } from '../../services/map/map.service';
import { FeaturesListItem } from '../FeaturesListItem/FeaturesListItem';
import { FeaturesListEmpty } from './Empty/FeaturesList-Empty';
import { FeatureError } from '../../services/map/map-link-following.service';

import '!style-loader!css-loader!sass-loader!./FeaturesList.scss';

const cnFeaturesList = cn('FeaturesList');

@observer
export class FeaturesList extends Component {
  @observable private highlightedFeatureId: string | null = null;
  private highlightAllFeaturesTimeout: number;

  componentDidMount() {
    mapService.highlightFeatures(this.features);
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
    const featuresErrors: FeatureError[] = [
      ...(sidebars.deletedFeatures || []),
      ...(sidebars.featuresWithNoAccess || []),
      ...(sidebars.deletedLayers || [])
    ];

    return (
      <div className={cnFeaturesList(null, ['scroll'])}>
        {this.features.map(feature => (
          <FeaturesListItem
            feature={feature}
            highlighted={feature.id === this.highlightedFeatureId}
            onSelect={this.handleItemSelect}
            onHighlight={this.handleItemHighlight}
            key={feature.id}
          />
        ))}

        {featuresErrors.map(featureError => (
          <FeaturesListItem errorData={featureError} key={featureError.id} />
        ))}

        {!this.features.length && !featuresErrors.length && <FeaturesListEmpty />}
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
      mapService.highlightFeatures([feature]);
    } else {
      mapService.highlightFeatures(this.features);
    }
    this.highlightedFeatureId = feature && feature.id;
  }

  @action.bound
  private handleItemSelect(feature: WfsFeature) {
    sidebars.setMemorizedFeatures(sidebars.viewFeatures);
    sidebars.closeSidebar();
    sidebars.openEdit({ features: [feature], mode: EditFeatureMode.single });
  }
}
