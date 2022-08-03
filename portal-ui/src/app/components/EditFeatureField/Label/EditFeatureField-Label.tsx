import React, { FC } from 'react';
import { cn } from '@bem-react/classname';

import { ChildrenProps } from '../../../services/models';

import '!style-loader!css-loader!sass-loader!./EditFeatureField-Label.scss';

const cnEditFeatureField = cn('EditFeatureField');

export const EditFeatureFieldLabel: FC<ChildrenProps> = ({ children }) => (
  <div className={cnEditFeatureField('Label')}>{children}</div>
);
