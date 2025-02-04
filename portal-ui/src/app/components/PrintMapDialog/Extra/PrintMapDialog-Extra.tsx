import React, { FC } from 'react';
import { cn } from '@bem-react/classname';

import { PseudoLink } from '../../PseudoLink/PseudoLink';
import { PrintMapDialogExtraIcon } from '../ExtraIcon/PrintMapDialog-ExtraIcon';

import '!style-loader!css-loader!sass-loader!./PrintMapDialog-Extra.scss';

const cnPrintMapDialogExtra = cn('PrintMapDialog', 'Extra');

interface PrintMapDialogExtraProps {
  open: boolean;
  onClick(): void;
}

export const PrintMapDialogExtra: FC<PrintMapDialogExtraProps> = ({ open, onClick }) => (
  <PseudoLink className={cnPrintMapDialogExtra('Extra')} onClick={onClick}>
    {open ? 'Меньше' : 'Больше'} настроек
    <PrintMapDialogExtraIcon open={open} />
  </PseudoLink>
);
