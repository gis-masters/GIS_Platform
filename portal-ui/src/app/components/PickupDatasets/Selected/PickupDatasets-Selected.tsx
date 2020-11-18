import React, { FC } from 'react';
import { cn } from '@bem-react/classname';

import { PickupDatasetSelectedContent } from '../SelectedContent/PickupDataset-SelectedContent';
import { PickupDatasetSelectedTitle } from '../SelectedTitle/PickupDataset-SelectedTitle';

import '!style-loader!css-loader!sass-loader!./PickupDatasets-Selected.scss';

const cnPickupDatasetsSelected = cn('PickupDatasets', 'Selected');

export interface PickupDatasetsSelectedProps {
  name: string;
}

export const PickupDatasetSelected: FC<PickupDatasetsSelectedProps> = ({ name }) => (
  <div className={cnPickupDatasetsSelected()}>
    <PickupDatasetSelectedTitle />
    <PickupDatasetSelectedContent>{name}</PickupDatasetSelectedContent>
  </div>
);
