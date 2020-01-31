import * as React from 'react';
import { cn } from '@bem-react/classname';

import '!style-loader!css-loader!sass-loader!./EditFeatureField-Label.scss';

const cnEditFeatureField = cn('EditFeatureField');

export const EditFeatureFieldLabel: React.FC = ({ children }) => (
  <div className={cnEditFeatureField('Label')}>
    {children}
  </div>
);
