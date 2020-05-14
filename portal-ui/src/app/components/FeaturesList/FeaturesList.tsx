import React, { Component } from 'react';
import { observable, action } from 'mobx';
import { observer } from 'mobx-react';
import { cn } from '@bem-react/classname';

import { WfsFeature } from '../../services/geoserver/wfs-models';
import { FeaturesListItem } from '../FeaturesListItem/FeaturesListItem';

import { FeaturesListEmpty } from './Empty/FeaturesList-Empty';

import '!style-loader!css-loader!sass-loader!./FeaturesList.scss';

const cnFeaturesList = cn('FeaturesList');

interface FeaturesListProps {
  features?: WfsFeature[];
  onItemSelect: (item: WfsFeature) => void;
  onItemHighlight: (item: WfsFeature | null) => void;

}

@observer
export class FeaturesList extends Component<FeaturesListProps> {
  @observable private highlightedFeatureId: string | null = null;

  constructor (props: FeaturesListProps) {
    super(props);

    this.handleItemHighlight = this.handleItemHighlight.bind(this);
  }

  render () {
    const { features, onItemSelect } = this.props;

    return (
      <div className={cnFeaturesList()}>
        {features && features.length ?
            features.map(feature => (
                <FeaturesListItem
                    feature={feature}
                    highlighted={feature.id === this.highlightedFeatureId}
                    onSelect={onItemSelect}
                    onHighlight={this.handleItemHighlight}
                    key={feature.id}
                />
            )) :
            <FeaturesListEmpty />}
      </div>
    );
  }

  @action
  private handleItemHighlight (feature: WfsFeature | null) {
    this.props.onItemHighlight(feature);
    this.highlightedFeatureId = feature && feature.id;
  }
}
