import React, { FC, ReactNode } from 'react';
import { cn } from '@bem-react/classname';

import '!style-loader!css-loader!sass-loader!./PickupDataset-SelectedContent.scss';

const cnPickupDatasetsSelectedContent = cn('PickupDatasets', 'SelectedContent');

interface PickupDatasetSelectedContentProps {
  children: ReactNode;
}

export const PickupDatasetSelectedContent: FC<PickupDatasetSelectedContentProps> = ({ children }) => (
  <span className={cnPickupDatasetsSelectedContent()}>{children}</span>
);
