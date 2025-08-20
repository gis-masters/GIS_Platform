import React, { FC } from 'react';
import { cn } from '@bem-react/classname';

import { Explorer } from '../Explorer/Explorer';
import { ExplorerItemType } from '../Explorer/Explorer.models';

import '!style-loader!css-loader!sass-loader!./DataManagement.scss';

const cnDataManagement = cn('DataManagement');

export const DataManagement: FC = () => (
  <div className={cnDataManagement()}>
    <Explorer preset={ExplorerItemType.ROOT} urlChangeEnabled withInfoPanel fixedHeight explorerRole='dm' />
  </div>
);
