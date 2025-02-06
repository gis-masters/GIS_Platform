import React, { FC } from 'react';
import { cn } from '@bem-react/classname';

import '!style-loader!css-loader!sass-loader!./FeaturesList-Empty.scss';

const cnFeaturesList = cn('FeaturesList');

export const FeaturesListEmpty: FC = () => <div className={cnFeaturesList('Empty')}>Нет выделенных объектов</div>;
