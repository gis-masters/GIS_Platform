import React, { Component } from 'react';
import { computed } from 'mobx';
import { observer } from 'mobx-react';

import { selectedFeaturesStore } from '../../services/map/a-map-mode/selected-features/SelectedFeatures.store';
import { sidebars } from '../../stores/Sidebars.store';
import { FeaturesList, FeaturesListItemInfo } from '../FeaturesList/FeaturesList';

@observer
export class SelectedFeaturesList extends Component<Record<string, unknown>> {
  render() {
    return <FeaturesList items={this.features} />;
  }

  @computed
  private get features(): FeaturesListItemInfo[] {
    const allFeatures = [...selectedFeaturesStore.features].map(item => {
      return { feature: item };
    });

    const allErrors = [
      ...(sidebars.deletedFeatures || []),
      ...(sidebars.featuresWithNoAccess || []),
      ...(sidebars.deletedLayers || [])
    ].map(item => {
      return { error: item };
    });

    return [...allFeatures, ...allErrors];
  }
}
