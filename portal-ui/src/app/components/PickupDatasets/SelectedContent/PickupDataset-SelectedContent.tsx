import React, { type FC } from 'react';
import { cn } from '@bem-react/classname';

import { type ChildrenProps } from '../../../services/models';

import './PickupDataset-SelectedContent.scss';

const cnPickupDatasetsSelectedContent = cn('PickupDatasets', 'SelectedContent');
export const PickupDatasetSelectedContent: FC<ChildrenProps> = ({ children }) => (
  <span className={cnPickupDatasetsSelectedContent()}>{children}</span>
);
