import React from 'react';
import { cn } from '@bem-react/classname';

import '!style-loader!css-loader!sass-loader!./FeaturesList-Empty.scss';

const cnFeaturesList = cn('FeaturesList');

export const FeaturesListEmpty: React.FC = () => (
  <div className={cnFeaturesList('Empty')}>
    Объекты не выбраны
  </div>
);
