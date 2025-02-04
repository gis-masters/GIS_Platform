import React, { Component } from 'react';
import { computed } from 'mobx';
import { observer } from 'mobx-react';

import { mapStore } from '../../stores/Map.store';
import { sidebars } from '../../stores/Sidebars.store';
import { FeaturesList, FeaturesListItemInfo } from '../FeaturesList/FeaturesList';

@observer
export class SelectedFeaturesList extends Component<Record<string, unknown>> {
  render() {
    return <FeaturesList items={this.features} />;
  }

  @computed
  private get features(): FeaturesListItemInfo[] {
    const allFeatures = [...mapStore.selectedFeatures].map(item => {
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
