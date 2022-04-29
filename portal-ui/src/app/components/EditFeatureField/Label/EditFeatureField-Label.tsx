import React, { FC, ReactNode } from 'react';
import { cn } from '@bem-react/classname';

import '!style-loader!css-loader!sass-loader!./EditFeatureField-Label.scss';

const cnEditFeatureField = cn('EditFeatureField');

interface EditFeatureFieldLabelProps {
  children: ReactNode;
}

export const EditFeatureFieldLabel: FC<EditFeatureFieldLabelProps> = ({ children }) => (
  <div className={cnEditFeatureField('Label')}>{children}</div>
);
