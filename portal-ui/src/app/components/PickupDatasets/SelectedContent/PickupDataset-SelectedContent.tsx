import React, { FC } from 'react';
import { cn } from '@bem-react/classname';

import { ChildrenProps } from '../../../services/models';

import '!style-loader!css-loader!sass-loader!./PickupDataset-SelectedContent.scss';

const cnPickupDatasetsSelectedContent = cn('PickupDatasets', 'SelectedContent');
export const PickupDatasetSelectedContent: FC<ChildrenProps> = ({ children }) => (
  <span className={cnPickupDatasetsSelectedContent()}>{children}</span>
);
