import React, { FC } from 'react';
import { cn } from '@bem-react/classname';

import '!style-loader!css-loader!sass-loader!./PickupDataset-SelectedContent.scss';

const cnPickupDatasetsSelectedContent = cn('PickupDatasets', 'SelectedContent');

export const PickupDatasetSelectedContent: FC = ({ children }) => (
  <span className={cnPickupDatasetsSelectedContent()}>{children}</span>
);
