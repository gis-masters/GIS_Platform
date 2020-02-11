import React from 'react';
import { cn } from '@bem-react/classname';

import { WfsFeature } from '../../services/geoserver/wfs-models';
import { FeaturesListItem } from '../FeaturesListItem/FeaturesListItem';

import { FeaturesListEmpty } from './Empty/FeaturesList-Empty';

import '!style-loader!css-loader!sass-loader!./FeaturesList.scss';

const cnFeaturesList = cn('FeaturesList');

interface FeaturesListProps {
  features?: WfsFeature[];
  onItemSelect: (item: WfsFeature) => void;
}

export const FeaturesList: React.FC<FeaturesListProps> = ({ features, onItemSelect }) => (
  <div className={cnFeaturesList()}>
    {features && features.length ?
        features.map(feature => (
            <FeaturesListItem
                feature={feature}
                key={feature.id}
                onSelect={onItemSelect}
            />
        )) :
        <FeaturesListEmpty />}
  </div>
);
