import React, { FC } from 'react';
import { cn } from '@bem-react/classname';

import '!style-loader!css-loader!sass-loader!./Explorer-InfoDescTitle.scss';

const cnExplorerInfoDescTitle = cn('Explorer', 'InfoDescTitle');

export const ExplorerInfoDescTitle: FC = ({ children }) => (
  <span className={cnExplorerInfoDescTitle()}>{children}</span>
);
