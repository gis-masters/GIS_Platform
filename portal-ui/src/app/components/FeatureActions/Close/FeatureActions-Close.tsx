import React, { FC } from 'react';
import { Close } from '@mui/icons-material';
import { cn } from '@bem-react/classname';

import { ActionsItemVariant } from '../../Actions/Item/Actions-Item.base';
import { ActionsItem } from '../../Actions/Item/Actions-Item.composed';

const cnFeatureActionsClose = cn('FeatureActions', 'Close');

interface FeatureActionsCloseProps {
  onClick(): void;
  as: ActionsItemVariant;
}

export const FeatureActionsClose: FC<FeatureActionsCloseProps> = ({ onClick, as }) => (
  <ActionsItem className={cnFeatureActionsClose()} title='Закрыть' icon={<Close />} onClick={onClick} as={as} />
);
