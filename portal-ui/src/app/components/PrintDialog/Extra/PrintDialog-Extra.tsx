import React, { FC } from 'react';
import { cn } from '@bem-react/classname';

import { PseudoLink } from '../../PseudoLink/PseudoLink';

import { PrintDialogExtraIcon } from '../ExtraIcon/PrintDialog-ExtraIcon';

import '!style-loader!css-loader!sass-loader!./PrintDialog-Extra.scss';

const cnPrintDialogExtra = cn('PrintDialog', 'Extra');

interface PrintDialogExtraProps {
  open: boolean;
  onClick: () => void;
}

export const PrintDialogExtra: FC<PrintDialogExtraProps> = ({ open, onClick }) => (
  <PseudoLink className={cnPrintDialogExtra('Extra')} onClick={onClick}>
    {open ? 'Меньше' : 'Больше'} настроек
    <PrintDialogExtraIcon open={open} />
  </PseudoLink>
);
