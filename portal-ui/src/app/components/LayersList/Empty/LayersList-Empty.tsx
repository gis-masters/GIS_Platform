import React, { type FC } from 'react';
import { cn } from '@bem-react/classname';

import './LayersList-Empty.scss';

const cnLayersList = cn('LayersList');

export const LayersListEmpty: FC = () => <div className={cnLayersList('Empty')}>Слои отсутствуют</div>;
