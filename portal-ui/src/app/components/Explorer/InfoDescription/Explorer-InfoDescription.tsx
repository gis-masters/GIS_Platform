import React, { FC } from 'react';
import { cn } from '@bem-react/classname';

import '!style-loader!css-loader!sass-loader!./Explorer-InfoDescription.scss';

const cnExplorerInfoDescription = cn('Explorer', 'InfoDescription');

export const ExplorerInfoDescription: FC = ({ children }) => (
  <div className={cnExplorerInfoDescription()}>{children}</div>
);
