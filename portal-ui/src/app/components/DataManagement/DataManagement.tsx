import React, { FC } from 'react';
import { cn } from '@bem-react/classname';

import { ExplorerItemType } from '../Explorer/Explorer.models';
import { Explorer } from '../Explorer/Explorer';

import '!style-loader!css-loader!sass-loader!./DataManagement.scss';

const cnDataManagement = cn('DataManagement');

export const DataManagement: FC = () => (
  <div className={cnDataManagement()}>
    <Explorer preset={ExplorerItemType.ROOT} urlChangeEnabled withInfoPanel fixedHeight explorerRole='dm' />
  </div>
);
